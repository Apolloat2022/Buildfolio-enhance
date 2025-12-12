-- AlterTable
ALTER TABLE "StartedProject" ADD COLUMN     "adminApprovedAt" TIMESTAMP(3),
ADD COLUMN     "adminApprovedBy" TEXT,
ADD COLUMN     "adminNotes" TEXT,
ADD COLUMN     "adminReviewed" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "certificateEligible" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "certificateIssuedAt" TIMESTAMP(3),
ADD COLUMN     "githubRepoUrl" TEXT,
ADD COLUMN     "repoValidatedAt" TIMESTAMP(3),
ADD COLUMN     "showcaseSubmitted" BOOLEAN NOT NULL DEFAULT false;
