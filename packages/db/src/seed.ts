import prisma from "."

async function seedCategories() {
    const categories = [
        {
            "id": 1,
            "category_name": "Mocassins"
        },
        {
            "id": 2,
            "category_name": "Escarpins"
        },
        {
            "id": 3,
            "category_name": "Bottes & Bottines"
        },
        {
            "id": 4,
            "category_name": "Claquettes & Tongs"
        },
        {
            "id": 5,
            "category_name": "Sandales & Mules"
        }
    ]
    try {
        await prisma.category.createMany({ data: categories })
    } catch (error) {
        console.error(error)
    }
}

await seedCategories()