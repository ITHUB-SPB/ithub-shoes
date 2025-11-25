import prisma from "@ithub-shoes/db";
import { appContract } from "../contracts";

export const colorsRouter = {
	getAll: appContract.colors.getAll.handler(async () => {
		return await prisma.color.findMany({
			orderBy: { id: "asc" },
		});
	}),

	getOne: appContract.colors.getOne.handler(async ({ input }) => {
		return await prisma.color.findFirstOrThrow({
			where: { id: input.id },
		});
	}),

	create: appContract.colors.create.handler(async ({ input }) => {
		return await prisma.color.create({
			data: { value: input.value },
		});
	}),

	update: appContract.colors.update.handler(async ({ input }) => {
		return await prisma.color.update({
			where: { id: input.params.id },
			data: { value: input.body.value },
		});
	}),

	delete: appContract.colors.delete.handler(async ({ input }) => {
		try {
			await prisma.color.delete({ where: { id: input.id } });
		} catch (error) {
			console.error(error);
		}
	}),
};

