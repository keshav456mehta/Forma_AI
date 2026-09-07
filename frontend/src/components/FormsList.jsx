import { useEffect, useState } from "react";
import { getForms } from "../api/formApi";

export default function FormsList({ onSelect }) {
  const [forms, setForms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    getForms()
      .then((data) => {
        if (!cancelled) setForms(Array.isArray(data) ? data : []);
      })
      .catch(() => {
        if (!cancelled) setError("Unable to load forms right now.");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  if (loading) {
    return <p className="text-slate-600 dark:text-slate-400">Loading forms…</p>;
  }

  if (error) {
    return <p className="text-red-500 dark:text-red-400">{error}</p>;
  }

  if (forms.length === 0) {
    return <p className="text-slate-600 dark:text-slate-400">No forms available yet.</p>;
  }

  return (
    <div className="mx-auto w-full max-w-2xl">
      <h2 className="mb-6 text-3xl font-black tracking-tight text-slate-900 dark:text-white">
        Choose a form
      </h2>
      <div className="grid gap-4 sm:grid-cols-2">
        {forms.map((form) => (
          <button
            key={form._id}
            type="button"
            onClick={() => onSelect(form._id)}
            className="flex flex-col items-start gap-1 rounded-2xl border border-slate-200 bg-white/90 p-5 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-orange-300 hover:shadow-lg dark:border-white/10 dark:bg-[#0f1324]/90 dark:hover:border-orange-400/40"
          >
            <span className="text-base font-bold text-slate-900 dark:text-white">
              {form.title}
            </span>
            {form.description && (
              <span className="text-sm text-slate-500 dark:text-slate-400">
                {form.description}
              </span>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
