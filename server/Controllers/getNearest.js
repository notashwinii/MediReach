const getData = require("../utils/getData");

// Haversine formula to calculate distance
const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Radius of Earth in kilometers
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; // Distance in kilometers
};

// Function to fetch amenities within a given radius
const getNearest = async (req, res) => {
  const { coordinates, distance } = req.body; // Extract coordinates and distance from request body
  const amenityQuery = req.query.amenity; // Fetch amenity types from query parameters

  try {
    // Validate coordinates
    if (!coordinates || !Array.isArray(coordinates) || coordinates.length < 4) {
      return res.status(400).json({ success: false, message: "Invalid or missing polygon coordinates." });
    }

    // Validate distance
    if (!distance || typeof distance !== "number" || distance <= 0) {
      return res.status(400).json({ success: false, message: "Invalid or missing distance." });
    }

    // Split and validate amenities
    const amenities = amenityQuery ? amenityQuery.split(",") : ["hospital", "clinic", "pharmacy"];

    const validAmenities = ["hospital", "clinic", "pharmacy"];
    const invalidAmenities = amenities.filter((a) => !validAmenities.includes(a));

    if (invalidAmenities.length > 0) {
      return res.status(400).json({
        success: false,
        message: `Invalid amenity types provided: ${invalidAmenities.join(", ")}`,
      });
    }

    // Fetch data for the specified amenities
    const data = await getData(coordinates, amenities);

    if (!data || !data.features || data.features.length === 0) {
      return res.status(200).json({
        success: true,
        data: [],
        message: "No amenities found within the given area.",
      });
    }

    // Calculate approximate centroid of the polygon
    const userCoordinates = {
      latitude: (coordinates[0][1] + coordinates[2][1]) / 2,
      longitude: (coordinates[0][0] + coordinates[2][0]) / 2,
    };

    // Filter and calculate distances for amenities within the given radius
    const filteredAmenities = data.features
      .filter((feature) => {
        const [lon, lat] = feature.geometry.coordinates;
        const dist = calculateDistance(userCoordinates.latitude, userCoordinates.longitude, lat, lon);
        return dist <= distance;
      })
      .map((feature) => ({
        ...feature,
        distance: calculateDistance(userCoordinates.latitude, userCoordinates.longitude, feature.geometry.coordinates[1], feature.geometry.coordinates[0]),
      }));

    // Return filtered amenities
    res.status(200).json({ success: true, data: filteredAmenities });
  } catch (error) {
    console.error("Error fetching amenities:", error.message);
    res.status(500).json({ success: false, message: "An error occurred. Please try again." });
  }
};

export default { getNearest };
