# Forma AI Schema Documentation

## Week 1 Schema Validation

The Forma AI backend validates form schemas before they are used by the application.

## Form Schema

A form schema contains:

- `formName` — required string identifying the form.
- `fields` — required array containing the form fields.

## Field Schema

Each field can contain:

- `label` — required string displayed to the user.
- `type` — required field type.
- `required` — optional boolean indicating whether the field must be completed.

## Supported Field Types

The schema validator currently supports:

- `text`
- `email`
- `number`
- `date`
- `password`
- `select`
- `checkbox`
- `radio`
- `textarea`

## Validation Rules

The validator rejects:

1. A schema that is not a JSON object.
2. A schema without `formName`.
3. A schema without a `fields` array.
4. A field without a `label`.
5. A field without a `type`.
6. An unsupported field type.
7. A `required` value that is not boolean.

## Submission Validation

Required submission fields are checked before a form submission is accepted.

For checkbox fields, the value must be `true`.

For other required fields, missing, null, or blank string values are treated as missing.

## Week 1 Test Coverage

Backend Jest tests cover:

- Valid schema acceptance.
- Missing `formName`.
- Missing `fields`.
- Missing field labels.
- Invalid field types.
- Invalid `required` values.
- Missing required submission fields.
- Complete required submission data.

Current local result:

**8 backend tests passed.**