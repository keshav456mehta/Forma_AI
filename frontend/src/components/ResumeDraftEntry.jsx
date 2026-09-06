import { useState } from "react";

export default function ResumeDraftEntry({ onResume }) {
  const [code, setCode] = useState("");

  const handleSubmit = () => {
    if (code.trim()) onResume(code.trim());
  };

  return (
    <div className="resume-entry">
      <p className="resume-entry__title">Resume a saved draft</p>
      <input
        type="text"
        value={code}
        onChange={(e) => setCode(e.target.value)}
        placeholder="Enter your resume code"
        className="resume-entry__input"
      />
      <button onClick={handleSubmit} className="resume-entry__btn">
        Resume Draft
      </button>
    </div>
  );
}
