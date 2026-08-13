export default function Checkbox({
  id,
  label,
  required = false,
  error,
  ...inputProps
}) {
  return (
    <div className="mb-4">
      <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
        <input
          id={id}
          type="checkbox"
          {...inputProps}
          className={`h-4 w-4 rounded border focus:ring-2 focus:ring-blue-400 ${
            error ? "border-red-500" : "border-gray-300"
          }`}
        />

        {label}

        {required && (
          <span className="text-red-500 ml-1">*</span>
        )}
      </label>

      {error && (
        <p className="text-red-500 text-xs mt-1 ml-6">
          {error}
        </p>
      )}
    </div>
  );
}