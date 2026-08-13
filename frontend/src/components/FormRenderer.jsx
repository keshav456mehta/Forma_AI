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

  const onSubmit = (data) => {
    console.log("Form submitted:", data);
  };

  if (loading) {
    return <p>Loading form...</p>;
  }

  if (error) {
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
    <form onSubmit={handleSubmit(onSubmit)}>
      <h2>{schema.title}</h2>

      {schema.fields.map((field) => {
        if (!shouldShowField(field, watchedValues)) {
          return null;
        }

        const fieldType = field.type || "text";

        if (fieldType === "checkbox") {
          return (
            <Checkbox
              key={field.name || field.id}
              id={field.name || field.id}
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
            <div
              key={field.name || field.id}
              className="mb-4"
            >
              <label
                htmlFor={field.name}
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                {field.label}

                {field.required && (
                  <span className="text-red-500 ml-1">
                    *
                  </span>
                )}
              </label>

              <select
                id={field.name}
                {...register(field.name, {
                  required: field.required,
                })}
                className="w-full px-3 py-2 border rounded-md"
                defaultValue=""
              >
                <option value="">
                  Select an option
                </option>

                {(field.options || []).map((option) => {
                  const value =
                    typeof option === "string"
                      ? option
                      : option.value;

                  const label =
                    typeof option === "string"
                      ? option
                      : option.label;

                  return (
                    <option
                      key={value}
                      value={value}
                    >
                      {label}
                    </option>
                  );
                })}
              </select>
            </div>
          );
        }

        return (
          <TextField
            key={field.name || field.id}
            id={field.name || field.id}
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

      <button type="submit">
        Submit
      </button>
    </form>
  );
}

export { shouldShowField };
export default FormRenderer;