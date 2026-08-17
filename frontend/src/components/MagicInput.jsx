import { useState } from "react";
import "./MagicInput.css";

export default function MagicInput({ onSubmit }) {
  const [story, setStory] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    setIsLoading(true);

    try {
      await onSubmit?.(story);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="magic-input">
      {isLoading ? (
        <div className="magic-input__skeleton" aria-busy="true">
          <div className="skeleton-line skeleton-line--wide" />
          <div className="skeleton-line skeleton-line--medium" />
          <div className="skeleton-line skeleton-line--short" />
        </div>
      ) : (
        <textarea
          className="magic-input__textarea"
          placeholder="e.g. My name is Priya, I'm 24, and I live in Bangalore..."
          value={story}
          onChange={(e) => setStory(e.target.value)}
          disabled={isLoading}
        />
      )}

      <button
        className="magic-input__submit"
        onClick={handleSubmit}
        disabled={isLoading || !story.trim()}
      >
        {isLoading ? "Processing..." : "Submit"}
      </button>
    </div>
  );
}