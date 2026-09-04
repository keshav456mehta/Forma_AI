import FormRenderer from "./components/FormRenderer";
import TestExtractionPage from "./pages/TestExtractionPage";
<<<<<<< HEAD
=======

>>>>>>> origin/main
function App() {
  const showTestPage =
    import.meta.env.DEV &&
    new URLSearchParams(window.location.search).has("test");

  return showTestPage ? <TestExtractionPage /> : <FormRenderer />;
}

export default App;