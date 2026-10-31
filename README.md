# Personal IELTS Writing Examiner

A private, rigorous full-stack web application designed for personal IELTS Academic Writing practice and diagnostic assessment, evaluated strictly against the **Official May 2023 IELTS Writing Band Descriptors**.

Powered by **Groq AI** for ultra-fast, deterministic evaluation using structured JSON outputs and vision-capable multimodal analysis.

---

## Key Features

- **Strict, Non-Inflated Assessment**: Employs the official May 2023 band descriptors as the primary scoring reference. Bolded limiting features (such as missing overviews or mechanical cohesion) directly cap ratings as required by official examiners.
- **Accurate IELTS Overall Band Calculation**: Implements the official IELTS rounding methodology:
  - Takes the arithmetic mean of the four assessment criteria.
  - If the fractional part of the average is `< 0.25`, it rounds down to the whole band.
  - If the fractional part is `>= 0.25` and `< 0.75`, it rounds to the half band (`0.5`).
  - If the fractional part is `>= 0.75`, it rounds up to the next whole band.
- **Academic Writing Task 1**:
  - Supports Line Graphs, Bar Charts, Pie Charts, Tables, Maps, and Process Diagrams.
  - Multi-file upload for JPG, PNG, WEBP images and past exam question PDFs.
  - Multimodal vision analysis extracts categories, units, key trends, extreme values, and compares them with student reports to prevent AI hallucination and verify factual accuracy.
- **Academic Writing Task 2**:
  - Classifies question types (Opinion / Agree or Disagree, Discussion, Problems and Solutions, Advantages and Disadvantages, Two-part, etc.).
  - Evaluates position clarity, argument development, paragraph purpose, and conclusion strength.
- **Detailed Examiner Breakdown**:
  - **4 Individual Criterion Cards**: Task Achievement / Response, Coherence & Cohesion, Lexical Resource, Grammatical Range & Accuracy. Each card details descriptor characteristics matched, quotes exact evidence from the essay, and states what specifically prevents the candidate from achieving the next band.
  - **Grammar & Sentence Structure**: Identifies meaningful mistakes with side-by-side original vs. corrected sentences and grammatical explanations.
  - **Lexical Resource**: Evaluates repetitive vocabulary with frequency counts, flags inaccurate word choices and awkward collocations, and suggests academic alternatives without artificial thesaurus stuffing.
  - **Coherence & Cohesion**: Audits linking devices, classifying them as effective, mechanical, overused, or inaccurate.
  - **Refined Model (Band 8–9)**: Provides an improved version preserving the student's original arguments, thesis, and factual data.
  - **Improvement Action Plan**: 3–5 prioritized, actionable recommendations.
- **Privacy & Simplicity (Zero Database)**:
  - No database, no user accounts, no tracking.
  - Uploaded temporary files are cleaned up immediately from disk after processing.
  - API keys are never exposed to client-side code.

---

## Technology Stack

- **Frontend**: React 19, TypeScript, Vite, Tailwind CSS v4, Lucide React icons.
- **Backend**: Node.js, Express, TypeScript, Multer, Sharp (image optimization & validation), PDF-Parse.
- **AI Engine**: Groq SDK (`groq-sdk`), structured JSON mode, vision-capable multimodal models.
- **Testing**: Vitest (25/25 automated unit & integration tests) and Browser Subagent UI validation.

---

## Project Structure

```
d:/ielts/writing/
├── .env.example              # Template for environment variables
├── .gitignore                # Git ignore rules
├── package.json              # Root orchestration scripts
├── README.md                 # Project documentation
├── server/                   # Backend Express TypeScript server
│   ├── package.json
│   ├── tsconfig.json
│   ├── src/
│   │   ├── config.ts         # Environment & server configuration
│   │   ├── index.ts          # Express server entry point & static serving
│   │   ├── types/            # TypeScript data contracts
│   │   ├── middleware/       # Multer upload, rate limiter, error handling
│   │   ├── routes/           # /api/assess, /api/models, /api/health
│   │   └── services/
│   │       ├── bandDescriptors.ts # Complete Official May 2023 Band Descriptors
│   │       ├── scoringEngine.ts   # Official IELTS rounding & word counter
│   │       ├── documentParser.ts  # Sharp image & PDF-Parse document processor
│   │       ├── promptBuilder.ts   # Descriptor-injected system & user prompts
│   │       └── groq.ts            # Groq API vision & text evaluation client
│   └── tests/
│       ├── scoringEngine.test.ts        # Unit tests for scoring & rounding rules
│       ├── bandDescriptors.test.ts     # Verification of official rubric coverage
│       └── assessmentIntegration.test.ts# 10 integration & edge case scenarios
└── client/                   # Frontend React TypeScript application
    ├── package.json
    ├── vite.config.ts
    ├── tsconfig.json
    ├── index.html
    └── src/
        ├── App.tsx           # Main application shell with theme & view routing
        ├── index.css         # Tailwind CSS v4 setup and typography
        ├── types/            # Frontend interfaces
        ├── services/         # API client & sample test data
        └── components/       # UI components
            ├── Navbar.tsx
            ├── Dashboard.tsx
            ├── Task1Assessment.tsx
            ├── Task2Assessment.tsx
            ├── AssessmentResults.tsx
            ├── BandScoreCard.tsx
            ├── CriterionCard.tsx
            ├── GrammarCorrectionsView.tsx
            ├── VocabularyAnalysisView.tsx
            ├── CoherenceAnalysisView.tsx
            ├── RefinedEssayView.tsx
            ├── ImprovementPlanView.tsx
            ├── FileUploadZone.tsx
            ├── WordCounter.tsx
            ├── LoadingIndicator.tsx
            ├── SettingsModal.tsx
            └── DescriptorsModal.tsx
```

