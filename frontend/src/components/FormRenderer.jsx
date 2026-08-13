import { useEffect, useState } from "react";
import { Controller, useForm, useWatch } from "react-hook-form";
import axios from "axios";

import TextField from "./TextField";
import Checkbox from "./Checkbox";
import Dropdown from "./DropDown";

function shouldShowField(field, watchedValues) {
  if (!field.showIf) return true;

  const { fieldId, equals } = field.showIf;
  return watchedValues?.[fieldId] === equals;
}

function FormRenderer({ formId = "6a7c88a689bd3a82004abdd2" }) {
  const [schema, setSchema] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [submissionError, setSubmissionError] = useState(null);
  const [submissionSuccess, setSubmissionSuccess] = useState(null);
  const { control, handleSubmit } = useForm();
  const watchedValues = useWatch({ control });

  useEffect(() => {
    axios
      .get(`http://localhost:5000/api/forms/${formId}`)
      .then((res) => {
        setSchema(res.data);
        setLoading(false);
      })
      .catch((requestError) => {
        console.error("Failed to fetch schema:", requestError);
        setError("Could not load the form. Is the backend running?");
        setLoading(false);
      });
  }, [formId]);

  const onSubmit = async (data) => {
    setSubmissionError(null);
    setSubmissionSuccess(null);

    try {
      const response = await axios.post(
        `http://localhost:5000/api/forms/${formId}/submit`,
        data
      );
      setSubmissionSuccess(response.data.message);
    } catch (submitError) {
      const responseData = submitError.response?.data;
      const missingFields = responseData?.fields?.join(", ");
      setSubmissionError(
        missingFields
          ? `${responseData.error}: ${missingFields}`
          : responseData?.error || "Could not submit the form. Please try again."
      );
    }
  };

  if (loading) return <p>Loading form...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;
  if (!schema?.fields) return <p>No form fields available.</p>;

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <h2>{schema.title || schema.formName}</h2>

      {schema.fields.map((field) => {
        if (!shouldShowField(field, watchedValues)) return null;

        const fieldId = field.name || field.fieldId || field.id;
        const fieldType = field.type || "text";
        const validationRules = {
          ...(field.required ? { required: `${field.label} is required` } : {}),
          ...(field.validationRegex
            ? {
                pattern: {
                  value: new RegExp(field.validationRegex),
                  message: `${field.label} format is invalid`,
                },
              }
            : {}),
        };

        if (fieldType === "checkbox") {
          return (
            <Controller
              key={fieldId}
              name={fieldId}
              control={control}
              defaultValue={false}
              rules={
                field.required
                  ? { validate: (value) => value || `${field.label} is required` }
                  : {}
              }
              render={({ field: controllerField, fieldState }) => (
                <Checkbox
                  id={fieldId}
                  label={field.label}
                  required={field.required}
                  checked={Boolean(controllerField.value)}
                  onChange={controllerField.onChange}
                  error={fieldState.error?.message}
                />
              )}
            />
          );
        }

        if (fieldType === "dropdown" || fieldType === "select") {
          return (
            <Controller
              key={fieldId}
              name={fieldId}
              control={control}
              defaultValue=""
              rules={validationRules}
              render={({ field: controllerField, fieldState }) => (
                <Dropdown
                  id={fieldId}
                  label={field.label}
                  required={field.required}
                  options={field.options || []}
                  value={controllerField.value}
                  onChange={controllerField.onChange}
                  onBlur={controllerField.onBlur}
                  name={controllerField.name}
                  error={fieldState.error?.message}
                />
              )}
            />
          );
        }

        return (
          <Controller
            key={fieldId}
            name={fieldId}
            control={control}
            defaultValue=""
            rules={validationRules}
            render={({ field: controllerField, fieldState }) => (
              <TextField
                id={fieldId}
                label={field.label}
                required={field.required}
                value={controllerField.value}
                onChange={controllerField.onChange}
                onBlur={controllerField.onBlur}
                name={controllerField.name}
                inputRef={controllerField.ref}
                placeholder={field.placeholder || ""}
                error={fieldState.error?.message}
              />
            )}
          />
        );
      })}

      <button type="submit">Submit</button>
      {submissionSuccess && <p role="status">{submissionSuccess}</p>}
      {submissionError && <p role="alert">{submissionError}</p>}
    </form>
  );
}

export default FormRenderer;
