import { publicProcedure } from "..";
import { categoriesContract } from "./categories";
import { brandsContract } from "./brands";
import { productsContract } from "./products";

export const appContract = {
  healthCheck: publicProcedure.route({ path: "/healthcheck", method: "GET" }),
  categories: categoriesContract,
  brands: brandsContract,
  products: productsContract,
}

export type AppContract = typeof appContract
