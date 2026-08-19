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

  // ========== Basic Information form fields ==========

  // fullName — extract "My name is X" or "I'm X" or "I am X"
  const nameMatch = story.match(
    /(?:my name is|i'm|i am|owner is)\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)+?)(?:\s+and|\.|,|$)/i
  );
  if (nameMatch) extracted.fullName = nameMatch[1].trim();

  // ownerName (Vehicle Registration) — alias for fullName
  if (nameMatch) extracted.ownerName = nameMatch[1].trim();

  // country — match India, United States, United Kingdom, etc.
  if (lower.includes("india")) extracted.country = "India";
  else if (lower.includes("united states") || lower.includes("us"))
    extracted.country = "United States";
  else if (lower.includes("united kingdom") || lower.includes("uk"))
    extracted.country = "United Kingdom";

  // terms checkbox — look for "agree", "accept", "confirm"
  if (lower.match(/\b(agree|accept|confirm)\b/)) {
    extracted.terms = true;
  }

  // ========== Insurance Claim form fields ==========

  // hasInsurance — yes/no based on "have insurance" or "don't have insurance"
  if (lower.match(/\b(have|has)\s+insurance\b/)) {
    extracted.hasInsurance = "Yes";
  } else if (lower.match(/\b(don't|do not|no)\s+(have\s+)?insurance\b/)) {
    extracted.hasInsurance = "No";
  }

  // insuranceCompany — extract company name after "insurance with"
  const insuranceMatch = story.match(
    /insurance\s+with\s+([A-Z][A-Za-z\s]+?)(?:\.|,|$)/i
  );
  if (insuranceMatch) extracted.insuranceCompany = insuranceMatch[1].trim();

  // ========== Vehicle Registration form fields ==========

  // vehicleType — Car, Bike, Truck
  if (lower.match(/\b(it's a|is a|registering a)\s+car\b/))
    extracted.vehicleType = "Car";
  else if (lower.match(/\b(it's a|is a|registering a)\s+bike\b/))
    extracted.vehicleType = "Bike";
  else if (lower.match(/\b(it's a|is a|registering a)\s+truck\b/))
    extracted.vehicleType = "Truck";

  // vehicleNumber — match pattern like DL1234, MH5678
  const vehicleNumMatch = story.match(/\b([A-Z]{2}\d{4})\b/);
  if (vehicleNumMatch) extracted.vehicleNumber = vehicleNumMatch[1];

  // ========== 3-Level Branching form fields (Day 12) ==========

  // vehicleCategory — Sedan, SUV, Hatchback (only relevant when vehicleType = Car)
  if (lower.match(/\bcategory is sedan\b/))
    extracted.vehicleCategory = "Sedan";
  else if (lower.match(/\bcategory is suv\b/))
    extracted.vehicleCategory = "SUV";
  else if (lower.match(/\bcategory is hatchback\b/))
    extracted.vehicleCategory = "Hatchback";

  // vehicleModel — free text after "model is"
  const modelMatch = story.match(/model is\s+([A-Za-z\s]+?)(?:\.|,|$)/i);
  if (modelMatch) extracted.vehicleModel = modelMatch[1].trim();

  return extracted;
}

