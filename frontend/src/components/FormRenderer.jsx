import { Fragment, useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";

import TextField from "./TextField";
import Checkbox from "./Checkbox";
import Dropdown from "./DropDown";
import MagicInput from "./MagicInput";
import { AIMissedField, NeedsReviewField } from "./ValidationStates";
import SaveDraftButton from "./SaveDraftButton";
import ResumeLinkDisplay from "./ResumeLinkDisplay";
import "./save-resume.css";

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

  // Day 23: save-draft state. draftSaveStatus feeds SaveDraftButton's
  // idle/saving/success/error prop directly.
  const [draftSaveStatus, setDraftSaveStatus] = useState("idle");
  const [resumeToken, setResumeToken] = useState(null);

  // Day 24: resume-draft state. Kept separate from save state since a user
  // could in principle resume a different draft than the one they just saved.
  const [resumeCodeInput, setResumeCodeInput] = useState("");
  const [resumingDraft, setResumingDraft] = useState(false);
  const [resumeStatus, setResumeStatus] = useState("");

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
  // nested format Praveen designed for ambiguous extractions ({ fullName: { value: "Raj", found: true } }).
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
  // straight away — no hunting for which field the warning belongs to.
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

  // Day 23 (fixed for the resumeToken contract): POSTs the current form
  // state to the save-draft endpoint. The backend no longer returns a
  // MongoDB draftId — it returns an opaque resumeToken that's the only
  // valid identifier for GET /api/forms/:id/draft/:resumeToken.
  const handleSaveDraft = async () => {
    const currentValues = getValues();
    setDraftSaveStatus("saving");

    try {
      const response = await axios.post(
        `http://localhost:5000/api/forms/${formId}/draft`,
        { values: currentValues }
      );

      setResumeToken(response.data.resumeToken);
      setDraftSaveStatus("success");
    } catch (err) {
      setDraftSaveStatus("error");
    }
  };

  // Day 24: fetches a previously saved draft by its resume token and
  // repopulates the form. Resumed values are mapped via setValue() so
  // watchedValues (and therefore showIf conditionals) update correctly,
  // exactly like AI extraction does. Every resumed field is also marked
  // human-edited so a stale extraction can never silently overwrite it.
  const handleResumeDraft = async () => {
    const trimmedCode = resumeCodeInput.trim();

    if (!trimmedCode) {
      setResumeStatus("Enter a resume code to continue.");
      return;
    }

    setResumingDraft(true);
    setResumeStatus("Loading draft...");

    try {
      const response = await axios.get(
        `http://localhost:5000/api/forms/${formId}/draft/${trimmedCode}`
      );

      const { values } = response.data;

      if (!values || typeof values !== "object") {
        setResumeStatus("Draft has no saved values.");
        return;
      }

      Object.entries(values).forEach(([fieldName, fieldValue]) => {
        humanEditedRef.current.add(fieldName);
        setValue(fieldName, fieldValue, {
          shouldValidate: true,
          shouldDirty: true,
        });
      });

      // Resumed data is now the human's — clear any stale AI highlight state
      // so nothing shows as "AI-missed" or "needs review" after resume.
      setAiMissedFields({});
      setAiReviewFields({});
      setAiWarning("");
      setResumeStatus("Draft loaded.");
    } catch (err) {
      const message =
        err.response?.data?.error || "Failed to load draft. Check the code and try again.";
      setResumeStatus(message);
    } finally {
      setResumingDraft(false);
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

      {schema.description && (
        <p className="text-gray-600 mb-6">{schema.description}</p>
      )}

      {/* Day 9: Magic Input — sends story text to extraction API,
          then calls applyExtractedData() to pre-fill matching fields */}
      <MagicInput formId={formId} onExtracted={applyExtractedData} />

      {/* Day 24: resume a previously saved draft by its resume code.
          ResumeLinkDisplay (below) only ever shows a code back to the user
          after a save — it has no input, so entering a code to resume still
          needs its own control here. */}
      <div className="mb-6 p-4 border border-gray-200 rounded-md">
        <label htmlFor="resumeCodeInput" className="block text-sm font-medium mb-1">
          Resume a saved draft
        </label>
        <div className="flex gap-2">
          <input
            id="resumeCodeInput"
            type="text"
            value={resumeCodeInput}
            onChange={(e) => setResumeCodeInput(e.target.value)}
            placeholder="Paste resume code"
            className="flex-1 border border-gray-300 rounded-md px-3 py-2 text-sm"
          />
          <button
            type="button"
            onClick={handleResumeDraft}
            disabled={resumingDraft}
            className="px-3 py-2 bg-gray-700 text-white rounded-md text-sm disabled:opacity-50"
          >
            {resumingDraft ? "Loading..." : "Resume"}
          </button>
        </div>
        {resumeStatus && (
          <p role="status" className="mt-2 text-sm text-gray-600">
            {resumeStatus}
          </p>
        )}
      </div>

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

      {/* Day 23 (fixed): save-draft action, now via the teammate-built
          SaveDraftButton component instead of an inline button. */}
      <span className="ml-2 inline-block align-middle">
        <SaveDraftButton status={draftSaveStatus} onSave={handleSaveDraft} />
      </span>

      {/* Day 24: show the resume code once a save succeeds, so the user has
          something to copy for later. */}
      {draftSaveStatus === "success" && resumeToken && (
        <div className="mt-3">
          <ResumeLinkDisplay resumeCode={resumeToken} />
        </div>
      )}

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
