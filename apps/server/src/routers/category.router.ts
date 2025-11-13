import { z } from "zod";
import router
import { publicProcedure } from "@ithub-shoes/api";
import { db } from "/Users/romanbokov/Desktop/node.js/ithub-shoes/packages/db/prisma/schema/Users/romanbokov/Desktop/node.js/ithub-shoes/apps/server/local.db";


export const categoryRouter = Router({
  list: publicProcedure
    .input(
      z.object({
        includeChildren: z.boolean().default(true),
        includeProducts: z.boolean().default(false),
      })
    )
    .query(async ({ input }) => {
      const categories = await db.category.findMany({
        where: { parentId: null },
        include: {
          children: input.includeChildren
            ? {
                include: {
                  products: input.includeProducts
                    ? {
                        take: 3,
                        select: {
                          id: true,
                          name: true,
                          price: true,
                          images: true,
                        },
                      }
                    : false,
                  _count: {
                    select: { products: true },
                  },
                },
              }
            : false,
          products: input.includeProducts
            ? {
                take: 3,
                select: { id: true, name: true, price: true, images: true },
              }
            : false,
          _count: {
            select: {
              products: true,
              children: true,
            },
          },
        },
        orderBy: { name: "asc" },
      });

      return categories;
    }),

  // Получить категорию по ID
  byId: publicProcedure.input(IdSchema).query(async ({ input }) => {
    const category = await db.category.findUnique({
      where: { id: input.id },
      include: {
        parent: true,
        children: {
          include: {
            _count: {
              select: { products: true },
            },
          },
        },
        products: {
          include: {
            brand: true,
            sizes: true,
            colors: true,
          },
        },
        _count: {
          select: {
            products: true,
            children: true,
          },
        },
      },
    });

    if (!category) {
      throw new Error("Category not found");
    }

    return category;
  }),

  update: publicProcedure
    .input(
      z.object({
        id: z.number(),
        name: z.string().min(1).max(255).optional(),
        slug: z.string().min(1).max(255).optional(),
        parentId: z.number().nullable().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const { id, ...data } = input;

      const category = await db.category.update({
        where: { id },
        data,
      });

      return category;
    }),
});