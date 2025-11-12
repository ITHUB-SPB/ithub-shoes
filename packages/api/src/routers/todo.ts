import prisma from "@ithub-shoes/db";
import { appContract } from "../contracts";

export const todoRouter = {
	getAll: appContract.todo.getAll.handler(async () => {
		return await prisma.todo.findMany({
			orderBy: {
				id: "asc",
			},
		});
	}),

	create: appContract.todo.create
		.handler(async ({ input }) => {
			return await prisma.todo.create({
				data: {
					text: input.text,
				},
			});
		}),

	toggle: appContract.todo.toggle
		.handler(async ({ input }) => {
			return await prisma.todo.update({
				where: { id: input.id },
				data: { completed: input.completed },
			});
		}),

	delete: appContract.todo.delete
		.handler(async ({ input }) => {
			return await prisma.todo.delete({
				where: { id: input.id },
			});
		}),
};
