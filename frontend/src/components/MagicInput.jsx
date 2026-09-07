import { useState } from "react";
import axios from "axios";

// Day 16: the live extraction service is the ONLY default path.
// The Week 2 keyword-based mock parser is retired from the primary flow and
// exists solely as an explicit dev fallback, enabled by adding ?mock=1 to the
// URL (e.g. http://localhost:5173/?mock=1). When active it shows a visible
// MOCK badge so nobody mistakes mock results for real extraction output.
const isMockMode = () =>
  typeof window !== "undefined" &&
  new URLSearchParams(window.location.search).get("mock") === "1";

export default function MagicInput({ formId, onExtracted }) {
  const [story, setStory] = useState("");
  const [extracting, setExtracting] = useState(false);
  const [extractError, setExtractError] = useState("");
  const [mockMode] = useState(isMockMode);

  const handleExtract = async () => {
    if (!story.trim()) return;

    setExtracting(true);
    setExtractError("");

    // Explicit dev-only mock path (?mock=1): parse locally, no API call.
    if (mockMode) {
      try {
        onExtracted?.(buildMockExtraction(story));
      } finally {
        setExtracting(false);
      }
      return;
    }

    try {
      const response = await axios.post(
        `http://localhost:5000/api/forms/${formId}/extract`,
        { story }
      );
      onExtracted?.(response.data);
    } catch (error) {
      // Graceful degradation, never silent: surface WHY it failed using the
      // backend's standardized { error } shape, with kind-specific fallbacks
      // for cases where the shape isn't present (network drop, timeout).
      setExtractError(friendlyError(error));
    } finally {
      setExtracting(false);
    }
  };

  return (
    <div className="mb-6 rounded-2xl border border-orange-100 bg-gradient-to-br from-orange-50 via-white to-amber-50 p-4 shadow-sm dark:border-orange-500/15 dark:bg-none dark:bg-white/[0.03]">
      <div className="mb-3 flex items-center justify-between gap-2">
        <label htmlFor="magic-input" className="flex items-center gap-1.5 text-sm font-semibold text-orange-700 dark:text-orange-300">
          <span aria-hidden="true">✨</span> Magic Input
        </label>
        {mockMode && (
          <span
            role="note"
            aria-label="mock mode"
            className="rounded-full border border-amber-300 bg-amber-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.12em] text-amber-800 dark:border-amber-400/30 dark:bg-amber-400/10 dark:text-amber-300"
          >
            Mock
          </span>
        )}
      </div>
      <textarea
        id="magic-input"
        value={story}
        onChange={(event) => setStory(event.target.value)}
        disabled={extracting}
        rows={3}
        placeholder="Describe your incident and we’ll fill the form for you."
        className="w-full resize-none rounded-xl border border-orange-200 bg-white px-3 py-3 text-sm text-slate-700 shadow-inner shadow-orange-100/50 outline-none transition focus:border-orange-400 focus:ring-4 focus:ring-orange-100 dark:border-white/10 dark:bg-white/5 dark:text-slate-100 dark:shadow-none dark:placeholder:text-slate-500 dark:focus:border-orange-400/60 dark:focus:ring-orange-500/10"
      />
      {extractError && <p role="alert" className="mt-2 text-xs text-red-600 dark:text-red-400">{extractError}</p>}
      <button
        type="button"
        onClick={handleExtract}
        disabled={extracting || !story.trim()}
        className="mt-3 inline-flex items-center justify-center gap-1.5 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-orange-500/25 transition hover:translate-y-[-1px] hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-60"
      >
        <span aria-hidden="true">✨</span>
        {extracting ? "Extracting…" : "Auto-fill from story"}
      </button>
    </div>
  );
}

// Map failures to clear, actionable messages. The backend's standardized
// error shape ({ error }) always wins; these fallbacks cover responses that
// never made it back (network down, request cancelled, timeout).
function friendlyError(error) {
  const kind = error?.response?.data?.kind;
  if (kind === "rate_limit") {
    return "The AI service is rate-limited right now — wait a moment and try again.";
  }
  if (kind === "timeout") {
    return "The AI service took too long to respond — please try again.";
  }
  if (kind === "unavailable") {
    return "The AI service is temporarily unavailable — please try again.";
  }

  const serverMessage = error?.response?.data?.error;
  if (serverMessage) return serverMessage;

  if (!error.response) {
    return "Can't reach the server — check that the backend is running, then try again.";
  }
  const status = error.response.status;
  if (status === 429) return "The AI service is rate-limited right now — wait a moment and try again.";
  if (status === 503 || status >= 500) return "The AI service is temporarily unavailable — please try again.";
  return "Extraction failed — please try again.";
}

// ---------------------------------------------------------------------------
// DEV-ONLY mock extraction (?mock=1). Keyword matching only — good enough to
// exercise the wiring without burning API credits. Never used by default.
// ---------------------------------------------------------------------------
export function buildMockExtraction(story) {
  const extracted = {};
  const lower = story.toLowerCase();

  // Names — "My name is X", "I'm X", "Owner is X" (stops at and/./,)
  const nameMatch = story.match(
  /(?:my name is|i'm|i am|owner is)\s+([A-Za-z]+(?:\s+[A-Za-z]+)+?)(?:\s+and|\s+from|\.|,|$)/i
);
  if (nameMatch) {
    extracted.fullName = nameMatch[1].trim();
    extracted.ownerName = nameMatch[1].trim();
  }

  // Country
  if (lower.includes("united kingdom")) extracted.country = "United Kingdom";
  else if (lower.includes("united states")) extracted.country = "United States";
  else if (lower.includes("india")) extracted.country = "India";

  // Insurance
  if (/\b(have|has)\s+insurance\b/.test(lower)) extracted.hasInsurance = "Yes";
  else if (/\b(don't|do not)\s+(have\s+)?insurance\b/.test(lower)) extracted.hasInsurance = "No";
  const insuranceCompany = story.match(/insurance\s+with\s+([A-Z][A-Za-z\s]+?)(?:\.|,|$)/i);
  if (insuranceCompany) extracted.insuranceCompany = insuranceCompany[1].trim();

  // Vehicle type / number / category / model
  if (/\b(it's a|is a|registering a)\s+car\b/.test(lower)) extracted.vehicleType = "Car";
  else if (/\b(it's a|is a|registering a)\s+bike\b/.test(lower)) extracted.vehicleType = "Bike";
  else if (/\b(it's a|is a|registering a)\s+truck\b/.test(lower)) extracted.vehicleType = "Truck";
  const vehicleNumber = story.match(/\b([A-Z]{2}\d{4})\b/);
  if (vehicleNumber) extracted.vehicleNumber = vehicleNumber[1];
  if (/\bcategory is sedan\b/.test(lower)) extracted.vehicleCategory = "Sedan";
  else if (/\bcategory is suv\b/.test(lower)) extracted.vehicleCategory = "SUV";
  else if (/\bcategory is hatchback\b/.test(lower)) extracted.vehicleCategory = "Hatchback";
  const model = story.match(/model is\s+([A-Za-z\s]+?)(?:\.|,|$)/i);
  if (model) extracted.vehicleModel = model[1].trim();

  // Confirmation checkbox
  if (/\b(agree|accept|confirm)\b/.test(lower)) extracted.terms = true;

  return extracted;
}
