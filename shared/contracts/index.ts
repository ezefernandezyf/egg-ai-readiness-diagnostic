export {
  DIMENSIONS,
  LikertScore,
  QuizAnswer,
  QuizStep,
  QuizSubmission,
  DimensionAnswers,
} from './quiz.schema.js';

export type {
  Dimension,
  QuizAnswer as QuizAnswerType,
  QuizStep as QuizStepType,
  QuizSubmission as QuizSubmissionType,
  DimensionAnswers as DimensionAnswersType,
} from './quiz.schema.js';

export {
  DimensionScore,
  MaturitySegment,
  Recommendation,
  GroqResponse,
  Report,
} from './report.schema.js';

export type {
  DimensionScore as DimensionScoreType,
  MaturitySegment as MaturitySegmentType,
  Recommendation as RecommendationType,
  GroqResponse as GroqResponseType,
  Report as ReportType,
} from './report.schema.js';

export {
  LeadCapture,
  Lead,
  DiagnosticSubmitPayload,
} from './lead.schema.js';

export type {
  LeadCapture as LeadCaptureType,
  Lead as LeadType,
  DiagnosticSubmitPayload as DiagnosticSubmitPayloadType,
} from './lead.schema.js';
