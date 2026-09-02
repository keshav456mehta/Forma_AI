# Day 21 — Week 3 Test Documentation

## Week 3 Final Results

| Area | Status |
|--------|--------|
| validateSchema | PASS |
| validateSubmission | PASS |
| extractionService | PASS |
| errorContract | PASS |
| FormRenderer | PASS |
| MagicInput | PASS |
| extractionApi (Live) | SKIPPED* |

* Live extraction tests require `API_URL` and a running backend.

## Final Metrics

- Backend: **24 passed**, 7 skipped
- Frontend: **20 passed**
- Total Passing Tests: **44**
- Failed Tests: **0**

## Cleanup Completed

- Removed obsolete Week 2 temporary test code
- Added Day 17–20 regression comments
- Verified submit-blocking and AI validation coverage
- Confirmed no dead test cases remain

## Team Verification

Week 3 regression completed successfully against the merged branch. No merge-related regressions were detected.

**Overall Status:** PASS
# Day 22 — Save Draft API Test Coverage

## Objective
Validate the new save-draft endpoint across multiple draft completion levels.

## Results

| Scenario | Status |
|----------|--------|
| Empty draft | FAIL (404) |
| Partial draft | FAIL (404) |
| Near-complete draft | FAIL (404) |
| resumeToken returned | FAIL |

## Mismatch Report

The endpoint:

POST /api/forms/:formId/save-draft

currently returns **404 Not Found**.

### Impact
- Unable to validate resumeToken generation
- Draft persistence cannot be verified
- Tests are ready and should pass once the endpoint is implemented

## Action Required

Assigned to **Member 2/3**:
- Implement `/save-draft`
- Return HTTP 200
- Return a non-empty `resumeToken`
- Support empty, partial, and near-complete drafts
# Day 23 — Resume Draft API Test Coverage

## Objective
Validate retrieval of previously saved drafts using resume tokens.

## Coverage Added

| Scenario | Status |
|----------|--------|
| Valid resumeToken | Pending |
| Invalid resumeToken | Pending |

## Expected Behavior

- Valid token returns HTTP 200 and the saved draft payload.
- Invalid or nonexistent token returns HTTP 404 with a clear error message.
- Tests are marked pending until the Resume Draft endpoint is implemented.
# Day 24 — Draft Expiry Test Coverage

## Coverage Added

| Scenario | Status |
|----------|--------|
| Expired draft token | Pending |
| Concurrent save requests | Pending |

## Expected Behavior

- Expired token returns HTTP 410 with a clear error message.
- Concurrent saves complete successfully without crashing.
- Tests are pending until Member 3 completes the backend implementation.