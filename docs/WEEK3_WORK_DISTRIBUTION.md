# Forma AI — Week 3 Work Distribution Document

**Week 3 (Aug 22–28, 2026)** — AI-Missed Validation + Correction UX
**Project:** Forma AI (AI-Augmented Dynamic Form Engine)
**Prepared by:** Keshav (Team Lead)

---

## 1. Team Commit Record (verified via `git log --no-merges`, all branches, fetched fresh Aug 29)

| Member | Role | Days Committed (of 7) | Missing Days |
|--------|------|-------------------------|---------------|
| Keshav | Frontend Renderer Lead + Leader | 7/7 | none |
| Rakesh | Backend Schema Architect | 6/7 | Aug 26 (merge-only — see note) |
| Vinay | Backend API Engineer | 5/7 | Aug 25, Aug 28 |
| Praveen | Frontend UI/UX Engineer | 7/7 | none |
| V. Divyesh | Test Engineer | 7/7 | none |

**Note on Rakesh (Aug 26):** verified via `--author` filter and full commit-log search — his only account activity on Aug 26 was two merge actions (`Merge pull request #86`, `Merge pull request #87`), no authored feature/docs commit that day. Confirmed with a fresh `git fetch` and cross-checked against a commit list he shared himself.

**Note on Vinay:** Aug 25 and Aug 28 show no commits under either of his git identities (`vinaysannidhi` / `vinatsannidhi575`) across any branch, verified after a fresh fetch on Aug 29. His next commit after Aug 27 is dated Aug 29, which falls outside the Week 3 window. Pending confirmation from Vinay.

---

## 2. Member-by-Member Summary

### Keshav (Member 1) — Frontend Renderer Lead + Team Leader

| Day | Date | Commit | What Was Done |
|-----|------|--------|----------------|
| 15 | Aug 22 | `feat: wire FormRenderer to live extraction endpoint` | Connected `FormRenderer` to the live extraction service, replacing mock wiring |
| 16 | Aug 23 | `chore: retire mock extraction as default, gate behind ?mock=1 dev flag` | Mock fallback moved behind a dev-only flag; live extraction now default |
| 17 | Aug 24 | `feat: integrate AI-missed field validation into submit flow` | Wired AI-missed field detection into the form submission flow |
| 18 | Aug 25 | `fix: allow easy manual correction of AI-filled field values` | Enabled user override of extraction-populated fields without breaking validation |
| 19 | Aug 26 | `test: verify extraction-to-validation flow across all seeded forms` | Verified extraction → auto-fill → validation flow across all sample forms |
| 20 | Aug 27 | `fix: merge Week 3 branches, resolve integration bugs` | Merged all Week 3 member branches, resolved integration bugs |
| 21 | Aug 28 | `docs: add Week 3 status update, prep Week 4 kickoff` | Week 3 status documentation, Week 4 prep |

**Key deliverables:** Live extraction wiring, mock retirement, AI-missed validation integration, manual-correction support, cross-form verification, Week 3 branch merge, status docs.

---

### Rakesh (Member 2) — Backend Schema Architect

