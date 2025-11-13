import { z } from "zod";
import { router, publicProcedure } from "../trpc";
import { db } from "/Users/romanbokov/Desktop/node.js/ithub-shoes/packages/db/prisma/schema/Users/romanbokov/Desktop/node.js/ithub-shoes/apps/server/local.db";

export const postRouter = router({
  list: publicProcedure
    .input(
      z.object({
        page: z.number().min(1).default(1),
        limit: z.number().min(1).max(100).default(10),
      })
    )
    .query(async ({ input }) => {
      const { page, limit } = input;
      const shoes = await db.shoe.findMany({
        skip: (page - 1) * limit,
        take: limit,
        include: {
          author: {
            select: {
              name: true,
              email: true,
            },
          },
        },
        orderBy: [
          { brand: "asc" },
          { model: "asc" },
          { size: "asc" },
          { price: "asc" },
        ],
      });
      return shoes;
    }),

  create: publicProcedure
    .input(
      z.object({
        brand: z.string(),
        model: z.string(),
        type: z.string(),
        gender: z.string(),
        size: z.number(),
        color: z.string(),
        material: z.string(),
        price: z.number(),
        authorId: z.number(),
      })
    )
    .mutation(async ({ input }) => {
      const shoe = await db.shoe.create({
        data: input,
      });
      return shoe;
    }),
});
