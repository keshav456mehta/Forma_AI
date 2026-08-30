jest.mock("./models/Form", () => ({ findById: jest.fn() }));
jest.mock("./models/Draft", () => ({
  create: jest.fn(),
  findOne: jest.fn(),
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
    }));
    expect(response.status).toHaveBeenCalledWith(201);
    expect(response.json).toHaveBeenCalledWith({
      message: "Draft saved",
      savedAt,
      resumeToken: expect.any(String),
    });
  });

  test("retrieves a draft using its resume token", async () => {
    const draft = { formId, values: { name: "Ada" }, resumeToken: "resume-token" };
    Draft.findOne.mockReturnValue({ lean: jest.fn().mockResolvedValue(draft) });
    const response = responseRecorder();

    await getDraft({ params: { resumeToken: "resume-token" } }, response);

    expect(Draft.findOne).toHaveBeenCalledWith({ resumeToken: "resume-token" });
    expect(response.status).toHaveBeenCalledWith(200);
    expect(response.json).toHaveBeenCalledWith(draft);
  });
});
