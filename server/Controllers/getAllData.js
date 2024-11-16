import getData from "../utils/getData.js";

export const getAllData = async (req, res) => {
  try {
    // Coordinates should be passed in the request body
    const { coordinates } = req.body;

    // Ensure coordinates are provided and valid
    if (!coordinates || !Array.isArray(coordinates)) {
      return res.status(400).json({
        success: false,
        message: "Invalid coordinates format.",
      });
    }

    // List of amenities to fetch
    const amenities = ["hospital", "clinic", "pharmacy"];

    // Fetch data for each amenity
    const results = [];
    for (const amenity of amenities) {
      const data = await getData(coordinates, [amenity]);
      results.push({ amenity, data });
    }

    // Combine and return results
    res.status(200).json({
      success: true,
      data: results,
    });
  } catch (error) {
    console.error("Error in getAllData:", error.message);
    res.status(500).json({
      success: false,
      message: "Failed to fetch data for all amenities.",
    });
  }
};
