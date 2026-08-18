const test = require("node:test");
const assert = require("node:assert/strict");

process.env.MONGO_URI = "mongodb://127.0.0.1:65535/invalid";
process.env.MONGO_FALLBACK = "true";

const seedModule = require("./seed.js");

test("seedDatabase falls back to local or in-memory Mongo when Atlas is unreachable", async () => {
  await assert.doesNotReject(async () => {
    await seedModule.seedDatabase();
  });
});
