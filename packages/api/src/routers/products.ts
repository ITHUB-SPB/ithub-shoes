import prisma from "@ithub-shoes/db";
import { appContract } from "../contracts";

export const productsRouter = {
  getAll: appContract.products.getAll.handler(async ({ input }) => {
    const q = input?.query ?? {}
    const page = Number(q.page ?? 1)
    const limit = Math.min(Number(q.limit ?? 20), 100)
    const skip = (page - 1) * limit

    const where: any = {}
    if (q.search) where.model = { contains: q.search, mode: "insensitive" }
    if (q.categoryId) where.category_id = Number(q.categoryId)
    if (q.brandId) where.brandId = Number(q.brandId)
    if (q.gender) {
      where.gender = { name: q.gender }
    }
    if (q.minPrice || q.maxPrice) {
      where.price = {}
      if (q.minPrice) where.price.gte = Number(q.minPrice)
      if (q.maxPrice) where.price.lte = Number(q.maxPrice)
    }

    if (q.size) {
      where.sizes = { some: { size: { value: q.size } } }
    }
    if (q.colors) {
      where.colors = { some: { color: { value: q.colors } } }
    }

    const orderBy: any = q.sortBy ? { [q.sortBy]: (q.sortOrder ?? "asc") as any } : { id: "asc" }

    const [items, total] = await Promise.all([
      prisma.product.findMany({
        where,
        take: limit,
        skip,
        orderBy,
        include: {
          brand: true,
          category: true,
          gender: true,
          sizes: { include: { size: true } },
          colors: { include: { color: true } },
          materials: { include: { material: true } },
        },
      }),
      prisma.product.count({ where }),
    ])

    return { items, total }
  }),

  getOne: appContract.products.getOne.handler(async ({ input }) => {
    const id = input.id
    return prisma.product.findUniqueOrThrow({
      where: { id },
      include: {
        brand: true,
        category: true,
        gender: true,
        sizes: { include: { size: true } },
        colors: { include: { color: true } },
        materials: { include: { material: true } },
      },
    })
  }),

  create: appContract.products.create.handler(async ({ input }) => {
    const brandConnect = input.brand
      ? { connectOrCreate: { where: { name: input.brand }, create: { name: input.brand } } }
      : undefined
    const genderConnect = input.gender
      ? { connectOrCreate: { where: { name: input.gender }, create: { name: input.gender } } }
      : undefined

    const product = await prisma.product.create({
      data: {
        model: input.model,
        brand: brandConnect,
        category: { connect: { id: input.category_id } },
        gender: genderConnect,
        price: input.price ?? null,
      },
    })

    if (input.sizes?.length) {
      for (const s of input.sizes) {
        await prisma.size.upsert({ where: { value: s }, update: {}, create: { value: s } })
        const sizeRec = await prisma.size.findUnique({ where: { value: s } })
        if (sizeRec) {
          await prisma.productSize.create({
            data: { productId: product.id, sizeId: sizeRec.id },
          }).catch(() => {})
        }
      }
    }

    if (input.colors?.length) {
      for (const c of input.colors) {
        await prisma.color.upsert({ where: { value: c }, update: {}, create: { value: c } })
        const colorRec = await prisma.color.findUnique({ where: { value: c } })
        if (colorRec) {
          await prisma.productColor.create({
            data: { productId: product.id, colorId: colorRec.id },
          }).catch(() => {})
        }
      }
    }

    if (input.materials?.length) {
      for (const m of input.materials) {
        await prisma.material.upsert({ where: { value: m }, update: {}, create: { value: m } })
        const matRec = await prisma.material.findUnique({ where: { value: m } })
        if (matRec) {
          await prisma.productMaterial.create({
            data: { productId: product.id, materialId: matRec.id },
          }).catch(() => {})
        }
      }
    }

    return prisma.product.findUniqueOrThrow({
      where: { id: product.id },
      include: {
        brand: true,
        category: true,
        gender: true,
        sizes: { include: { size: true } },
        colors: { include: { color: true } },
        materials: { include: { material: true } },
      },
    })
  }),

  update: appContract.products.update.handler(async ({ input }) => {
    const id = input.params.id
    const body = input.body

    const data: any = {}
    if (body.model) data.model = body.model
    if (body.price !== undefined) data.price = body.price
    if (body.category_id !== undefined) data.category = { connect: { id: body.category_id } }

    if (body.brand) {
      data.brand = { connectOrCreate: { where: { name: body.brand }, create: { name: body.brand } } }
    }
    if (body.gender) {
      data.gender = { connectOrCreate: { where: { name: body.gender }, create: { name: body.gender } } }
    }

    await prisma.product.update({ where: { id }, data })

    if (body.sizes) {
      await prisma.productSize.deleteMany({ where: { productId: id } })
      for (const s of body.sizes) {
        await prisma.size.upsert({ where: { value: s }, update: {}, create: { value: s } })
        const sizeRec = await prisma.size.findUnique({ where: { value: s } })
        if (sizeRec) {
          await prisma.productSize.create({ data: { productId: id, sizeId: sizeRec.id } }).catch(() => {})
        }
      }
    }

    if (body.colors) {
      await prisma.productColor.deleteMany({ where: { productId: id } })
      for (const c of body.colors) {
        await prisma.color.upsert({ where: { value: c }, update: {}, create: { value: c } })
        const colorRec = await prisma.color.findUnique({ where: { value: c } })
        if (colorRec) {
          await prisma.productColor.create({ data: { productId: id, colorId: colorRec.id } }).catch(() => {})
        }
      }
    }

    if (body.materials) {
      await prisma.productMaterial.deleteMany({ where: { productId: id } })
      for (const m of body.materials) {
        await prisma.material.upsert({ where: { value: m }, update: {}, create: { value: m } })
        const matRec = await prisma.material.findUnique({ where: { value: m } })
        if (matRec) {
          await prisma.productMaterial.create({ data: { productId: id, materialId: matRec.id } }).catch(() => {})
        }
      }
    }

    return prisma.product.findUniqueOrThrow({
      where: { id },
      include: {
        brand: true,
        category: true,
        gender: true,
        sizes: { include: { size: true } },
        colors: { include: { color: true } },
        materials: { include: { material: true } },
      },
    })
  }),

  delete: appContract.products.delete.handler(async ({ input }) => {
    await prisma.product.delete({ where: { id: input.id } })
  }),
}
