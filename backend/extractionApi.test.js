const axios = require("axios");
const stories = require("../fixtures/stories");

const API_URL =
  process.env.API_URL || "http://localhost:5000/api/forms";

const formId =
  process.env.EXTRACTION_FORM_ID || "507f1f77bcf86cd799439011";

describe("LLM Extraction API", () => {
  test("extracts fields from a clear user story", async () => {
    const story = stories.find((item) => item.id === "story-1");

    expect(story).toBeDefined();
    expect(story.text).toBeTruthy();

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
    expect(typeof response.data).toBe("object");
  });

  test("handles an ambiguous user story without crashing", async () => {
    const story = stories.find((item) => item.id === "story-6");

    expect(story).toBeDefined();
    expect(story.completeness).toBe("ambiguous");

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
    expect(response.data).toBeDefined();
    expect(typeof response.data).toBe("object");
  });

  test("handles an incomplete user story without crashing", async () => {
    const story = stories.find((item) => item.id === "story-5");

    expect(story).toBeDefined();
    expect(story.completeness).toBe("incomplete");

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
    expect(response.data).toBeDefined();
    expect(typeof response.data).toBe("object");
  });

  test("handles an extremely short story without crashing", async () => {
    const response = await axios.post(
      `${API_URL}/${formId}/extract`,
      {
        story: "Hi",
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    expect(response.status).toBe(200);
    expect(response.data).toBeDefined();
    expect(typeof response.data).toBe("object");
  });

  test("handles an empty story gracefully", async () => {
    try {
      const response = await axios.post(
        `${API_URL}/${formId}/extract`,
        {
          story: "",
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      // Either successful empty extraction or a controlled 400 is acceptable.
      expect([200, 400]).toContain(response.status);
      expect(response.data).toBeDefined();
    } catch (error) {
      // A validation error is acceptable; a server crash is not.
      expect(error.response).toBeDefined();
      expect(error.response.status).toBe(400);
      expect(error.response.data).toBeDefined();
    }
  });
});