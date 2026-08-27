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
      validateRequiredFields(conditionalFields, {
        hasInsurance: "No",
      })
    ).toEqual([]);
  });
});

describe("Missed / Incorrect Field Coverage", () => {
  test("flags AI-missed required fields", () => {
    const aiSubmission = {
      email: "user@mail.com",
      terms: true,
      // incidentType missed by AI
    };

    expect(validateRequiredFields(fields, aiSubmission)).toEqual([
      "incidentType",
    ]);
  });

  test("manual correction always overrides AI-filled value", () => {
    const aiData = {
      email: "user@mail.com",
      incidentType: "Fire",
      terms: true,
    };

    const manualData = {
      incidentType: "Theft",
    };

    const finalSubmission = {
      ...aiData,
      ...manualData,
    };

    expect(finalSubmission.incidentType).toBe("Theft");
    expect(validateRequiredFields(fields, finalSubmission)).toEqual([]);
  });

  test("ambiguous story reports missing fields correctly", () => {
    const ambiguousSubmission = {
      email: "user@mail.com",
      notes: "Something happened yesterday.",
      terms: true,
      // AI couldn't determine incidentType
    };

    expect(validateRequiredFields(fields, ambiguousSubmission)).toEqual([
      "incidentType",
    ]);
  });
});