| Date | Commit | Hash |
|------|--------|------|
| Aug 22 | `fix: align schema with live extraction response shape` | `0b76179` |
| Aug 23 | `docs: define confidence/review guidance for extracted fields` | `435c6c5` |
| Aug 24 | `feat: expand field aliases based on real extraction testing` | `bc4ba2e` |
| Aug 25 | `docs: document AI-filled vs manually-edited field handling` | `48a6e6c` |
| Aug 26 | *(merge only — PR #86, PR #87; no authored commit)* | `df159b4`, `208bba9` |
| Aug 27 | `fix: verify schema consistency after Week 3 merge` | `6dd3183` |
| Aug 28 | `docs: finalize Week 3 schema updates` | `4b3b239` |

**Key deliverables:** Schema alignment with live extraction, confidence/review guidance, expanded field aliases, AI-filled vs manual-edit documentation, post-merge schema consistency verification, final Week 3 schema docs.

---

### Vinay (Member 3) — Backend API Engineer

| Date | Commit | Hash |
|------|--------|------|
| Aug 22 | `chore: clean up Week 2 backend code` | `a00d5e4` |
| Aug 23 | `docs: finalize and document live extraction API contract` | `bf97fd8` |
| Aug 24 | `fix: improve extraction reliability for production-default use` | `6651a1b` |
| Aug 25 | — | no commit found |
| Aug 26 | `feat: distinguish missed vs empty fields in extraction response` / `fix: harden nested extraction shape handling for edge cases` | `8f6dc36`, `b3780cd` |
| Aug 27 | `fix: standardize API error responses` | `2556961` |
| Aug 28 | — | no commit found |

**Missing:** Aug 25, Aug 28 — no commit found under either git identity (`vinaysannidhi` / `vinatsannidhi575`) across any branch, verified after a fresh fetch. Pending confirmation from Vinay.

**Key deliverables:** Extraction API contract documentation, extraction reliability improvements, missed-vs-empty field distinction, nested extraction shape hardening, standardized API error responses.

---

### Praveen (Member 4) — Frontend UI/UX Engineer

| Date | Commit | Hash |
|------|--------|------|
| Aug 22 | `docs: add Week 2 UI screenshots` | `c14bb22` |
| Aug 23 | `feat: design validation UI states for missed/uncertain fields` | `3e0632d` |
| Aug 24 | `feat: add correction affordance for AI-filled fields` | `08ee023` |
| Aug 25 | `feat: style submission-blocked warning for missed required fields` | `cfdd7b3` |
| Aug 26 | `fix: resolve validation UI visual bugs against live extraction data` | `76bd13a` |
| Aug 27 | `fix: resolve mobile responsive issues for Week 3 UI` | `abd2a07` |
| Aug 28 | `fix: resolve UI inconsistencies across Week 3 features` | `ecabc87` |

**Key deliverables:** Validation UI state design, correction affordance for AI-filled fields, submission-blocked warning styling, visual bug fixes, mobile responsiveness, final Week 3 UI consistency pass.

---

### V. Divyesh (Member 5) — Test Engineer

| Date | Commit | Hash |
|------|--------|------|
| Aug 22 | `chore: finalize Week 2 test suite and docs` | `a04bb20` |
| Aug 23 | `test: migrate extraction tests from mock to live endpoint` | `0550e12` |
| Aug 24 | `test: add coverage for missed/incorrect field validation` | `8f0814a` |
| Aug 25 | `test: add submit-blocking validation tests` | `b75aca2` |
| Aug 26 | `test: verify 3-level branching against live extraction` | `49db12c` |
| Aug 27 | `test: update full regression suite for Week 3` | `6f4faab` |
| Aug 28 | `test: run full regression suite against merged Week 3 branch` | `a04fd6a` |

**Key deliverables:** Migration of extraction tests to the live endpoint, missed/incorrect field validation coverage, submit-blocking validation tests, 3-level branching re-verification, full Week 3 regression suite.

---

## 3. Integration Status

- ✅ All Week 3 member branches merged into `Keshav`/`main` as of Day 20 (Aug 27)
- ✅ Full extraction-to-validation flow verified across all seeded forms
- ✅ Praveen and V. Divyesh closed out Aug 28 work after initial check-in
- ⏳ Vinay's Aug 25 and Aug 28 gaps remain unconfirmed as of this document

## 4. Open Items Going Into Week 4

1. Confirm Aug 25 and Aug 28 gaps directly with Vinay
2. Backend should align to the nested `{value, found}` extraction contract for ambiguous cases (flagged to Rakesh/Vinay)
3. Save & Resume feature planning for Week 4
4. Final Review prep (20/20-day commit-coverage standard)
