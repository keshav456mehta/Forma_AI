# Forma AI — Week 2 Work Distribution Document

**Week 2 (Aug 15–21, 2026)** — LLM Integration + AI Input UX
**Project:** Forma AI (AI-Augmented Dynamic Form Engine)
**Prepared by:** Keshav (Member 1, Team Leader)

---

## Team Commit Record (verified via `git log --all --no-merges`)

| Member | Role | Days Committed | Missing Days |
|--------|------|-----------------|---------------|
| Keshav (M1) | Frontend Renderer Lead + Leader | 7/7 | none |
| Rakesh (M2) | Backend Schema Architect | 5/7 | Aug 16, Aug 19 |
| Vinay (M3) | Backend API Engineer | 4/7 | Aug 15, Aug 18, Aug 19 |
| Praveen (M4) | Frontend UI/UX Engineer | 6/7 | Aug 15 |
| V. Divyesh (M5) | Test Engineer | 4/7 | Aug 16, Aug 20, Aug 21 |

**Note on gaps:** Rakesh, Vinay, and Praveen's missing days are unaccounted for as of this document being written and are being followed up on directly with each of them. V. Divyesh's gap (Aug 20–21) is due to a personal/medical emergency — the team is aware, and he is catching up on his Day 13–14 tasks.

---

## Member-by-Member Summary

### Keshav (Member 1) — Frontend Renderer Lead + Team Leader

| Day | Date | Commit | What Was Done |
|-----|------|--------|----------------|
| 8 | Aug 15 | `feat: scaffold AI extraction wiring in FormRenderer` | Stub function accepting extracted JSON, calling `setValue()` per field |
| 9 | Aug 16 | `feat: wire Magic Input to extraction API` | Axios POST to `/api/forms/:id/extract`, loading state, mock fallback |
| 10 | Aug 17 | `feat: auto-populate form fields from AI extraction` | Mapped extraction JSON to fields via `setValue()` |
| 11 | Aug 18 | `fix: ensure conditional fields react to AI-populated values` | `shouldDirty: true` fix so `watch()` picks up programmatic sets |
| 12 | Aug 19 | `test: verify 3-level conditional branching with AI data` | Verified 3-level branching chain resolves from one extraction |
| 13 | Aug 20 | Multiple — merge/cleanup commits | Integration Day 2: merged all Week 2 branches into Keshav via dev, resolved 3 conflicts, cleaned up duplicate `DynamicForma.jsx`, excluded `seedDay12.js`/`commit_log.txt` |
| 14 | Aug 21 | `chore: fix App.jsx to render real FormRenderer by default, remove unused Jest/Babel test config` | Fixed `App.jsx` default view, removed unused Jest/Babel deps and configs |

**Key deliverables:** `MagicInput.jsx` wiring, `applyExtractedData()` in `FormRenderer.jsx`, integration of all Week 2 branches, App.jsx fix, test-runner cleanup.

---

### Rakesh (Member 2) — Backend Schema Architect

| Date | Commit |
|------|--------|
| Aug 15 | `feat: add dynamic form renderer` |
| Aug 17 | `feat: design LLM extraction output schema` |
| Aug 18 | `feat: finalize field-to-entity mapping schema`, `feat: add field aliases to schema for extraction matching` |
| Aug 20 | `docs: document final extraction schema` |
| Aug 21 | `updated file` |

**Missing:** Aug 16, Aug 19 — no commit found under this author across any branch. Pending confirmation from Rakesh.

**Key deliverables:** Extraction output schema, field-to-entity mapping, field aliases, schema documentation.

---

### Vinay (Member 3) — Backend API Engineer

| Date | Commit |
|------|--------|
| Aug 16 | `Add AI extraction service scaffold` |
| Aug 17 | `feat: add LLM extraction endpoint`, `fix: improve LLM prompt robustness and error handling` |
| Aug 20 | `feat: add error handling for LLM API failures`, `test: gate live extraction API checks`, `fix: support nested extraction shapes for complex forms` |
| Aug 21 | `fix: resolve backend integration issues post-merge` |

**Missing:** Aug 15, Aug 18, Aug 19 — no commit found under either git identity used (`vinaysannidhi` / `vinatsannidhi575`). Pending confirmation from Vinay.

**Key deliverables:** LLM extraction service and endpoint, error handling, nested-shape support for complex forms.

---

### Praveen (Member 4) — Frontend UI/UX Engineer

| Date | Commit |
|------|--------|
| Aug 16 | `feat: add Magic Input textarea component` |
| Aug 17 | `feat: add loading skeleton state for AI processing` |
| Aug 18 | `style: polish Magic Input UX` |
| Aug 19 | `feat: highlight AI-missed fields for human review` |
| Aug 20 | `style: smooth transitions for multi-level conditional fields` |
| Aug 21 | `chore: update Forma_AI submodule pointer` |

**Missing:** Aug 15 — no commit found under this author. Pending confirmation from Praveen.

**Key deliverables:** Magic Input UI, loading skeleton, AI-missed field highlighting, conditional field transitions.

---

### V. Divyesh (Member 5) — Test Engineer

| Date | Commit |
|------|--------|
| Aug 15 | `chore: finalize and document the full Week 1 test suite`, `test: support conditional required fields` |
| Aug 17 | `test: add sample story fixtures for extraction tests` |
| Aug 18 | `feat: add user story extraction API` |
| Aug 19 | `test: add tests for malformed and incomplete extraction inputs`, `fix: align extraction controller with extraction service` |

**Missing:** Aug 16, Aug 20, Aug 21 — Aug 16 unaccounted for; Aug 20–21 due to a personal/medical emergency, team informed. Day 13 (regression suite) and Day 14 (test cleanup + docs) tasks are still outstanding and will be completed once he's back.

**Key deliverables:** Story fixtures, extraction API tests, malformed-input tests, extraction controller alignment.

---

## Integration Status

- ✅ All branches merged into `Keshav`/`main` as of Day 13 (Aug 20)
- ✅ 3 conflicts resolved during merge (routes, extraction service, test file)
- ✅ Full AI-input-to-rendered-form flow verified working post-merge
- ✅ Backend: 23/23 tests passing (18 unit + 5 live API)
- ✅ Frontend: 10/10 tests passing (Vitest)
- ⏳ PR #57 (Keshav → main) open, pending final confirmation before merge
- ⏳ Full Week 2 regression suite (Day 13/14 task, owned by V. Divyesh) — outstanding

---

## Open Items Going Into Week 3

1. Confirm Aug 16/19 gaps with Rakesh, Aug 15/18/19 gaps with Vinay, and Aug 15 gap with Praveen
2. V. Divyesh to complete Day 13 regression suite + Day 14 test cleanup/`test-log.md` once available
3. Replace mock extraction fallback in `MagicInput.jsx` with the live, generalized extraction service now on `main`
4. Resolve remaining Jest/Vitest config ambiguity on backend if any (frontend already cleaned up)
5. Merge PR #57 once outstanding items above are closed
