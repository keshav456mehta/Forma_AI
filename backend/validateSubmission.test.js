const validateRequiredFields = require("./validateSubmission");

const fields = [
  { name: "email", type: "text", required: true },
  { name: "incidentType", type: "dropdown", required: true },
  { name: "notes", type: "text", required: false },
  { name: "terms", type: "checkbox", required: true },
];

describe("Required Field Validation", () => {
  test("returns every missing required field", () => {
    const submission = {
      email: "  ",
      terms: false,
    };

    expect(validateRequiredFields(fields, submission)).toEqual([
      "email",
      "incidentType",
      "terms",
    ]);
  });

  test("accepts complete required-field data", () => {
    const submission = {
      email: "person@example.com",
      incidentType: "Theft",
      terms: true,
    };

    expect(validateRequiredFields(fields, submission)).toEqual([]);
  });

  test("does not require a conditional field when it is hidden", () => {
    const conditionalFields = [
      { name: "hasInsurance", type: "dropdown", required: true },
      {
        name: "insuranceCompany",
        type: "text",
        required: true,
        showIf: { fieldId: "hasInsurance", equals: "Yes" },
      },
    ];

    expect(
      validateRequiredFields(conditionalFields, { hasInsurance: "No" })
    ).toEqual([]);
  });
});