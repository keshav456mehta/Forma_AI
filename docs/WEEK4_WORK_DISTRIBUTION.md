# Forma AI — Week 4 Work Distribution Document

**Week 4 (Aug 29 – Sep 4, 2026)** — Save & Resume + Polish + Final Review Prep
**Project:** Forma AI (AI-Augmented Dynamic Form Engine)
**Prepared by:** Keshav (Member 1, Team Leader)

---

## 1. Team Commit Record (verified via `git log --all --no-merges`, all branches, fetched fresh Sep 4)

| Member | Role | Days Committed (of 7) | Missing Days |
|--------|------|-------------------------|---------------|
| Keshav (M1) | Frontend Renderer Lead + Leader | 7/7 | none |
| Rakesh (M2) | Backend Schema Architect | 6/7 | Sep 2 (see note) |
| Vinay (M3) | Backend API Engineer | 5/7 | Aug 31, Sep 2 |
| Praveen (M4) | Frontend UI/UX Engineer | 7/7 | none |
| V. Divyesh (M5) | Test Engineer | 6/7 | Sep 2 (see note) |

**Note on Rakesh (Sep 2):** No authored commit found under his identity on Sep 2 across any branch; his Sep 2 activity was limited to a merge action only. His authored commits resume on Sep 3–4 with pre-integration audit work. Confirmed via `--author` filter across all branches.

**Note on V. Divyesh (Sep 2):** No authored commit found on Sep 2. His coverage is otherwise unbroken across the rest of the week. Pending confirmation from Divyesh.

**Note on Vinay (Aug 31, Sep 2):** No commits found under `vinatsannidhi575` on Aug 31 or Sep 2 across any branch. His authored commits on Aug 29–30 and Sep 1, 3–4 confirm active participation. Pending confirmation from Vinay on the two missing days.

---

## 2. Member-by-Member Summary

### Keshav (Member 1) — Frontend Renderer Lead + Team Leader

| Day | Date | Commit | What Was Done |
|-----|------|--------|----------------|
| 22 | Aug 29 | `feat: scaffold save-draft action in FormRenderer` | Added Save Draft button to FormRenderer; confirmed react-hook-form state serialization |
| 22 | Aug 29 | `docs: add Week 3 work distribution and progress summary` | Published Week 3 docs to `docs/` folder |
| 23 | Aug 30 | `feat: wire save-draft action to backend API` | Axios POST to save-draft endpoint; success/failure status messages; draft ID/token stored for resume |
| 24 | Aug 31 | `feat: implement resume-from-draft flow` | Resume entry point added; fields populated via `setValue()`; `showIf` fields resolve correctly on resume |
| 25 | Sep 1 | `Day 25: bug fixes and cleanup` | Animation/transition polish pass with Praveen; layout jump fix on resume; mobile-width re-check |
| 26 | Sep 2 | `fix: resolve edge cases across full save/resume/validation flow` | Full end-to-end testing; expired/invalid draft handling; cross-browser verification; edge case fixes |
| 27 | Sep 3 | `chore: ignore local working notes` | Housekeeping — gitignore for local scratch files |
| 27 | Sep 4 | `fix: merge Week 4 branches, final integration pass` | Final merge of all Week 4 branches into Keshav; build verified; PR #128 opened for mentor review |

**Key deliverables:** Save Draft scaffold and backend wiring, Resume Draft flow, edge-case and cross-browser testing, final Week 4 branch merge, PR #128 opened for Final Review.

---

### Rakesh (Member 2) — Backend Schema Architect

| Date | Commit | What Was Done |
|------|--------|----------------|
| Aug 29 | `feat: design draft/save-state schema` | Drafted MongoDB schema for save-state (`values`, `resumeToken`, `expiresAt` fields) |
| Aug 30 | `docs: document finalized draft schema` | Finalized and documented the draft schema for team use |
| Sep 1 | `feat: handle draft save resume and schema drift` | Added schema-drift handling for drafts saved against an older form version |
| Sep 2 | *(no authored commit — merge only)* | — |
| Sep 3 | `fix: final pre-integration schema audit` | Pre-integration audit of schema consistency ahead of Day 27 merge |
| Sep 4 | `fix: final pre-integration schema audit` | Final push of audit fixes for integration |

**Key deliverables:** Draft/save-state schema design and documentation, schema-drift handling, pre-integration schema audit.

---

### Vinay (Member 3) — Backend API Engineer

