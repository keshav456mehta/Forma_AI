const validateSchema = require("./validateSchema");

describe("Schema Validator", () => {
  test("accepts a valid schema", () => {
    const schema = {
      formName: "Registration Form",
      fields: [
        {
          label: "Name",
          type: "text",
          required: true
        },
        {
          label: "Email",
          type: "email",
          required: true
        }
      ]
    };

    const result = validateSchema(schema);

    expect(result.valid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  test("rejects schema without formName", () => {
    const schema = {
      fields: [
        {
          label: "Name",
          type: "text"
        }
      ]
    };

    const result = validateSchema(schema);

    expect(result.valid).toBe(false);
    expect(result.errors).toContain(
      "formName is required and must be a string."
    );
  });

  test("rejects schema without fields", () => {
    const schema = {
      formName: "Registration Form"
    };

    const result = validateSchema(schema);

    expect(result.valid).toBe(false);
    expect(result.errors).toContain(
      "fields is required and must be an array."
    );
  });

  test("rejects field without label", () => {
    const schema = {
      formName: "Registration Form",
      fields: [
        {
          type: "text"
        }
      ]
    };

    const result = validateSchema(schema);

    expect(result.valid).toBe(false);
    expect(result.errors).toContain(
      "Field 1: label is required."
    );
  });

  test("rejects invalid field type", () => {
    const schema = {
      formName: "Registration Form",
      fields: [
        {
          label: "Name",
          type: "invalid"
        }
      ]
    };

    const result = validateSchema(schema);

    expect(result.valid).toBe(false);
    expect(result.errors).toContain(
      'Field 1: invalid field type "invalid".'
    );
  });

  test("rejects non-boolean required value", () => {
    const schema = {
      formName: "Registration Form",
      fields: [
        {
          label: "Name",
          type: "text",
          required: "yes"
        }
      ]
    };

    const result = validateSchema(schema);

    expect(result.valid).toBe(false);
    expect(result.errors).toContain(
      "Field 1: required must be a boolean."
    );
  });
});