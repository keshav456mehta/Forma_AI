import { useForm } from "react-hook-form";

// Temporary hardcoded schema — just to prove the loop works
const sampleSchema = {
  title: "Sample Form",
  fields: [
    { name: "fullName", label: "Full Name", type: "text" },
    { name: "email", label: "Email", type: "text" },
    { name: "subscribe", label: "Subscribe to newsletter", type: "checkbox" },
  ],
};

function FormRenderer({ schema = sampleSchema }) {
  const { register, handleSubmit } = useForm();

  const onSubmit = (data) => {
    console.log("Form submitted:", data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <h2>{schema.title}</h2>

      {schema.fields.map((field) => {
        console.log("Rendering field:", field.type); // confirms the loop works
        return (
          <div key={field.name} style={{ marginBottom: "12px" }}>
            <label>{field.label}</label>
            <br />
            {/* Placeholder — real field types come in later days */}
            <input {...register(field.name)} type="text" />
          </div>
        );
      })}

      <button type="submit">Submit</button>
    </form>
  );
}

export default FormRenderer;