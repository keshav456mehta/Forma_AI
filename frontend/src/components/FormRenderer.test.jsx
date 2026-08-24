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

  // Day 15: the live extraction service returns EVERY schema field in its
  // response — "" for text/select it couldn't extract. A re-extraction must
  // never wipe values the user already typed manually.
  it("keeps manually-entered values when a re-extraction misses those fields", async () => {
    axios.get.mockResolvedValue({
      data: {
        title: "Basic Form",
        fields: [
          { name: "fullName", label: "Full Name", type: "text" },
          { name: "city", label: "City", type: "text" },
        ],
      },
    });

    render(<FormRenderer formId="form-id" />);
    await screen.findByText("Basic Form");

    // First extraction fills only fullName; city comes back "" (missed)
    axios.post.mockResolvedValueOnce({ data: { fullName: "Rajesh Kumar", city: "" } });
    await act(async () => {
      fireEvent.change(document.getElementById("magic-input"), {
        target: { value: "My name is Rajesh Kumar." },
      });
      fireEvent.click(screen.getByRole("button", { name: /auto-fill/i }));
    });

    // User manually fills the field the AI missed
    fireEvent.change(await screen.findByLabelText("City"), {
      target: { value: "Mumbai" },
    });

    // Second extraction misses BOTH fields ("") — nothing already on screen
    // may be wiped
    axios.post.mockResolvedValueOnce({ data: { fullName: "", city: "" } });
    await act(async () => {
      fireEvent.change(document.getElementById("magic-input"), {
        target: { value: "something unrelated happened." },
      });
      fireEvent.click(screen.getByRole("button", { name: /auto-fill/i }));
    });

    expect(screen.getByLabelText("City")).toHaveValue("Mumbai");
    expect(screen.getByLabelText("Full Name")).toHaveValue("Rajesh Kumar");
  });

  // Day 17: after a partial extraction, missed fields get the ❓ highlight
  // and AI-filled fields get the ⚠️ needs-review highlight. Any manual edit
  // clears that field's highlight immediately.
  it("highlights AI-missed vs AI-filled fields and clears highlights on manual edit", async () => {
    axios.get.mockResolvedValue({
      data: {
        title: "Basic Form",
        fields: [
          { name: "fullName", label: "Full Name", type: "text" },
          { name: "city", label: "City", type: "text" },
        ],
      },
    });

    render(<FormRenderer formId="form-id" />);
    await screen.findByText("Basic Form");

    // Live extraction run with partial results: fullName extracted, city missed
    axios.post.mockResolvedValueOnce({ data: { fullName: "Rajesh Kumar", city: "" } });
    await act(async () => {
      fireEvent.change(document.getElementById("magic-input"), {
        target: { value: "My name is Rajesh Kumar." },
      });
      fireEvent.click(screen.getByRole("button", { name: /auto-fill/i }));
    });

    // Missed → ❓ message; filled → ⚠️ message
    expect(screen.getByText(/AI couldn't find this/)).toBeInTheDocument();
    expect(screen.getByText(/Please double-check this value/)).toBeInTheDocument();

    // Manually filling the missed field clears its ❓ highlight
    fireEvent.change(screen.getByLabelText("City"), { target: { value: "Mumbai" } });
    expect(screen.queryByText(/AI couldn't find this/)).not.toBeInTheDocument();

    // Manually editing an AI-filled field clears its ⚠️ highlight too
    fireEvent.change(screen.getByLabelText("Full Name"), {
      target: { value: "Keshav Mehta" },
    });
    expect(screen.queryByText(/Please double-check this value/)).not.toBeInTheDocument();
  });

  // Day 17: submitting while a REQUIRED AI-missed field is still empty must
  // be blocked with a warning that names the fields — not just the generic
  // "X is required". Filling the field must let submission go through.
  it("blocks submit with a named warning when required AI-missed fields are empty", async () => {
    axios.get.mockResolvedValue({
      data: {
        title: "Claim Form",
        fields: [{ name: "incidentDate", label: "Incident Date", type: "text", required: true }],
      },
    });

    render(<FormRenderer formId="form-id" />);
    await screen.findByText("Claim Form");

    // Extraction misses the required field entirely
    axios.post.mockResolvedValueOnce({ data: { incidentDate: "" } });
    await act(async () => {
      fireEvent.change(document.getElementById("magic-input"), {
        target: { value: "something happened last week." },
      });
      fireEvent.click(screen.getByRole("button", { name: /auto-fill/i }));
    });

    expect(await screen.findByText(/AI couldn't find this/)).toBeInTheDocument();

    // Attempt to submit → blocked, with a warning naming Incident Date
    // (handleSubmit resolves async, so wait for the alert to appear)
    fireEvent.click(screen.getByRole("button", { name: "Submit" }));
    const warning = await screen.findByRole("alert");
    expect(warning.textContent).toContain("The AI couldn't fill");
    expect(warning.textContent).toContain("Incident Date");
    // No submission request went out — only the extraction POST
    expect(axios.post).toHaveBeenCalledTimes(1);

    // Fill the missed field manually → highlight clears, submit succeeds
    // (regex match — required fields render a trailing "*" in their label)
    axios.post.mockResolvedValueOnce({ data: { message: "Submission is valid" } });
    fireEvent.change(screen.getByLabelText(/Incident Date/), {
      target: { value: "2026-08-20" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Submit" }));

    expect(await screen.findByRole("status")).toHaveTextContent("Submission is valid");
    expect(axios.post).toHaveBeenCalledWith(
      "http://localhost:5000/api/forms/form-id/submit",
      { incidentDate: "2026-08-20" }
    );
  });
});
