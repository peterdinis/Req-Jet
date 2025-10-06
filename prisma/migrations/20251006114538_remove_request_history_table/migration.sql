/*
  Warnings:

  - You are about to drop the `request_history` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."request_history" DROP CONSTRAINT "request_history_request_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."request_history" DROP CONSTRAINT "request_history_user_id_fkey";

-- DropTable
DROP TABLE "public"."request_history";
