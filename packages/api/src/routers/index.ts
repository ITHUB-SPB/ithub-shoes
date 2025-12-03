import type { RouterClient } from "@orpc/server";

import { appContract } from "../contracts";
import { categoriesRouter } from "./categories";
import { brandsRouter } from "./brands";
import { productsRouter } from "./products";

export const appRouter = {
  healthCheck: appContract.healthCheck.handler(() => {
    return "OK";
  }),
  categories: categoriesRouter,
  brands: brandsRouter,
  products: productsRouter,
}

export type AppRouter = typeof appRouter
export type AppRouterClient = RouterClient<typeof appRouter>
