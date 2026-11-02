-- AlterTable
ALTER TABLE "User"
ADD COLUMN "emailVerificationExpiry" TIMESTAMP(3),
ADD COLUMN "emailVerificationToken" TEXT,
ADD COLUMN "isEmailVerified" BOOLEAN NOT NULL DEFAULT false;

-- CreateIndex
CREATE UNIQUE INDEX "User_emailVerificationToken_key"
ON "User"("emailVerificationToken");

-- Mark existing users as verified
UPDATE "User"
SET "isEmailVerified" = true;