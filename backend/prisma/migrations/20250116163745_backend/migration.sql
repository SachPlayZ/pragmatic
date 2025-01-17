/*
  Warnings:

  - Added the required column `ammenities` to the `Property` table without a default value. This is not possible if the table is not empty.
  - Added the required column `description` to the `Property` table without a default value. This is not possible if the table is not empty.
  - Added the required column `embeddings` to the `Property` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Property" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "owner" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "price" TEXT NOT NULL,
    "bedrooms" INTEGER NOT NULL,
    "sqft" INTEGER NOT NULL,
    "listDate" DATETIME DEFAULT CURRENT_TIMESTAMP,
    "imageUrl" TEXT NOT NULL DEFAULT 'https://reviveyouthandfamily.org/wp-content/uploads/2016/11/house-placeholder.jpg',
    "ammenities" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "embeddings" TEXT NOT NULL
);
INSERT INTO "new_Property" ("bedrooms", "id", "imageUrl", "listDate", "location", "name", "owner", "price", "sqft") SELECT "bedrooms", "id", "imageUrl", "listDate", "location", "name", "owner", "price", "sqft" FROM "Property";
DROP TABLE "Property";
ALTER TABLE "new_Property" RENAME TO "Property";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
