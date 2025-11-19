-- CreateTable
CREATE TABLE "brand" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "brand_name" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "gender" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "products" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "price" REAL NOT NULL,
    "description" TEXT,
    "image" TEXT,
    "inStock" BOOLEAN NOT NULL DEFAULT true,
    "brandId" INTEGER NOT NULL,
    "shoes_categoryId" INTEGER NOT NULL,
    "genderId" INTEGER NOT NULL,
    "sizeId" INTEGER NOT NULL,
    CONSTRAINT "products_brandId_fkey" FOREIGN KEY ("brandId") REFERENCES "brand" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "products_shoes_categoryId_fkey" FOREIGN KEY ("shoes_categoryId") REFERENCES "shoes_category" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "products_genderId_fkey" FOREIGN KEY ("genderId") REFERENCES "gender" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "products_genderId_fkey" FOREIGN KEY ("genderId") REFERENCES "size" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "shoes_category" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "category_name" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "size" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "value" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "brand_brand_name_key" ON "brand"("brand_name");

-- CreateIndex
CREATE UNIQUE INDEX "gender_name_key" ON "gender"("name");

-- CreateIndex
CREATE UNIQUE INDEX "shoes_category_category_name_key" ON "shoes_category"("category_name");

-- CreateIndex
CREATE UNIQUE INDEX "size_value_key" ON "size"("value");
