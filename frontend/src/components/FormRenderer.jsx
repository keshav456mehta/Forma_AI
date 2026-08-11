import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";

function shouldShowField(field, watchedValues) {
  if (!field.showIf) return true;

  const { fieldId, equals } = field.showIf;

  return watchedValues[fieldId] === equals;
}

function FormRenderer({ formId = "6a7ac008bb3e76cb84c1dc72" }) {
  const [schema, setSchema] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { register, handleSubmit, watch } = useForm();

  // eslint-disable-next-line
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
        setError("Could not load the form. Is the backend running?");
        setLoading(false);
      });
  }, [formId]);

  const onSubmit = (data) => {
    console.log("Form submitted:", data);
  };

  if (loading) return <p>Loading form...</p>;

  if (error) {
    return <p style={{ color: "red" }}>{error}</p>;
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <h2>{schema.title}</h2>

      {schema.fields.map((field) => {
        if (!shouldShowField(field, watchedValues)) return null;

        return (
          <div key={field.name} style={{ marginBottom: "12px" }}>
            <label>{field.label}</label>
            <br />

            <input
              {...register(field.name)}
              type="text"
              style={{
                border: "1px solid black",
                padding: "4px",
              }}
            />
          </div>
        );
      })}

      <button type="submit">Submit</button>
    </form>
  );
}

export { shouldShowField };
export default FormRenderer;