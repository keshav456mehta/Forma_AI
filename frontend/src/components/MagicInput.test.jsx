import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import { beforeEach, vi } from "vitest";
import axios from "axios";
import MagicInput from "./MagicInput";

vi.mock("axios", () => ({ default: { post: vi.fn() } }));

beforeEach(() => {
  vi.clearAllMocks();
});

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

// Day 16: a network-level failure (no HTTP response at all) must degrade
// gracefully with an actionable message, not a generic one.
test("shows an actionable message when the server is unreachable", async () => {
  axios.post.mockRejectedValueOnce(new Error("Network Error"));

  render(<MagicInput formId="507f1f77bcf86cd799439011" onExtracted={vi.fn()} />);
  fireEvent.change(screen.getByRole("textbox"), {
    target: { value: "My car was damaged." },
  });
  fireEvent.click(screen.getByRole("button", { name: "Auto-fill from story" }));

  expect((await screen.findByRole("alert")).textContent).toContain(
    "Can't reach the server"
  );
});

// Day 16: the keyword mock parser survives ONLY behind the explicit
// ?mock=1 dev flag — it must never touch axios, and it must be visible.
test("mock flag (?mock=1) parses locally without calling the API", async () => {
  window.history.pushState({}, "", "?mock=1");

  const onExtracted = vi.fn();
  render(<MagicInput formId="507f1f77bcf86cd799439011" onExtracted={onExtracted} />);

  expect(screen.getByText(/MOCK — not calling the AI/)).toBeInTheDocument();

  fireEvent.change(screen.getByRole("textbox"), {
    target: { value: "My name is Rajesh Kumar and I live in India." },
  });
  fireEvent.click(screen.getByRole("button", { name: "Auto-fill from story" }));

  await waitFor(() => expect(onExtracted).toHaveBeenCalled());
  expect(onExtracted).toHaveBeenCalledWith({
    fullName: "Rajesh Kumar",
    ownerName: "Rajesh Kumar",
    country: "India",
  });
  expect(axios.post).not.toHaveBeenCalled();

  // Reset the URL so later tests run against the live path.
  window.history.pushState({}, "", "/");
});

