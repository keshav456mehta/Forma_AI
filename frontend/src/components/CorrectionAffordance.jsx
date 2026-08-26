// src/components/CorrectionAffordance.jsx
import { useRef } from "react";
import "./CorrectionAffordance.css";

/**
 * Small inline control shown on AI-filled fields.
 * Lets the user flag the field as wrong, which focuses + clears it
 * so they can manually re-enter the correct value.
 *
 * Props:
 * - isAiFilled: boolean — whether this field was auto-filled by AI
 * - inputRef: ref to the actual input element (passed from parent field)
 * - onClear: fn() — called when user clicks "this looks wrong"
 */
export default function CorrectionAffordance({ isAiFilled, inputRef, onClear }) {
  if (!isAiFilled) return null; // don't clutter form when field is fine

  const handleClick = () => {
    if (onClear) onClear();
    if (inputRef?.current) {
      inputRef.current.value = "";
      inputRef.current.focus();
    }
  };

  return (
    <button
      type="button"
      className="correction-affordance"
      onClick={handleClick}
      aria-label="Flag this AI-filled value as incorrect and clear it"
    >
      ⚠️ This looks wrong
    </button>
  );
}