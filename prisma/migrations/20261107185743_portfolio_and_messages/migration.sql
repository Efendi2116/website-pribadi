/*
  Warnings:

  - You are about to drop the `GuestbookEntry` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Post` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the column `accent` on the `Project` table. All the data in the column will be lost.
  - You are about to drop the column `featured` on the `Project` table. All the data in the column will be lost.
  - You are about to drop the column `liveUrl` on the `Project` table. All the data in the column will be lost.
  - You are about to drop the column `repoUrl` on the `Project` table. All the data in the column will be lost.
  - You are about to drop the column `role` on the `Project` table. All the data in the column will be lost.
  - You are about to drop the column `slug` on the `Project` table. All the data in the column will be lost.
  - You are about to drop the column `sortOrder` on the `Project` table. All the data in the column will be lost.
  - You are about to drop the column `summary` on the `Project` table. All the data in the column will be lost.
  - You are about to drop the column `year` on the `Project` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "GuestbookEntry_createdAt_idx";

-- DropIndex
DROP INDEX "Post_publishedAt_idx";

-- DropIndex
DROP INDEX "Post_slug_key";

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "GuestbookEntry";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "Post";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "Message" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Project" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "imageUrl" TEXT,
    "tags" TEXT NOT NULL,
    "githubLink" TEXT,
    "liveLink" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_Project" ("createdAt", "description", "id", "tags", "title") SELECT "createdAt", "description", "id", "tags", "title" FROM "Project";
DROP TABLE "Project";
ALTER TABLE "new_Project" RENAME TO "Project";
CREATE INDEX "Project_createdAt_idx" ON "Project"("createdAt");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE INDEX "Message_createdAt_idx" ON "Message"("createdAt");
