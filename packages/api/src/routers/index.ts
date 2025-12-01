import type { RouterClient } from "@orpc/server";

import { appContract } from "../contracts";
import { categoriesRouter } from "./categories";
import { brandsRouter } from "./brands";
import { colorsRouter } from "./colors";
import { productsRouter } from "./products";
import { sizesRouter } from "./sizes";

export const appRouter = {
  healthCheck: appContract.healthCheck.handler(() => {
    return "OK";
  }),
  categories: categoriesRouter,
  brands: brandsRouter,
  colors: colorsRouter,
  products: productsRouter,
  sizes: sizesRouter,
};


export type AppRouter = typeof appRouter;
export type AppRouterClient = RouterClient<typeof appRouter>;
