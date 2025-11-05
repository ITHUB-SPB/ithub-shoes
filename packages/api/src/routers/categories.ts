import z from "zod";
import { implement } from "@orpc/server";
import { oc } from "@orpc/contract";

import prisma from "@ithub-shoes/db";
import { publicProcedure } from "../index";


const idInputSchema = z.object({
	id: z.string().transform(value => Number(value))
})

const categorySchema = z.object({
	id: z.int().min(1),
	category_name: z.string()
})

const allCategoriesSchema = z.array(categorySchema)

const categoriesContract = {
	getAll: oc
		.route({
			path: "/categories",
			summary: "Получить все категории",
		})
		.output(allCategoriesSchema),
	getOne: oc
		.route({
			path: "/categories/{id}",
			summary: "Получить одну категорию"
		})
		.input(idInputSchema)
		.output(categorySchema)
}

export const categoriesRouter = {
	getAll: implement(categoriesContract.getAll).handler(async () => {
		return await prisma.category.findMany({
			orderBy: {
				id: "asc",
			},
		});
	}),
	getOne: implement(categoriesContract.getOne).handler(async ({ input }) => {
		return await prisma.category.findUnique({
			where: {
				id: input.id
			}
		});
	})
};
