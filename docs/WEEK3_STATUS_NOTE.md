# Forma AI — Week 3 Status Note (For Mentor / Axleo Review)

**Prepared:** Keshav (Member 1, Team Leader) — 2026-08-27
**Week 3 (Aug 22–28, 2026)** — Live Extraction Wiring + Validation UI

---

## What Week 3 Set Out to Do

Replace the Week 2 mock fallback with the live LLM extraction service,
integrate validation UI (AI-missed / needs-review highlights), and
confirm the full extraction → validated-form flow across every seeded
form type — including the 3-level branching stress test.

---

## What Was Delivered (verified via git log, non-merge)

| Member | Role | Key Week 3 commits (verified) |
|--------|------|------------------------------|
| Keshav (M1) | Frontend Renderer Lead + Leader | `feat: integrate AI-missed field validation`, `fix: allow easy manual correction`, `test: verify extraction-to-validation flow` (5/5) |
| Rakesh (M2) | Backend Schema Architect | `docs: finalize Week 3 schema updates`, `fix: verify schema consistency`, `feat: expand field aliases`, `docs: define confidence/review guidance` |
| Vinay (M3) | Backend API Engineer | `feat: distinguish missed vs empty fields`, `fix: harden nested extraction shape`, `fix: improve extraction reliability`, `docs: finalize live extraction API contract` |
| Praveen (M4) | Frontend UI/UX Engineer | `feat: design validation UI states`, `feat: correction affordance`, `feat: style submission-blocked warning`, `fix: resolve validation UI visual bugs` |
| V. Divyesh (M5) | Test Engineer | `test: migrate extraction tests`, `test: add submit-blocking validation`, `test: add missed/incorrect coverage`, `test: update full regression suite`, `test: verify 3-level branching` |

**Integration:** Day 20 (Aug 27) — all Week 3 branches merged cleanly into
`Keshav` (fast-forward, zero conflicts). Bridge added so both flat live
and nested `/value+found` extraction responses work.

**Testing:** 20/20 Vitest passing; full end-to-end verified across all 4
seeded forms + 3-level branching chain.

---

## Current State

- ✅ Live extraction endpoint (`POST /api/forms/:id/extract`) wired to
  `MagicInput` by default; mock gated behind `?mock=1`
- ✅ `applyExtractedData()` handles live flat JSON + Praveen's nested
  format; misses (`""`/false) never wipe manual edits
- ✅ Conditional (`showIf`) fields react correctly to AI-populated values
- ✅ Validation UI integrated: ❓ missed, ⚠️ review, + correction button
- ✅ Submit blocked with named warning when required AI-missed fields
  are still empty
- ✅ Ambiguous-story fixture added for Member 5; manual correction
  survives later re-extractions (`humanEditedRef`)
- ⏳ Week 3 regression suite (Day 13/14 task, V. Divyesh) — completed in
  this week's test updates (`test-log.md` updated)

---

## Week 4 Kickoff Outline (Save & Resume + Polish)

Per Axleo's plan (Week 4): Save & Resume, Polish, Final Review prep.

**Proposed distribution (pending team agreement):**
- **Day 22:** Keshav scaffold `Save draft` button + serialize state
- **Day 23:** Vinay wire save action to backend endpoint; Praveen design resume UI
- **Day 24:** Rakesh / Keshav implement resume-from-draft flow (setValue + conditional resolve)
- **Day 25:** Praveen animation/polish pass (expand/collapse, mobile width)
- **Day 26:** V. Divyesh full regression + edge cases (expired draft, mobile)
- **Day 27:** Integration Day 4 — merge all Week 4 branches, final build
- **Day 28:** Final Review Prep — docs, commit record (20-day no-gap), mentor walkthrough

---

## Open / Carry-Forward Items

1. **Nested vs flat extraction contract:** live service returns flat; Praveen
   designed nested (`found`/`value`). Bridge works; backend should align.
2. **Confidence / review guidance:** Rakesh's `confidence/review guidance`
   doc is finalized — integrate into extraction output schema when backend
   adds confidence scores.
3. **No-gap commit record:** all 5 members have Week 3 commits; none have
   48h unresponsive gaps. Confirm before Final Review.

---

*Prepared by Keshav (Member 1) — 2026-08-27*
