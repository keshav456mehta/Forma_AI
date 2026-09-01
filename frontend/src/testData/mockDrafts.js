import { partialDraft } from "./testData/mockDrafts";

function TestResumePage() {
  return <YourFormComponent initialValues={partialDraft} />;
}
export const emptyDraft = {};

export const partialDraft = {
  fullName: "Praveen Kumar",
  email: "praveen@example.com",
  // only a few fields filled
};

export const nearCompleteDraft = {
  fullName: "Praveen Kumar",
  email: "praveen@example.com",
  phone: "9876543210",
  address: "123 Main St",
  city: "Bengaluru",
  // most fields filled, one or two missing
};