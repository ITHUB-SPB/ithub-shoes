import z from "zod";
import prisma from "@ithub-shoes/db";
import { publicProcedure } from "../index";

export const categoriesRouter = {
	getAll: publicProcedure.handler(async () => {
		return await prisma.category.findMany({
			orderBy: {
				id: "asc",
			},
		});
	}),
};
