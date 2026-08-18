import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";

import TextField from "./TextField";
import Checkbox from "./Checkbox";
import Dropdown from "./DropDown";
import MagicInput from "./MagicInput";

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

  // Day 8 stub: accepts the AI-extraction response and pre-fills matching
  // form fields via react-hook-form's setValue().
  //
  // ASSUMED SHAPE (not yet confirmed with Member 3 / backend): a flat JSON
  // object whose keys match schema field names exactly, e.g.
  //   { incidentType: "animal_collision", vehicle: "Honda", damage: "windshield" }
  // Once the real /api/forms/:id/extract endpoint exists (Day 9), confirm
  // this shape matches its actual response and adjust if it doesn't.
  const applyExtractedData = (extractedData) => {
    if (!extractedData || !schema?.fields) return;

    schema.fields.forEach((field) => {
      const fieldName = field.name || field.id;
      const extractedValue = extractedData[fieldName];

      // Only set fields the extraction actually returned a value for —
      // leave everything else untouched for manual entry.
      // shouldDirty: true is required so watch() picks up the programmatic
      // change and triggers a re-render — without it, showIf conditions
      // won't react to AI-populated values (Day 11 fix).
      if (extractedValue !== undefined && extractedValue !== null) {
        setValue(fieldName, extractedValue, {
          shouldValidate: true,
          shouldDirty: true,
        });
      }
    });
  };

  // Submit the filled-in form data to the backend for validation/storage.
  const onSubmit = async (data) => {
    setSubmissionStatus("");
    setError(null);

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
      onSubmit={handleSubmit(onSubmit)}
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

        const fieldError = errors?.[field.name]?.message;

        if (fieldType === "checkbox") {
          return (
            <Checkbox
              key={fieldId}
              id={fieldId}
              label={field.label}
              required={field.required}
              error={fieldError}
              {...register(field.name, validationRules)}
            />
          );
        }

        if (fieldType === "dropdown") {
          return (
            <Dropdown
              key={fieldId}
              id={fieldId}
              name={field.name}
              label={field.label}
              required={field.required}
              options={field.options || []}
              error={fieldError}
              {...register(field.name, validationRules)}
            />
          );
        }

        // Default case: render as a text field.
        return (
          <TextField
            key={fieldId}
            id={fieldId}
            name={field.name}
            label={field.label}
            required={field.required}
            placeholder={field.placeholder}
            error={fieldError}
            {...register(field.name, validationRules)}
          />
        );
      })}

      <button
        type="submit"
        disabled={isSubmitting}
        className="px-4 py-2 bg-blue-600 text-white rounded-md disabled:opacity-50"
      >
        {isSubmitting ? "Submitting..." : "Submit"}
      </button>

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

export { shouldShowField};

export default FormRenderer;