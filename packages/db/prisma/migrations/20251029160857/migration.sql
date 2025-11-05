-- CreateTable
CREATE TABLE "category" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "category_name" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "category_category_name_key" ON "category"("category_name");
