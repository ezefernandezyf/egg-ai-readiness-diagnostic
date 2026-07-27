-- CreateTable
CREATE TABLE "Lead" (
    "id" TEXT NOT NULL,
    "email_hash" TEXT NOT NULL,
    "company" TEXT NOT NULL,
    "role" TEXT,
    "maturity_segment" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Lead_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "QuizResponse" (
    "id" TEXT NOT NULL,
    "lead_id" TEXT NOT NULL,
    "dimension" TEXT NOT NULL,
    "question_key" TEXT NOT NULL,
    "score_1_5" INTEGER NOT NULL,

    CONSTRAINT "QuizResponse_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DimensionScore" (
    "id" TEXT NOT NULL,
    "lead_id" TEXT NOT NULL,
    "dimension" TEXT NOT NULL,
    "score_0_100" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "DimensionScore_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Report" (
    "id" TEXT NOT NULL,
    "lead_id" TEXT NOT NULL,
    "overall_score" DOUBLE PRECISION NOT NULL,
    "narrative" TEXT,
    "recommendations" TEXT,
    "pdf_url" TEXT,
    "partial" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Report_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Lead_email_hash_key" ON "Lead"("email_hash");

-- CreateIndex
CREATE UNIQUE INDEX "Report_lead_id_key" ON "Report"("lead_id");

-- AddForeignKey
ALTER TABLE "QuizResponse" ADD CONSTRAINT "QuizResponse_lead_id_fkey" FOREIGN KEY ("lead_id") REFERENCES "Lead"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DimensionScore" ADD CONSTRAINT "DimensionScore_lead_id_fkey" FOREIGN KEY ("lead_id") REFERENCES "Lead"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Report" ADD CONSTRAINT "Report_lead_id_fkey" FOREIGN KEY ("lead_id") REFERENCES "Lead"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
