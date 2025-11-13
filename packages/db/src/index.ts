import { PrismaClient } from "../prisma/generated/client";

const prisma = new PrismaClient();

const globalForPrisma = global as unknown as {
    prisma: PrismaClient | undefined;
}

if (!globalForPrisma.prisma) {
    globalForPrisma.prisma = prisma;
}

export default prisma;
