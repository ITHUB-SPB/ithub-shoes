import z from "zod";
import { publicProcedure, protectedProcedure } from "../index";

const productSchema = z.object({
  id: z.number(),
  model: z.string(),
  material: z.string(),
  price: z.string(),
  brandId: z.number(),
  categoryId: z.number(),
  genderId: z.number(),
  sizeId: z.number(),
  colorId: z.number(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

const createProductSchema = productSchema.pick({
  model: true,
  material: true,
  price: true,
  brandId: true,
  categoryId: true,
  genderId: true,
  sizeId: true,
  colorId: true,
});

const idInputSchema = z.object({ id: z.string().transform(Number) });

export const productsContract = {
  getAll: publicProcedure
    .route({ method: "GET", path: "/products", description: "All Products" })
    .output(z.array(productSchema)),

  getOne: publicProcedure
    .route({
      method: "GET",
      path: "/products/{id}",
      description: "Product by Id",
    })
    .input(idInputSchema)
    .output(productSchema),

  create: protectedProcedure
    .route({ method: "POST", path: "/products", description: "New Product" })
    .input(createProductSchema)
    .output(productSchema),

  update: protectedProcedure
    .route({
      method: "PATCH",
      path: "/products/{id}",
      inputStructure: "detailed",
      description: "Update Product",
    })
    .input(
      z.object({
        params: idInputSchema,
        body: createProductSchema,
      })
    )
    .output(productSchema),

  delete: protectedProcedure
    .route({
      method: "DELETE",
      path: "/products/{id}",
      description: "Delete Product",
    })
    .input(idInputSchema),
};
