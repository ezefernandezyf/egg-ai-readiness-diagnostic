# ai-report-engine Specification

## Purpose

Scores quiz responses, calls Groq for narrative analysis, generates a downloadable PDF report, and renders an interactive radar-chart dashboard. This is the core value-delivery engine of the diagnostic.

## Requirements

### Requirement: Scoring Algorithm (RPT-001)

The system MUST compute per-dimension scores by averaging Likert responses (1–5) and normalizing to 0–100. The overall score MUST be the average of all 5 dimension scores. Scores MUST be calculated server-side.

#### Scenario: All minimum responses

- GIVEN all 3 Strategy answers are 1
- WHEN the scoring algorithm runs
- THEN Strategy score normalizes to 0
- AND all-1 across all dimensions yields overall_score=0

#### Scenario: All maximum responses

- GIVEN all answers across all 5 dimensions are 5
- WHEN the scoring algorithm runs
- THEN all dimension scores normalize to 100
- AND overall_score=100

### Requirement: Groq Narrative Generation (RPT-002)

The system MUST send a structured prompt containing dimension scores to Groq and receive a Zod-validated JSON response with scores, a narrative summary, and at least 3 personalized recommendations. Response timeout MUST be 12 seconds.

#### Scenario: Successful generation

- GIVEN valid dimension scores from scoring algorithm
- WHEN the server calls Groq with the structured prompt
- THEN Groq returns valid JSON within 12s
- AND response passes Zod validation
- AND the client receives scores + narrative + recommendations

#### Scenario: Groq timeout

- GIVEN Groq does not respond within 12s
- WHEN the timeout fires
- THEN the system returns scores without narrative
- AND the report is marked partial=true

#### Scenario: Malformed Groq response

- GIVEN Groq returns JSON that fails Zod validation
- WHEN the server detects the validation failure
- THEN a single retry is attempted
- AND if the retry also fails, the fallback response is returned (scores only, partial=true)

### Requirement: PDF Generation (RPT-003)

The system MUST generate a downloadable PDF report server-side containing the radar chart, dimension scores, narrative summary, and recommendations.

#### Scenario: User downloads PDF

- GIVEN user is viewing the dashboard with a completed report
- WHEN user clicks "Descargar PDF"
- THEN a PDF is generated server-side within 5s
- AND the browser triggers a file download

#### Scenario: PDF generation fails

- GIVEN the PDF generation service encounters an error
- WHEN the download is requested
- THEN the dashboard remains visible
- AND a "Reintentar" button appears for the PDF

### Requirement: Radar Chart Visualization (RPT-004)

The dashboard MUST render an interactive radar chart with 5 axes (one per dimension). Hover state MUST show the exact score for that dimension. The chart MUST animate on first render.

#### Scenario: Radar chart renders

- GIVEN report data with 5 dimension scores is received
- WHEN the dashboard component mounts
- THEN a radar chart renders with 5 labeled axes
- AND animation completes in <500ms
- AND hovering a data point shows the numeric score
