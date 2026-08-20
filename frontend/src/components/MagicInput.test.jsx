import { fireEvent, render, screen } from "@testing-library/react";
import { vi } from "vitest";
import axios from "axios";
import MagicInput from "./MagicInput";

vi.mock("axios", () => ({ default: { post: vi.fn() } }));

test("shows the standardized extraction error returned by the backend", async () => {
  axios.post.mockRejectedValueOnce({
    response: {
      data: { error: "Extraction service unavailable, please try again" },
    },
  });

  render(<MagicInput formId="507f1f77bcf86cd799439011" onExtracted={vi.fn()} />);
  fireEvent.change(screen.getByRole("textbox"), {
    target: { value: "My car was damaged." },
  });
  fireEvent.click(screen.getByRole("button", { name: "Auto-fill from story" }));

  expect((await screen.findByRole("alert")).textContent).toContain(
    "Extraction service unavailable, please try again"
  );
});
