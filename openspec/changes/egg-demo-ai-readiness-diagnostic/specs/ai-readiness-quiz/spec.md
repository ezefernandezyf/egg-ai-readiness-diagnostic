# ai-readiness-quiz Specification

## Purpose

Multi-step interactive quiz evaluating AI maturity across 5 enterprise dimensions. Serves as the entry point for the diagnostic funnel, collecting structured responses before lead capture.

## Requirements

### Requirement: Multi-step Navigation (QUIZ-001)

The system MUST present one dimension per screen (5 total: Estrategia, Talento, Procesos, Tecnología, Cultura), with 3 Likert-scale questions (1–5) each. A progress bar MUST be visible at all times. Bidirectional navigation (Anterior/Siguiente) MUST preserve answered state. Each step MUST validate all questions before advancing.

#### Scenario: Complete quiz flow

- GIVEN user lands on intro screen
- WHEN user clicks "Comenzar diagnóstico"
- THEN step 1 (Estrategia) loads with progress bar at 0%
- AND 3 Likert questions appear with radio-button options (1–5)

#### Scenario: Step validation blocked

- GIVEN user on step 2 with at least one unanswered question
- WHEN user clicks "Siguiente"
- THEN inline error highlights the unanswered field(s)
- AND the step does NOT advance

#### Scenario: Back navigation preserves state

- GIVEN user on step 3 with previously selected answers on step 2
- WHEN user clicks "Anterior"
- THEN step 2 loads with all previously selected answers restored

### Requirement: Animated Transitions (QUIZ-002)

The system SHOULD animate transitions between quiz steps (fade or horizontal slide, ≤300ms) to provide visual continuity.

#### Scenario: Forward transition

- GIVEN user completes step 1
- WHEN user clicks "Siguiente"
- THEN step 1 fades or slides out over ~300ms
- AND step 2 fades or slides in

### Requirement: Responsive Layout (QUIZ-003)

The quiz MUST be mobile-first. Questions MUST stack vertically on viewports <640px. The progress bar MUST be sticky at the top of the viewport.

#### Scenario: Mobile viewport

- GIVEN viewport width <640px
- WHEN quiz step renders
- THEN questions stack in a single column
- AND progress bar is fixed to the top of the screen
