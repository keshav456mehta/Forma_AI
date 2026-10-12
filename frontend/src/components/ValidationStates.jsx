// ValidationStates.jsx
// Day 15 — Validation UI design draft
// Two distinct states for AI-processed form fields:
//   1. ai-missed    → AI could not extract a value at all
//   2. needs-review → AI extracted a value, but it may be wrong
// Accessibility note: each state uses a label AND an icon, not just color,
// so colorblind users can still tell the states apart.
// Design shared with Member 1 for review before build.

import React from "react";
import "./ValidationStates.css";

// State 1: AI Missed This Field
// Integration note (Day 17): `label` is optional — when wrapping Week 1 field
// components (TextField/Dropdown) those already render their own accessible
// <label htmlFor>, so passing none avoids a duplicate visible label.
export function AIMissedField({ label, children }) {
  return (
    <div className="field-wrapper ai-missed">
      {label && <label>{label}</label>}
      {children}
      <div className="field-message missed-message">
        <span aria-hidden="true">❓</span>
        <span>AI couldn't find this — please fill it in</span>
      </div>
    </div>
  );
}

// State 2: Needs Review (AI extracted something, but check it)
export function NeedsReviewField({ label, children }) {
  return (
    <div className="field-wrapper needs-review">
      {label && <label>{label}</label>}
      {children}
      <div className="field-message review-message">
        <span aria-hidden="true">⚠️</span>
        <span>Please double-check this value</span>
      </div>
    </div>
  );
}

// Stable wrapper: always renders the outer container to reserve layout
// space and avoid layout shifts when a state toggles on resume.
export function FieldWrapper({ status = "none", children, fieldId, onStartCorrection }) {
  const className = `field-wrapper ${
    status === "missed" ? "ai-missed" : status === "review" ? "needs-review" : ""
  }`;

  return (
    <div className={className} data-field-id={fieldId}>
      {children}
      {status === "missed" && (
        <div className="field-message missed-message">
          <span aria-hidden="true">❓</span>
          <span>AI couldn't find this — please fill it in</span>
        </div>
      )}
      {status === "review" && (
        <div className="field-message review-message">
          <span aria-hidden="true">⚠️</span>
          <span>Please double-check this value</span>
          {onStartCorrection && (
            <button
              type="button"
              onClick={onStartCorrection}
              className="mt-1 text-xs font-medium text-yellow-800 underline hover:no-underline bg-transparent border-0 cursor-pointer"
            >
              Not right? Fix it
            </button>
          )}
        </div>
      )}
    </div>
  );
}
