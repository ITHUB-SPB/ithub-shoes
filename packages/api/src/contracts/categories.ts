import z from "zod";
import { publicProcedure, protectedProcedure } from "../index";

export const categoriesContract = {
	getAll: publicProcedure
		.route({ method: "GET", path: "/todo" })
		.output(z.array(z.object({ id: z.number(), text: z.string(), completed: z.boolean() }))),

	getOne: publicProcedure
		.route({ method: "GET", path: "/todo" })
		.output(z.array(z.object({ id: z.number(), text: z.string(), completed: z.boolean() }))),

	create: protectedProcedure
		.route({ method: "POST", path: "/todo" })
		.input(z.object({ text: z.string().min(1) }))
		.output(z.array(z.object({ id: z.number(), text: z.string(), completed: z.boolean() }))),

	update: protectedProcedure
		.route({ method: "PATCH", path: "/todo" })
		.input(z.object({ id: z.number(), completed: z.boolean() }))
		.output(z.object({ id: z.number(), text: z.string(), completed: z.boolean() })),

	delete: protectedProcedure
		.route({ method: "DELETE", path: "/todo" })
		.input(z.object({ id: z.number() }))
		.output(z.object({ status: z.enum(["204", "404", "400"]) })),
};
