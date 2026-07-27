-- CreateTable
CREATE TABLE "Lead" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email_hash" TEXT NOT NULL,
    "company" TEXT NOT NULL,
    "role" TEXT,
    "maturity_segment" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "QuizResponse" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "lead_id" TEXT NOT NULL,
    "dimension" TEXT NOT NULL,
    "question_key" TEXT NOT NULL,
    "score_1_5" INTEGER NOT NULL,
    CONSTRAINT "QuizResponse_lead_id_fkey" FOREIGN KEY ("lead_id") REFERENCES "Lead" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "DimensionScore" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "lead_id" TEXT NOT NULL,
    "dimension" TEXT NOT NULL,
    "score_0_100" REAL NOT NULL,
    CONSTRAINT "DimensionScore_lead_id_fkey" FOREIGN KEY ("lead_id") REFERENCES "Lead" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Report" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "lead_id" TEXT NOT NULL,
    "overall_score" REAL NOT NULL,
    "narrative" TEXT,
    "recommendations" TEXT,
    "pdf_url" TEXT,
    "partial" BOOLEAN NOT NULL DEFAULT false,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Report_lead_id_fkey" FOREIGN KEY ("lead_id") REFERENCES "Lead" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "Lead_email_hash_key" ON "Lead"("email_hash");

-- CreateIndex
CREATE UNIQUE INDEX "Report_lead_id_key" ON "Report"("lead_id");
