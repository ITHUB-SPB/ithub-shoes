import z from "zod";
import prisma from "@ithub-shoes/db";
import { publicProcedure } from "../index";
import { oc } from "@orpc/contract";
import { implement } from "@orpc/server";


const idInputSchema = z.object({
	id: z.string().refine(value => Number(value))
})

const categorySchema = z.object({
  id: z.int().min(1),
  category_name: z.string(),
});


const allCategoriesSchema = z.array(z.object({
	id: z.int().min(1),
	category_name: z.string(),
}))

const categoriesContact = {
  getAll: oc
    .route({
      path: "/categories",
      summary: "получить отсортированный список",
    })
    .output(allCategoriesSchema),
  getOne: oc
    .route({
      path: "/categories/{id}",
      summary: "получить одну категорию",
	})
	.input(idInputSchema)
  .output(categorySchema),
};

export const categoriesRouter = {
  getAll: implement(categoriesContact.getAll).handler(async () => {
    return await prisma.category.findMany({
      orderBy: {
        id: "asc",
      },
    });
  }),
	getOne: implement(categoriesContact.getOne).handler(async ({input}) => {
		return await prisma.category.findMany({
			where: {
			id: input.id
		}
    });
  }),
};
