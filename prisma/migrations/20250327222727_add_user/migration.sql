-- CreateTable
CREATE TABLE "Tache" (
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

-- CreateTable
CREATE TABLE "user" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "nom" TEXT NOT NULL,
    "type" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "user_email_key" ON "user"("email");
