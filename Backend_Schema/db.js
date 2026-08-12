const mongoose = require("mongoose");
const dotenv = require("dotenv");
const { MongoMemoryServer } = require("mongodb-memory-server");

dotenv.config();

const atlasUri = process.env.MONGO_URI;
const localUri = process.env.LOCAL_MONGO_URI || "mongodb://127.0.0.1:27017/formai";
const fallbackEnabled = process.env.MONGO_FALLBACK !== "false";

let inMemoryServer = null;

const createInMemoryMongo = async () => {
  console.log("Starting in-memory MongoDB fallback...");
  inMemoryServer = await MongoMemoryServer.create();
  return inMemoryServer.getUri();
};

const connect = async (uri, label) => {
  console.log(`Connecting to ${label} MongoDB: ${uri}`);
  return mongoose.connect(uri, {
    dbName: "formai",
  });
};

const connectMongo = async () => {
  const tryInMemory = async () => {
    if (!fallbackEnabled) {
      throw new Error("Fallback is disabled");
    }

    const uri = await createInMemoryMongo();
    return connect(uri, "in-memory");
  };

  if (atlasUri) {
    try {
      return await connect(atlasUri, "Atlas");
    } catch (atlasError) {
      console.error("Atlas MongoDB connection failed:", atlasError.message);

      if (!fallbackEnabled) {
        throw atlasError;
      }

      try {
        console.log(`Attempting local MongoDB fallback: ${localUri}`);
        return await connect(localUri, "local");
      } catch (localError) {
        console.error("Local MongoDB fallback failed:", localError.message);
        localError.atlasError = atlasError;

        console.log("Attempting in-memory MongoDB fallback");
        try {
          return await tryInMemory();
        } catch (memoryError) {
          memoryError.atlasError = atlasError;
          memoryError.localError = localError;
          throw memoryError;
        }
      }
    }
  }

  console.log(`MONGO_URI not set. Using local MongoDB: ${localUri}`);
  if (!fallbackEnabled) {
    return connect(localUri, "local");
  }

  try {
    return await connect(localUri, "local");
  } catch (localError) {
    console.error("Local MongoDB failed:", localError.message);
    console.log("Attempting in-memory MongoDB fallback");
    return tryInMemory();
  }
};

const disconnectMongo = async () => {
  try {
    await mongoose.disconnect();
  } catch (disconnectError) {
    console.error("Error disconnecting mongoose:", disconnectError.message);
  }

  if (inMemoryServer) {
    try {
      await inMemoryServer.stop();
    } catch (stopError) {
      console.error("Error stopping in-memory MongoDB:", stopError.message);
    } finally {
      inMemoryServer = null;
    }
  }
};

module.exports = {
  connectMongo,
  disconnectMongo,
  atlasUri,
  localUri,
};
