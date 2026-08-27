# Day 18 — Nested / Complex Extraction Regression

## Objective
Verify that live extraction correctly handles nested 3-level branching and ambiguous stories without introducing regression.

## Tests Added

### 1. 3-Level Branching (Live)
**Story**
> I have insurance. It is health insurance with Star Health. My policy number is SH123456.

**Expected**
- hasInsurance → Yes
- insuranceType → Health
- policyNumber → SH123456

**Result:** PASS

---

### 2. Ambiguous Partial Branching (Live)
**Story**
> I think I have insurance, but I don't remember the company or my policy number.

**Expected**
- hasInsurance → Yes
- insuranceCompany → ""
- policyNumber → ""

**Result:** PASS

---

## Regression Summary

| Test | Status |
|------|--------|
| Clear extraction | PASS |
| Ambiguous story | PASS |
| Incomplete story | PASS |
| Empty story handling | PASS |
| 3-level branching | PASS |
| Partial branching | PASS |

**Overall Result:** PASS

No regression observed. Live extraction preserves branching behavior and leaves unknown nested fields as empty strings instead of generating incorrect values.