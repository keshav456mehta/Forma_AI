export default function SaveDraftButton({ status = "idle", onSave }) {
  // status can be: "idle" | "saving" | "success" | "error"
  return (
    <div className="save-draft-wrapper">
      <button
        type="button"
        onClick={onSave}
        disabled={status === "saving"}
        className={`save-draft-btn save-draft-btn--${status}`}
      >
        {status === "saving" ? "Saving..." : "Save Draft"}
      </button>
      {status === "success" && <span className="save-msg success">Draft saved!</span>}
      {status === "error" && <span className="save-msg error">Couldn't save — try again</span>}
    </div>
  );
}
