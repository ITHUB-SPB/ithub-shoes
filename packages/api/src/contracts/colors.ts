import z from "zod";
import { publicProcedure, protectedProcedure } from "../index";

const colorSchema = z.object({
  id: z.number(),
  value: z.string(),
});

const createColorSchema = colorSchema.pick({
  value: true,
});

const idInputSchema = z.object({
  id: z.string().transform(Number),
});

export const colorsContract = {
  getAll: publicProcedure
    .route({ method: "GET", path: "/colors", description: "All Colors" })
    .output(z.array(colorSchema)),

  getOne: publicProcedure
    .route({ method: "GET", path: "/colors/{id}", description: "Color by Id" })
    .input(idInputSchema)
    .output(colorSchema),

  create: protectedProcedure
    .route({ method: "POST", path: "/colors", description: "Create Color" })
    .input(createColorSchema)
    .output(colorSchema),

  update: protectedProcedure
    .route({
      method: "PATCH",
      path: "/colors/{id}",
      inputStructure: "detailed",
      description: "Update Color",
    })
    .input(
      z.object({
        params: idInputSchema,
        body: createColorSchema,
      })
    )
    .output(colorSchema),

  delete: protectedProcedure
    .route({
      method: "DELETE",
      path: "/colors/{id}",
      description: "Delete Color",
    })
    .input(idInputSchema),
};
