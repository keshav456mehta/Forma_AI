const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config();

const atlasUri = process.env.MONGO_URI;
const localUri = process.env.LOCAL_MONGO_URI || "mongodb://127.0.0.1:27017/formai";
const fallbackEnabled = process.env.MONGO_FALLBACK !== "false";

const connectMongo = async () => {
  const connect = async (uri, label) => {
    console.log(`Connecting to ${label} MongoDB: ${uri}`);
    return mongoose.connect(uri, {
      dbName: "formai",
    });
  };

  if (atlasUri) {
    try {
      return await connect(atlasUri, "Atlas");
    } catch (atlasError) {
      console.error("Atlas MongoDB connection failed:", atlasError.message);

      if (!fallbackEnabled) {
        throw atlasError;
      }

      console.log(`Attempting local MongoDB fallback: ${localUri}`);
      try {
        return await connect(localUri, "local");
      } catch (localError) {
        console.error("Local MongoDB fallback failed:", localError.message);
        localError.atlasError = atlasError;
        throw localError;
      }
    }
  }

  console.log(`MONGO_URI not set. Using local MongoDB: ${localUri}`);
  return await connect(localUri, "local");
};

module.exports = {
  connectMongo,
  atlasUri,
  localUri,
};
