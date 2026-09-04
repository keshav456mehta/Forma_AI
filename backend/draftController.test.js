jest.mock("./models/Form", () => ({ findById: jest.fn() }));
jest.mock("./models/Draft", () => ({
  create: jest.fn(),
  findOne: jest.fn(),
  findOneAndUpdate: jest.fn(),
}));

const Form = require("./models/Form");
const Draft = require("./models/Draft");
const { saveDraft, getDraft } = require("./controllers/draftController");

function responseRecorder() {
  return {
    status: jest.fn().mockReturnThis(),
    json: jest.fn().mockReturnThis(),
  };
}

describe("draft API controller", () => {
  const formId = "507f1f77bcf86cd799439011";

  beforeEach(() => jest.clearAllMocks());

  test("saves partial values and returns a resume token", async () => {
    const savedAt = new Date("2026-08-30T10:00:00.000Z");
    Form.findById.mockReturnValue({ lean: jest.fn().mockResolvedValue({ _id: formId }) });
    Draft.create.mockImplementation(async (draft) => ({ ...draft, createdAt: savedAt }));
    const response = responseRecorder();

    await saveDraft({ params: { id: formId }, body: { values: { name: "Ada", hasPet: false } } }, response);

    expect(Draft.create).toHaveBeenCalledWith(expect.objectContaining({
      formId,
      values: { name: "Ada", hasPet: false },
      resumeToken: expect.any(String),
      expiresAt: expect.any(Date),
    }));
    expect(response.status).toHaveBeenCalledWith(201);
    expect(response.json).toHaveBeenCalledWith({
      message: "Draft saved",
      savedAt,
      resumeToken: expect.any(String),
      expiresAt: expect.any(Date),
    });
  });

  test("sets the expiry exactly 30 days after the draft is saved", async () => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date("2026-08-01T12:00:00.000Z"));
    Form.findById.mockReturnValue({ lean: jest.fn().mockResolvedValue({ _id: formId }) });
    Draft.create.mockImplementation(async (draft) => ({ ...draft, createdAt: new Date() }));
    const response = responseRecorder();

    await saveDraft({ params: { id: formId }, body: { values: {} } }, response);

    expect(Draft.create).toHaveBeenCalledWith(expect.objectContaining({
      expiresAt: new Date("2026-08-31T12:00:00.000Z"),
    }));
    jest.useRealTimers();
  });

  test("updates a draft atomically when its revision matches", async () => {
    const updatedDraft = {
      formId,
      values: { name: "Grace" },
      resumeToken: "resume-token",
      revision: 2,
      createdAt: new Date("2026-08-30T10:00:00.000Z"),
      expiresAt: new Date("2026-09-29T10:00:00.000Z"),
    };
    Form.findById.mockReturnValue({ lean: jest.fn().mockResolvedValue({ _id: formId }) });
    Draft.findOneAndUpdate.mockReturnValue({ lean: jest.fn().mockResolvedValue(updatedDraft) });
    const response = responseRecorder();

    await saveDraft({
      params: { id: formId },
      body: { values: updatedDraft.values, resumeToken: "resume-token", revision: 1 },
    }, response);

    expect(Draft.findOneAndUpdate).toHaveBeenCalledWith(
      { formId, resumeToken: "resume-token", revision: 1 },
      expect.objectContaining({ $inc: { revision: 1 } }),
      { new: true }
    );
    expect(response.status).toHaveBeenCalledWith(200);
    expect(response.json).toHaveBeenCalledWith(expect.objectContaining({ revision: 2 }));
  });

  test("rejects a stale concurrent save without overwriting the newer draft", async () => {
    Form.findById.mockReturnValue({ lean: jest.fn().mockResolvedValue({ _id: formId }) });
    Draft.findOneAndUpdate.mockReturnValue({ lean: jest.fn().mockResolvedValue(null) });
    Draft.findOne.mockReturnValue({ lean: jest.fn().mockResolvedValue({ revision: 2 }) });
    const response = responseRecorder();

    await saveDraft({
      params: { id: formId },
      body: { values: { name: "Ada" }, resumeToken: "resume-token", revision: 1 },
    }, response);

    expect(response.status).toHaveBeenCalledWith(409);
    expect(response.json).toHaveBeenCalledWith({
      error: "Draft has been updated elsewhere. Reload it and try again.",
    });
  });

  test("retrieves a draft using its resume token", async () => {
    const draft = {
      formId,
      values: { name: "Ada" },
      resumeToken: "resume-token",
      expiresAt: new Date("2026-09-29T10:00:00.000Z"),
    };
    Draft.findOne.mockReturnValue({ lean: jest.fn().mockResolvedValue(draft) });
    const response = responseRecorder();

    await getDraft({ params: { id: formId, resumeToken: "resume-token" } }, response);

    expect(Draft.findOne).toHaveBeenCalledWith({ formId, resumeToken: "resume-token" });
    expect(response.status).toHaveBeenCalledWith(200);
    expect(response.json).toHaveBeenCalledWith(draft);
  });

  test("returns 404 when a resume token is invalid", async () => {
    Draft.findOne.mockReturnValue({ lean: jest.fn().mockResolvedValue(null) });
    const response = responseRecorder();

    await getDraft({ params: { id: formId, resumeToken: "expired-token" } }, response);

    expect(response.status).toHaveBeenCalledWith(404);
    expect(response.json).toHaveBeenCalledWith({ error: "Draft not found" });
  });

  test("returns 410 with a clear error when a draft has expired", async () => {
    const draft = {
      formId,
      values: { name: "Ada" },
      resumeToken: "expired-token",
      expiresAt: new Date("2026-08-29T10:00:00.000Z"),
    };
    Draft.findOne.mockReturnValue({ lean: jest.fn().mockResolvedValue(draft) });
    const response = responseRecorder();

    await getDraft({ params: { id: formId, resumeToken: "expired-token" } }, response);

    expect(response.status).toHaveBeenCalledWith(410);
    expect(response.json).toHaveBeenCalledWith({ error: "This draft has expired" });
  });

  test("returns 404 when a resume token is malformed", async () => {
    const response = responseRecorder();

    await getDraft({ params: { id: formId, resumeToken: " " } }, response);

    expect(response.status).toHaveBeenCalledWith(404);
    expect(response.json).toHaveBeenCalledWith({ error: "Draft not found" });
  });
});
