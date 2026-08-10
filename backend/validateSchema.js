const allowedFieldTypes = [
  "text",
  "email",
  "number",
  "date",
  "password",
  "select",
  "checkbox",
  "radio",
  "textarea"
];

function validateSchema(schema) {
  const errors = [];

  // Schema must be an object
  if (!schema || typeof schema !== "object" || Array.isArray(schema)) {
    return {
      valid: false,
      errors: ["Schema must be a JSON object."]
    };
  }

  // formName is required
  if (!schema.formName || typeof schema.formName !== "string") {
    errors.push("formName is required and must be a string.");
  }

  // fields is required
  if (!Array.isArray(schema.fields)) {
    errors.push("fields is required and must be an array.");
    return {
      valid: false,
      errors
    };
  }

  // Validate every field
  schema.fields.forEach((field, index) => {
    if (!field || typeof field !== "object") {
      errors.push(`Field ${index + 1} must be an object.`);
      return;
    }

    if (!field.label || typeof field.label !== "string") {
      errors.push(`Field ${index + 1}: label is required.`);
    }

    if (!field.type || typeof field.type !== "string") {
      errors.push(`Field ${index + 1}: type is required.`);
    } else if (!allowedFieldTypes.includes(field.type)) {
      errors.push(
        `Field ${index + 1}: invalid field type "${field.type}".`
      );
    }

    if (
      field.required !== undefined &&
      typeof field.required !== "boolean"
    ) {
      errors.push(
        `Field ${index + 1}: required must be a boolean.`
      );
    }
  });

  return {
    valid: errors.length === 0,
    errors
  };
}

module.exports = validateSchema;