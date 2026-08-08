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