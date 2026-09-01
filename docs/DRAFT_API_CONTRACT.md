# Draft API contract

Share this contract with the FormRenderer save/resume implementation.

## Save a partial form

`POST /api/forms/:formId/draft`

Request body:

```json
{
  "values": {
    "fullName": "Ada Lovelace",
    "hasInsurance": "No",
    "insuranceProvider": ""
  }
}
```

`values` is a snapshot of the current form state. It may contain empty values
and values for conditional (`showIf`) fields so the UI can restore the exact
in-progress state.

Successful response (`201`):

```json
{
  "message": "Draft saved",
  "savedAt": "2026-08-30T10:00:00.000Z",
  "resumeToken": "0e9c0d63-a800-4ee7-9484-a8cc3bd7e9a4"
}
```

Persist `resumeToken` client-side or include it in a resume link. It is the
only identifier needed to retrieve the draft; do not use MongoDB document IDs.

## Resume a draft

`GET /api/forms/draft/:resumeToken`

Successful response (`200`) contains the saved document, including `formId`,
`values`, `resumeToken`, `createdAt`, and `updatedAt`.
