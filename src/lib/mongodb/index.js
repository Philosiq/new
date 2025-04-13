import mongoose from "mongoose";

const MONGODB_URI =
  process.env.MONGODB_URI ||
  "mongodb://uzair:uzair123@ac-gxnmdjp-shard-00-00.cpammnv.mongodb.net:27017,ac-gxnmdjp-shard-00-01.cpammnv.mongodb.net:27017,ac-gxnmdjp-shard-00-02.cpammnv.mongodb.net:27017/Philosiq?ssl=true&replicaSet=atlas-bfokwp-shard-0&authSource=admin&retryWrites=true&w=majority&appName=API";

// Mongoose connection cache
let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function connectToDatabase() {
  if (cached.conn) {
    console.log("Using cached MongoDB connection");
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      // Add connection timeouts for more reliability
      serverSelectionTimeoutMS: 10000, // Timeout after 10s instead of 30s
      socketTimeoutMS: 45000, // Close sockets after 45s of inactivity
    };

    console.log(
      `Connecting to MongoDB at ${MONGODB_URI.split("@")[1].split("/")[0]}`
    ); // Log connection target without credentials

    cached.promise = mongoose
      .connect(MONGODB_URI, opts)
      .then((mongoose) => {
        console.log("Connected to MongoDB successfully");
        return mongoose;
      })
      .catch((err) => {
        console.error("MongoDB connection error details:", {
          name: err.name,
          message: err.message,
          code: err.code,
          codeName: err.codeName,
        });
        throw err;
      });
  }

  try {
    cached.conn = await cached.promise;

    // Log available collections
    const collections = Object.keys(mongoose.connection.collections);
    console.log("Available collections:", collections);

    return cached.conn;
  } catch (error) {
    console.error("MongoDB connection error:", error);
    // Reset the promise if connection fails, so we can try again
    cached.promise = null;
    throw error;
  }
}

export default connectToDatabase;
