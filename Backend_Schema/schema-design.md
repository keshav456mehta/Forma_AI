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