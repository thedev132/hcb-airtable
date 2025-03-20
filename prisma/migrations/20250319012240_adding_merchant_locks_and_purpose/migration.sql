-- AlterTable
ALTER TABLE "Project" ADD COLUMN     "category_locks" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "grant_purpose" TEXT,
ADD COLUMN     "keyword_lock" TEXT,
ADD COLUMN     "merchant_locks" TEXT[] DEFAULT ARRAY[]::TEXT[];
