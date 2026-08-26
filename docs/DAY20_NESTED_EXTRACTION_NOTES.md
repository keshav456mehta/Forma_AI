# Day 20 — Nested Extraction Edge Cases

## Regression stories for the three-level branching form

1. “It is a car, but I do not know whether it is a sedan or SUV, and the model is unclear.”
   - `vehicleType`: `{ "value": "Car", "found": true }`
   - `vehicleCategory` and `vehicleModel`: `found: false`; neither may be guessed.
2. “My vehicle might be a car or a bike; I do not know the category or model.”
   - All three levels: `found: false`.
3. “It is a car, perhaps a sedan, and someone mentioned a Honda but not its model.”
   - Do not promote “perhaps” or an unqualified brand to category/model values; ambiguous levels remain `found: false`.

## Expected frontend behavior

Use `found`, never an empty-string or false-value check, to render the AI-missed state.
The clear parent field can populate and reveal its child. Any ambiguous child stays
empty, gets the AI-missed treatment, and must not overwrite a human-entered value
on a later extraction.

## Performance check

The deterministic service test for the branching shape completed in under 2 ms
locally (mocked provider). Production timing must be captured from the existing
`[extraction] model request completed in …ms` log while calling the seeded
`POST /api/forms/:id/extract` endpoint with the three stories above. The local
workspace has no running seeded API/provider configuration, so a real endpoint
measurement was not fabricated.
