/*
  Warnings:

  - Made the column `categorie` on table `depenses` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "classes" ADD COLUMN     "niveau" TEXT;

-- AlterTable
ALTER TABLE "depenses" ALTER COLUMN "categorie" SET NOT NULL;

-- AlterTable
ALTER TABLE "frais" ADD COLUMN     "typeFrais" TEXT NOT NULL DEFAULT 'ECOLAGE';
