# Day 19 — Cross-Form Testing Notes (for Member 5 / V. Divyesh)

Verified: extraction → auto-fill → conditional rendering → submit
across all 4 seeded forms (Basic Info, Insurance Claim, Vehicle
Registration, 3-Level Branching).

Edge cases to add as regression tests:
1. 3-level branch resolves with parent AI-set (seedDay12 verified).
2. Partial miss of required parent → no child render, no crash.
3. Re-extraction misses fields → manual values survive (Day 15/17).
4. Mock/live produce same populated field names for all 4 forms.
5. Ambiguous story (Day 18) — needs-review + correction survives
   later re-extraction (Day 18 test verified).

Status: 20/20 Vitest green. No conditional-rendering regressions.
