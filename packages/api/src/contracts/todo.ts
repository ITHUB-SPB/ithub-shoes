import z from "zod";
import { publicProcedure } from "../index";

export const todoContract = {
	getAll: publicProcedure
		.route({ method: "GET", path: "/todo" })
		.output(z.array(z.object({ id: z.number(), text: z.string(), completed: z.boolean() }))),

	create: publicProcedure
		.route({ method: "POST", path: "/todo" })
		.input(z.object({ text: z.string().min(1) }))
		.output(z.array(z.object({ id: z.number(), text: z.string(), completed: z.boolean() }))),

	toggle: publicProcedure
		.route({ method: "PATCH", path: "/todo" })
		.input(z.object({ id: z.number(), completed: z.boolean() }))
		.output(z.object({ id: z.number(), text: z.string(), completed: z.boolean() })),

	delete: publicProcedure
		.route({ method: "DELETE", path: "/todo" })
		.input(z.object({ id: z.number() }))
		.output(z.object({ status: z.enum(["204", "404", "400"]) })),
};
