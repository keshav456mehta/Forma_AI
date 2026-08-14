import { beforeEach, describe, expect, it, vi } from "vitest";
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
    axios.get.mockImplementation(() => new Promise(() => {}));
    render(<FormRenderer />);
    expect(screen.getByText("Loading form...")).toBeInTheDocument();
  });

  it("renders the form after successfully loading the schema", async () => {
    axios.get.mockResolvedValue({
      data: { title: "Student Form", fields: [{ name: "name", label: "Name" }] },
    });
    render(<FormRenderer />);
    expect(await screen.findByText("Student Form")).toBeInTheDocument();
    expect(screen.getByLabelText("Name")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Submit" })).toBeInTheDocument();
  });

  it("shows an error message when the API request fails", async () => {
    axios.get.mockRejectedValue(new Error("API error"));
    render(<FormRenderer />);
    expect(
      await screen.findByText("Could not load the form. Is the backend running?")
    ).toBeInTheDocument();
  });

  it("shows a conditional field only when its condition is satisfied", async () => {
    axios.get.mockResolvedValue({
      data: {
        title: "Student Form",
        fields: [
          { name: "isStudent", label: "Are you a student?" },
          {
            name: "collegeName",
            label: "College Name",
            showIf: { fieldId: "isStudent", equals: "yes" },
          },
        ],
      },
    });
    render(<FormRenderer />);
    await screen.findByText("Student Form");
    expect(screen.queryByLabelText("College Name")).not.toBeInTheDocument();
  });

  it("renders dropdown and checkbox fields", async () => {
    axios.get.mockResolvedValue({
      data: {
        title: "Student Form",
        fields: [
          {
            name: "course",
            label: "Course",
            type: "dropdown",
            options: [
              { value: "cse", label: "Computer Science" },
              { value: "ece", label: "Electronics" },
            ],
          },
          { name: "isStudent", label: "Are you a student?", type: "checkbox" },
        ],
      },
    });
    render(<FormRenderer />);
    await screen.findByText("Student Form");
    expect(screen.getByLabelText("Course")).toBeInTheDocument();
    expect(screen.getByRole("option", { name: "Computer Science" })).toBeInTheDocument();
    expect(screen.getByRole("option", { name: "Electronics" })).toBeInTheDocument();
    expect(screen.getByLabelText("Are you a student?")).toBeInTheDocument();
  });

  it("submits the frontend payload to the validation endpoint", async () => {
    axios.get.mockResolvedValue({
      data: { title: "Student Form", fields: [{ name: "name", label: "Name" }] },
    });
    axios.post.mockResolvedValue({ data: { message: "Submission is valid" } });
    render(<FormRenderer formId="form-id" />);
    fireEvent.change(await screen.findByLabelText("Name"), {
      target: { value: "Vinay" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Submit" }));
    expect(await screen.findByRole("status")).toHaveTextContent("Submission is valid");
    expect(axios.post).toHaveBeenCalledWith(
      "http://localhost:5000/api/forms/form-id/submit",
      { name: "Vinay" }
    );
  });
});
