import prisma from "@ithub-shoes/db";
import { appContract } from "../contracts";

const normalizeProduct = (product: any) => ({
  id: product.id,
  model: product.model,
  material: product.material,
  price: product.price?.toString?.() ?? String(product.price),
  brandId: product.brandId,
  categoryId: product.categoryId,
  genderId: product.genderId,
  sizeId: product.sizeId,
  colorId: product.colorId,
  createdAt: product.createdAt.toISOString(),
  updatedAt: product.updatedAt.toISOString(),
});

const formatPriceInput = (price: string | number): string => {
  if (typeof price === "number") {
    return price.toFixed(2);
  }
  const numeric = Number(price);
  return Number.isFinite(numeric) ? numeric.toFixed(2) : "0.00";
};

export const productsRouter = {
  getAll: appContract.products.getAll.handler(async ({ input }) => {
    const limit = +(input.limit ?? 10);
    const offset = +(input.offset ?? 0);
    const sort = input.sort ?? [];
    const orderBy = sort.map((item) => {
      const [fieldRaw, dir] = item.split(".");
      const field = fieldRaw || "id";
      return { [field]: dir };
    });
    const filter = input.filter ?? [];
    const where: Record<string, any> = {};
    const intFields = new Set([
      "id",
      "brandId",
      "categoryId",
      "genderId",
      "sizeId",
      "colorId",
    ]);
    const decimalFields = new Set(["price"]);
    const allowedOperators = new Set([
      "equals",
      "gt",
      "gte",
      "lt",
      "lte",
      "contains",
      "startsWith",
      "endsWith",
    ]);
    for (let el of filter) {
      const startBracket = el.indexOf("[");
      const endBracket = el.indexOf("]");
      const field = el.slice(0, startBracket);
      const operator = el.slice(startBracket + 1, endBracket);
      let value: string | number = el.slice(endBracket + 1).trim();
      if (!field || !operator || !value) continue;
	  if (!allowedOperators.has(operator)) continue;
	  if (intFields.has(field) || decimalFields.has(field)) value = +value; 
      if (!where[field]) where[field] = {};
      where[field][operator] = value;
    }

    const products = await prisma.product.findMany({
      take: limit,
      skip: offset,
      orderBy: orderBy.length != 0 ? orderBy : [{ id: "asc" }],
      where: where,
    });

    const normalizedProducts = products.map(normalizeProduct);
    if (!input.select) return normalizedProducts;
    const fields = input.select.split(",").map((el) => el.trim());
    return normalizedProducts.map((product) => {
      const productPart: Record<string, any> = {};
      for (let field of fields) {
        if (field in product) {
          productPart[field] = (product as any)[field];
        }
      }
      return productPart;
    });
  }),

  getOne: appContract.products.getOne.handler(async ({ input }) => {
    const product = await prisma.product.findFirstOrThrow({
      where: { id: input.id },
    });
    return normalizeProduct(product);
  }),

  create: appContract.products.create.handler(async ({ input }) => {
    const product = await prisma.product.create({
      data: {
        model: input.model,
        material: input.material,
        price: formatPriceInput(input.price),
        brandId: input.brandId,
        categoryId: input.categoryId,
        genderId: input.genderId,
        sizeId: input.sizeId,
        colorId: input.colorId,
      },
    });
    return normalizeProduct(product);
  }),

  update: appContract.products.update.handler(async ({ input }) => {
    const product = await prisma.product.update({
      where: { id: input.params.id },
      data: {
        model: input.body.model,
        material: input.body.material,
        price: formatPriceInput(input.body.price),
        brandId: input.body.brandId,
        categoryId: input.body.categoryId,
        genderId: input.body.genderId,
        sizeId: input.body.sizeId,
        colorId: input.body.colorId,
      },
    });
    return normalizeProduct(product);
  }),

  delete: appContract.products.delete.handler(async ({ input }) => {
    try {
      await prisma.product.delete({
        where: { id: input.id },
      });
    } catch (error) {
      console.error(error);
    }
  }),
};
