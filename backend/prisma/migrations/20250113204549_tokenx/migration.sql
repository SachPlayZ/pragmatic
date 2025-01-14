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
    "listDate" DATETIME DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_Property" ("bedrooms", "id", "listDate", "location", "name", "owner", "price", "sqft") SELECT "bedrooms", "id", "listDate", "location", "name", "owner", "price", "sqft" FROM "Property";
DROP TABLE "Property";
ALTER TABLE "new_Property" RENAME TO "Property";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
