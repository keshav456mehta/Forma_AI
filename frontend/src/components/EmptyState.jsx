export default function EmptyState({
  message = "This form has no fields yet.",
}) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-12 px-4 border border-dashed border-gray-300 rounded-lg">
      <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center mb-3">
        <span className="text-gray-400 text-lg">!</span>
      </div>
      <p className="text-sm font-medium text-gray-600">{message}</p>
      <p className="text-xs text-gray-400 mt-1">
        Add a field to this form to see it here.
      </p>
    </div>
  );
}