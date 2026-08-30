const axios = require("axios");

const API_URL =
  process.env.API_URL || "http://localhost:5000/api/forms";

const describeLiveApi = process.env.API_URL ? describe : describe.skip;

const formId =
  process.env.EXTRACTION_FORM_ID || "507f1f77bcf86cd799439011";

describeLiveApi("Save Draft API", () => {
  jest.setTimeout(30000);

  test("returns a resumeToken for an empty draft", async () => {
    const response = await axios.post(
      `${API_URL}/${formId}/save-draft`,
      { draft: {} },
      { headers: { "Content-Type": "application/json" } }
    );

    expect(response.status).toBe(200);
    expect(response.data.resumeToken).toBeDefined();
    expect(typeof response.data.resumeToken).toBe("string");
  });

  test("returns a resumeToken for a partial draft", async () => {
    const response = await axios.post(
      `${API_URL}/${formId}/save-draft`,
      {
        draft: {
          fullName: "Divyesh",
          city: "Tirupati",
        },
      },
      { headers: { "Content-Type": "application/json" } }
    );

    expect(response.status).toBe(200);
    expect(response.data.resumeToken).toBeDefined();
    expect(typeof response.data.resumeToken).toBe("string");
  });

  test("returns a resumeToken for a near-complete draft", async () => {
    const response = await axios.post(
      `${API_URL}/${formId}/save-draft`,
      {
        draft: {
          fullName: "Divyesh",
          email: "divyesh@example.com",
          phone: "9876543210",
          city: "Tirupati",
          incidentType: "Theft",
          notes: "Wallet lost near bus stand.",
        },
      },
      { headers: { "Content-Type": "application/json" } }
    );

    expect(response.status).toBe(200);
    expect(response.data.resumeToken).toBeDefined();
    expect(typeof response.data.resumeToken).toBe("string");
  });
});