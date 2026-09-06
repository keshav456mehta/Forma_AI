import Label from "./Label";

export default function TextField({
  id,
  label,
  required = false,
  error,
  placeholder,
  ...props
}) {
  return (
    <div className="mb-4">
      {label && (
        <Label htmlFor={id} required={required}>
          {label}
        </Label>
      )}

      <input
        id={id}
        type="text"
        placeholder={placeholder}
        className={`w-full rounded-xl border bg-slate-50 px-3.5 py-2.5 text-sm text-slate-800 shadow-sm transition placeholder:text-slate-400 focus:border-indigo-400 focus:bg-white focus:outline-none focus:ring-4 ${
          error
            ? "border-red-400 focus:ring-red-100"
            : "border-slate-200 focus:ring-indigo-100"
        }`}
        {...props}
      />

      {error && (
        <p className="text-sm text-red-500 mt-1">
          {error}
        </p>
      )}
    </div>
  );
}