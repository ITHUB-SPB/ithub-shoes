import { PrismaClient } from "../prisma/generated/client";
import xlsx from "xlsx";
import path from "node:path";
import type { Prisma } from "../prisma/generated/client";

const prisma = new PrismaClient();
const DATA_FILE = path.resolve(process.cwd(), "..", "..", "shoes_data.xlsx");

type RawData = {
  Brand: string | null;
  Model: string | null;
  Material: string | null;
  Gender: string | null;
  Size: string | null;
  Color: string | null;
  Type: string | null;
  "Price (USD)": string | null;
};

function loadRows(): RawData[] {
  const book = xlsx.readFile(DATA_FILE);
  const sheet = book.Sheets["shoes"];
  return xlsx.utils.sheet_to_json<RawData>(sheet!, { defval: null });
}

type LookupMaps = {
  brands: Map<string, number>;
  categories: Map<string, number>;
  genders: Map<string, number>;
  sizes: Map<string, number>;
  colors: Map<string, number>;
};

function sanitizeString(value: unknown): string | null {
  if (typeof value === "string") {
    const trimmed = value.trim();
    return trimmed.length ? trimmed : null;
  }
  if (typeof value === "number") {
    return value.toString();
  }
  return null;
}

function parsePrice(value: unknown): string {
  if (typeof value === "number") {
    return value.toFixed(2);
  }
  if (typeof value === "string") {
    const numeric = Number(value.replace(/[^0-9.]/g, ""));
    if (Number.isFinite(numeric)) {
      return numeric.toFixed(2);
    }
  }
  return "0.00";
}

function uniqueValues(rows: RawData[], key: keyof RawData): string[] {
  const uniqueSet = new Set<string>();
  for (const row of rows) {
    const value = sanitizeString(row[key]);
    if (value) {
      uniqueSet.add(value);
    }
  }
  return [...uniqueSet];
}

async function resetTables() {
  await prisma.product.deleteMany();
  await prisma.brand.deleteMany();
  await prisma.category.deleteMany();
  await prisma.gender.deleteMany();
  await prisma.size.deleteMany();
  await prisma.color.deleteMany();
}

async function seedLookups(rows: RawData[]): Promise<LookupMaps> {
  const brandNames = uniqueValues(rows, "Brand");
  const categoryNames = uniqueValues(rows, "Type");
  const genderNames = uniqueValues(rows, "Gender");
  const sizeValues = uniqueValues(rows, "Size");
  const colorNames = uniqueValues(rows, "Color");

  await Promise.all(
    brandNames.map((title) =>
      prisma.brand.upsert({ where: { title }, update: {}, create: { title } })
    )
  );
  await Promise.all(
    categoryNames.map((title) =>
      prisma.category.upsert({
        where: { title },
        update: {},
        create: { title },
      })
    )
  );
  await Promise.all(
    genderNames.map((title) =>
      prisma.gender.upsert({ where: { title }, update: {}, create: { title } })
    )
  );
  await Promise.all(
    sizeValues.map((value) =>
      prisma.size.upsert({ where: { value }, update: {}, create: { value } })
    )
  );
  await Promise.all(
    colorNames.map((value) =>
      prisma.color.upsert({ where: { value }, update: {}, create: { value } })
    )
  );

  const [brands, categories, genders, sizes, colors] = await Promise.all([
    prisma.brand.findMany(),
    prisma.category.findMany(),
    prisma.gender.findMany(),
    prisma.size.findMany(),
    prisma.color.findMany(),
  ]);

  return {
    brands: new Map(brands.map((brand) => [brand.title, brand.id])),
    categories: new Map(
      categories.map((category) => [category.title, category.id])
    ),
    genders: new Map(genders.map((gender) => [gender.title, gender.id])),
    sizes: new Map(sizes.map((size) => [size.value, size.id])),
    colors: new Map(colors.map((color) => [color.value, color.id])),
  };
}

async function seedProducts(rows: RawData[], lookups: LookupMaps) {
  const products: Prisma.ProductCreateManyInput[] = [];
  for (const row of rows) {
    const brandName = sanitizeString(row.Brand);
    const model = sanitizeString(row.Model);
    const categoryName = sanitizeString(row.Type);
    const genderName = sanitizeString(row.Gender);
    const sizeValue = sanitizeString(row.Size);
    const colorName = sanitizeString(row.Color);
    const material = sanitizeString(row.Material) ?? "Unknown";
    const price = parsePrice(row["Price (USD)"]);

    if (
      !brandName ||
      !model ||
      !categoryName ||
      !genderName ||
      !sizeValue ||
      !colorName
    ) {
      continue;
    }

    const brandId = lookups.brands.get(brandName);
    const categoryId = lookups.categories.get(categoryName);
    const genderId = lookups.genders.get(genderName);
    const sizeId = lookups.sizes.get(sizeValue);
    const colorId = lookups.colors.get(colorName);

    if (!brandId || !categoryId || !genderId || !sizeId || !colorId) {
      continue;
    }

    products.push({
      model,
      material,
      price,
      brandId,
      categoryId,
      genderId,
      sizeId,
      colorId,
    });
  }

  if (!products.length) {
    return;
  }

  await prisma.product.createMany({ data: products });
}

const rows = loadRows();
await resetTables();
const lookups = await seedLookups(rows);
await seedProducts(rows, lookups);