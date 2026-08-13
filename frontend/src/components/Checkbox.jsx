// Checkbox.jsx
import Label from "./Label";

export default function Checkbox({ label, required, error, ...props }) {
  return (
    <div className="mb-4">
      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          className={`h-4 w-4 rounded border
            ${error ? "border-red-500" : "border-gray-300"}
            focus:ring-2 focus:ring-blue-400`}
          {...props}
        />
        <Label text={label} required={required} inline />
      </div>
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  );
}