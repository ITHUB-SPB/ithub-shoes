import { todoContract } from "./todo";
import { categoriesContract } from "./categories";

export const appContract = {
	todo: todoContract,
	categories: categoriesContract
};

export type AppContract = typeof appContract;
