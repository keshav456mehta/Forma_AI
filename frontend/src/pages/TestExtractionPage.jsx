import { useState } from "react";
import FormRenderer from "../components/FormRenderer";
import { sampleStories } from "../fixtures/stories";

// Day 10: Manual test page for extraction flow
// Lets you pick a sample story, paste it into Magic Input, and verify
// the extracted fields match what we expect.
export default function TestExtractionPage() {
  const [selectedFormId, setSelectedFormId] = useState(null);
  const [selectedStory, setSelectedStory] = useState(null);

  // Form IDs from the backend seed output
  const formOptions = [
    { id: "6a828552980c388e1d07ee4c", title: "Basic Information" },
    { id: "6a828552980c388e1d07ee4d", title: "Insurance Claim" },
    { id: "6a828552980c388e1d07ee4e", title: "Vehicle Registration" },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold mb-2">Day 10: Extraction Test</h1>
        <p className="text-gray-600 mb-6">
          Pick a form, select a sample story, paste it into Magic Input, and
          verify the fields auto-populate correctly.
        </p>

        {/* Form selector */}
        <div className="mb-6 p-4 bg-white rounded-lg shadow">
          <label className="block text-sm font-semibold mb-2">
            1. Select a form to test:
          </label>
          <div className="space-y-2">
            {formOptions.map((form) => (
              <button
                key={form.id}
                onClick={() => {
                  setSelectedFormId(form.id);
                  setSelectedStory(null);
                }}
                className={`w-full text-left px-4 py-2 rounded border transition-colors ${
                  selectedFormId === form.id
                    ? "bg-blue-100 border-blue-500"
                    : "bg-gray-50 border-gray-300 hover:bg-gray-100"
                }`}
              >
                {form.title}
              </button>
            ))}
          </div>
        </div>

        {/* Story selector */}
        {selectedFormId && (
          <div className="mb-6 p-4 bg-white rounded-lg shadow">
            <label className="block text-sm font-semibold mb-2">
              2. Select a sample story to test:
            </label>
            <div className="space-y-2">
              {sampleStories.map((sample, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedStory(sample)}
                  className={`w-full text-left px-4 py-2 rounded border transition-colors ${
                    selectedStory === sample
                      ? "bg-green-100 border-green-500"
                      : "bg-gray-50 border-gray-300 hover:bg-gray-100"
                  }`}
                >
                  <div className="font-medium">{sample.name}</div>
                  <div className="text-xs text-gray-600 mt-1">
                    {sample.story}
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Expected extraction preview */}
        {selectedStory && (
          <div className="mb-6 p-4 bg-yellow-50 rounded-lg border border-yellow-300">
            <h3 className="text-sm font-semibold mb-2">Expected extraction:</h3>
            <pre className="text-xs bg-white p-3 rounded border overflow-x-auto">
              {JSON.stringify(selectedStory.expectedFields, null, 2)}
            </pre>
            <p className="text-xs text-gray-600 mt-2">
              👆 After pasting the story into Magic Input below, verify these
              fields get auto-filled correctly.
            </p>
          </div>
        )}

        {/* Form renderer */}
        {selectedFormId && (
          <div className="bg-white rounded-lg shadow p-6">
            <FormRenderer formId={selectedFormId} />
          </div>
        )}

        {!selectedFormId && (
          <div className="text-center text-gray-400 py-12">
            Select a form above to start testing
          </div>
        )}
      </div>
    </div>
  );
}
