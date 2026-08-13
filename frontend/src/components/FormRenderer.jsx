// FormRenderer.jsx
export default function FormRenderer({ fields }) {
  return (
    <div className="w-full max-w-md mx-auto px-4 sm:px-6 py-6">
      {fields.map((field) => {
        switch (field.type) {
          case "text":
            return <TextField key={field.id} {...field} />;
          case "dropdown":
            return <Dropdown key={field.id} {...field} />;
          case "checkbox":
            return <Checkbox key={field.id} {...field} />;
          default:
            return null;
        }
      })}
    </div>
  );
}