import { describe, expect, it } from "vitest";
import { shouldShowField } from "./FormRenderer";

describe("shouldShowField", () => {
  it("shows the field when the condition is satisfied", () => {
    const field = {
      name: "collegeName",
      label: "College Name",
      showIf: {
        fieldId: "isStudent",
        equals: true,
      },
    };

    const watchedValues = {
      isStudent: true,
    };

    expect(shouldShowField(field, watchedValues)).toBe(true);
  });

  it("hides the field when the condition is not satisfied", () => {
    const field = {
      name: "collegeName",
      label: "College Name",
      showIf: {
        fieldId: "isStudent",
        equals: true,
      },
    };

    const watchedValues = {
      isStudent: false,
    };

    expect(shouldShowField(field, watchedValues)).toBe(false);
  });

  it("toggles the field visibility when the controlling value changes", () => {
    const field = {
      name: "collegeName",
      label: "College Name",
      showIf: {
        fieldId: "isStudent",
        equals: true,
      },
    };

    expect(
      shouldShowField(field, { isStudent: true })
    ).toBe(true);

    expect(
      shouldShowField(field, { isStudent: false })
    ).toBe(false);

    expect(
      shouldShowField(field, { isStudent: true })
    ).toBe(true);
  });
});