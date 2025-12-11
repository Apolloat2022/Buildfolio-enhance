-- CreateTable
CREATE TABLE "Showcase" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "projectSlug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "imageUrl" TEXT,
    "githubUrl" TEXT,
    "liveUrl" TEXT,
    "tags" TEXT[],
    "likes" INTEGER NOT NULL DEFAULT 0,
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Showcase_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ShowcaseComment" (
    "id" TEXT NOT NULL,
    "showcaseId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ShowcaseComment_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Showcase_userId_idx" ON "Showcase"("userId");

-- CreateIndex
CREATE INDEX "Showcase_projectSlug_idx" ON "Showcase"("projectSlug");

-- CreateIndex
CREATE INDEX "Showcase_featured_idx" ON "Showcase"("featured");

-- CreateIndex
CREATE INDEX "ShowcaseComment_showcaseId_idx" ON "ShowcaseComment"("showcaseId");

-- CreateIndex
CREATE INDEX "ShowcaseComment_userId_idx" ON "ShowcaseComment"("userId");

-- AddForeignKey
ALTER TABLE "Showcase" ADD CONSTRAINT "Showcase_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ShowcaseComment" ADD CONSTRAINT "ShowcaseComment_showcaseId_fkey" FOREIGN KEY ("showcaseId") REFERENCES "Showcase"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ShowcaseComment" ADD CONSTRAINT "ShowcaseComment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
