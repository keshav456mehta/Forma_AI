const axios = require("axios");

const API_URL =
  process.env.API_URL || "http://localhost:5000/api/forms";

const describeLiveApi = process.env.API_URL ? describe : describe.skip;

const formId =
  process.env.EXTRACTION_FORM_ID || "507f1f77bcf86cd799439011";

// Live API tests are opt-in via API_URL.
// GET /api/forms/:id/draft/:resumeToken

describeLiveApi("Resume Draft API", () => {
  jest.setTimeout(30000);

  const validToken = "sample-valid-token";

  test("returns saved draft data for a valid resumeToken", async () => {
    const response = await axios.get(
      `${API_URL}/${formId}/resume-draft/${validToken}`
    );

    expect(response.status).toBe(200);
    expect(response.data).toBeDefined();
    expect(response.data.resumeToken).toBe(validToken);

    expect(response.data.draft).toMatchObject({
      fullName: expect.any(String),
      city: expect.any(String),
    });
  });

  test("returns a clear error for an invalid resumeToken", async () => {
    try {
      await axios.get(
        `${API_URL}/${formId}/resume-draft/invalid-token`
      );

      throw new Error("Expected request to fail");
    } catch (error) {
      expect(error.response).toBeDefined();
      expect(error.response.status).toBe(404);
      expect(error.response.data).toHaveProperty("message");
    }
  });
});
