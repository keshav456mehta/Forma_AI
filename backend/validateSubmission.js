function isMissingRequiredValue(value, fieldType) {
  if (fieldType === "checkbox") {
    return value !== true;
  }

  return (
    value === undefined ||
    value === null ||
    (typeof value === "string" && value.trim() === "")
  );
}

function isFieldVisible(field, submission) {
  if (!field.showIf) {
    return true;
  }

  const { fieldId, equals } = field.showIf;

  if (!fieldId) {
    return true;
  }

  return submission[fieldId] === equals;
}

function validateRequiredFields(fields, submission) {
  const payload = submission && typeof submission === "object" ? submission : {};

  // Required conditional fields only apply when their controlling answer
  // makes them visible, preventing hidden branches from blocking submission.
  return fields
    .filter((field) => field.required)
    .filter((field) => isFieldVisible(field, payload))
    .filter((field) => isMissingRequiredValue(payload[field.name], field.type))
    .map((field) => field.name);
}

module.exports = validateRequiredFields;
