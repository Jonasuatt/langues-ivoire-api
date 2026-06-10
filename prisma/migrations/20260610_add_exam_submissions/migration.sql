-- Migration Phase B : ExamSubmission (examens charnières comité d'experts)

-- Enum ExamStatus
CREATE TYPE "ExamStatus" AS ENUM ('PENDING', 'IN_REVIEW', 'APPROVED', 'REJECTED');

-- Table exam_submissions
CREATE TABLE "exam_submissions" (
    "id"           TEXT NOT NULL,
    "userId"       TEXT NOT NULL,
    "languageId"   TEXT NOT NULL,
    "enrollmentId" TEXT NOT NULL,
    "gradeLevelId" TEXT NOT NULL,
    "textContent"  TEXT,
    "audioUrl"     TEXT,
    "status"       "ExamStatus" NOT NULL DEFAULT 'PENDING',
    "reviewedBy"   TEXT,
    "commentaire"  TEXT,
    "reviewedAt"   TIMESTAMP(3),
    "createdAt"    TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt"    TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "exam_submissions_pkey" PRIMARY KEY ("id")
);

-- Index
CREATE INDEX "exam_submissions_status_idx"           ON "exam_submissions"("status");
CREATE INDEX "exam_submissions_userId_languageId_idx" ON "exam_submissions"("userId", "languageId");

-- Foreign keys
ALTER TABLE "exam_submissions" ADD CONSTRAINT "exam_submissions_userId_fkey"
    FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "exam_submissions" ADD CONSTRAINT "exam_submissions_languageId_fkey"
    FOREIGN KEY ("languageId") REFERENCES "languages"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "exam_submissions" ADD CONSTRAINT "exam_submissions_enrollmentId_fkey"
    FOREIGN KEY ("enrollmentId") REFERENCES "enrollments"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "exam_submissions" ADD CONSTRAINT "exam_submissions_gradeLevelId_fkey"
    FOREIGN KEY ("gradeLevelId") REFERENCES "grade_levels"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "exam_submissions" ADD CONSTRAINT "exam_submissions_reviewedBy_fkey"
    FOREIGN KEY ("reviewedBy") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
