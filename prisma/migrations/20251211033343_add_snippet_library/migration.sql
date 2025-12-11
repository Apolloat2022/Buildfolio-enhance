-- CreateTable
CREATE TABLE "Snippet" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "code" TEXT NOT NULL,
    "language" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "tags" TEXT[],
    "usageCount" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Snippet_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Snippet_language_idx" ON "Snippet"("language");

-- CreateIndex
CREATE INDEX "Snippet_category_idx" ON "Snippet"("category");
