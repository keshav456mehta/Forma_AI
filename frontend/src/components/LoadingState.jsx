import './save-resume.css';

export default function LoadingState({
  label = 'Saving your progress...',
  message = 'Please wait while we save your draft.',
}) {
  return (
    <div className="loading-state" role="status" aria-live="polite">
      <div className="spinner" aria-hidden="true" />
      <div className="loading-copy">
        <p className="loading-label">{label}</p>
        <p className="loading-message">{message}</p>
      </div>
    </div>
  );
}