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

  test("binds the prompt and response to the supplied form schema", async () => {
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
    expect(create.mock.calls[0][0].messages[0].content).toContain("Incident type");
  });

  test("preserves all levels of a conditional form schema", async () => {
    const nestedFields = [
      { name: "ownerName", label: "Owner Name", type: "text" },
      { name: "vehicleType", label: "Vehicle Type", type: "select", options: [{ value: "Car" }, { value: "Bike" }] },
      { name: "vehicleCategory", label: "Vehicle Category", type: "select", showIf: { fieldId: "vehicleType", equals: "Car" } },
      { name: "vehicleModel", label: "Vehicle Model", type: "text", showIf: { fieldId: "vehicleCategory", equals: "Sedan" } },
      { name: "terms", label: "Confirm details", type: "checkbox" },
    ];
    process.env.OPENAI_API_KEY = "test-key";
    const create = jest.fn().mockResolvedValue({
      choices: [{ message: { content: JSON.stringify({
        ownerName: "Raj Patel",
        vehicleType: "Car",
        vehicleCategory: "Sedan",
        vehicleModel: "Honda City",
        terms: true,
        unexpected: "ignored",
      }) } }],
    });
    OpenAI.mockImplementation(() => ({ chat: { completions: { create } } }));

    await expect(extractFromStory(
      "Owner is Raj Patel. It's a Car. Category is Sedan. Model is Honda City. I confirm.",
      nestedFields
    )).resolves.toEqual({
      ownerName: "Raj Patel",
      vehicleType: "Car",
      vehicleCategory: "Sedan",
      vehicleModel: "Honda City",
      terms: true,
    });

    const prompt = create.mock.calls[0][0].messages[0].content;
    expect(prompt).toContain("vehicleCategory");
    expect(prompt).toContain("vehicleModel");
    expect(prompt).toContain("vehicleType");
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
    await expect(extractFromStory("Something happened to my car.", fields))
      .resolves.toEqual({
        incidentType: "",
        vehicle: "",
        damage: "",
      });

    expect(create).toHaveBeenCalledTimes(2);
  });

  test("uses a 15-second timeout and reports provider timeouts safely", async () => {
    process.env.OPENAI_API_KEY = "test-key";
    const timeoutError = Object.assign(new Error("timed out"), {
      code: "ETIMEDOUT",
      name: "APIConnectionTimeoutError",
    });
    const create = jest.fn().mockRejectedValue(timeoutError);
    OpenAI.mockImplementation(() => ({ chat: { completions: { create } } }));
    await expect(extractFromStory("A story", fields)).rejects.toEqual(
      expect.objectContaining({
        name: "ExtractionServiceError",
        kind: "timeout",
        message: "Extraction service unavailable, please try again",
      })
    );
    expect(create).toHaveBeenCalledTimes(3);
    expect(create.mock.calls[0][0].timeout).toBe(15000);
  });

  test("retries transient provider failures with bounded backoff before succeeding", async () => {
    process.env.OPENAI_API_KEY = "test-key";
    const transientError = Object.assign(new Error("gateway unavailable"), {
      status: 503,
    });
    const create = jest.fn()
      .mockRejectedValueOnce(transientError)
      .mockRejectedValueOnce(transientError)
      .mockResolvedValueOnce({ choices: [{ message: { content: JSON.stringify({
        incidentType: "collision",
        vehicle: "Honda",
        damage: "bumper",
      }) } }] });
    OpenAI.mockImplementation(() => ({ chat: { completions: { create } } }));

    await expect(extractFromStory("A story", fields)).resolves.toEqual({
      incidentType: "collision",
      vehicle: "Honda",
      damage: "bumper",
    });
    expect(create).toHaveBeenCalledTimes(3);
  });

  test("reports rate limits as a typed provider failure", async () => {
    process.env.OPENAI_API_KEY = "test-key";
    const rateLimitError = Object.assign(new Error("too many requests"), {
      status: 429,
      name: "RateLimitError",
    });
    const create = jest.fn().mockRejectedValue(rateLimitError);
    OpenAI.mockImplementation(() => ({ chat: { completions: { create } } }));
    await expect(extractFromStory("A story", fields)).rejects.toBeInstanceOf(
      ExtractionServiceError
    );
    expect(create).toHaveBeenCalledTimes(1);
  });
});
