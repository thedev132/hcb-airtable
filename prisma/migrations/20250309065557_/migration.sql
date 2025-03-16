/*
  Warnings:

  - Added the required column `airtable_table` to the `Project` table without a default value. This is not possible if the table is not empty.
  - Added the required column `airtable_view` to the `Project` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Project" ADD COLUMN     "airtable_table" TEXT NOT NULL,
ADD COLUMN     "airtable_view" TEXT NOT NULL;
