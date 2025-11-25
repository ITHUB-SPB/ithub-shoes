import prisma from "@ithub-shoes/db";
import { appContract } from "../contracts";

export const brandsRouter = {
	getAll: appContract.brands.getAll.handler(async () => {
		return await prisma.brand.findMany({
			orderBy: { id: "asc" },
		});
	}),

	getOne: appContract.brands.getOne.handler(async ({ input }) => {
		return await prisma.brand.findFirstOrThrow({
			where: { id: input.id },
		});
	}),

	create: appContract.brands.create.handler(async ({ input }) => {
		return await prisma.brand.create({
			data: { title: input.title },
		});
	}),

	update: appContract.brands.update.handler(async ({ input }) => {
		return await prisma.brand.update({
			where: { id: input.params.id },
			data: { title: input.body.title },
		});
	}),

	delete: appContract.brands.delete.handler(async ({ input }) => {
		try {
			await prisma.brand.delete({ where: { id: input.id } });
		} catch (error) {
			console.error(error);
		}
	}),
};

