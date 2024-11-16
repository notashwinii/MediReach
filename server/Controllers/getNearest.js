import getData from "../utils/getData.js";

// Haversine formula to calculate distance
const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Earth's radius in kilometers
  const toRadians = (degree) => (degree * Math.PI) / 180;

  const dLat = toRadians(lat2 - lat1);
  const dLon = toRadians(lon2 - lon1);

  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

// Validate coordinates format
const isValidCoordinates = (coordinates) => {
  return coordinates.every(
    (coord) =>
      Array.isArray(coord) &&
      coord.length === 2 &&
      typeof coord[0] === "number" &&
      typeof coord[1] === "number" &&
      coord[0] >= -180 &&
      coord[0] <= 180 && // longitude bounds
      coord[1] >= -90 &&
      coord[1] <= 90 // latitude bounds
  );
};

const getNearest = async (req, res) => {
  try {
    const { coordinates } = req.body;

    // Validate coordinates
    if (!coordinates || !Array.isArray(coordinates[0]) || coordinates[0].length < 4 || !isValidCoordinates(coordinates[0])) {
      return res.status(400).json({
        success: false,
        message: "Invalid polygon coordinates. Please provide valid directions as coordinate pairs [longitude, latitude].",
      });
    }

    const polygon = coordinates[0]; // Extract the first polygon (if multiple)
    const amenities = ["hospital", "clinic", "pharmacy"];

    // Calculate centroid of the polygon
    const centroid = polygon.reduce(
      (acc, coord) => {
        acc.latSum += coord[1];
        acc.lonSum += coord[0];
        return acc;
      },
      { latSum: 0, lonSum: 0 }
    );

    const centroidCoordinates = {
      latitude: centroid.latSum / polygon.length,
      longitude: centroid.lonSum / polygon.length,
    };

    // Fetch data for amenities within the specified area
    const data = await getData(polygon, amenities);

    if (!data || !data.features || data.features.length === 0) {
      return res.status(200).json({
        success: true,
        data: [],
        message: `No hospitals, clinics, or pharmacies found within the specified area.`,
      });
    }

    // Filter amenities within 10 km radius
    const filteredAmenities = data.features
      .filter((feature) => {
        if (!feature.geometry?.coordinates) return false;
        const [lon, lat] = feature.geometry.coordinates;
        const dist = calculateDistance(centroidCoordinates.latitude, centroidCoordinates.longitude, lat, lon);
        return dist <= 10; // Only keep amenities within 10 km
      })
      .map((feature) => {
        const dist = calculateDistance(centroidCoordinates.latitude, centroidCoordinates.longitude, feature.geometry.coordinates[1], feature.geometry.coordinates[0]);
        return {
          ...feature,
          distance: Number(dist.toFixed(2)), // Add distance in km
        };
      });

    // Sort amenities by distance
    filteredAmenities.sort((a, b) => a.distance - b.distance);

    // Return filtered amenities with metadata
    return res.status(200).json({
      success: true,
      data: filteredAmenities,
      metadata: {
        total: filteredAmenities.length,
        searchRadius: 10,
        centerPoint: centroidCoordinates,
        amenityTypes: amenities,
      },
    });
  } catch (error) {
    console.error("Error fetching nearest amenities:", error);
    return res.status(500).json({
      success: false,
      message: "An error occurred while fetching the nearest amenities.",
      error: error.message,
    });
  }
};

export default getNearest;
