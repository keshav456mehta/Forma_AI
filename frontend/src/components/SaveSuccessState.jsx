export default function SaveSuccessState({ resumeCode }) {
  return (
    <div className="save-success">
      <p>Your progress is saved!</p>
      <p>Resume code: <strong>{resumeCode}</strong></p>
      <button onClick={() => navigator.clipboard.writeText(resumeCode)}>
        Copy Code
      </button>
    </div>
  );
}