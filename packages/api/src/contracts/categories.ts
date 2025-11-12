import z from "zod";
import { publicProcedure, protectedProcedure } from "../index";

const categorySchema = z.object({ id: z.number(), title: z.string() })
const getAllCategoriesSchema = z.array(categorySchema)
const createCategorySchema = categorySchema.pick({ title: true })

const inputIdSchema = z.object({ id: z.string().transform(Number) })

export const categoriesContract = {
	getAll: publicProcedure
		.route({ method: "GET", path: "/categories", description: "All Categories" })
		.output(getAllCategoriesSchema),

	getOne: publicProcedure
		.route({ method: "GET", path: "/categories/{id}", description: "Category by Id" })
		.input(inputIdSchema)
		.output(categorySchema),

	create: protectedProcedure
		.route({ method: "POST", path: "/categories", description: "New Category" })
		.input(createCategorySchema)
		.output(categorySchema),

	update: protectedProcedure
		.route({ method: "PATCH", path: "/categories/{id}", inputStructure: "detailed", description: "Update Category" })
		.input(z.object({
			params: inputIdSchema,
			body: createCategorySchema
		}))
		.output(categorySchema),

	delete: protectedProcedure
		.route({ method: "DELETE", path: "/categories/{id}", description: "Delete Category" })
		.input(inputIdSchema)
};
