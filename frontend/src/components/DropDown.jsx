// Dropdown.jsx
import Label from "./Label";

export default function Dropdown({ id, label, required, error, options = [], ...props }) {
  return (
    <div className="mb-4">
      <Label htmlFor={id} text={label} required={required} />
      <select
        id={id}
        className={`w-full rounded-xl border bg-slate-50 px-3.5 py-2.5 text-sm text-slate-800 shadow-sm transition focus:border-indigo-400 focus:bg-white focus:outline-none focus:ring-4 dark:bg-white/5 dark:text-slate-100 ${
          error
            ? "border-red-400 focus:ring-red-100 dark:border-red-400/60 dark:focus:ring-red-500/10"
            : "border-slate-200 focus:ring-indigo-100 dark:border-white/10 dark:focus:border-indigo-400/60 dark:focus:ring-indigo-500/10"
        }`}
        {...props}
      >
        <option value="" className="dark:bg-[#111528]">Select an option</option>
        {options.map((option) => {
          const value = typeof option === "string" ? option : option.value;
          const optionLabel = typeof option === "string" ? option : option.label;
          return (
          <option key={value} value={value} className="dark:bg-[#111528]">
            {optionLabel}
          </option>
          );
        })}
      </select>
      {error && <p className="mt-1 text-xs text-red-500 dark:text-red-400">{error}</p>}
    </div>
  );
}
