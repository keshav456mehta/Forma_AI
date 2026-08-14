import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";

import TextField from "./TextField";
import Checkbox from "./Checkbox";
import Dropdown from "./DropDown";

function shouldShowField(field, watchedValues) {
  if (!field.showIf) return true;

  const { fieldId, equals } = field.showIf;

  return watchedValues[fieldId] === equals;
}

function FormRenderer({
  formId = "6a7ac008bb3e76cb84c1dc72",
}) {
  const [schema, setSchema] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [submissionStatus, setSubmissionStatus] = useState("");

  const {
    register,
    handleSubmit,
    watch,
  } = useForm();

  const watchedValues = watch();

  useEffect(() => {
    axios
      .get(`http://localhost:5000/api/forms/${formId}`)
      .then((res) => {
        setSchema(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch schema:", err);
        setError(
          "Could not load the form. Is the backend running?"
        );
        setLoading(false);
      });
  }, [formId]);

  const onSubmit = async (data) => {
    console.log("Form submitted:", data);

    setSubmissionStatus("");
    setError(null);

    try {
      const response = await axios.post(
        `http://localhost:5000/api/forms/${formId}/submit`,
        data
      );

      setSubmissionStatus(
        response.data.message || "Submission is valid"
      );
    } catch (err) {
      console.error("Failed to submit form:", err);

      const message =
        err.response?.data?.error ||
        "Failed to submit the form.";

      setError(message);
    }
  };

  if (loading) {
    return <p>Loading form...</p>;
  }

  if (error && !schema) {
    return (
      <p style={{ color: "red" }}>
        {error}
      </p>
    );
  }

  if (!schema || !schema.fields) {
    return <p>No form fields available.</p>;
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="w-full max-w-md mx-auto px-4 sm:px-6 py-6"
    >
      <h2 className="text-2xl font-bold mb-2">
        {schema.title}
      </h2>

      {schema.description && (
        <p className="text-gray-600 mb-6">
          {schema.description}
        </p>
      )}

      {schema.fields.map((field) => {
        if (!shouldShowField(field, watchedValues)) {
          return null;
        }

        const fieldType = field.type || "text";
        const fieldId = field.name || field.id;

        if (fieldType === "checkbox") {
          return (
            <Checkbox
              key={fieldId}
              id={fieldId}
              label={field.label}
              required={field.required}
              {...register(field.name, {
                required: field.required,
              })}
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
              {...register(field.name, {
                required: field.required,
              })}
            />
          );
        }

        return (
          <TextField
            key={fieldId}
            id={fieldId}
            name={field.name}
            label={field.label}
            required={field.required}
            placeholder={field.placeholder}
            {...register(field.name, {
              required: field.required,
            })}
          />
        );
      })}

      <button
        type="submit"
        className="px-4 py-2 bg-blue-600 text-white rounded-md disabled:opacity-50"
      >
        Submit
      </button>

      {submissionStatus && (
        <p
          role="status"
          className="mt-4 text-green-600"
        >
          {submissionStatus}
        </p>
      )}

      {error && (
        <p
          role="alert"
          className="mt-4 text-red-500"
        >
          {error}
        </p>
      )}
    </form>
  );
}

export { shouldShowField };
export default FormRenderer;