import z from "zod";
import { publicProcedure, protectedProcedure } from "../index";

const brandSchema = z.object({ id: z.number(), title: z.string() });
const getAllBrandesSchema = z.array(brandSchema);
const createBrandSchema = brandSchema.pick({ title: true });

const idInputSchema = z.object({ id: z.string().transform(Number) });

export const brandsContract = {
  getAll: publicProcedure
    .route({ method: "GET", path: "/brands", description: "All Brands" })
    .output(getAllBrandesSchema),

  getOne: publicProcedure
    .route({ method: "GET", path: "/brands/{id}", description: "Brand by Id" })
    .input(idInputSchema)
    .output(brandSchema),

  create: protectedProcedure
    .route({ method: "POST", path: "/brands", description: "Create Brand" })
    .input(createBrandSchema)
    .output(brandSchema),

  update: protectedProcedure
    .route({
      method: "PATCH",
      path: "/brands/{id}",
      inputStructure: "detailed",
      description: "Update Brand",
    })
    .input(
      z.object({
        params: idInputSchema,
        body: createBrandSchema,
      })
    )
    .output(brandSchema),

  delete: protectedProcedure
    .route({
      method: "DELETE",
      path: "/brands/{id}",
      description: "Delete Brand",
    })
    .input(idInputSchema),
};