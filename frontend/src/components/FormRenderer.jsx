// FormRenderer.jsx
import TextField from "./TextField";
import Dropdown from "./Dropdown";
import Checkbox from "./Checkbox";

export default function FormRenderer({ fields }) {
  return (
    <div className="max-w-md mx-auto py-6">
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