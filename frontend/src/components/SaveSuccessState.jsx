import './save-resume.css';

export default function SaveSuccessState({ resumeCode, resumeUrl }) {
  const handleCopy = async () => {
    const value = resumeUrl || resumeCode || '';
    if (!value) return;

    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(value);
    }
  };

  return (
    <div className="save-success">
      <div className="save-success-icon" aria-hidden="true">
        ✓
      </div>
      <div className="save-success-copy">
        <p className="save-success-title">Draft saved successfully</p>
        <p className="save-success-label">Resume link</p>
        <div className="resume-link-box" role="link" aria-label="Resume draft link">
          <span className="resume-link-text">{resumeUrl || 'https://forma-ai.app/resume'}</span>
        </div>
        <p className="save-success-label">Resume code</p>
        <div className="resume-code-box">
          <span className="resume-code">{resumeCode || 'ABC123'}</span>
        </div>
        <button type="button" onClick={handleCopy} className="copy-code-button">
          Copy Code
        </button>
      </div>
    </div>
  );
}