import { describe, expect, it, vi, beforeEach } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
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

  it("submits the frontend payload to the validation endpoint", async () => {
    axios.get.mockResolvedValue({
      data: {
        title: "Student Form",
        fields: [{ name: "name", label: "Name" }],
      },
    });
    axios.post.mockResolvedValue({ data: { message: "Submission is valid" } });

    render(<FormRenderer formId="form-id" />);

    const input = await screen.findByLabelText("Name");
    fireEvent.change(input, { target: { value: "Vinay" } });
    fireEvent.click(screen.getByRole("button", { name: "Submit" }));

    expect(await screen.findByRole("status")).toHaveTextContent(
      "Submission is valid"
    );
    expect(axios.post).toHaveBeenCalledWith(
      "http://localhost:5000/api/forms/form-id/submit",
      { name: "Vinay" }
    );
  });
});
