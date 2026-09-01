# Forma AI — Week 3 Progress Summary (For Mentor)

**Week 3 (Aug 22–28, 2026)** — AI-Missed Validation + Correction UX
**Prepared by:** Keshav (Team Leader, Member 1)

---

## What Week 3 Set Out to Do

Close the loop on the AI-augmented input flow built in Week 2: distinguish AI-missed fields from genuinely empty ones, let users manually correct AI-filled values without breaking validation state, add clear validation UI states (including a submission-blocked warning), retire the mock extraction fallback as the default path, and bring the extraction contract and test suite fully in line with the live extraction service.

## What Was Delivered

### Backend (Rakesh — M2, Vinay — M3)
- Schema aligned with the live extraction response shape; confidence/review guidance defined for extracted fields (Rakesh)
- Field aliases expanded based on real extraction testing; AI-filled vs. manually-edited field handling documented (Rakesh)
- Post-merge schema consistency verified and finalized (Rakesh)
- Live extraction API contract finalized and documented (Vinay)
- Extraction reliability improved for production-default use (Vinay)
- Missed vs. empty field distinction added to extraction output; nested extraction shape handling hardened for edge cases (Vinay)
- API error responses standardized (Vinay)

### Frontend (Keshav — M1, Praveen — M4)
- `FormRenderer` wired to the live extraction endpoint, replacing mock wiring; mock fallback retired as default and gated behind a dev flag (Keshav)
- AI-missed field validation integrated into the submit flow; manual correction of AI-filled values enabled without breaking validation state (Keshav)
- Validation UI states designed for missed/uncertain fields, including a correction affordance and submission-blocked warning styling (Praveen)
- Validation UI visual bugs and mobile responsive issues resolved; final UI consistency pass across all Week 3 features (Praveen)

### Testing (V. Divyesh — M5)
- Extraction tests migrated from mock to the live endpoint
- Missed/incorrect field validation coverage and submit-blocking validation tests added
- 3-level conditional branching re-verified against live extraction
- Full Week 3 regression suite completed, including a final run against the merged Week 3 branch

### Integration (Keshav — Day 20)
- All Week 3 member branches merged into `Keshav`/`main`
- Extraction-to-validation flow verified end-to-end across all seeded forms

## Current State

- Working flow confirmed end-to-end: Magic Input story → LLM extraction → auto-filled form → AI-missed/empty distinction → validation UI → manual correction → submission
- Mock extraction fallback no longer in the default path
- Cross-form extraction-to-validation flow verified across all sample forms
- Praveen and V. Divyesh both closed out their Aug 28 work; full regression suite passing against the merged Week 3 branch

## Commit Compliance

Verified fresh via `git fetch` + `git log --no-merges` across all branches on Aug 29:

| Member | Days committed (of 7) | Missing |
|--------|-------------------------|---------|
| Keshav | 7/7 | none |
| Rakesh | 6/7 | Aug 26 (merge-only — two PR merges under his account, no authored commit that day) |
| Vinay | 5/7 | Aug 25, Aug 28 |
| Praveen | 7/7 | none |
| V. Divyesh | 7/7 | none |

Rakesh's Aug 26 gap is a merge-only day, not an absence — confirmed by author-filtered log search. Vinay's Aug 25 and Aug 28 gaps remain unconfirmed as of this summary and are being followed up on directly.

## Known Items Carried into Week 4

1. Confirm Aug 25 and Aug 28 gaps directly with Vinay
2. Resolve the nested vs. flat extraction contract at the backend source (currently bridged on the frontend) — flagged to Rakesh/Vinay
3. Save & Resume feature planning and implementation
4. Final Review prep — sustain the 20/20-day, no-gap commit-coverage standard through the remaining weeks
