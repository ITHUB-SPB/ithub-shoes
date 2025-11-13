import { publicProcedure } from "..";
import { categoriesContract } from "./categories";

export const appContract = {
	healthCheck: publicProcedure.route({ path: "/healthcheck", method: "GET" }),
	categories: categoriesContract
};

export type AppContract = typeof appContract;
