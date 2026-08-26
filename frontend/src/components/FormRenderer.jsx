import { Fragment, useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";

import TextField from "./TextField";
import Checkbox from "./Checkbox";
import Dropdown from "./DropDown";
import MagicInput from "./MagicInput";
import { AIMissedField, NeedsReviewField } from "./ValidationStates";

// Day 17: drop a single key out of an AI-state map without mutating state.
function clearFlag(flags, fieldName) {
  if (!flags[fieldName]) return flags;
  const next = { ...flags };
  delete next[fieldName];
  return next;
}

// Returns true if a field should be visible, based on its showIf rule
// (e.g. only show "Insurance Company" if "hasInsurance" === "Yes").
function shouldShowField(field, watchedValues) {
  if (!field.showIf) return true;

  const { fieldId, equals } = field.showIf;
  return watchedValues?.[fieldId] === equals;
}

function FormRenderer({ formId = "6a7ac008bb3e76cb84c1dc72" }) {
  const [schema, setSchema] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [submissionStatus, setSubmissionStatus] = useState("");

  // Day 17: AI-validation UI state, keyed by field name.
  //   aiMissedFields — the latest extraction couldn't fill these (need human entry)
  //   aiReviewFields — the latest extraction DID fill these (need human double-check)
  // Both clear per-field the moment the user edits that field manually.
  const [aiMissedFields, setAiMissedFields] = useState({});
  const [aiReviewFields, setAiReviewFields] = useState({});
  const [aiWarning, setAiWarning] = useState("");

  // Day 18: fields the human has explicitly taken over (typed into, or hit
  // "Not right?" on). Once claimed, NO later extraction may overwrite them —
  // a manual correction always wins, no matter the source.
  const humanEditedRef = useRef(new Set());

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm();

  const watchedValues = watch();

  // Fetch the form schema from the backend whenever formId changes.
  useEffect(() => {
    axios
      .get(`http://localhost:5000/api/forms/${formId}`)
      .then((res) => {
        setSchema(res.data);
        setLoading(false);
      })
      .catch(() => {
        setError("Could not load the form. Is the backend running?");
        setLoading(false);
      });
  }, [formId]);

  // Day 15: applies the LIVE extraction response (schema-shaped flat JSON)
  // from POST /api/forms/:id/extract via react-hook-form's setValue().
  //
  // Live response shape (extractionService.cleanExtraction): an object with
  // EVERY schema field name present — "" for text/select fields the AI
  // couldn't extract, false for unknown checkboxes. Because misses come back
  // as "" (not undefined), we skip empty/false values so a re-extraction
  // never wipes values the user already typed manually.
  const applyExtractedData = (extractedData) => {
    if (!extractedData || !schema?.fields) return;

    const missedNow = {};
    const reviewNow = {};

    schema.fields.forEach((field) => {
      const fieldName = field.name || field.id;

      // Day 18: a field the human edited is theirs for good — skip it
      // silently: no overwrite, and no highlight either.
      if (humanEditedRef.current.has(fieldName)) return;

      const extraction = extractedData[fieldName];
      const extractedValue = extraction?.value;

      // Only set fields the AI actually extracted a value for —
      // empty string = missed, false = unknown checkbox. Both are left
      // untouched for manual entry and flagged with the AI-missed highlight.
      const isMissed = extraction?.found !== true;

      if (isMissed) {
        missedNow[fieldName] = true;
        return;
      }

      // shouldDirty: true is required so watch() picks up the programmatic
      // change and triggers a re-render — without it, showIf conditions
      // won't react to AI-populated values (Day 11 fix).
      setValue(fieldName, extractedValue, {
        shouldValidate: true,
        shouldDirty: true,
      });

      // AI-filled: keep until a human confirms by editing the field.
      reviewNow[fieldName] = true;
    });

    // A new extraction replaces the previous AI states wholesale.
    setAiMissedFields(missedNow);
    setAiReviewFields(reviewNow);
  };

  // Day 17: any manual edit overrides the AI — clear both AI states for that
  // field so its highlight disappears as soon as the user starts typing.
  const handleUserChange = (fieldName, rhfOnChange) => (event) => {
    humanEditedRef.current.add(fieldName);
    setAiMissedFields((prev) => clearFlag(prev, fieldName));
    setAiReviewFields((prev) => clearFlag(prev, fieldName));
    setAiWarning("");
    rhfOnChange(event);
  };

  // Day 18: "this doesn't look right" correction affordance. Clicking it
  // claims the field for the human, drops the needs-review highlight
  // immediately and focuses the input so the correct value can be typed
  // straight away — no hunting for which field the ⚠️ belongs to.
  const startCorrection = (fieldName) => {
    humanEditedRef.current.add(fieldName);
    setAiReviewFields((prev) => clearFlag(prev, fieldName));
    setAiMissedFields((prev) => clearFlag(prev, fieldName));
    setAiWarning("");
    // Defer focus until after React commits: dropping the AI-state wrapper
    // remounts the field's <input>, which would otherwise lose the focus
    // set here. One tick later, the new node is what receives focus.
    setTimeout(() => document.getElementById(fieldName)?.focus(), 0);
  };

  // Submit the filled-in form data to the backend for validation/storage.
  const onValidSubmit = async (data) => {
    setSubmissionStatus("");
    setError(null);
    setAiWarning("");

    try {
      const response = await axios.post(
        `http://localhost:5000/api/forms/${formId}/submit`,
        data
      );

      setSubmissionStatus(response.data.message || "Submission is valid");
    } catch (err) {
      const message = err.response?.data?.error || "Failed to submit the form.";
      setError(message);
    }
  };

  // Day 17: submission was blocked by client-side validation. When the
  // blockers include required fields the AI never extracted, say so
  // explicitly — a generic "X is required" alone doesn't tell the user WHY
  // the field is empty or that they need to fill it themselves.
  const onInvalidSubmit = (errors) => {
    const missedRequired = [];

    schema?.fields?.forEach((field) => {
      const fieldId = field.name || field.id;
      if (
        field.required &&
        errors[fieldId]?.type === "required" &&
        aiMissedFields[fieldId]
      ) {
        missedRequired.push(field.label || fieldId);
      }
    });

    setAiWarning(
      missedRequired.length > 0
        ? `The AI couldn't fill ${missedRequired.length} required field${
            missedRequired.length > 1 ? "s" : ""
          }: ${missedRequired.join(", ")}. Please complete ${
            missedRequired.length > 1 ? "them" : "it"
          } before submitting.`
        : ""
    );
  };

  if (loading) {
    return <p>Loading form...</p>;
  }

  if (error && !schema) {
    return <p style={{ color: "red" }}>{error}</p>;
  }

  if (!schema || !schema.fields) {
    return <p>No form fields available.</p>;
  }

  return (
    <form
      onSubmit={handleSubmit(onValidSubmit, onInvalidSubmit)}
      className="w-full max-w-md mx-auto px-4 sm:px-6 py-6"
    >
      <h2 className="text-2xl font-bold mb-2">{schema.title}</h2>

      {schema.description && (
        <p className="text-gray-600 mb-6">{schema.description}</p>
      )}

      {/* Day 9: Magic Input — sends story text to extraction API,
          then calls applyExtractedData() to pre-fill matching fields */}
      <MagicInput formId={formId} onExtracted={applyExtractedData} />

      {schema.fields.map((field) => {
        // Skip fields whose showIf condition isn't currently satisfied.
        if (!shouldShowField(field, watchedValues)) return null;

        const fieldType = field.type || "text";
        const fieldId = field.name || field.id;

        // Build react-hook-form validation rules from the schema:
        // required-field check, plus an optional regex pattern check.
        const validationRules = {
          ...(field.required
            ? { required: `${field.label} is required` }
            : {}),
          ...(field.validationRegex
            ? {
                pattern: {
                  value: new RegExp(field.validationRegex),
                  message: `${field.label} format is invalid`,
                },
              }
            : {}),
        };

        // Day 17: intercept onChange so ANY manual edit clears this field's
        // AI state — human input always wins over both "missed" and
        // "needs review" flags. Everything else from register() passes through.
        const registration = register(field.name, validationRules);
        const registrationProps = {
          ...registration,
          onChange: handleUserChange(fieldId, registration.onChange),
        };

        const fieldError = errors?.[field.name]?.message;

        let fieldNode;
        if (fieldType === "checkbox") {
          fieldNode = (
            <Checkbox
              id={fieldId}
              label={field.label}
              required={field.required}
              error={fieldError}
              {...registrationProps}
            />
          );
        } else if (fieldType === "dropdown") {
          fieldNode = (
            <Dropdown
              id={fieldId}
              name={field.name}
              label={field.label}
              required={field.required}
              options={field.options || []}
              error={fieldError}
              {...registrationProps}
            />
          );
        } else {
          // Default case: render as a text field.
          fieldNode = (
            <TextField
              id={fieldId}
              name={field.name}
              label={field.label}
              required={field.required}
              placeholder={field.placeholder}
              error={fieldError}
              {...registrationProps}
            />
          );
        }

        // Day 17: wrap with Member 4's validation states where applicable.
        // The wrappers add border + guidance message; no label passed because
        // the inner components already render accessible labels.
        if (aiMissedFields[fieldId]) {
          return <AIMissedField key={fieldId}>{fieldNode}</AIMissedField>;
        }
        if (aiReviewFields[fieldId]) {
          // Day 18: needs-review fields get a one-click correction affordance.
          return (
            <NeedsReviewField key={fieldId}>
              {fieldNode}
              <button
                type="button"
                onClick={() => startCorrection(fieldId)}
                className="mt-1 text-xs font-medium text-yellow-800 underline hover:no-underline bg-transparent border-0 cursor-pointer"
              >
                Not right? Fix it
              </button>
            </NeedsReviewField>
          );
        }
        return <Fragment key={fieldId}>{fieldNode}</Fragment>;
      })}

      <button
        type="submit"
        disabled={isSubmitting}
        className="px-4 py-2 bg-blue-600 text-white rounded-md disabled:opacity-50"
      >
        {isSubmitting ? "Submitting..." : "Submit"}
      </button>

      {/* Day 17: explicit warning when submission is blocked because required
          fields the AI missed are still empty. */}
      {aiWarning && (
        <p role="alert" className="mt-3 text-sm font-medium text-orange-700">
          {aiWarning}
        </p>
      )}

      {submissionStatus && (
        <p role="status" className="mt-4 text-green-600">
          {submissionStatus}
        </p>
      )}

      {error && (
        <p role="alert" className="mt-4 text-red-500">
          {error}
        </p>
      )}
    </form>
  );
}

export default FormRenderer;
