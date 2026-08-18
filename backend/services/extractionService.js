function extractFields(story) {
  if (!story || typeof story !== "string") {
    throw new Error("Story is required");
  }

  const text = story.toLowerCase();

  const fields = [];

  // Email
  if (text.includes("email")) {
    fields.push({
      name: "email",
      type: "email",
      label: "Email",
      required: true,
    });
  }

  // Password
  if (text.includes("password")) {
    fields.push({
      name: "password",
      type: "password",
      label: "Password",
      required: true,
    });
  }

  // Name
  if (text.includes("name")) {
    fields.push({
      name: "name",
      type: "text",
      label: "Name",
      required: true,
    });
  }

  // Phone number
  if (text.includes("phone")) {
    fields.push({
      name: "phone",
      type: "tel",
      label: "Phone Number",
      required: true,
    });
  }

  return {
    fields,
  };
}

module.exports = {
  extractFields,
};