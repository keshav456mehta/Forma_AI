import { useEffect, useState } from "react";
import FormRenderer from "./components/FormRenderer";
import TestExtractionPage from "./pages/TestExtractionPage";
import Sidebar from "./components/Sidebar";
import ThemeToggle from "./components/ThemeToggle";
import BackgroundFX from "./components/BackgroundFX";
import FormsList from "./components/FormsList";

const DEFAULT_FORM_ID = "6a828552980c388e1d07ee4c";

function App() {
  const showTestPage =
    import.meta.env.DEV &&
    new URLSearchParams(window.location.search).has("test");

  const [theme, setTheme] = useState(() => {
    if (typeof window === "undefined") return "light";
    return window.localStorage.getItem("forma-theme") || "light";
  });
  const [menuOpen, setMenuOpen] = useState(false);
  // "home" shows the default form directly; "forms" shows the picker list.
  const [view, setView] = useState("home");
  const [activeFormId, setActiveFormId] = useState(DEFAULT_FORM_ID);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    window.localStorage.setItem("forma-theme", theme);
  }, [theme]);

  const toggleTheme = () => setTheme((prev) => (prev === "dark" ? "light" : "dark"));

  const goHome = () => {
    setActiveFormId(DEFAULT_FORM_ID);
    setView("home");
  };

  const goToFormsList = () => setView("forms");

  const handleSelectForm = (formId) => {
    setActiveFormId(formId);
    setView("home");
  };

  return (
    <div className="relative min-h-screen text-slate-900 dark:text-slate-100">
      <BackgroundFX />

      <header className="sticky top-0 z-20 border-b border-slate-200/80 bg-white/80 backdrop-blur-md dark:border-white/10 dark:bg-[#0b0f1e]/80">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-orange-500 to-pink-500 text-lg font-black text-white shadow-lg shadow-orange-500/30">
              F
            </div>
            <div>
              <div className="text-xl font-black tracking-tight text-slate-900 dark:text-white">
                Forma AI
              </div>
              <div className="text-[10px] font-semibold uppercase tracking-[0.22em] text-slate-500 dark:text-slate-400">
                Smart form automation
              </div>
            </div>
          </div>

          <nav className="hidden items-center gap-6 text-sm font-medium text-slate-600 dark:text-slate-300 md:flex">
            <button
              type="button"
              onClick={goHome}
              className={`transition hover:text-orange-500 ${view === "home" ? "text-orange-500" : ""}`}
            >
              Home
            </button>
            <button
              type="button"
              onClick={goToFormsList}
              className={`transition hover:text-orange-500 ${view === "forms" ? "text-orange-500" : ""}`}
            >
              Forms
            </button>
          </nav>

          <div className="flex items-center gap-3">
            <ThemeToggle theme={theme} onToggle={toggleTheme} />

            <div className="relative">
              <button
                type="button"
                onClick={() => setMenuOpen((v) => !v)}
                className="flex items-center gap-1.5 rounded-full border border-slate-200 bg-white/70 py-1 pl-1 pr-2 transition hover:border-orange-300 dark:border-white/10 dark:bg-white/5"
              >
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-orange-400 to-pink-500 text-xs font-bold text-white">
                  K
                </span>
                <svg
                  viewBox="0 0 24 24"
                  className={`h-3.5 w-3.5 text-slate-500 transition-transform dark:text-slate-400 ${
                    menuOpen ? "rotate-180" : ""
                  }`}
                  fill="none"
                >
                  <path d="m6 9 6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>

              {menuOpen && (
                <div className="absolute right-0 top-11 w-40 rounded-xl border border-slate-200 bg-white py-1.5 text-sm shadow-xl dark:border-white/10 dark:bg-[#111528]">
                  <button className="block w-full px-3 py-1.5 text-left text-slate-600 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-white/5" type="button">
                    Profile
                  </button>
                  <button className="block w-full px-3 py-1.5 text-left text-slate-600 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-white/5" type="button">
                    Settings
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto flex max-w-6xl gap-10 px-4 py-10 sm:px-6 lg:px-8">
        <Sidebar />
        <div className="w-full">
          {showTestPage ? (
            <TestExtractionPage />
          ) : view === "forms" ? (
            <FormsList onSelect={handleSelectForm} />
          ) : (
            <FormRenderer formId={activeFormId} />
          )}
        </div>
      </main>

      <div className="pointer-events-none fixed bottom-5 left-5 z-20">
        <span className="pointer-events-auto inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white/80 px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.16em] text-slate-500 shadow-md backdrop-blur dark:border-white/10 dark:bg-white/5 dark:text-slate-300">
          {theme === "dark" ? "Dark • Live Motion" : "Aurora • Minimal"}
        </span>
      </div>
    </div>
  );
}

export default App;

