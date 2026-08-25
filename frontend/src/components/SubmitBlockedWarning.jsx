// src/components/SubmitBlockedWarning.jsx
import "./SubmitBlockedWarning.css";

/**
 * Warning banner shown when submission is blocked because
 * one or more required AI-missed fields are still empty.
 *
 * Props:
 * - missingFields: string[] — labels of fields still needing attention
 * - visible: boolean — whether to show the warning
 */
export default function SubmitBlockedWarning({ missingFields = [], visible }) {
  if (!visible || missingFields.length === 0) return null;

  return (
    <div className="submit-blocked-warning" role="alert">
      <div className="submit-blocked-warning__header">
        <span className="submit-blocked-warning__icon" aria-hidden="true">⚠️</span>
        <span>Please review the following before submitting:</span>
      </div>
      <ul className="submit-blocked-warning__list">
        {missingFields.map((field) => (
          <li key={field}>{field}</li>
        ))}
      </ul>
    </div>
  );
}