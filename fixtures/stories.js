const stories = [
  {
    id: "story-1",
    title: "Simple login form",
    text: "As a user, I want to log in using my email and password so that I can access my account.",
    complexity: "simple",
    completeness: "complete",
  },

  {
    id: "story-2",
    title: "User registration",
    text: "As a new user, I want to create an account using my name, email, password, and phone number so that I can use the application.",
    complexity: "medium",
    completeness: "complete",
  },

  {
    id: "story-3",
    title: "Incident reporting form",
    text: "As a citizen, I want to report an incident by providing the incident type, date, location, description, and supporting evidence so that the authorities can review it.",
    complexity: "complex",
    completeness: "complete",
  },

  {
    id: "story-4",
    title: "Insurance details",
    text: "As a user submitting a claim, I want to provide insurance information when I have insurance so that my claim contains the required details.",
    complexity: "complex",
    completeness: "partial",
  },

  {
    id: "story-5",
    title: "Contact support",
    text: "I want to contact support about my problem.",
    complexity: "simple",
    completeness: "incomplete",
  },

  {
    id: "story-6",
    title: "Application request",
    text: "As a user, I want to submit an application with the necessary information so that it can be processed.",
    complexity: "medium",
    completeness: "ambiguous",
  },
];

module.exports = stories;