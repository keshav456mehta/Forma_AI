import { useState } from "react";

// MagicInput — Day 9
// Accepts a plain-text "story" from the user, sends it to the
// extraction endpoint, and hands the parsed JSON back to the caller
// via onExtracted(data).  Loading / error states are self-contained
// so FormRenderer stays clean.
export default function MagicInput({ formId, onExtracted }) {
  const [story, setStory] = useState("");
  const [extracting, setExtracting] = useState(false);
  const [extractError, setExtractError] = useState(null);

  const handleExtract = async () => {
    if (!story.trim()) return;

    setExtracting(true);
    setExtractError(null);

    try {
      // Real endpoint — will be live once Vinay (Member 3) pushes Day 9.
      // Until then the backend will 404 and we fall through to the mock.
      const { default: axios } = await import("axios");
      const res = await axios.post(
        `http://localhost:5000/api/forms/${formId}/extract`,
        { story }
      );

      // Log raw response so we can confirm the request/response cycle works
      console.log("[MagicInput] extraction response:", res.data);

      onExtracted(res.data);
    } catch (err) {
      // If the real endpoint isn't live yet, fall back to a mock so
      // the frontend wiring can still be tested end-to-end.
      const status = err?.response?.status;
      if (status === 404 || status === undefined || err.code === "ERR_NETWORK") {
        console.warn(
          "[MagicInput] extraction endpoint not available — using mock response"
        );
        const mock = buildMockResponse(story);
        console.log("[MagicInput] mock extraction response:", mock);
        onExtracted(mock);
      } else {
        const message =
          err?.response?.data?.error || "Extraction failed. Please try again.";
        setExtractError(message);
      }
    } finally {
      setExtracting(false);
    }
  };

  return (
    <div className="mb-6 p-4 border border-blue-200 rounded-lg bg-blue-50">
      <label
        htmlFor="magic-input"
        className="block text-sm font-semibold text-blue-800 mb-1"
      >
        ✨ Magic Input
      </label>
      <p className="text-xs text-blue-600 mb-2">
        Describe your situation in plain English and we'll fill the form for you.
      </p>

      <textarea
        id="magic-input"
        value={story}
        onChange={(e) => setStory(e.target.value)}
        disabled={extracting}
        rows={3}
        placeholder="e.g. I was in a car accident on Monday. My Honda Civic hit a deer on Highway 9. The windshield is cracked."
        className="w-full px-3 py-2 border border-blue-300 rounded-md text-sm
          resize-none focus:outline-none focus:ring-2 focus:ring-blue-400
          disabled:opacity-60 bg-white"
      />

      {extractError && (
        <p className="text-xs text-red-500 mt-1">{extractError}</p>
      )}

      <button
        type="button"
        onClick={handleExtract}
        disabled={extracting || !story.trim()}
        className="mt-2 px-4 py-2 bg-blue-600 text-white text-sm rounded-md
          hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed
          transition-colors"
      >
        {extracting ? "Extracting…" : "Auto-fill from story"}
      </button>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Mock fallback — simulates what Vinay's endpoint will return.
// Parses the story text with simple keyword matching so the full
// frontend wiring (axios → applyExtractedData → setValue) can be
// verified before the real LangChain endpoint lands.
// Remove or gate this behind a dev flag once the real endpoint is stable.
// ---------------------------------------------------------------------------
function buildMockResponse(story) {
  const lower = story.toLowerCase();
  const extracted = {};

  // Incident type
  if (lower.includes("accident") || lower.includes("collision")) {
    extracted.incidentType = "accident";
  } else if (lower.includes("theft") || lower.includes("stolen")) {
    extracted.incidentType = "theft";
  } else if (lower.includes("flood") || lower.includes("water")) {
    extracted.incidentType = "flood";
  }

  // Vehicle make / model
  const vehicleMatch = lower.match(
    /\b(honda|toyota|ford|bmw|tesla|hyundai|maruti|suzuki|kia)\b/
  );
  if (vehicleMatch) extracted.vehicle = vehicleMatch[1];

  // Damage description (grab a short phrase around "damage" or "cracked")
  const damageMatch = story.match(
    /(?:damage[sd]?|cracked|broken|dented)[^.?,]*/i
  );
  if (damageMatch) extracted.damage = damageMatch[0].trim();

  // Date — simple ISO or "Monday / yesterday" style
  const dateMatch = story.match(/\b(\d{4}-\d{2}-\d{2})\b/);
  if (dateMatch) extracted.incidentDate = dateMatch[1];

  // Location
  const locationMatch = story.match(
    /(?:on|at|near)\s+(highway\s+\w+|road\s+\w+|\w+\s+street|\w+\s+road)/i
  );
  if (locationMatch) extracted.location = locationMatch[1].trim();

  // hasInsurance — assume true if "insurance" is mentioned
  if (lower.includes("insurance")) extracted.hasInsurance = "Yes";

  return extracted;
}
