const API_URL = "http://localhost:5000/api/forms";

export const getForm = async (formId) => {
  const response = await fetch(`${API_URL}/${formId}`);

  if (!response.ok) {
    throw new Error("Unable to fetch form");
  }

  return response.json();
};