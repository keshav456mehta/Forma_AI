export default function ThemeToggle({ theme, onToggle }) {
  const isDark = theme === "dark";

  return (
    <button
      type="button"
      onClick={onToggle}
      aria-label="Toggle color theme"
      aria-pressed={isDark}
      className="relative flex h-9 w-16 items-center rounded-full border border-slate-200 bg-slate-100 px-1 transition-colors dark:border-white/10 dark:bg-white/10"
    >
      <span className="flex w-full items-center justify-between px-1 text-[13px]">
        <span aria-hidden="true">☀️</span>
        <span aria-hidden="true">🌙</span>
      </span>
      <span
        className={`absolute top-1 h-7 w-7 rounded-full bg-white shadow-md shadow-black/10 transition-transform duration-300 dark:bg-slate-900 ${
          isDark ? "translate-x-7" : "translate-x-0"
        }`}
      />
    </button>
  );
}
