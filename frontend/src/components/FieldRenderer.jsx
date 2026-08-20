// FieldRenderer.jsx
function FieldRenderer({ field, value, extractionStatus, onChange }) {
  // extractionStatus: 'missed' | 'uncertain' | 'confident'
  const isFlagged = extractionStatus === 'missed' || extractionStatus === 'uncertain';
  const stillEmpty = !value || value.trim() === '';

  return (
    <div className="field-wrapper">
      <label htmlFor={field.id}>{field.label}</label>
      <input
        id={field.id}
        value={value}
        onChange={(e) => onChange(field.id, e.target.value)}
        className={`field-input ${isFlagged && stillEmpty ? 'field-flagged' : ''} ${
          extractionStatus === 'uncertain' ? 'field-uncertain' : ''
        }`}
      />
      {isFlagged && stillEmpty && (
        <span className="field-flag-hint">
          {extractionStatus === 'missed' ? 'Please fill this in' : 'AI wasn't sure — please check'}
        </span>
      )}
    </div>
  );
}