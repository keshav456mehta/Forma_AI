import { describe, expect, it, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import axios from "axios";
import FormRenderer from "./FormRenderer";

vi.mock("axios");

describe("FormRenderer", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("shows loading state while fetching the form", () => {
    axios.get.mockImplementation(
      () => new Promise(() => {})
    );

    render(<FormRenderer />);

    expect(screen.getByText("Loading form...")).toBeInTheDocument();
  });

  it("renders the form after successfully loading the schema", async () => {
    axios.get.mockResolvedValue({
      data: {
        title: "Student Form",
        fields: [
          {
            name: "name",
            label: "Name",
          },
        ],
      },
    });

    render(<FormRenderer />);

    expect(await screen.findByText("Student Form")).toBeInTheDocument();
    expect(screen.getByDisplayValue("")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Submit" })).toBeInTheDocument();
  });

  it("shows an error message when the API request fails", async () => {
    axios.get.mockRejectedValue(new Error("API error"));

    render(<FormRenderer />);

    expect(
      await screen.findByText(
        "Could not load the form. Is the backend running?"
      )
    ).toBeInTheDocument();
  });

  it("shows a conditional field only when its condition is satisfied", async () => {
    axios.get.mockResolvedValue({
      data: {
        title: "Student Form",
        fields: [
          {
            name: "isStudent",
            label: "Are you a student?",
          },
          {
            name: "collegeName",
            label: "College Name",
            showIf: {
              fieldId: "isStudent",
              equals: "yes",
            },
          },
        ],
      },
    });

    render(<FormRenderer />);

    expect(await screen.findByText("Student Form")).toBeInTheDocument();

    expect(screen.queryByLabelText("College Name")).not.toBeInTheDocument();
  });
});