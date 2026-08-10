import { useForm } from "react-hook-form";

const sampleSchema = {
  title: "Sample Form",
  fields: [
    { name: "employmentStatus", label: "Employment Status", type: "text" },
    {
      name: "companyName",
      label: "Company Name",
      type: "text",
      showIf: { fieldId: "employmentStatus", equals: "Employed" },
    },
    { name: "subscribe", label: "Subscribe to newsletter", type: "checkbox" },
  ],
};

function shouldShowField(field, watchedValues) {
  if (!field.showIf) return true;
  const { fieldId, equals } = field.showIf;
  return watchedValues[fieldId] === equals;
}

function FormRenderer({ schema = sampleSchema }) {
  const { register, handleSubmit, watch } = useForm();
  const watchedValues = watch();

  const onSubmit = (data) => {
    console.log("Form submitted:", data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <h2>{schema.title}</h2>

      {schema.fields.map((field) => {
        if (!shouldShowField(field, watchedValues)) return null;

        console.log("Rendering field:", field.type);
        return (
          <div key={field.name} style={{ marginBottom: "12px" }}>
            <label>{field.label}</label>
            <br />
            <input {...register(field.name)} type="text" style={{ border: "1px solid black", padding: "4px" }} />          
          </div>
        );
      })}

      <button type="submit">Submit</button>
    </form>
  );
}

export default FormRenderer;