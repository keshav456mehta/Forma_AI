// src/TestField.jsx
import { useRef } from "react";
import CorrectionAffordance from "./components/CorrectionAffordance";

export default function TestField() {
  const inputRef = useRef(null);
  return (
    <div style={{ padding: "40px" }}>
      <h3>Testing Correction Affordance</h3>
      <input ref={inputRef} defaultValue="AI-extracted value" />
      <CorrectionAffordance
        isAiFilled={true}
        inputRef={inputRef}
        onClear={() => console.log("flagged as wrong")}
      />
    </div>
  );
}