import prisma from "@ithub-shoes/db";
import { appContract } from "../contracts";

export const sizesRouter = {
	getAll: appContract.sizes.getAll.handler(async () => {
		return await prisma.size.findMany({
			orderBy: { id: "asc" },
		});
	}),

	getOne: appContract.sizes.getOne.handler(async ({ input }) => {
		return await prisma.size.findFirstOrThrow({
			where: { id: input.id },
		});
	}),

	create: appContract.sizes.create.handler(async ({ input }) => {
		return await prisma.size.create({
			data: { value: input.value },
		});
	}),

	update: appContract.sizes.update.handler(async ({ input }) => {
		return await prisma.size.update({
			where: { id: input.params.id },
			data: { value: input.body.value },
		});
	}),

	delete: appContract.sizes.delete.handler(async ({ input }) => {
		try {
			await prisma.size.delete({ where: { id: input.id } });
		} catch (error) {
			console.error(error);
		}
	}),
};

