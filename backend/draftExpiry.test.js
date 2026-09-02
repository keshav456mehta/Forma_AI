const axios = require("axios");

const API_URL =
  process.env.API_URL || "http://localhost:5000/api/forms";

const formId =
  process.env.EXTRACTION_FORM_ID || "507f1f77bcf86cd799439011";

// Day 24 – Pending until draft expiry & concurrency are implemented
describe.skip("Draft Expiry & Concurrency API", () => {
  jest.setTimeout(30000);

  test("returns a clear error for an expired draft token", async () => {
    await expect(
      axios.get(
        `${API_URL}/${formId}/resume-draft/expired-token`
      )
    ).rejects.toMatchObject({
      response: {
        status: 410,
        data: {
          message: expect.any(String),
        },
      },
    });
  });

  test("handles concurrent save requests without crashing", async () => {
    const payload = {
      draft: {
        fullName: "Divyesh",
        city: "Tirupati",
      },
    };

    const [first, second] = await Promise.all([
      axios.post(`${API_URL}/${formId}/save-draft`, payload),
      axios.post(`${API_URL}/${formId}/save-draft`, payload),
    ]);

    expect(first.status).toBe(200);
    expect(second.status).toBe(200);

    expect(first.data.resumeToken).toBeDefined();
    expect(second.data.resumeToken).toBeDefined();
  });
});