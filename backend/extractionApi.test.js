const axios = require("axios");
const stories = require("../fixtures/stories");

const API_URL =
  process.env.API_URL || "http://localhost:5000/api/forms";

describe("LLM Extraction API", () => {
  test("extracts fields from a clear user story", async () => {
    const story = stories.find((item) => item.id === "story-1");

    expect(story).toBeDefined();
    expect(story.text).toBeTruthy();

    const formId =
      process.env.EXTRACTION_FORM_ID || "507f1f77bcf86cd799439011";

    const response = await axios.post(
      `${API_URL}/${formId}/extract`,
      {
        story: story.text,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    expect(response.status).toBe(200);
    expect(response.headers["content-type"]).toMatch(/json/);
    expect(response.data).toBeDefined();
    expect(Array.isArray(response.data.fields)).toBe(true);
  });
});