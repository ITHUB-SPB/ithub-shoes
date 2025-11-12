import { PrismaClient } from "../prisma/generated/client"

const prisma = new PrismaClient()

async function seedCategories() {
    const categories = [
        {
            "id": 1,
            "title": "Basketball"
        },
        {
            "id": 2,
            "title": "Running"
        },
        {
            "id": 3,
            "title": "Casual"
        },
        {
            "id": 4,
            "title": "Lifestyle"
        },
    ]
    try {
        await prisma.category.createMany({ data: categories })
    } catch (error) {
        console.error(error)
    }
}

async function seedProducts() {
    const products = [
        {
            model: "Air Jordan 1",
            category_id: 1
        },
        {
            model: "Ultra Boost 21",
            category_id: 2
        },
        {
            model: "Classic Leather",
            category_id: 3
        },
        {
            model: "Future Rider",
            category_id: 4
        },
    ]
    try {
        await prisma.product.createMany({ data: products })
    } catch (error) {
        console.error(error)
    }
}


await seedCategories()
await seedProducts()