---

## Installation & Setup

### Prerequisites
- Node.js v18+ (tested on Node v24)
- npm v9+

### 1. Install Dependencies
Run the following from the root directory:
```bash
npm install
npm --prefix server install
npm --prefix client install
```

### 2. Configure Your Groq API Key
You can configure your Groq API key in one of two ways:

#### Option A: Via `.env` file (Recommended)
Copy `.env.example` to `.env` in the root folder:
```bash
cp .env.example .env
```
Edit `.env` and insert your key:
```ini
GROQ_API_KEY=gsk_your_actual_groq_api_key_here
GROQ_TEXT_MODEL=llama-3.3-70b-versatile
GROQ_VISION_MODEL=qwen/qwen3.8-27b
PORT=3001
```

#### Option B: Via the Application UI
You can launch the application without setting `.env`. Click the **Settings** (gear icon) in the top-right corner of the web interface to enter your API key directly. It is saved in your browser's local session and securely passed via header to the backend.

---

## Running the Application Locally

### Running in Development Mode
You can run both backend and frontend concurrently:

In terminal 1 (Backend):
```bash
npm run dev:server
```
In terminal 2 (Frontend):
```bash
npm run dev:client
```
Access the client at `http://localhost:5173`. API requests are automatically proxied to `http://localhost:3001`.

### Running in Unified Production Mode
Build both client and server, then run the unified server:
```bash
npm run build
npm --prefix server start
```
Open `http://localhost:3001` in your browser. The Express server serves both the API and the pre-built React frontend.

---

## Explanation of Selected Groq Models

| Model | Role | Rationale |
|---|---|---|
| **`llama-3.3-70b-versatile`** | Primary Text & Scoring Model | State-of-the-art 70B parameter model with a 131,072 token context window. Excellent at following complex multi-criterion JSON schemas, strict objective reasoning, and nuanced linguistic/stylistic analysis. |
| **`qwen/qwen3.8-27b`** | Primary Multimodal Vision Model | Production-grade 27B vision-language model with native support on Groq. Capable of accurately parsing complex graphs, labels, legends, axes, process diagrams, and tables without hallucinating numerical figures. |
| **`llama-3.1-8b-instant`** | Automatic Fallback Model | Ultra-fast low-latency fallback if high-demand rate limits or model availability issues occur. |

*Note: Models can be swapped at any time via `.env` or the Settings modal without modifying any code.*

---

## Automated Test Results

The test suite verifies all required test cases (`npm --prefix server test`):

```
✓ tests/scoringEngine.test.ts (12 tests)
  - Clamping scores to valid IELTS [0.0 - 9.0] range
  - Official IELTS rounding rules:
    * Ends in .25 -> rounds UP to half band (.5)
    * Ends in .75 -> rounds UP to next whole band (1.0)
    * Fraction < 0.25 (.125) -> rounds DOWN to whole band
    * Fraction .375 -> rounds to half band
    * Fraction .625 -> rounds to half band
    * Fraction .875 -> rounds to next whole band
  - Accurate word counting (hyphenated terms, punctuation)

✓ tests/bandDescriptors.test.ts (3 tests)
  - Complete 0–9 band coverage for Task 1 (TA, CC, LR, GRA)
  - Complete 0–9 band coverage for Task 2 (TR, CC, LR, GRA)
  - Limiting features embedded for Bands 5 & 6

✓ tests/assessmentIntegration.test.ts (10 tests)
  - Empty essay submission rejection (400 validation error)
  - Invalid file uploads / security checks
  - Missing/invalid Groq API key handling
  - Malformed AI response handling
  - Task 1 Line Graph prompt & descriptor generation
  - Task 1 Table evaluation and word count
  - Task 1 Process Diagram evaluation
  - Task 1 PDF document extraction
  - Task 2 Opinion essay prompt classification
  - Task 2 Discussion essay prompt evaluation

Total: 25 passed out of 25 tests.
```

---

## Known Limitations

1. **Groq Free-Tier Rate Limits**: Free Groq API accounts have requests-per-minute (RPM) and tokens-per-minute (TPM) limits. If reached, the application displays a friendly countdown warning.
2. **Scanned Hand-Drawn Diagrams**: Highly degraded or low-contrast handwritten sketches might produce uncertain labels; the vision engine explicitly marks ambiguous figures as uncertain rather than guessing.
3. **Vercel Region**: Deployed to Washington, D.C. (`iad1`) for direct low-latency Groq AI API access.

