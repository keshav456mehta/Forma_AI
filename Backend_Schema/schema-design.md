# Forma AI — Dynamic Form Schema

## Purpose

Forma AI needs a dynamic form schema so that forms can be
created and rendered from structured data.

## Form

A form contains:



- title
- description
- fields

## Field

Each field contains:

- name
- label
- type
- required
- order

## Example Form

```json
{
  "title": "Basic Information",
  "description": "Collect basic user information",
  "fields": [
    {
      "name": "fullName",
      "label": "Full Name",
      "type": "text",
      "required": true,
      "order": 1
    },
    {    git remote set-url origin https://github.com/<owner>/<repo-name>.git
      "name": "email",
      "label": "Email Address",
      "type": "text",
      "required": true,
      "order": 2
    }
  ]
}
# Forma AI — LLM Extraction Output Schema

## Day 8 — LLM Extraction Schema

### Purpose

Forma AI will allow a user to describe an incident using
natural language.

The LLM will extract useful information from the user's story
and return it in a strict JSON format.

The extracted JSON will then be mapped to the existing
dynamic form fields.

---

## 1. Entities to Extract

The first version of Forma AI will extract these entities:

- incidentType
- vehicle
- damage
- location
- date

### Entity Description

| Entity | Description |
|---|---|
| incidentType | Type of incident reported by the user |
| vehicle | Vehicle involved in the incident |
| damage | Damage described by the user |
| location | Location where the incident happened |
| date | Date or relative date of the incident |

---

## 2. LLM Output Format

The LLM must return a JSON object.

The output should follow this structure:

```json
{
  "incidentType": "animal_collision",
  "vehicle": "Honda",
  "damage": "windshield",
  "location": "I-95",
  "date": "yesterday"
}

## Day 9 — LLM Extraction to Form Field Mapping

### Purpose

This mapping defines how LLM extraction entities map
to the existing dynamic form field names.

| LLM Entity | Form Field Name | Purpose |
|---|---|---|
| incidentType | incidentType | Type of incident |
| vehicle | vehicle | Vehicle involved |
| damage | damage | Damage reported |

### Mapping Rules

1. LLM extraction keys must use the agreed entity names.
2. Form field names must remain consistent with the mapping.
3. Any naming mismatch must be resolved before integration.
4. The mapping should be directly usable by the frontend
   when populating form values.

### Example

LLM Output:

{
  "incidentType": "animal_collision",
  "vehicle": "Honda",
  "damage": "windshield"
}

Mapping:

incidentType → incidentType
vehicle → vehicle
damage → damage


## Day 11 — Final LLM Extraction Schema

### Purpose

This section defines the finalized extraction schema for
Forma AI Week 2.

The extraction schema describes:

- entities
- aliases
- form-field mapping
- expected output format
- example input stories
- expected extracted JSON

---

## Final Entities

The current extraction entities are:

- incidentType
- vehicle
- damage

---

## Final Extraction-to-Field Mapping

| Extraction Entity | Form Field | Example |
|---|---|---|
| incidentType | incidentType | animal_collision |
| vehicle | vehicle | Honda |
| damage | damage | windshield |

---

## Aliases

Aliases allow natural-language variations to resolve to
the same form field.

### vehicle

```json
[
  "car",
  "vehicle",
  "automobile",
  "honda"
]

## Day 11 — Final LLM Extraction Schema

### Purpose

This section defines the finalized LLM extraction schema
for Forma AI Week 2.

The schema defines:

- Extracted entities
- Field aliases
- Extraction-to-form mapping
- Expected JSON output
- Worked examples
- Items requiring further validation in Week 3

---

## 1. Final Extraction Entities

The current approved extraction entities are:

- incidentType
- vehicle
- damage

---

## 2. Final Extraction-to-Form Mapping

| LLM Extraction Key | Form Field Name | Example |
|---|---|---|
| incidentType | incidentType | animal_collision |
| vehicle | vehicle | Honda |
| damage | damage | windshield |

The extraction key should remain consistent with
the corresponding form field name.

---

## 3. Field Aliases

Aliases allow the extraction system to recognize
different natural-language expressions for the same field.

### vehicle

```json
[
  "car",
  "vehicle",
  "automobile",
  "honda"
]