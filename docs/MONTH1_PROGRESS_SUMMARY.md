# Forma AI — Month 1 Final Progress Summary (For Mentor / Final Review)

**Project 1 · AI-Augmented Dynamic Form Engine · Axlero Solutions Internship**
**Period covered:** August 8 – September 4, 2026 (Day 1–28)
**Prepared by:** Keshav (Team Leader, Member 1)

---

## What Month 1 Set Out to Do

Build a complete AI-Augmented Dynamic Form Engine on the MERN stack: a MongoDB schema capable of representing dynamic, conditionally-branching forms; an LLM extraction layer that converts free-text user stories into structured form data; a React frontend that renders forms, auto-populates them from AI extraction, validates AI-missed or incorrect fields, and supports saving and resuming partially-completed forms — all delivered with an automated test suite and unbroken team-wide commit compliance.

## What Was Delivered, Week by Week

### Week 1 (Aug 8–14) — Foundation: Schema, API, Renderer
- MongoDB dynamic-form schema with `validationRegex` and `showIf` conditional logic (Rakesh)
- Express + Mongoose backend serving schemas via `GET /api/forms/:id`, with error handling and CORS (Vinay)
- `FormRenderer.jsx` built and wired to live schema data; text/dropdown/checkbox fields with conditional visibility (Keshav, Praveen)
- Automated Jest test suite covering schema validation and conditional logic (V. Divyesh)
- 3 sample forms seeded and verified end-to-end

### Week 2 (Aug 15–21) — LLM Integration + AI Input UX
- Generalized extraction service (`extractionService.js`) and `POST /api/forms/:id/extract` endpoint (Vinay, Rakesh)
- Magic Input component: free-text story → LLM extraction → structured JSON (Keshav, Praveen)
- Auto-population via `applyExtractedData()`; conditional fields confirmed to react correctly to AI-filled values
- 3-level branching form added and verified from a single extraction
- Extraction test fixtures, malformed/incomplete-input coverage (V. Divyesh)
- All 5 branches merged; 23/23 backend tests, 10/10 frontend tests passing

### Week 3 (Aug 22–28) — Live Extraction Wiring + Validation UI
- Mock extraction retired as default, gated behind `?mock=1` dev flag; `FormRenderer` wired to the live endpoint (Keshav)
- AI-missed vs. genuinely-empty field distinction added to extraction output (Vinay)
- Validation UI states designed and integrated: missed-field highlighting, correction affordance, submission-blocked warning (Praveen, Keshav)
- Manual correction of AI-filled fields enabled without breaking validation state
- Full extraction-to-validation flow verified across all seeded forms, including the 3-level branching stress test
- Schema aligned with live extraction shape; field aliases expanded; confidence/review guidance documented (Rakesh)
- Full Week 3 regression suite completed (V. Divyesh); all Week 3 branches merged cleanly

### Week 4 (Aug 29 – Sep 4) — Save & Resume + Polish + Final Integration
- Draft/save-state schema designed, including `values`, `resumeToken`, `expiresAt` (Rakesh)
- Save-draft and resume-draft API routes implemented with server-side expiry enforcement (Vinay)
- Save Draft and Resume Draft frontend flows built and wired to the backend; `showIf` fields confirmed to resolve correctly on resume (Keshav)
- Save/resume UI states and final animation/transition polish delivered, including mobile-width QA (Praveen)
- Draft expiry, concurrency, and full end-to-end (extract → validate → save → resume → submit) test coverage added (V. Divyesh)
- All Week 4 branches merged into `Keshav` via `origin/main`; frontend and backend verified clean; PR #128 opened for Final Review

## Current State — End of Month 1

The complete flow works end-to-end: a user describes their situation in plain English via Magic Input → the LLM extracts structured data → the form auto-populates, distinguishing AI-missed fields from genuinely empty ones → validation blocks submission on unresolved required fields → the user can manually correct any AI-filled value → the form can be saved as a draft and resumed later, with all conditional logic intact → the form is submitted.

- Frontend build verified clean (Vite, 83 modules, zero errors)
- Backend verified clean (MongoDB connected, Express server running)
- Cross-browser tested on Chrome, Brave, and Edge (all Chromium) — consistent
- Expired and invalid draft handling verified
- `main` branch reflects the complete, working Month 1 feature set; PR #128 open for mentor review

## Commit Compliance — Full Month

Verified via `git log --all --no-merges` across all branches, fetched fresh on Sep 4.

**Final Review requirement:** at least one commit from any team member on all 20 of the prior 20 days, zero gaps, team-wide.

| Window | Days | Team Coverage |
|--------|------|-----------------|
| Aug 16 – Sep 4 (Final Review window) | 20 | **20/20 — zero gap days ✅** |
| Aug 8 – Sep 4 (full Month 1) | 28 | **28/28 — zero gap days ✅** |

**Result: the team meets and exceeds both the Mid Review (10/14 days) and Final Review (20/20 days, no gaps) standards for the entire month**, with no day across all 28 days lacking at least one commit from the team.

Individual members had occasional gap days across the month (see each week's Work Distribution document for details), but none triggered the SOP's 48-hour unresponsive-member process, and none affected team-level compliance.

## Known Items Going Into Post-Final-Review / Project 2

1. **`OPENAI_API_KEY` missing from backend `.env`** — live extraction is currently blocked; all recent testing used mock mode (`?mock=1`). Needs to be obtained from the team's key-holder and added before production use.
2. **Firefox / non-Chromium browser testing** not yet completed — Chromium browsers verified and consistent.
3. **1 moderate `npm audit` vulnerability** in a backend transitive dependency — non-blocking, does not affect functionality.
4. **Nested vs. flat extraction contract** — currently bridged on the frontend; backend alignment flagged to Rakesh/Vinay as a cleanup item.
5. A small number of individual commit-gap days across Weeks 2–4 remain informally unconfirmed with the relevant members; none affected team-level compliance or delivery.

---

*Prepared by Keshav (Member 1, Team Leader) — September 4, 2026*
