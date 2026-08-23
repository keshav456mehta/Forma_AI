# Forma AI — Week 1 Work Distribution Document

*Project 1 (Month 1) · AI-Augmented Dynamic Form Engine · Axlero Solutions Internship*

**Prepared by:** Keshav (Team Lead) | **Period covered:** August 8–14, 2026

---

## 1. Team & Role Assignment

| Member | Role | Primary Ownership |
|--------|------|--------------------|
| Keshav (Lead) | Frontend Renderer Lead + Coordination | FormRenderer.jsx, conditional rendering, repo/branch setup, merges, Work Distribution Doc |
| Rakesh | Backend Schema Architect | MongoDB dynamic-form schema design, validation rules, showIf logic, seed data |
| Vinay | Backend API Engineer | Express routes/controllers serving the form schema, error handling, CORS |
| Praveen | Frontend UI/UX Engineer | Styling, layout, field-type components (TextField, Dropdown, Checkbox) |
| V_Divyesh | Test Engineer | Jest tests, validator scripts, API test scripts, docs, commit verification |

---

## 2. GitHub Compliance — Team Daily Commit Coverage

Per Axlero Solutions' Standard Operating Procedures, GitHub compliance is assessed at the team-repository level: the requirement is that the shared repository shows at least one commit, from any member, on each day being reviewed — not that every individual commits every day. Mid Review requires commits on at least 10 of the prior 14 days; Final Review requires commits on all 20 of the prior 20 days with no gaps.

**For Week 1 (August 8–14), the Forma AI repository had at least one commit on every single day, with zero gap days:**

| Day | Focus | Team Commit on This Day |
|-----|-------|---------------------------|
| Day 1 — Aug 8 | Kickoff & Environment Setup | Yes |
| Day 2 — Aug 9 | Schema Design Begins | Yes |
| Day 3 — Aug 10 | Validation Rules & Conditional Logic | Yes |
| Day 4 — Aug 11 | Backend Serves, Frontend Fetches | Yes |
| Day 5 — Aug 12 | Full Field-Type Coverage | Yes |
| Day 6 — Aug 13 | Integration Day | Yes |
| Day 7 — Aug 14 | Wrap-up, Docs & Mid-Review Prep | Yes |

**Result: 7 out of 7 days covered — full compliance for this week, well within both the Mid Review (10/14 days) and Final Review (20/20 days, no gaps) standards.**

---

## 3. Individual Contribution Summary

All five members contributed well above the required activity level this week. Commit counts below include every commit authored by that member (feature work, fixes, docs, and merges) between August 8 and 14.

| Member | Commits (Aug 8–14) | Notes |
|--------|----------------------|-------|
| Keshav | 8 | All 7 days covered on schedule; led merges and Day 7 cleanup/docs |
| Rakesh | 8 | Day 6 and Day 7 work landed together on Aug 14; all tasks completed |
| Vinay | 15 | Highest commit volume; Day 5 task landed with Day 6 work on Aug 13 |
| Praveen | 8 | Day 1 task landed Aug 9; Day 5 folded into Day 6 integration work |
| V_Divyesh | 9 | Day 1 setup landed just after midnight Aug 9; consistent daily testing work |

**Note on scheduling:** a small number of tasks landed one day later than the day-by-day schedule suggested (e.g. Rakesh's Day 6 work merged with Day 7, Praveen's Day 1 task landed Aug 9, Praveen's Day 5 folded into Day 6 integration work, V_Divyesh's Day 1 setup landed just after midnight on Aug 9). None of these affected the team's day-to-day commit coverage, and all Week 1 deliverables were completed by end of day 7.

---

## 4. Week 1 Deliverables Completed

- GitHub repository set up with 5 individual member branches and a protected main branch
- MongoDB dynamic-form schema designed, including validationRegex and showIf conditional logic
- Express + Mongoose backend serving form schemas via GET /api/forms/:id, with error handling and CORS configured
- FormRenderer.jsx built and wired to fetch live schema data, rendering text, dropdown, and checkbox fields with conditional visibility
- Styled UI components (TextField, Label, Dropdown, Checkbox) integrated and visually consistent across all sample forms
- Form submission handling implemented, including validation error display
- Automated test suite in place (Jest component tests + API test scripts), all passing against the merged codebase
- 3 sample forms seeded in MongoDB and verified end-to-end

---

## 5. Progress Summary for Mentor Review

Week 1 of the Forma AI project is complete and on track. The team established the full technical foundation for the AI-Augmented Dynamic Form Engine: a MongoDB schema capable of representing dynamic, conditionally-branching forms; an Express API serving that schema; and a React frontend (FormRenderer) that consumes it and renders text, dropdown, and checkbox fields with working conditional logic and validation. All work is covered by an automated test suite, and the repository shows unbroken daily commit activity across all 7 days of the week, exceeding Axlero's GitHub compliance requirements for both the upcoming Mid Review and the stricter Final Review standard.

The team is ready to proceed into Week 2, which will extend the project toward AI-augmented input (LLM-based extraction from free-text descriptions) per the official Project 3 plan.
