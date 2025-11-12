import prisma from "@ithub-shoes/db";
import { appContract } from "../contracts";

export const categoriesRouter = {
	getAll: appContract.categories.getAll.handler(async () => {
		return await prisma.category.findMany({
			orderBy: {
				id: "asc",
			},
		});
	}),

	getOne: appContract.categories.getOne.handler(async ({ input }) => {
		return await prisma.category.findFirstOrThrow({
			where: {
				id: input.id
			},
			orderBy: {
				id: "asc",
			},
		});
	}),

	create: appContract.categories.create
		.handler(async ({ input }) => {
			return await prisma.category.create({
				data: {
					title: input.title,
				},
			});
		}),

	update: appContract.categories.update
		.handler(async ({ input }) => {
			return await prisma.category.update({
				where: { id: input.params.id },
				data: { title: input.body.title },
			});
		}),

	delete: appContract.categories.delete
		.handler(async ({ input }) => {
			try {
				await prisma.category.delete({
					where: { id: input.id },
				});
			} catch (error) {
				console.error(error)
			}
		}),
};
