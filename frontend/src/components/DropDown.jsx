export default function Dropdown({
  label,
  required = false,
  options = [],
  value,
  onChange,
  error,
}) {
  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>

      <select
        value={value}
        onChange={onChange}
        className={`w-full px-3 py-2 rounded-md border text-sm bg-white
          focus:outline-none focus:ring-2 focus:ring-blue-400
          ${error ? "border-red-500" : "border-gray-300"}`}
      >
        <option value="">Select an option</option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>

      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  );
}