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

function shouldValidateField(field, submission) {
  if (!field.showIf) {
    return true;
  }

  const { fieldId, equals } = field.showIf;
  return submission[fieldId] === equals;
}

function validateRequiredFields(fields, submission) {
  const payload = submission && typeof submission === "object" ? submission : {};

  return fields
    .filter((field) => field.required)
    .filter((field) => shouldValidateField(field, payload))
    .filter((field) => isMissingRequiredValue(payload[field.name], field.type))
    .map((field) => field.name);
}

module.exports = validateRequiredFields;
