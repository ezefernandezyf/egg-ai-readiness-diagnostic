# lead-capture Specification

## Purpose

Captures lead contact information (email + company) before unlocking the diagnostic report, using Zod validation and storing results segmented by maturity level.

## Requirements

### Requirement: Email + Company Capture (LEAD-001)

The system MUST present a form requiring email and company name before displaying the report dashboard. The form MUST be Zod-validated (email regex, company non-empty). The role field SHALL be optional.

#### Scenario: Valid submission unlocks report

- GIVEN user completes the 5 quiz steps
- WHEN user submits valid email and company name
- THEN the lead is stored in the database
- AND the report dashboard is unlocked and displayed

#### Scenario: Invalid email rejected

- GIVEN user enters "notanemail" in the email field
- WHEN the form is submitted
- THEN an inline error displays "Ingresá un email válido"
- AND the report is NOT unlocked

#### Scenario: Empty company rejected

- GIVEN user leaves the company field empty
- WHEN the form is submitted
- THEN an inline error displays "Ingresá el nombre de tu empresa"
- AND the report is NOT unlocked

### Requirement: Maturity-segmented Storage (LEAD-002)

The system MUST store the lead with all per-dimension scores, an overall score, a maturity segment (low: 0–33, medium: 34–66, high: 67–100), timestamp, and source. A single transaction MUST create the Lead, QuizResponse records, DimensionScore records, and Report.

#### Scenario: Lead stored with full segmentation

- GIVEN a validated lead submission with quiz answers
- WHEN the server processes the submission
- THEN a Lead record is created with maturity_segment
- AND 15 QuizResponse records (3 per dimension) are created
- AND 5 DimensionScore records are created
- AND 1 Report record is created
- ALL within a single database transaction

#### Scenario: Duplicate email resubmission

- GIVEN a lead with email "ceo@acme.com" already exists
- WHEN the same email submits again
- THEN the existing cached report is returned
- AND no new records are created
