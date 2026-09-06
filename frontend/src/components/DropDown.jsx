// Dropdown.jsx
import Label from "./Label";

export default function Dropdown({ id, label, required, error, options = [], ...props }) {
  return (
    <div className="mb-4">
      <Label htmlFor={id} text={label} required={required} />
      <select
        id={id}
        className={`w-full rounded-xl border bg-slate-50 px-3.5 py-2.5 text-sm text-slate-800 shadow-sm transition focus:border-indigo-400 focus:bg-white focus:outline-none focus:ring-4 ${
          error ? "border-red-400 focus:ring-red-100" : "border-slate-200 focus:ring-indigo-100"
        }`}
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
