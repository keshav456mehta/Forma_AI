const validateRequiredFields = require("./validateSubmission");

const fields = [
  { name: "email", type: "text", required: true },
  { name: "incidentType", type: "dropdown", required: true },
  { name: "notes", type: "text", required: false },
  { name: "terms", type: "checkbox", required: true },
];

describe("validateRequiredFields", () => {
  test("returns every missing required field", () => {
    expect(validateRequiredFields(fields, { email: "  ", terms: false })).toEqual([
      "email",
      "incidentType",
      "terms",
    ]);
  });

  test("accepts complete required-field data", () => {
    expect(
      validateRequiredFields(fields, {
        email: "person@example.com",
        incidentType: "Theft",
        terms: true,
      })
    ).toEqual([]);
  });
});
