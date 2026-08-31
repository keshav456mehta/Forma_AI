import { useState } from 'react';
import './save-resume.css';

export default function ResumeDraftEntry({ onResume }) {
  const [code, setCode] = useState('');

  const handleSubmit = () => {
    const trimmedValue = code.trim();
    if (!trimmedValue) return;
    onResume?.(trimmedValue);
  };

  return (
    <div className="resume-entry">
      <label htmlFor="resume-code-input" className="resume-entry-label">
        Enter your resume code
      </label>
      <div className="resume-entry-row">
        <input
          id="resume-code-input"
          type="text"
          value={code}
          onChange={(event) => setCode(event.target.value)}
          placeholder="Enter your resume code"
          aria-label="Enter your resume code"
          className="resume-entry-input"
        />
        <button type="button" onClick={handleSubmit} className="resume-entry-button">
          Resume Draft
        </button>
      </div>
    </div>
  );
}