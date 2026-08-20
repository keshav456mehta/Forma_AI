jest.mock("openai", () => jest.fn());

const OpenAI = require("openai");
const { extractFromStory, ExtractionServiceError } = require("./extractionService");

describe("extractFromStory", () => {
  const fields = [
    { name: "incidentType", label: "Incident type", type: "text" },
    { name: "vehicle", label: "Vehicle", type: "text" },
    { name: "damage", label: "Damage", type: "text" },
  ];

  beforeEach(() => {
    delete process.env.OPENAI_API_KEY;
    jest.clearAllMocks();
  });

  test("uses Rakesh's exact field names and worked example in the prompt", async () => {
    process.env.OPENAI_API_KEY = "test-key";
    const create = jest.fn().mockResolvedValue({
      choices: [{ message: { content: JSON.stringify({
        incidentType: "animal_collision",
        vehicle: "Honda",
        damage: "windshield",
        ignored: "not returned",
      }) } }],
    });
    OpenAI.mockImplementation(() => ({ chat: { completions: { create } } }));

    await expect(extractFromStory("I hit a deer on I-95 yesterday in my Honda, and the windshield shattered.", fields)).resolves.toEqual({
      incidentType: "animal_collision",
      vehicle: "Honda",
      damage: "windshield",
    });

    expect(create.mock.calls[0][0].messages[0].content).toContain("incidentType");
    expect(create.mock.calls[0][0].messages[0].content).toContain("windshield shattered");
  });

  test("degrades gracefully for an incomplete story", async () => {
    await expect(extractFromStory("Something happened to my car.", fields))
      .resolves.toEqual({
        incidentType: "",
        vehicle: "",
        damage: "",
      });
  });

  test("rejects an empty story with a controlled validation error", async () => {
    await expect(extractFromStory("", fields)).rejects.toThrow(
      "A non-empty story is required for extraction"
    );
  });

  test("retries malformed model output and falls back to clean JSON", async () => {
    process.env.OPENAI_API_KEY = "test-key";
    const create = jest.fn()
      .mockResolvedValueOnce({ choices: [{ message: { content: "not JSON" } }] })
      .mockResolvedValueOnce({ choices: [{ message: { content: "```json\ninvalid\n```" } }] });
    OpenAI.mockImplementation(() => ({
      chat: { completions: { create } },
    }));
    const errorSpy = jest.spyOn(console, "error").mockImplementation(() => {});

    await expect(extractFromStory("Something happened to my car.", fields))
      .resolves.toEqual({
        incidentType: "",
        vehicle: "",
        damage: "",
      });

    expect(create).toHaveBeenCalledTimes(2);
    errorSpy.mockRestore();
  });

  test("uses a 15-second timeout and reports provider timeouts safely", async () => {
    process.env.OPENAI_API_KEY = "test-key";
    const timeoutError = Object.assign(new Error("timed out"), {
      code: "ETIMEDOUT",
      name: "APIConnectionTimeoutError",
    });
    const create = jest.fn().mockRejectedValue(timeoutError);
    OpenAI.mockImplementation(() => ({ chat: { completions: { create } } }));
    const errorSpy = jest.spyOn(console, "error").mockImplementation(() => {});

    await expect(extractFromStory("A story", fields)).rejects.toEqual(
      expect.objectContaining({
        name: "ExtractionServiceError",
        kind: "timeout",
        message: "Extraction service unavailable, please try again",
      })
    );
    expect(create).toHaveBeenCalledTimes(1);
    expect(create.mock.calls[0][0].timeout).toBe(15000);
    errorSpy.mockRestore();
  });

  test("reports rate limits as a typed provider failure", async () => {
    process.env.OPENAI_API_KEY = "test-key";
    const rateLimitError = Object.assign(new Error("too many requests"), {
      status: 429,
      name: "RateLimitError",
    });
    OpenAI.mockImplementation(() => ({
      chat: { completions: { create: jest.fn().mockRejectedValue(rateLimitError) } },
    }));
    const errorSpy = jest.spyOn(console, "error").mockImplementation(() => {});

    await expect(extractFromStory("A story", fields)).rejects.toBeInstanceOf(
      ExtractionServiceError
    );
    errorSpy.mockRestore();
  });
});
