import type { RouterClient } from "@orpc/server";

import { appContract } from "../contracts";
import { categoriesRouter } from "./categories";

export const appRouter = {
	healthCheck: appContract.healthCheck.handler(() => {
		return "OK";
	}),
	categories: categoriesRouter
};


export type AppRouter = typeof appRouter;
export type AppRouterClient = RouterClient<typeof appRouter>;
