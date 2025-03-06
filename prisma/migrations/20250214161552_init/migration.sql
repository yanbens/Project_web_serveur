-- CreateTable
CREATE TABLE "Tache" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "priority" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'À faire',
    "dueDate" DATETIME NOT NULL,
    "assignedTo" INTEGER NOT NULL DEFAULT 1,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "TacheHistory" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "tacheId" INTEGER NOT NULL,
    "changedBy" INTEGER NOT NULL DEFAULT 1,
    "changeType" TEXT NOT NULL,
    "oldValues" TEXT,
    "newValues" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "TacheHistory_tacheId_fkey" FOREIGN KEY ("tacheId") REFERENCES "Tache" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
