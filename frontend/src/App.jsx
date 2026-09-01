import FormRenderer from "./components/FormRenderer";
import TestExtractionPage from "./pages/TestExtractionPage";
import SaveDraftSuccess from "./components/SaveDraftSuccess";
import ResumeDraftEntry from "./components/ResumeDraftEntry";
import SaveResumeLoading from "./components/SaveResumeLoading";

function App() {
  const showTestPage =
    import.meta.env.DEV &&
    new URLSearchParams(window.location.search).has("test");

  return showTestPage ? <TestExtractionPage /> : <FormRenderer />;
}

export default App;