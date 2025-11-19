import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const brandRepository = {
    async findAll({ page = 1, limit = 10, sortBy = 'name', sortOrder = 'asc'} = {}) {
        const skip = (page - 1 ) * limit;

        const [brands, total] = await Promise.all([
            prisma.brand.findMany({
                skip,
                take: limit,
                orderBy: { [sortBy]: sortOrder },
            }),
            prisma.brand.count(),
        ]);

        return {
            data: brands,
            pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
        };
    },

    async findById(id: number) {
        return prisma.brand.findUnique({ where: { id }});
    },
}