import z from "zod";
import { publicProcedure, protectedProcedure } from "../index";

const sizeSchema = z.object({
  id: z.number(),
  value: z.string(),
});

const createSizeSchema = sizeSchema.pick({
  value: true,
});

const idInputSchema = z.object({
  id: z.string().transform(Number),
});

export const sizesContract = {
  getAll: publicProcedure
    .route({ method: "GET", path: "/sizes", description: "All Sizes" })
    .output(z.array(sizeSchema)),

  getOne: publicProcedure
    .route({ method: "GET", path: "/sizes/{id}", description: "Size by Id" })
    .input(idInputSchema)
    .output(sizeSchema),

  create: protectedProcedure
    .route({ method: "POST", path: "/sizes", description: "Create Size" })
    .input(createSizeSchema)
    .output(sizeSchema),

  update: protectedProcedure
    .route({
      method: "PATCH",
      path: "/sizes/{id}",
      inputStructure: "detailed",
      description: "Update Size",
    })
    .input(
      z.object({
        params: idInputSchema,
        body: createSizeSchema,
      })
    )
    .output(sizeSchema),

  delete: protectedProcedure
    .route({
      method: "DELETE",
      path: "/sizes/{id}",
      description: "Delete Size",
    })
    .input(idInputSchema),
};
