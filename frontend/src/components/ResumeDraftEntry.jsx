import { useState } from "react";

export default function ResumeDraftEntry({ onResume }) {
  const [code, setCode] = useState("");

  return (
    <div className="resume-entry">
      <label>Enter your resume code</label>
      <input value={code} onChange={(e) => setCode(e.target.value)} />
      <button onClick={() => onResume(code)}>Resume Draft</button>
    </div>
  );
}