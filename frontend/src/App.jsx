import FormRenderer from "./components/FormRenderer";
import TestExtractionPage from "./pages/TestExtractionPage";

function App() {
  const showTestPage =
    import.meta.env.DEV &&
    new URLSearchParams(window.location.search).has("test");

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_#eef2ff_0%,_#f8fafc_40%,_#eef6ff_100%)] text-slate-900">
      <header className="sticky top-0 z-20 border-b border-slate-200/80 bg-white/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-600 to-purple-600 text-lg font-black text-white shadow-lg shadow-indigo-500/30">
              F
            </div>
            <div>
              <div className="text-xl font-black tracking-tight text-slate-900">Forma AI</div>
              <div className="text-[10px] font-semibold uppercase tracking-[0.22em] text-slate-500">
                Smart form automation
              </div>
            </div>
          </div>

          <nav className="hidden items-center gap-6 text-sm font-medium text-slate-600 md:flex">
            <a href="#" className="transition hover:text-indigo-600">Home</a>
            <a href="#" className="transition hover:text-indigo-600">Forms</a>
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
        {showTestPage ? <TestExtractionPage /> : <FormRenderer />}
      </main>
    </div>
  );
}

export default App;