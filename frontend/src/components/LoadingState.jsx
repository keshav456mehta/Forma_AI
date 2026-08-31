export default function LoadingState({ label = "Saving your progress..." }) {
  return (
    <div className="loading-state">
      <div className="spinner" />
      <p>{label}</p>
    </div>
  );
}