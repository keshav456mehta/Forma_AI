export default function SaveResumeLoading({ label = "Saving your draft..." }) {
  return (
    <div className="save-loading">
      <div className="save-loading__spinner" />
      <p className="save-loading__label">{label}</p>
    </div>
  );
}