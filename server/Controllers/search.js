import getData from "../utils/getData.js";

const searchUser = async (req, res) => {
  try {
    const { coordinates } = req.body; // Coordinates from request body
    const { amenity } = req.query; // Query params for name and amenity

    // Validate coordinates input
    if (!coordinates || !Array.isArray(coordinates) || coordinates.length < 4) {
      return res.status(400).json({ error: "Invalid coordinates. Please provide at least 4 points to form a polygon." });
    }

    // Validate at least one search parameter (name or amenity) is provided
    if (!amenity) {
      return res.status(400).json({ error: "Please provide at least one search parameter (name or amenity)." });
    }

    // Fetch nearby facilities using getData
    const facilities = await getData(coordinates, amenity ? [amenity] : ["hospital", "clinic", "pharmacy"]);
    console.log("Faciliteis" + facilities);
    if (!facilities || !facilities.features || facilities.features.length === 0) {
      return res.status(200).json({
        success: true,
        data: [],
        message: "No facilities found within the specified area.",
      });
    }

    // Filter facilities by name and/or amenity
    const searchResults = facilities.features.filter((facility) => {
      console.log(facility.properties.tags.amenity);
      const matchesAmenity = amenity ? facility.properties.tags.amenity?.toLowerCase() === amenity.toLowerCase() : true;

      console.log(matchesAmenity);

      return matchesAmenity;
    });

    if (searchResults.length === 0) {
      return res.status(200).json({
        success: true,
        data: [],
        message: "No facilities matching the criteria were found.",
      });
    }

    // Return filtered results with name and amenity
    return res.status(200).json({
      success: true,
      data: searchResults.map((facility) => ({
        amenity: facility.properties.amenity,
      })),
    });
  } catch (error) {
    console.error("Error searching facilities:", error);
    return res.status(500).json({ error: "An error occurred while processing your request." });
  }
};

export default searchUser;
