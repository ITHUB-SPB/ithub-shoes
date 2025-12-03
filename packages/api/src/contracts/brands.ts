import z from "zod";
import { publicProcedure, protectedProcedure } from "../index";

const brandSchema = z.object({
  id: z.number(),
  name: z.string(),
})
const brandsSchema = z.array(brandSchema)

const createBrandSchema = z.object({ name: z.string().min(1) })

const idParam = z.object({ id: z.string().transform(Number) })

export const brandsContract = {
  getAll: publicProcedure
    .route({ method: "GET", path: "/brands", description: "List brands" })
    .input(z.object({
      query: z.object({
        page: z.string().optional(),
        limit: z.string().optional(),
        sortBy: z.string().optional(),
        sortOrder: z.enum(["asc", "desc"]).optional(),
        search: z.string().optional()
      }).optional()
    }))
    .output(z.object({ items: brandsSchema, total: z.number() })),

  getOne: publicProcedure
    .route({ method: "GET", path: "/brands/{id}", description: "Brand by id" })
    .input(idParam)
    .output(brandSchema),

  create: protectedProcedure
    .route({ method: "POST", path: "/brands", description: "Create brand" })
    .input(createBrandSchema)
    .output(brandSchema),

  update: protectedProcedure
    .route({ method: "PATCH", path: "/brands/{id}" })
    .input(z.object({
      params: idParam,
      body: createBrandSchema
    }))
    .output(brandSchema),

  delete: protectedProcedure
    .route({ method: "DELETE", path: "/brands/{id}" })
    .input(idParam)
}
