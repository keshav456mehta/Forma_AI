// TextField.jsx
import Label from "./Label";

export default function TextField({ label, required, error, ...props }) {
  return (
    <div className="mb-4">
      <Label text={label} required={required} />
      <input
        className={`w-full px-3 py-2 rounded-md border text-sm
          ${error ? "border-red-500" : "border-gray-300"}
          focus:outline-none focus:ring-2 focus:ring-blue-400`}
        {...props}
      />
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  );
}