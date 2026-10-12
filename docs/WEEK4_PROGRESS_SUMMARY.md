# Forma AI — Week 4 Progress Summary (For Mentor)

**Week 4 (Aug 29 – Sep 4, 2026)** — Save & Resume + Polish + Final Review Prep
**Prepared by:** Keshav (Team Leader, Member 1)

---

## What Week 4 Set Out to Do

Implement Save & Resume — allowing users to save a partially-completed, AI-populated form as a draft and return to it later — and deliver the final UI polish pass (animations, transitions, mobile QA) ahead of the Month 1 Final Review. Week 4 also carries final integration, full regression testing across all four weeks, and repo documentation to close out Month 1.

## What Was Delivered

### Backend (Rakesh — M2, Vinay — M3)
- Draft/save-state MongoDB schema designed and documented, including `values`, `resumeToken`, and `expiresAt` fields (Rakesh)
- Schema-drift handling added for drafts saved against an older form version (Rakesh)
- Pre-integration schema audit completed ahead of Day 27 merge (Rakesh)
- `POST /api/drafts` save-draft endpoint implemented with coordinated payload shape (Vinay)
- Resume-draft API route implemented (Vinay)
- Draft expiry enforced server-side via `expiresAt` (Vinay)
- Error handling hardened for draft save failures and extraction edge cases (Vinay)
- Full backend regression suite run across Weeks 1–4 (Vinay)

### Frontend (Keshav — M1, Praveen — M4)
- Save Draft button scaffolded in `FormRenderer`, react-hook-form state serialized cleanly for saving (Keshav)
- Save Draft wired to the backend API via Axios POST; success/failure status messages shown; draft ID/token stored for resume (Keshav)
- Resume Draft flow implemented: entry point added, fields populated via `setValue()`, `showIf` conditional fields resolve correctly on resume (Keshav)
- Edge cases handled: expired draft IDs show clear message; invalid/garbage draft IDs show "not a draft" error without crashing (Keshav)
- Save/resume UI state design — loading, success, error indicators (Praveen)
- Save/resume UI components built, including status indicators and resume-flow visual fixes (Praveen)
- Final animation and transition polish pass: expand/collapse consistency across save/resume, layout-jump fix on draft population, mobile-width QA (Praveen)

### Testing (V. Divyesh — M5)
- Save-draft and resume-draft API test coverage added — happy path, payload validation, expired/invalid token, error cases
- Draft expiry and concurrency edge-case tests added
- End-to-end integration test covering the full flow: extract → validate → save → resume → submit
- Week 3 test suite and docs closed out at Week 4 kickoff

### Integration (Keshav — Day 27)
- All Week 4 member branches merged into `Keshav` via `origin/main`
- Frontend build verified: Vite, 83 modules, zero errors
- Backend verified: MongoDB connected, Express server running on port 5000
- PR #128 opened for mentor Final Review

## Current State

- Complete Month 1 flow working end-to-end: Magic Input story → LLM extraction (mock mode) → auto-filled form → AI-missed/empty distinction → validation UI → manual correction → Save Draft → Resume Draft → Submit
- All four weeks of functionality integrated and verified
- Repository shows unbroken team-wide commit activity across all 20 days of the Final Review window (Aug 16 – Sep 4) — zero gap days
- PR #128 open for mentor review; main branch reflects the complete, working Month 1 build

## Commit Compliance

Verified via `git log --all --no-merges` across all branches, fetched fresh Sep 4. The Final Review window is assessed team-wide across the 20 days prior to review (Aug 16 – Sep 4):

| Day Range | Team Commit Coverage |
|-----------|----------------------|
| Aug 16 – Sep 4 (20 days) | 20/20 — zero gap days ✅ |

**Per-member Week 4 summary:**

| Member | Days Committed (of 7) | Missing |
|--------|------------------------|---------|
| Keshav | 7/7 | none |
| Rakesh | 6/7 | Sep 2 (merge-only, no authored commit) |
| Vinay | 5/7 | Aug 31, Sep 2 |
| Praveen | 7/7 | none |
| V. Divyesh | 6/7 | Sep 2 |

Individual gaps do not affect team-level compliance — the repo had at least one commit from another team member on every day these gaps occurred. Full per-member commit data is in `docs/WEEK4_WORK_DISTRIBUTION.md`.

## Known Items / Non-Blocking

1. **Live extraction disabled** — `OPENAI_API_KEY` is missing from backend `.env`; all Week 4 testing used mock mode (`?mock=1`). Key needs to be obtained from the team key-holder before production use
2. **Firefox browser testing** not completed — Chrome, Brave, and Edge (all Chromium-based) verified and consistent; Firefox worth completing post-Final Review
3. **1 moderate npm vulnerability** in backend — transitive dependency, not introduced this sprint; does not affect functionality
4. **Vinay's and V. Divyesh's individual gap days** — pending confirmation; do not affect team-level Final Review compliance
