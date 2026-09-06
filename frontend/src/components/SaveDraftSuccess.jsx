import { useState } from "react";

export default function SaveDraftSuccess({ resumeCode }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(resumeCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (

    <div className="save-success">
      <div className="save-success save-success--animate"></div>
      <p className="save-success__title">Draft saved!</p>
      <p className="save-success__subtitle">
        Use this code to resume later:
      </p>
      <div className="save-success__code-row">
        <code className="save-success__code">{resumeCode}</code>
        <button onClick={handleCopy} className="save-success__copy-btn">
          {copied ? "Copied!" : "Copy"}
        </button>
      </div>
    </div>
  );
}