| Date | Commit | What Was Done |
|------|--------|----------------|
| Aug 29 | `chore: clean up Week 3 backend code` | Removed console.logs and dead code from Week 3 additions |
| Aug 30 | `feat: add save-draft API route` | Implemented `POST /api/drafts` endpoint; payload shape coordinated with Keshav |
| Aug 31 | *(no commit found)* | — |
| Sep 1 | `feat: add draft expiry handling` | Added expiry logic to draft creation and retrieval; `expiresAt` enforced server-side |
| Sep 2 | *(no commit found)* | — |
| Sep 3 | `fix: harden draft save and extraction errors` | Hardened error handling for draft save failures and extraction edge cases |
| Sep 4 | `test: run full backend regression across Weeks 1-4` | Full backend regression suite run ahead of Final Review |

**Missing:** Aug 31 and Sep 2 — no commit found under `vinatsannidhi575` across any branch on these dates. Pending confirmation from Vinay.

**Key deliverables:** Save-draft and resume-draft API routes, draft expiry enforcement, backend error hardening, full backend regression suite.

---

### Praveen (Member 4) — Frontend UI/UX Engineer

| Date | Commit | What Was Done |
|------|--------|----------------|
| Aug 29 | `fix: resolve UI inconsistencies across Week 3 features` | Closed out remaining Week 3 UI fixes before Week 4 kickoff |
| Aug 30 | `feat: design save/resume UI states` | Designed loading/success/error states for Save Draft and Resume Draft actions |
| Aug 31 | `feat: build save/resume UI components` | Built save/resume UI components including status indicators |
| Sep 1 | `feat: build save/resume UI components` | Continued component work; `fix: resolve resume-flow visual issues` — resolved layout jump on resume draft population |
| Sep 2 | `fix: resolve resume-flow visual issues` | Final visual fixes for resume flow |
| Sep 3 | *(included in Sep 2–4 polish pass)* | — |
| Sep 4 | `style: final animation and transition polish pass` | Final expand/collapse animation consistency, mobile-width pass, overall visual QA |

**Key deliverables:** Save/resume UI state design, save/resume components, resume-flow visual bug fixes, final animation and transition polish, mobile QA.

---

### V. Divyesh (Member 5) — Test Engineer

| Date | Commit | What Was Done |
|------|--------|----------------|
| Aug 29 | `chore: finalize Week 3 test suite and docs` | Closed out outstanding Week 3 test documentation |
| Aug 30 | `test: add save-draft API test coverage` | Tests for save-draft endpoint — happy path, payload validation, error cases |
| Aug 31 | `test: add resume-draft API test coverage` | Tests for resume-draft endpoint — valid token, expired token, invalid ID |
| Sep 1 | `test: add draft expiry and concurrency test coverage` | Edge-case tests for expired drafts and concurrent save/resume scenarios |
| Sep 2 | *(no commit found)* | — |
| Sep 3 | `test: add end-to-end save/resume/submit integration test` | Full flow integration test: extract → validate → save → resume → submit |
| Sep 4 | `merge: resolve Week 4 integration conflicts` | Assisted with final integration merge and conflict resolution |

**Missing:** Sep 2 — no commit found. Pending confirmation from V. Divyesh.

**Key deliverables:** Save-draft and resume-draft API test coverage, draft expiry and concurrency edge cases, end-to-end save/resume/submit integration test.

---

## 3. Integration Status

- ✅ All Week 4 member branches merged into `Keshav` via `origin/main` as of Day 27 (Sep 4)
- ✅ Frontend build verified clean — Vite, 83 modules, zero errors
- ✅ Backend verified clean — MongoDB connected, Express server up on port 5000
- ✅ Full end-to-end flow confirmed working: extract → validate → save draft → resume → submit
- ✅ Expired/invalid draft handling verified (tested against manually expired Atlas documents)
- ✅ Cross-browser testing: Chrome, Brave, Edge (all Chromium) — consistent
- ✅ PR #128 (Keshav → main) opened for mentor Final Review
- ⏳ Firefox/non-Chromium browser testing not completed — logged as known non-blocking item
- ⏳ `OPENAI_API_KEY` missing from backend `.env` — live extraction blocked; mock mode (`?mock=1`) used for all Week 4 testing

## 4. Open Items / Known Non-Blocking

1. Obtain `OPENAI_API_KEY` from team key-holder and add to backend `.env` to enable live extraction in production
2. Firefox browser testing — worth completing post-Final Review
3. 1 moderate `npm audit` vulnerability in backend — transitive dependency, not introduced this sprint
4. Vinay's Aug 31 and Sep 2 gaps, Rakesh's Sep 2 gap, V. Divyesh's Sep 2 gap — pending individual confirmation
