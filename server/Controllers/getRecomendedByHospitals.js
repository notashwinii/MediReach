import getData from "../utils/getData.js";

export const getRecommendedHospitals = async (req, res) => {
  try {
    const { coordinates } = req.body;
    const amenities = ["hospital", "clinic", "pharmacy"];

    // Validate coordinates
    if (!coordinates || !Array.isArray(coordinates) || coordinates.length === 0) {
      console.error("Invalid coordinates received:", coordinates);
      return res.status(400).json({
        success: false,
        message: "Invalid coordinates format. Coordinates must be a non-empty array.",
      });
    }

    console.log("Coordinates received:", coordinates);
    console.log("Amenities:", amenities);

    // Fetch data
    const fetchedData = await getData(coordinates, amenities);
    console.log("Fetched data:", JSON.stringify(fetchedData, null, 2));

    if (!fetchedData || !fetchedData.features || fetchedData.features.length === 0) {
      console.error("No data fetched for the given coordinates and amenities.");
      return res.status(404).json({
        success: false,
        message: "No data found for the given coordinates and amenities.",
      });
    }

    // Filter features
    const recommendedHospitals = fetchedData.features.filter((feature) => {
      const tags = feature.properties.tags || {};
      return tags.building === "yes" || tags.emergency === "yes" || tags.internet_access;
    });

    if (recommendedHospitals.length === 0) {
      console.warn("No recommended hospitals found after filtering.");
      return res.status(404).json({
        success: false,
        message: "No recommended hospitals found for the given criteria.",
      });
    }

    console.log("Recommended hospitals:", JSON.stringify(recommendedHospitals, null, 2));

    res.status(200).json({
      success: true,
      data: recommendedHospitals,
    });
  } catch (error) {
    console.error("Error in getRecommendedHospitals:", error.message, error.stack);
    res.status(500).json({
      success: false,
      message: "Failed to fetch recommended hospitals.",
    });
  }
};