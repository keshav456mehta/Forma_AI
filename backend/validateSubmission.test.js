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
