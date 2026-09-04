const axios = require("axios");

const API_URL =
  process.env.API_URL || "http://localhost:5000/api/forms";

const describeLiveApi = process.env.API_URL ? describe : describe.skip;

// Form 1: Basic form
const BASIC_FORM = "507f1f77bcf86cd799439011";

// Form 2: 3-level branching form
const BRANCHING_FORM = "507f1f77bcf86cd799439012";

describeLiveApi.skip("End-to-End Save → Resume → Submit", () => {
  jest.setTimeout(30000);

  test("completes the full journey on the basic form", async () => {
    // 1. Extract
    const extract = await axios.post(`${API_URL}/${BASIC_FORM}/extract`, {
      story:
        "My name is Divyesh. I live in Tirupati. I lost my wallet yesterday.",
    });

    expect(extract.status).toBe(200);

    // 2. Validate / correct
    const draft = {
      ...extract.data,
      city: "Tirupati",
      incidentType: "Theft",
    };

    // 3. Save draft
    const saved = await axios.post(
      `${API_URL}/${BASIC_FORM}/save-draft`,
      { draft }
    );

    expect(saved.status).toBe(200);
    expect(saved.data.resumeToken).toBeDefined();

    // 4. Resume
    const resumed = await axios.get(
      `${API_URL}/${BASIC_FORM}/resume-draft/${saved.data.resumeToken}`
    );

    expect(resumed.status).toBe(200);
    expect(resumed.data.draft).toMatchObject(draft);

    // 5. Submit
    const submitted = await axios.post(
      `${API_URL}/${BASIC_FORM}/submit`,
      resumed.data.draft
    );

    expect(submitted.status).toBe(200);
  });

  test("completes the full journey on the 3-level branching form", async () => {
    const extract = await axios.post(`${API_URL}/${BRANCHING_FORM}/extract`, {
      story:
        "I have health insurance with Star Health. My policy number is SH123456.",
    });

    expect(extract.status).toBe(200);

    const draft = {
      ...extract.data,
      hasInsurance: "Yes",
      insuranceType: "Health",
      policyNumber: "SH123456",
    };

    const saved = await axios.post(
      `${API_URL}/${BRANCHING_FORM}/save-draft`,
      { draft }
    );

    const resumed = await axios.get(
      `${API_URL}/${BRANCHING_FORM}/resume-draft/${saved.data.resumeToken}`
    );

    expect(resumed.data.draft.policyNumber).toBe("SH123456");

    const submitted = await axios.post(
      `${API_URL}/${BRANCHING_FORM}/submit`,
      resumed.data.draft
    );

    expect(submitted.status).toBe(200);
  });
});