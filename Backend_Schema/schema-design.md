# Forma AI — Live Extraction API Contract

## Endpoint

`POST /api/forms/:id/extract`

Request body:

```json
{ "story": "I hit a deer in my Honda and the windshield shattered." }
```

`story` is required and must be a non-empty string.

## Successful response

The endpoint returns HTTP `200` with a flat JSON object. Its keys are **exactly**
the `name` values from the requested form's stored `fields` schema; unknown model
keys are removed. This makes the response directly usable as form values.

Value types are normalized as follows:

| Form field type | Response value |
| --- | --- |
| `checkbox` | boolean (`false` when unknown) |
| all other field types | string (empty string when unknown) |

For the current incident form, the response contract is:

```json
{
  "incidentType": "animal_collision",
  "vehicle": "Honda",
  "damage": "windshield"
}
```

An incomplete story still receives HTTP `200`; missing values use the defaults:

```json
{
  "incidentType": "",
  "vehicle": "",
  "damage": ""
}
```

Conditional fields are included in the response as well. The model receives each
field's name, label, type, options, and conditional rule so nested form schemas
can be populated without a mock-only mapping.

## Errors

All error bodies use a safe `error` string and never expose provider details,
prompts, or raw model output. Provider failures also include a machine-readable
`kind` (`rate_limit`, `timeout`, or `unavailable`) so the frontend can show a
specific recovery message.

| Status | When | Response |
| --- | --- | --- |
| `400` | Invalid form id | `{ "error": "Invalid form ID" }` |
| `400` | Missing or blank story | `{ "error": "story is required" }` |
| `404` | Form does not exist | `{ "error": "Form not found" }` |
| `429` | Provider rate limit | `{ "error": "Extraction service unavailable, please try again", "kind": "rate_limit" }` |
| `503` | Provider timeout or availability failure | `{ "error": "Extraction service unavailable, please try again", "kind": "timeout" }` |
| `500` | Unexpected server failure | `{ "error": "Extraction service unavailable, please try again" }` |

The provider request has a 15-second default timeout (`OPENAI_TIMEOUT_MS` can
override it). This remains the observed baseline because no persisted Day 15
latency data is available in the repository. Network timeouts, connection
resets, and momentary provider 5xx responses retry up to twice with 150 ms then
300 ms backoff. Rate limits and invalid input are never retried. If model output
is malformed, the service retries once with a stricter JSON-only instruction,
then returns schema-safe default values if that retry is also malformed.

## Operational logging

Each model attempt records only its outcome and duration in milliseconds. Story
content, prompts, and model responses are deliberately not logged. These logs
make slow live extractions visible without exposing user data.

## Frontend integration

- Share the live extraction findings with Member 3.
- Share the finalized extraction-to-form mapping with Member 1.
- Frontend wiring should consume the agreed extraction keys directly.

---

- Share the live extraction findings with Member 3.
- Share the finalized extraction-to-form mapping with Member 1.
- Frontend wiring should consume the agreed extraction keys directly.

`FormRenderer` should call this endpoint as the default, non-mock extraction
path and merge the returned object directly into values for matching form field
names. Consumers must not depend on extra keys or on a fixed incident-only
schema; the stored form schema is authoritative.

---

## Day 16 — Ambiguity Handling and Review Guidance

### Purpose

The extraction schema should identify information that may be
ambiguous or low-confidence instead of allowing uncertain
values to be treated as fully reliable.

This guidance defines which extracted fields can be trusted
automatically and which fields require human review.

### Confidence / Review Concept

The extraction output may optionally include a review indicator
for fields where the extracted value is uncertain.

Example:

```json
{
  "vehicle": {
    "value": "Honda",
    "reviewRequired": false
  },
  "damage": {
    "value": "front bumper",
    "reviewRequired": true
  }
}

---

## Day 17 — Extended Field Alias Coverage

### Purpose

Alias coverage was expanded based on real user-story phrasing
observed during Week 2 and Week 3 extraction testing.

### Expanded Field Alias Table

| Field | Aliases | Source / Reason |
|---|---|---|
| vehicle | car, vehicle, automobile, honda | Existing aliases and observed vehicle phrasing |
| damage | TBD | Add only aliases confirmed by fixture misses |
| incidentType | TBD | Add only aliases confirmed by fixture misses |

### Fixture Re-test

The expanded aliases were re-tested against Member 5's fixture set.

- Phrasing-related extraction misses were reviewed.
- New aliases were added for recurring phrasing gaps.
- Logic-related extraction failures were not treated as alias issues.
- Results were compared before and after alias expansion.

### Result

Alias coverage should reduce extraction misses caused by
natural-language phrasing while preserving the existing
extraction logic.



## Day 18 — AI-Filled vs Manually-Edited Field Handling

### Purpose

The form should support the rule that a manual correction always
takes precedence over an AI-filled value.

### Value Ownership

Extracted values are initially treated as AI-filled values.

When a user manually edits an AI-filled field, the manually entered
value becomes the authoritative value for that field.

The frontend should not overwrite a manually corrected value with a
later AI extraction result.

### Correction Behavior

| Field State | Authoritative Value |
|---|---|
| AI-filled, not edited | AI-extracted value |
| Manually edited | User-provided value |
| AI-filled and then manually corrected | Manually corrected value |
| Missing AI value, manually entered | User-provided value |

### Correction Tracking

The current schema stores the field value itself but does not require
a separate persisted flag identifying whether the value originated
from AI or from a user correction.

For the current implementation, this distinction may be handled by
frontend state.

If correction history needs to be persisted in the backend later,
the schema may need metadata such as:

```json
{
  "value": "Honda",
  "source": "manual"
}
