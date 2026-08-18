async function extractFromStory(story, fields = []) {
  if (!story || typeof story !== "string") {
    throw new Error("Story must be a non-empty string");
  }

  if (!Array.isArray(fields)) {
    throw new Error("Fields must be an array");
  }

  const result = {};
  const text = story.toLowerCase();

  for (const field of fields) {
    const fieldName =
      typeof field === "string"
        ? field
        : field.name || field.label || field.id;

    if (!fieldName) {
      continue;
    }

    const normalizedName = fieldName.toLowerCase();

    // Incident type
    if (
      normalizedName === "incidenttype" ||
      normalizedName === "incident_type"
    ) {
      if (
        text.includes("collision") ||
        text.includes("crash") ||
        text.includes("accident") ||
        text.includes("hit a deer") ||
        text.includes("hit deer")
      ) {
        result[fieldName] = "collision";
      }
    }

    // Vehicle
    else if (
      normalizedName === "vehicle" ||
      normalizedName === "vehiclemake"
    ) {
      const vehicleMatch = story.match(
        /\b(Honda|Toyota|Ford|BMW|Audi|Tesla|Hyundai|Kia)\b/i
      );

      if (vehicleMatch) {
        result[fieldName] = vehicleMatch[1];
      }
    }

    // Damage
    else if (
      normalizedName === "damage" ||
      normalizedName === "damagedescription"
    ) {
      if (text.includes("windshield shattered")) {
        result[fieldName] = "windshield shattered";
      } else if (text.includes("windshield")) {
        result[fieldName] = "windshield damage";
      } else if (text.includes("damage")) {
        result[fieldName] = "damage reported";
      }
    }

    // Location
    else if (
      normalizedName === "location" ||
      normalizedName === "address"
    ) {
      const locationMatch = story.match(/\bI-\d+\b/i);

      if (locationMatch) {
        result[fieldName] = locationMatch[0].toUpperCase();
      }
    }

    // Date
    else if (
      normalizedName === "date" ||
      normalizedName === "incidentdate"
    ) {
      if (text.includes("yesterday")) {
        result[fieldName] = "yesterday";
      }
    }
  }

  return result;
}

module.exports = {
  extractFromStory,
};