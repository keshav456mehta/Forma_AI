# Week 4 save/resume handoff

## Week 3 baseline

- `GET /api/forms/:id`, `POST /api/forms/:id/submit`, and
  `POST /api/forms/:id/extract` are the current backend contract.
- Extraction returns a schema-shaped object where every field contains
  `value` and `found`. Missing text/select values use `""`; missing checkboxes
  use `false`.
- The extraction service retries transient provider failures, returns a
  controlled error for unavailable providers, and falls back to schema-safe
  empty values for malformed model output.
- CORS is restricted to `CORS_ORIGIN` when configured. Local Vite origins are
  allowed only outside production; production therefore requires an explicit
  allowlist. The server can boot without MongoDB for extraction development,
  although persisted form routes require a configured database.

## Save/resume plan with Rakesh

1. Agree on the persisted draft shape and identifier: form ID, field values,
   `found` metadata, and the current conditional-branch state.
2. Define save and resume API behavior before frontend wiring: validation,
   ownership, not-found handling, and whether an incomplete draft may be
   submitted.
3. Add backend tests for a new draft, overwrite/update, resume after a page
   reload, and conditional-field values that become hidden.
4. Wire the frontend to restore values without treating restored values as new
   AI extraction results; preserve the existing correction affordance.
5. Run the cross-form regression suite and document the final request/response
   examples in the schema notes before merging.

## Environment notes

Copy `backend/.env.example` to a local `backend/.env`. Do not commit secrets.
`OPENAI_EXTRACTION_MODEL` and `OPENAI_TIMEOUT_MS` are optional; the application
defaults to `gpt-4o-mini` and 15000 milliseconds.
