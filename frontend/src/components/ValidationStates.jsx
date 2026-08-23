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
export function AIMissedField({ label, children }) {
  return (
    <div className="field-wrapper ai-missed">
      <label>{label}</label>
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
      <label>{label}</label>
      {children}
      <div className="field-message review-message">
        <span aria-hidden="true">⚠️</span>
        <span>Please double-check this value</span>
      </div>
    </div>
  );
}