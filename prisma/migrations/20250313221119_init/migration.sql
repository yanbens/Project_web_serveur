/*
  Warnings:

  - You are about to drop the column `priority` on the `Tache` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `Tache` table. All the data in the column will be lost.
  - Added the required column `priorityId` to the `Tache` table without a default value. This is not possible if the table is not empty.
  - Added the required column `statusId` to the `Tache` table without a default value. This is not possible if the table is not empty.

*/
-- CreateTable
CREATE TABLE "Priority" (
    "priorityId" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "description" TEXT
);

-- CreateTable
CREATE TABLE "Status" (
    "statusId" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "description" TEXT
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Tache" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "priorityId" INTEGER NOT NULL,
    "statusId" INTEGER NOT NULL,
    "dueDate" DATETIME NOT NULL,
    "assignedTo" INTEGER NOT NULL DEFAULT 1,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Tache_priorityId_fkey" FOREIGN KEY ("priorityId") REFERENCES "Priority" ("priorityId") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Tache_statusId_fkey" FOREIGN KEY ("statusId") REFERENCES "Status" ("statusId") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Tache" ("assignedTo", "createdAt", "description", "dueDate", "id", "title", "updatedAt") SELECT "assignedTo", "createdAt", "description", "dueDate", "id", "title", "updatedAt" FROM "Tache";
DROP TABLE "Tache";
ALTER TABLE "new_Tache" RENAME TO "Tache";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
