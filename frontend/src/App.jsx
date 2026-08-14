import FormRenderer from "./components/FormRenderer";

function App() {
  return (
    <div>
      <h2>Form 1</h2>
      <FormRenderer formId="PUT_FIRST_SEEDED_ID_HERE" />

      <h2>Form 2</h2>
      <FormRenderer formId="PUT_SECOND_SEEDED_ID_HERE" />

      <h2>Form 3</h2>
      <FormRenderer formId="PUT_THIRD_SEEDED_ID_HERE" />
    </div>
  );
}

export default App;