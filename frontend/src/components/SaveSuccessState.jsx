export default function SaveSuccessState({ resumeCode, onCopy = () => {} }) {
  return (
    <section className="save-success" role="status">
      <p className="save-success-title">Draft saved successfully</p>
      <code className="resume-code">{resumeCode}</code>
      <button type="button" className="copy-code-button" onClick={() => onCopy(resumeCode)}>
        Copy code
      </button>
    </section>
  );
}
