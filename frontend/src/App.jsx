import FormRenderer from "./components/FormRenderer";
import TestExtractionPage from "./pages/TestExtractionPage";
import TestField from "./TestField";
import TestWarning from "./components/TestWarning";

function App() {
  const showTestPage =
    import.meta.env.DEV &&
    new URLSearchParams(window.location.search).has("test");

  return showTestPage ? <TestExtractionPage /> : <FormRenderer />;
  
    <div>
      <TestField />
      <TestWarning />
      {/* existing app content — temporarily commented out or left below */}
    </div>
}

export default App;
