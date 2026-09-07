const API_URL = "http://localhost:5000/api/forms";

export const getForms = async () => {
  const response = await fetch(`${API_URL}`);

  if (!response.ok) {
    throw new Error("Unable to fetch forms");
  }

  return response.json();
};

export const getForm = async (formId) => {
  const response = await fetch(`${API_URL}/${formId}`);

  if (!response.ok) {
    throw new Error("Unable to fetch form");
  }

  return response.json();
};