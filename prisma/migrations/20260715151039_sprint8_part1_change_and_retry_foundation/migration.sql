-- CreateEnum
CREATE TYPE "AppointmentChangeType" AS ENUM ('RESCHEDULED');

-- AlterEnum
ALTER TYPE "ReminderStatus" ADD VALUE 'RETRY_PENDING';

-- AlterTable
ALTER TABLE "reminders" ADD COLUMN     "attempt_count" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "last_attempt_at" TIMESTAMP(3),
ADD COLUMN     "next_attempt_at" TIMESTAMP(3);

-- CreateTable
CREATE TABLE "appointment_changes" (
    "id" TEXT NOT NULL,
    "booking_id" TEXT NOT NULL,
    "type" "AppointmentChangeType" NOT NULL,
    "old_appointment_date" TIMESTAMP(3) NOT NULL,
    "old_start_time" TEXT NOT NULL,
    "old_end_time" TEXT NOT NULL,
    "new_appointment_date" TIMESTAMP(3) NOT NULL,
    "new_start_time" TEXT NOT NULL,
    "new_end_time" TEXT NOT NULL,
    "reason" TEXT,
    "changed_by_user_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "appointment_changes_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "appointment_changes_booking_id_idx" ON "appointment_changes"("booking_id");

-- CreateIndex
CREATE INDEX "reminders_status_next_attempt_at_idx" ON "reminders"("status", "next_attempt_at");

-- AddForeignKey
ALTER TABLE "appointment_changes" ADD CONSTRAINT "appointment_changes_booking_id_fkey" FOREIGN KEY ("booking_id") REFERENCES "bookings"("id") ON DELETE CASCADE ON UPDATE CASCADE;
