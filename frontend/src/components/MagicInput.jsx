import { useState } from "react";
import axios from "axios";

export default function MagicInput({ formId, onExtracted }) {
  const [story, setStory] = useState("");
  const [extracting, setExtracting] = useState(false);
  const [extractError, setExtractError] = useState("");

  const handleExtract = async () => {
    if (!story.trim()) return;

    setExtracting(true);
    setExtractError("");
    try {
      const response = await axios.post(
        `http://localhost:5000/api/forms/${formId}/extract`,
        { story }
      );
      onExtracted?.(response.data);
    } catch (error) {
      setExtractError(
        error.response?.data?.error ||
          "Extraction service unavailable, please try again"
      );
    } finally {
      setExtracting(false);
    }
  };

  return (
    <div className="mb-6 p-4 border border-blue-200 rounded-lg bg-blue-50">
      <label htmlFor="magic-input" className="block text-sm font-semibold text-blue-800 mb-1">
        Magic Input
      </label>
      <textarea
        id="magic-input"
        value={story}
        onChange={(event) => setStory(event.target.value)}
        disabled={extracting}
        rows={3}
        placeholder="Describe your incident and we’ll fill the form for you."
        className="w-full px-3 py-2 border border-blue-300 rounded-md text-sm resize-none"
      />
      {extractError && <p role="alert" className="text-xs text-red-600 mt-1">{extractError}</p>}
      <button
        type="button"
        onClick={handleExtract}
        disabled={extracting || !story.trim()}
        className="mt-2 px-4 py-2 bg-blue-600 text-white text-sm rounded-md disabled:opacity-50"
      >
        {extracting ? "Extracting…" : "Auto-fill from story"}
      </button>
    </div>
  );
}
