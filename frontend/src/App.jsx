import MagicInput from "./components/MagicInput";

function App() {
  return (
    <div>
      <MagicInput
        onSubmit={(story) => console.log("Story submitted:", story)}
      />
    </div>
  );
}

export default App;