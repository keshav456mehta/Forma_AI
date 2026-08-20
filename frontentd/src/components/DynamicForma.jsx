import { useEffect, useState } from "react";
import { getForm } from "../api/formApi";

function DynamicForm({ formId }) {
  const [form, setForm] = useState(null);
  const [values, setValues] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Load form from backend
  useEffect(() => {
    const loadForm = async () => {
      try {
        const data = await getForm(formId);
        setForm(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadForm();
  }, [formId]);

  // Handle field changes
  const handleChange = (name, value) => {
    setValues((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  // Check showIf condition
  const shouldShowField = (field) => {
    if (!field.showIf) {
      return true;
    }

    return (
      values[field.showIf.fieldId] === field.showIf.equals
    );
  };

  // Handle form submission
  const handleSubmit = (event) => {
    event.preventDefault();

    console.log("Form submitted:", values);

    alert("Form submitted successfully!");
  };

  // Loading state
  if (loading) {
    return <p>Loading form...</p>;
  }

  // Error state
  if (error) {
    return <p>Error: {error}</p>;
  }

  // Form not found
  if (!form) {
    return <p>Form not found.</p>;
  }

  // Sort fields according to order
  const sortedFields = [...form.fields].sort(
    (a, b) => a.order - b.order
  );

  return (
    <div>
      <h1>{form.title}</h1>

      <p>{form.description}</p>

      <form onSubmit={handleSubmit}>
        {sortedFields.map((field) => {
          // Check conditional logic
          if (!shouldShowField(field)) {
            return null;
          }

          return (
            <div key={field.name}>
              {/* =========================
                  TEXT FIELD
              ========================== */}
              {field.type === "text" && (
                <div>
                  <label htmlFor={field.name}>
                    {field.label}
                  </label>

                  <input
                    id={field.name}
                    name={field.name}
                    type="text"
                    value={values[field.name] || ""}
                    required={field.required}
                    pattern={
                      field.validationRegex || undefined
                    }
                    onChange={(event) =>
                      handleChange(
                        field.name,
                        event.target.value
                      )
                    }
                  />
                </div>
              )}

              {/* =========================
                  DROPDOWN FIELD
              ========================== */}
              {field.type === "dropdown" && (
                <div>
                  <label htmlFor={field.name}>
                    {field.label}
                  </label>

                  <select
                    id={field.name}
                    name={field.name}
                    value={values[field.name] || ""}
                    required={field.required}
                    onChange={(event) =>
                      handleChange(
                        field.name,
                        event.target.value
                      )
                    }
                  >
                    <option value="">
                      Select an option
                    </option>

                    <option value="Yes">Yes</option>
                    <option value="No">No</option>
                    <option value="India">India</option>
                    <option value="USA">USA</option>
                  </select>
                </div>
              )}

              {/* =========================
                  CHECKBOX FIELD
              ========================== */}
              {field.type === "checkbox" && (
                <div>
                  <label htmlFor={field.name}>
                    <input
                      id={field.name}
                      name={field.name}
                      type="checkbox"
                      checked={
                        values[field.name] || false
                      }
                      required={field.required}
                      onChange={(event) =>
                        handleChange(
                          field.name,
                          event.target.checked
                        )
                      }
                    />

                    {field.label}
                  </label>
                </div>
              )}
            </div>
          );
        })}

        {/* Submit button */}
        <button type="submit">
          Submit
        </button>
      </form>
    </div>........
  );
}

export default DynamicForm;