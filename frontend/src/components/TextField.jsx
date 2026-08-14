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
        className={`w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 ${
          error
            ? "border-red-500 focus:ring-red-300"
            : "border-gray-300 focus:ring-blue-300"
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