export default function EmptyState({
  message = "This form has no fields yet.",
}) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-14 px-4 border border-dashed border-indigo-200 rounded-2xl bg-gradient-to-br from-indigo-50/60 via-white to-white">
      <div className="h-11 w-11 rounded-full bg-indigo-100 flex items-center justify-center mb-3 shadow-sm">
        <span className="text-indigo-500 text-lg font-semibold">!</span>
      </div>
      <p className="text-sm font-semibold text-slate-700">{message}</p>
      <p className="text-xs text-slate-400 mt-1">
        Add a field to this form to see it here.
      </p>
    </div>
  );
}