import prisma from "@ithub-shoes/db";
import { appContract } from "../contracts";

export const brandsRouter = {
  getAll: appContract.brands.getAll.handler(async ({ input }) => {
    const q = input?.query ?? {}
    const page = Number(q.page ?? 1)
    const limit = Number(q.limit ?? 20)
    const skip = (page - 1) * limit
    const where: any = {}
    if (q.search) where.name = { contains: q.search, mode: "insensitive" }

    const [items, total] = await Promise.all([
      prisma.brand.findMany({ where, take: limit, skip, orderBy: { id: "asc" } }),
      prisma.brand.count({ where })
    ])

    return { items, total }
  }),

  getOne: appContract.brands.getOne.handler(async ({ input }) => {
    return prisma.brand.findUniqueOrThrow({ where: { id: input.id } })
  }),

  create: appContract.brands.create.handler(async ({ input }) => {
    return prisma.brand.create({ data: { name: input.name } })
  }),

  update: appContract.brands.update.handler(async ({ input }) => {
    return prisma.brand.update({ where: { id: input.params.id }, data: { name: input.body.name } })
  }),

  delete: appContract.brands.delete.handler(async ({ input }) => {
    await prisma.brand.delete({ where: { id: input.id } })
  })
}
