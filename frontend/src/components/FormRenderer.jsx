import { Fragment, useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";

import TextField from "./TextField";
import Checkbox from "./Checkbox";
import Dropdown from "./DropDown";
import MagicInput from "./MagicInput";
import { AIMissedField, NeedsReviewField, FieldWrapper } from "./ValidationStates";
import ResumeDraftEntry from "./ResumeDraftEntry";
import SaveResumeLoading from "./SaveResumeLoading";

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

function FormRenderer({ formId = "6a828552980c388e1d07ee4c" }) {
  const [schema, setSchema] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [submissionStatus, setSubmissionStatus] = useState("");
  const [draftStatus, setDraftStatus] = useState("");
  const [draftId, setDraftId] = useState(null);
  const [savingDraft, setSavingDraft] = useState(false);
  const [resumingDraft, setResumingDraft] = useState(false);

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
    getValues,
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
  // Day 20: support both live flat format ({ fullName: "Raj" }) and the
  // nested format Praveen designed for ambiguous/extractions ({ fullName: { value: "Raj", found: true } }).
  const getExtraction = (data, fieldName) => {
    const raw = data?.[fieldName];
    if (raw && typeof raw === "object" && "value" in raw && "found" in raw) {
      return { value: raw.value, found: raw.found === true };
    }
    // Flat live format: anything truthy/non-empty/non-false = found; misses = "" / false / undefined / null
    if (raw === undefined || raw === null || raw === "" || raw === false) {
      return { value: raw, found: false };
    }
    return { value: raw, found: true };
  };

  const applyExtractedData = (extractedData) => {
    if (!extractedData || !schema?.fields) return;

    const missedNow = {};
    const reviewNow = {};

    schema.fields.forEach((field) => {
      const fieldName = field.name || field.id;

      // Day 18: a field the human edited is theirs for good — skip it
      // silently: no overwrite, and no highlight either.
      if (humanEditedRef.current.has(fieldName)) return;

      const { value: extractedValue, found } = getExtraction(extractedData, fieldName);

      // Only set fields the AI actually extracted a value for —
      // empty string / false = missed; both get the AI-missed highlight.
      if (!found) {
        missedNow[fieldName] = true;
        return;
      }

      setValue(fieldName, extractedValue, {
        shouldValidate: true,
        shouldDirty: true,
      });
      reviewNow[fieldName] = true;
    });

    setAiMissedFields(missedNow);
    setAiReviewFields(reviewNow);
  };

  // Resume a saved draft by its public resume token.
  const handleResume = async (resumeToken) => {
    if (!resumeToken) return;
    setResumingDraft(true);
    setDraftStatus("Loading saved draft...");

    try {
      const response = await axios.get(
        `http://localhost:5000/api/forms/draft/${resumeToken}`
      );
      const values = response.data.values || {};

      // Apply all values in a batch so react-hook-form updates once.
      Object.keys(values).forEach((k) => {
        // Only set values for fields that exist in the schema.
        const exists = schema.fields.find((f) => (f.name || f.id) === k);
        if (exists) {
          setValue(k, values[k], { shouldValidate: true, shouldDirty: true });
          // Treat resumed non-empty values as human-edited so AI won't overwrite
          // them on subsequent extractions.
          if (values[k] !== undefined && values[k] !== null && values[k] !== "") {
            humanEditedRef.current.add(k);
            setAiMissedFields((prev) => clearFlag(prev, k));
            setAiReviewFields((prev) => clearFlag(prev, k));
          }
        }
      });

      setDraftStatus("Draft loaded");
    } catch (err) {
      setDraftStatus(err.response?.data?.error || "Failed to load draft");
    } finally {
      setResumingDraft(false);
    }
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

  // Day 23: POSTs the current form state to the real save-draft endpoint.
  // On success, stores the returned draftId so a resume link/flow (Day 24)
  // can use it later.
  const handleSaveDraft = async () => {
    const currentValues = getValues();
    setSavingDraft(true);
    setDraftStatus("Saving draft...");

    try {
      const response = await axios.post(
        `http://localhost:5000/api/forms/${formId}/draft`,
        { values: currentValues }
      );

      setDraftId(response.data.draftId);
      setDraftStatus(`Draft saved (ID: ${response.data.draftId})`);
    } catch (err) {
      const message =
        err.response?.data?.error || "Failed to save draft. Please try again.";
      setDraftStatus(message);
    } finally {
      setSavingDraft(false);
    }
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

      {/* Resume entry area */}
      <div className="mb-4">
        {resumingDraft ? (
          <SaveResumeLoading label={"Resuming draft..."} />
        ) : (
          <ResumeDraftEntry onResume={handleResume} />
        )}
      </div>

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

        // Use a stable FieldWrapper for every field so toggling AI states
        // doesn't remount the DOM node and cause layout jumps when many
        // fields populate at once (resume flow).
        const status = aiMissedFields[fieldId]
          ? "missed"
          : aiReviewFields[fieldId]
          ? "review"
          : "none";

        return (
          <FieldWrapper
            key={fieldId}
            status={status}
            fieldId={fieldId}
            onStartCorrection={status === "review" ? () => startCorrection(fieldId) : undefined}
          >
            {fieldNode}
          </FieldWrapper>
        );
      })}

      <button
        type="submit"
        disabled={isSubmitting}
        className="px-4 py-2 bg-blue-600 text-white rounded-md disabled:opacity-50"
      >
        {isSubmitting ? "Submitting..." : "Submit"}
      </button>

      {/* Day 23: save-draft action now posts to the real backend endpoint */}
      <button
        type="button"
        onClick={handleSaveDraft}
        disabled={savingDraft}
        className="ml-2 px-4 py-2 border border-blue-600 text-blue-600 rounded-md hover:bg-blue-50 disabled:opacity-50"
      >
        {savingDraft ? "Saving..." : "Save Draft"}
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

      {draftStatus && (
        <p role="status" className="mt-2 text-blue-600 text-sm">
          {draftStatus}
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
