export default function ResumeLinkDisplay({ resumeCode }) {
  return (
    <div className="resume-link-box">
      <span className="resume-label">Your resume code:</span>
      <code className="resume-code">{resumeCode}</code>
      <button
        className="resume-copy-btn"
        onClick={() => navigator.clipboard.writeText(resumeCode)}
      >
        Copy
      </button>
    </div>
  );
}