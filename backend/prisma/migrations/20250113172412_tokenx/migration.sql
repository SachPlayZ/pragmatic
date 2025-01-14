-- CreateTable
CREATE TABLE "Property" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "owner" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "price" BIGINT NOT NULL,
    "bedrooms" INTEGER NOT NULL,
    "sqft" INTEGER NOT NULL,
    "listDate" DATETIME DEFAULT CURRENT_TIMESTAMP
);
