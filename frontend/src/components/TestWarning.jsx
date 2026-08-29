// src/TestWarning.jsx
import SubmitBlockedWarning from "./SubmitBlockedWarning";
export default function TestWarning() {
  return (
    <div style={{ padding: "40px" }}>
      <h3>Testing Submit-Blocked Warning</h3>
      <SubmitBlockedWarning
        visible={true}
        missingFields={["Date of Birth", "Employer Name", "Annual Income"]}
      />
    </div>
  );
}