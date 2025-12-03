import fs from "fs";
import path from "path";
import xlsx from "xlsx";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

async function loadPrismaClient() {
  try {
    const mod = await import("../prisma/generated/client")
    if (mod && (mod.PrismaClient || mod.default?.PrismaClient)) {
      return (mod.PrismaClient || mod.default.PrismaClient) as any
    }
  } catch {}

  try {
    const mod = await import("@prisma/client")
    if (mod && mod.PrismaClient) return mod.PrismaClient as any
  } catch {}

  throw new Error("prisma client not found. run `pnpm prisma generate` in packages/db")
}

(async () => {
  const PrismaClient = await loadPrismaClient()
  const prisma = new PrismaClient()

  try {
    const file = path.resolve(__dirname, "../../..", "shoes_data.xlsx")
    if (!fs.existsSync(file)) throw new Error(`shoes_data.xlsx not found at ${file}`)

    const wb = xlsx.readFile(file)
    const firstSheetName = wb.SheetNames?.[0]
    if (!firstSheetName) throw new Error("excel has no sheets")
    const sheet = wb.Sheets[firstSheetName]
    const rows = xlsx.utils.sheet_to_json<Record<string, any>>(sheet, { defval: "" })

    const brandCache = new Map<string, number>()
    const categoryCache = new Map<string, number>()
    const genderCache = new Map<string, number>()
    const sizeCache = new Map<string, number>()
    const colorCache = new Map<string, number>()
    const materialCache = new Map<string, number>()

    async function upsertEntityByUnique<K extends string, V extends number>(
      cache: Map<string, V>,
      upsertFn: (args: any) => Promise<any>,
      uniqueWhere: any,
      createData: any
    ) {
      const key = Object.values(uniqueWhere).join("|").trim()
      if (!key) return null
      if (cache.has(key)) return cache.get(key)!
      const rec = await upsertFn({
        where: uniqueWhere,
        update: {},
        create: createData,
      }).catch(async () => {
        try {
          const found = await (upsertFn as any).findUnique?.({ where: uniqueWhere })
          if (found) return found
        } catch {}
        try {
          return await (upsertFn as any)({ data: createData })
        } catch {
          return (await (upsertFn as any).findUnique({ where: uniqueWhere })).catch(() => null)
        }
      })
      const id = rec?.id
      if (id) cache.set(key, id)
      return id ?? null
    }

    async function findOrCreateBrand(name: string) {
      if (!name) return null
      return upsertEntityByUnique(brandCache, prisma.brand.upsert.bind(prisma.brand), { name }, { name })
    }

    async function findOrCreateCategory(title: string) {
      if (!title) return null
      return upsertEntityByUnique(categoryCache, prisma.category.upsert.bind(prisma.category), { title }, { title })
    }

    async function findOrCreateGender(name: string) {
      if (!name) return null
      return upsertEntityByUnique(genderCache, prisma.gender.upsert.bind(prisma.gender), { name }, { name })
    }

    async function findOrCreateSize(value: string) {
      if (!value) return null
      return upsertEntityByUnique(sizeCache, prisma.size.upsert.bind(prisma.size), { value }, { value })
    }

    async function findOrCreateColor(value: string) {
      if (!value) return null
      return upsertEntityByUnique(colorCache, prisma.color.upsert.bind(prisma.color), { value }, { value })
    }

    async function findOrCreateMaterial(value: string) {
      if (!value) return null
      return upsertEntityByUnique(materialCache, prisma.material.upsert.bind(prisma.material), { value }, { value })
    }

    function parseList(cell: string) {
      if (!cell) return []
      return String(cell).split(/[;,]+/).map(s => s.trim()).filter(Boolean)
    }

    let created = 0
    for (const r of rows) {
      const brandName = (r["brand"] ?? r["Brand"] ?? "").toString().trim()
      const modelName = (r["model"] ?? r["Model"] ?? "").toString().trim()
      const type = (r["type"] ?? r["Type"] ?? "").toString().trim()
      const genderRaw = (r["gender"] ?? r["Gender"] ?? "").toString().trim()
      const sizeRaw = (r["size"] ?? r["Size"] ?? "").toString()
      const colorRaw = (r["color"] ?? r["Color"] ?? "").toString()
      const materialRaw = (r["material"] ?? r["Material"] ?? "").toString()
      const priceRaw = (r["price"] ?? r["Price"] ?? r["Price (USD)"] ?? "").toString()

      if (!modelName) continue

      const brandId = brandName ? await findOrCreateBrand(brandName) : null
      const categoryId = await findOrCreateCategory(type || "unknown")
      const genderId = genderRaw ? await findOrCreateGender(genderRaw) : null
      const price = priceRaw ? parseFloat(String(priceRaw).replace(/[^0-9.-]/g, "")) : null

      const existing = await prisma.product.findFirst({
        where: {
          model: modelName,
          brandId: brandId ?? undefined,
          category_id: categoryId ?? undefined,
        }
      })

      let productId: number
      if (existing) {
        await prisma.product.update({
          where: { id: existing.id },
          data: { price }
        })
        productId = existing.id
      } else {
        const createdProduct = await prisma.product.create({
          data: {
            model: modelName,
            brand: brandId ? { connect: { id: brandId } } : undefined,
            category: { connect: { id: categoryId! } },
            gender: genderId ? { connect: { id: genderId } } : undefined,
            price,
          }
        })
        productId = createdProduct.id
        created++
      }

      const sizeValues = parseList(sizeRaw)
      if (sizeValues.length) {
        const sizeIds: number[] = []
        for (const sv of sizeValues) {
          const sid = await findOrCreateSize(sv)
          if (sid) sizeIds.push(sid)
        }
        const toInsert = sizeIds.map(sid => ({ productId, sizeId: sid }))
        if (toInsert.length) await prisma.productSize.createMany({ data: toInsert, skipDuplicates: true }).catch(() => {})
      }

      const colorValues = parseList(colorRaw)
      if (colorValues.length) {
        const colorIds: number[] = []
        for (const cv of colorValues) {
          const cid = await findOrCreateColor(cv)
          if (cid) colorIds.push(cid)
        }
        const toInsert = colorIds.map(cid => ({ productId, colorId: cid }))
        if (toInsert.length) await prisma.productColor.createMany({ data: toInsert, skipDuplicates: true }).catch(() => {})
      }

      const materialValues = parseList(materialRaw)
      if (materialValues.length) {
        const materialIds: number[] = []
        for (const mv of materialValues) {
          const mid = await findOrCreateMaterial(mv)
          if (mid) materialIds.push(mid)
        }
        const toInsert = materialIds.map(mid => ({ productId, materialId: mid }))
        if (toInsert.length) await prisma.productMaterial.createMany({ data: toInsert, skipDuplicates: true }).catch(() => {})
      }
    }

  } catch (err) {
    console.error(err)
    process.exitCode = 1
  } finally {
    try {
      await (prisma as any).$disconnect()
    } catch {}
  }
})()
