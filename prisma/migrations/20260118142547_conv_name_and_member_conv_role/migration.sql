-- CreateEnum
CREATE TYPE "ConversationMemberRole" AS ENUM ('ADMIN', 'MEMBER');

-- AlterTable
ALTER TABLE "Conversation" ADD COLUMN     "name" TEXT;

-- AlterTable
ALTER TABLE "ConversationMember" ADD COLUMN     "role" "ConversationMemberRole" NOT NULL DEFAULT 'MEMBER';
