export default function Label({ htmlFor, children, text, required, inline }) {
  const base = inline
    ? "text-sm font-medium text-gray-700"
    : "block text-sm font-medium text-gray-700 mb-1";
  return (
    <label htmlFor={htmlFor} className={base}>
      {text ?? children}
      {required && <span className="text-red-500 ml-1">*</span>}
    </label>
  );
}