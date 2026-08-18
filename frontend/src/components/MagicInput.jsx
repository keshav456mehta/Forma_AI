import { useState, useEffect } from 'react';

const PLACEHOLDER_EXAMPLES = [
  "e.g. I'm a 28-year-old freelance designer looking for health insurance...",
  "e.g. My name is Priya, I run a small bakery and need a business loan...",
  "e.g. I'm applying on behalf of my father who is 65 and retired..."
];

function MagicInput({ onSubmit, isLoading }) {
  const [text, setText] = useState('');
  const [placeholderIndex, setPlaceholderIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setPlaceholderIndex((prev) => (prev + 1) % PLACEHOLDER_EXAMPLES.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const handleClear = () => setText('');

  return (
    <div className="magic-input-wrapper">
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder={PLACEHOLDER_EXAMPLES[placeholderIndex]}
        disabled={isLoading}
        className="magic-input-textarea"
      />
      <div className="magic-input-footer">
        <span className="char-count">{text.length} characters</span>
        {text.length > 0 && (
          <button type="button" onClick={handleClear} className="clear-btn">
            Clear
          </button>
        )}
        <button
          type="button"
          onClick={() => onSubmit(text)}
          disabled={isLoading || text.length === 0}
        >
          {isLoading ? 'Processing...' : 'Submit'}
        </button>
      </div>
    </div>
  );
}

export default MagicInput;