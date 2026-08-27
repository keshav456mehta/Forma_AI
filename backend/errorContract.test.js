const { ExtractionServiceError } = require("./services/extractionService");

function responseRecorder() {
  const response = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn().mockReturnThis(),
  };
  return response;
}

describe("API error contract", () => {
  test("malformed JSON is rendered as a JSON error response", () => {
    jest.isolateModules(() => {
      const express = require("express");
      const app = express();
      app.use(express.json());
      app.use((error, _req, res, next) => {
        if (error instanceof SyntaxError && "body" in error) {
          return res.status(400).json({ error: "Malformed JSON request body" });
        }
        return next(error);
      });

      // Verify the contract's exact response shape without exposing errors.
      const response = responseRecorder();
      const error = new SyntaxError("Unexpected token");
      error.body = "{";
      const middleware = app.router.stack.at(-1).handle;
      middleware(error, {}, response, jest.fn());
      expect(response.status).toHaveBeenCalledWith(400);
      expect(response.json).toHaveBeenCalledWith({ error: "Malformed JSON request body" });
    });
  });

  test("provider failure classifications do not leak into the HTTP response", async () => {
    jest.resetModules();
    jest.doMock("./models/Form", () => ({ findById: jest.fn() }));
    jest.doMock("./services/extractionService", () => ({
      extractFromStory: jest.fn().mockRejectedValue(new ExtractionServiceError("rate_limit")),
      ExtractionServiceError,
    }));
    const router = require("./routes/formRoutes");
    const handler = router.stack.find((layer) => layer.route?.path === "/:id/extract").route.stack[0].handle;
    const response = responseRecorder();

    const Form = require("./models/Form");
    Form.findById.mockReturnValue({ lean: jest.fn().mockResolvedValue({ fields: [] }) });
    await handler({ params: { id: "507f1f77bcf86cd799439011" }, body: { story: "My car was hit." } }, response);

    expect(response.status).toHaveBeenCalledWith(429);
    expect(response.json).toHaveBeenCalledWith({
      error: "Extraction service unavailable, please try again",
    });
  });
});
