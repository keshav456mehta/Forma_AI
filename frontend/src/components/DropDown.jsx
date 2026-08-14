// Dropdown.jsx
import Label from "./Label";

export default function Dropdown({ id, label, required, error, options = [], ...props }) {
  return (
    <div className="mb-4">
      <Label htmlFor={id} text={label} required={required} />
      <select
        id={id}
        className={`w-full px-3 py-2 rounded-md border text-sm bg-white
          ${error ? "border-red-500" : "border-gray-300"}
          focus:outline-none focus:ring-2 focus:ring-blue-400`}
        {...props}
      >
        <option value="">Select an option</option>
        {options.map((option) => {
          const value = typeof option === "string" ? option : option.value;
          const optionLabel = typeof option === "string" ? option : option.label;
          return (
          <option key={value} value={value}>
            {optionLabel}
          </option>
          );
        })}
      </select>
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  );
}
