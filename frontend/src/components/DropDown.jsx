// Dropdown.jsx
import Label from "./Label";

export default function Dropdown({ label, required, error, options = [], ...props }) {
  return (
    <div className="mb-4">
      <Label text={label} required={required} />
      <select
        className={`w-full px-3 py-2 rounded-md border text-sm bg-white
          ${error ? "border-red-500" : "border-gray-300"}
          focus:outline-none focus:ring-2 focus:ring-blue-400`}
        {...props}
      >
        <option value="">Select an option</option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  );
}