# Forma AI — Week 2 Progress Summary (For Mentor)

**Week 2 (Aug 15–21, 2026)** — LLM Integration + AI Input UX
**Prepared by:** Keshav (Team Leader, Member 1)

---

## What Week 2 Set Out to Do

Add the AI-augmented layer to the dynamic form engine built in Week 1: a "Magic Input" where a user describes their situation in plain English, an LLM extraction endpoint that converts that story into structured JSON, and a frontend that auto-populates the form from that JSON — including conditional (`showIf`) fields reacting correctly to AI-filled values.

## What Was Delivered

### Backend (Vinay — M3, Rakesh — M2)
- Extraction service (`services/extractionService.js`) — generalized, schema-driven, live on `main`
- `POST /api/forms/:id/extract` endpoint accepting a story and returning extracted entities as JSON
- Error handling: retries, timeouts, standardized `{ error: '...' }` response shape, proper `ExtractionServiceError` typing
- Extraction output schema documented, including field-to-entity mapping and field aliases (e.g. `vehicle: [car, honda, vehicle]`)
- 3-level branching sample form added to seed data

### Frontend (Keshav — M1, Praveen — M4)
- Magic Input component: textarea, submit, loading state
- Auto-population via `applyExtractedData()` — extraction JSON mapped to form fields via react-hook-form's `setValue()`
- Conditional fields now react correctly to AI-populated values (`shouldDirty: true` fix)
- 3-level branching verified end-to-end from a single extraction
- AI-missed field highlighting, smooth transitions for conditional fields

### Testing (V. Divyesh — M5)
- Story fixtures, extraction API tests, malformed/incomplete-input tests, extraction controller alignment fixes — completed through Day 12
- Day 13 (full regression suite) and Day 14 (test suite cleanup + `test-log.md`) are still outstanding — see Known Items below

### Integration (Keshav — Day 13)
- All 5 member branches merged, 3 conflicts resolved
- Full read-through and end-to-end verification of the merged flow
- Backend: 23/23 tests passing (18 unit + 5 live API). Frontend: 10/10 tests passing (Vitest)
- PR #57 (Keshav → main) open, pending final items before merge

## Current State

- Working flow confirmed: Magic Input story → LLM extraction → auto-filled form → conditional rendering → validated submission
- Frontend `App.jsx` now correctly defaults to the real form app (previously defaulted to a dev test page — fixed today)
- Unused Jest/Babel test tooling removed from frontend; Vitest confirmed as the single test runner

## Commit Compliance

Full per-day, per-member commit data verified directly from git history (`git log --all --no-merges`), not self-reported:

| Member | Days committed (of 7) | Missing |
|--------|------------------------|---------|
| Keshav | 7/7 | none |
| Rakesh | 5/7 | Aug 16, Aug 19 |
| Vinay | 4/7 | Aug 15, Aug 18, Aug 19 |
| Praveen | 6/7 | Aug 15 |
| V. Divyesh | 4/7 | Aug 16, Aug 20, Aug 21 |

Rakesh's, Vinay's, and Praveen's gaps are being followed up on directly and will be clarified before Mid Review. V. Divyesh's gap for Aug 20–21 is due to a personal/medical emergency; the team is aware and he will complete his remaining Day 13–14 work once he's back.

## Known Items Carried into Week 3

1. Mock extraction fallback in `MagicInput.jsx` should be fully replaced by the live extraction service now that it's stable on `main`
2. Frontend error boundary for LLM API failures still needs polish
3. Full Week 2 regression suite + `test-log.md` (V. Divyesh, Day 13–14) still outstanding
4. More edge-case story fixtures for extraction robustness
5. PR #57 merge pending the above
