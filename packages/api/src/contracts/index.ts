import { publicProcedure } from "..";
import { categoriesContract } from "./categories";
import { brandsContract } from "./brands";
import { colorsContract } from "./colors";
import { sizesContract } from "./sizes";
import { productsContract } from "./products";

export const appContract = {
    healthCheck: publicProcedure.route({ path: "/healthcheck", method: "GET" }),
    categories: categoriesContract,
    brands: brandsContract,
    colors: colorsContract,
    sizes: sizesContract,
    products: productsContract,
};

export type AppContract = typeof appContract;