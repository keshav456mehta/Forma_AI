const { extractFromStory } = require("./extractionService");

describe("extractFromStory", () => {
  const fields = [
    { name: "incidentType", label: "Incident type", type: "text" },
    { name: "vehicle", label: "Vehicle", type: "text" },
    { name: "damage", label: "Damage", type: "text" },
  ];

  beforeEach(() => {
    delete process.env.OPENAI_API_KEY;
  });

  test("returns clean JSON using only the supplied schema field names", async () => {
    await expect(
      extractFromStory(
        "I hit a deer on I-95 yesterday in my Honda, and the windshield shattered.",
        fields
      )
    ).resolves.toEqual({
      incidentType: "collision",
      vehicle: "Honda",
      damage: "windshield shattered",
    });
  });
});
