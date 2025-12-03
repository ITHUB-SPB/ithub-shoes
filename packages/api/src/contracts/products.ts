import z from "zod";
import { publicProcedure, protectedProcedure } from "../index"

const productBase = z.object({
  id: z.number(),
  model: z.string(),
  brandId: z.number().nullable(),
  category_id: z.number(),
  genderId: z.number().nullable(),
  price: z.number().nullable(),
  createdAt: z.string(),
  updatedAt: z.string(),
})

const productsSchema = z.array(productBase)

const createProductBody = z.object({
  model: z.string().min(1),
  brand: z.string().optional(), 
  category_id: z.number(),
  gender: z.string().optional(),
  price: z.number().optional(),
  sizes: z.array(z.string()).optional(),
  colors: z.array(z.string()).optional(),
  materials: z.array(z.string()).optional(),
})

const updateProductBody = createProductBody.partial()

const idParam = z.object({ id: z.string().transform(Number) })

const listQuery = z.object({
  page: z.string().optional(),
  limit: z.string().optional(),
  sortBy: z.string().optional(),
  sortOrder: z.enum(["asc", "desc"]).optional(),
  search: z.string().optional(),
  categoryId: z.string().optional(),
  brandId: z.string().optional(),
  gender: z.string().optional(),
  size: z.string().optional(),
  colors: z.array(z.string()).optional(),     
  materials: z.array(z.string()).optional(),  
  minPrice: z.string().optional(),
  maxPrice: z.string().optional(),
})

export const productsContract = {
  getAll: publicProcedure
    .route({ method: "GET", path: "/products" })
    .input(z.object({ query: listQuery.optional() }))
    .output(z.object({ items: productsSchema, total: z.number() })),

  getOne: publicProcedure
    .route({ method: "GET", path: "/products/{id}" })
    .input(idParam)
    .output(productBase),

  create: protectedProcedure
    .route({ method: "POST", path: "/products" })
    .input(createProductBody)
    .output(productBase),

  update: protectedProcedure
    .route({ method: "PATCH", path: "/products/{id}" })
    .input(z.object({ params: idParam, body: updateProductBody }))
    .output(productBase),

  delete: protectedProcedure
    .route({ method: "DELETE", path: "/products/{id}" })
    .input(idParam)
}
