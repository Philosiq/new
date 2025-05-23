import connectToDatabase from "../../../lib/mongodb";
import mongoose from "mongoose";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res
      .status(405)
      .json({ success: false, message: "Method not allowed" });
  }

  try {
    // Connect to the database
    await connectToDatabase();
    const mindmapCollection = mongoose.connection.db.collection("mindmapData");

    // Get the data from the request body
    const {
      education,
      gender,
      race,
      zipCode,
      age,
      votingTendency,
      archetype,
      axisScores,
      location,
    } = req.body;

    // Validate required fields
    if (
      !education ||
      !gender ||
      !race ||
      !zipCode ||
      !age ||
      !votingTendency ||
      !archetype
    ) {
      return res.status(400).json({
        success: false,
        message: "Required fields are missing",
      });
    }

    // Extract location details for filtering
    const city = location?.city || "Unknown";
    const state = location?.state || "Unknown";
    const country = location?.country || "Unknown";
    const countryCode = location?.country_code || "";
    const stateCode = location?.state_code || "";

    // Create document to store
    const mindmapEntry = {
      demographics: {
        education,
        gender,
        race,
        zipCode,
        age,
        votingTendency,
        // Add location details for filtering
        city,
        state,
        country,
        countryCode,
        stateCode,
        // Store the full location object for reference
        location,
      },
      archetype,
      axisScores: axisScores || {},
      createdAt: new Date(),
    };

    // Insert into database
    const result = await mindmapCollection.insertOne(mindmapEntry);

    if (result.acknowledged) {
      return res.status(201).json({
        success: true,
        message: "Contribution added successfully",
      });
    } else {
      throw new Error("Failed to add contribution");
    }
  } catch (error) {
    console.error("Error adding mindmap contribution:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to add contribution",
    });
  }
}
