-- DropForeignKey
ALTER TABLE "Result" DROP CONSTRAINT "Result_testId_fkey";

-- AddForeignKey
ALTER TABLE "Result" ADD CONSTRAINT "Result_testId_fkey" FOREIGN KEY ("testId") REFERENCES "Test"("id") ON DELETE CASCADE ON UPDATE CASCADE;
