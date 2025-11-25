import prisma from "@ithub-shoes/db";
import { appContract } from "../contracts";

const normalizeProduct = (product: any) => ({
	id: product.id,
	model: product.model,
	material: product.material,
	price: product.price?.toString?.() ?? String(product.price),
	brandId: product.brandId,
	categoryId: product.categoryId,
	genderId: product.genderId,
	sizeId: product.sizeId,
	colorId: product.colorId,
	createdAt: product.createdAt.toISOString(),
	updatedAt: product.updatedAt.toISOString()
});

const formatPriceInput = (price: string | number): string => {
	if (typeof price === "number") {
		return price.toFixed(2);
	}
	const numeric = Number(price);
	return Number.isFinite(numeric) ? numeric.toFixed(2) : "0.00";
};

export const productsRouter = {
	getAll: appContract.products.getAll.handler(async () => {
		const products = await prisma.product.findMany({
			orderBy: { id: "asc" }
		});
		return products.map(normalizeProduct);
	}),

	getOne: appContract.products.getOne.handler(async ({ input }) => {
		const product = await prisma.product.findFirstOrThrow({
			where: { id: input.id }
		});
		return normalizeProduct(product);
	}),

	create: appContract.products.create.handler(async ({ input }) => {
		const product = await prisma.product.create({
			data: {
				model: input.model,
				material: input.material,
				price: formatPriceInput(input.price),
				brandId: input.brandId,
				categoryId: input.categoryId,
				genderId: input.genderId,
				sizeId: input.sizeId,
				colorId: input.colorId
			}
		});
		return normalizeProduct(product);
	}),

	update: appContract.products.update.handler(async ({ input }) => {
		const product = await prisma.product.update({
			where: { id: input.params.id },
			data: {
				model: input.body.model,
				material: input.body.material,
				price: formatPriceInput(input.body.price),
				brandId: input.body.brandId,
				categoryId: input.body.categoryId,
				genderId: input.body.genderId,
				sizeId: input.body.sizeId,
				colorId: input.body.colorId
			}
		});
		return normalizeProduct(product);
	}),

	delete: appContract.products.delete.handler(async ({ input }) => {
		try {
			await prisma.product.delete({
				where: { id: input.id }
			});
		} catch (error) {
			console.error(error);
		}
	})
};

