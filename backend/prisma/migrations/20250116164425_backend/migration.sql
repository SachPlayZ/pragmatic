/*
  Warnings:

  - You are about to drop the column `description` on the `Property` table. All the data in the column will be lost.
  - You are about to drop the column `embeddings` on the `Property` table. All the data in the column will be lost.

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
    "ammenities" TEXT NOT NULL
);
INSERT INTO "new_Property" ("ammenities", "bedrooms", "id", "imageUrl", "listDate", "location", "name", "owner", "price", "sqft") SELECT "ammenities", "bedrooms", "id", "imageUrl", "listDate", "location", "name", "owner", "price", "sqft" FROM "Property";
DROP TABLE "Property";
ALTER TABLE "new_Property" RENAME TO "Property";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
