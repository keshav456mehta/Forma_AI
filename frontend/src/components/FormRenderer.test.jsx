import { beforeEach, describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen, act } from "@testing-library/react";
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

  // Day 11: conditional field must appear when AI extraction sets the
  // controlling field's value programmatically via setValue().
  it("shows a conditional field after AI extraction populates the controlling field", async () => {
    axios.get.mockResolvedValue({
      data: {
        title: "Insurance Claim",
        fields: [
          {
            name: "hasInsurance",
            label: "Do you have insurance?",
            type: "dropdown",
            options: [
              { value: "Yes", label: "Yes" },
              { value: "No", label: "No" },
            ],
          },
          {
            name: "insuranceCompany",
            label: "Insurance Company",
            type: "text",
            showIf: { fieldId: "hasInsurance", equals: "Yes" },
          },
        ],
      },
    });
    // Mock extraction endpoint to return hasInsurance: "Yes"
    axios.post.mockResolvedValue({
      data: { hasInsurance: "Yes", insuranceCompany: "ICICI Lombard" },
    });

    render(<FormRenderer formId="form-id" />);
    await screen.findByText("Insurance Claim");

    // Insurance Company should NOT be visible yet
    expect(screen.queryByLabelText("Insurance Company")).not.toBeInTheDocument();

    // Simulate Magic Input triggering the extraction call
    await act(async () => {
      fireEvent.change(document.getElementById("magic-input"), {
        target: { value: "I have insurance with ICICI Lombard." },
      });
      fireEvent.click(screen.getByRole("button", { name: /auto-fill/i }));
    });

    // After extraction, hasInsurance = "Yes" so Insurance Company must appear
    expect(await screen.findByLabelText("Insurance Company")).toBeInTheDocument();
  });

  // Day 11: manual edits after AI-fill must still work normally.
  it("allows manual edits to override AI-populated field values", async () => {
    axios.get.mockResolvedValue({
      data: {
        title: "Basic Form",
        fields: [{ name: "fullName", label: "Full Name", type: "text" }],
      },
    });
    axios.post.mockResolvedValue({ data: { fullName: "Rajesh Kumar" } });

    render(<FormRenderer formId="form-id" />);
    await screen.findByText("Basic Form");

    // Trigger extraction to populate fullName
    // Use the textarea's id directly to avoid ambiguity with the fullName input
    await act(async () => {
      fireEvent.change(document.getElementById("magic-input"), {
        target: { value: "My name is Rajesh Kumar." },
      });
      fireEvent.click(screen.getByRole("button", { name: /auto-fill/i }));
    });

    // Manually override the AI-filled value
    const input = await screen.findByLabelText("Full Name");
    fireEvent.change(input, { target: { value: "Keshav Mehta" } });

    expect(input).toHaveValue("Keshav Mehta");
  });
});
