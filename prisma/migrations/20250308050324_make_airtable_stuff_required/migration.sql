/*
  Warnings:

  - Made the column `airtable_base_id` on table `Project` required. This step will fail if there are existing NULL values in that column.
  - Made the column `airtable_approval_id` on table `Project` required. This step will fail if there are existing NULL values in that column.
  - Made the column `airtable_grant_id` on table `Project` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Project" ALTER COLUMN "airtable_base_id" SET NOT NULL,
ALTER COLUMN "airtable_approval_id" SET NOT NULL,
ALTER COLUMN "airtable_grant_id" SET NOT NULL;
