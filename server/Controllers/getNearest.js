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
  return (
    Array.isArray(coordinates) &&
    coordinates.length === 2 &&
    typeof coordinates[0] === "number" && // Longitude
    typeof coordinates[1] === "number" && // Latitude
    coordinates[0] >= -180 &&
    coordinates[0] <= 180 && // Longitude bounds
    coordinates[1] >= -90 &&
    coordinates[1] <= 90
  ); // Latitude bounds
};

const getNearest = async (req, res) => {
  try {
    const { coordinates } = req.body; // Polygon coordinates

    // Validate the format of the coordinates (array of arrays)
    if (!coordinates || !Array.isArray(coordinates[0]) || coordinates[0].length < 3) {
      return res.status(400).json({
        success: false,
        message: "Invalid polygon coordinates. Please provide a valid polygon as an array of coordinate pairs.",
      });
    }

    const polygon = coordinates[0]; // Extract the first polygon (if multiple)

    // Calculate the centroid of the polygon
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

    const amenities = ["hospital", "clinic", "pharmacy"];

    // Fetch data for amenities within the specified area
    const data = await getData(polygon, amenities);

    if (!data || !data.features || data.features.length === 0) {
      return res.status(200).json({
        success: true,
        data: null,
        message: "No hospitals, clinics, or pharmacies found within the specified polygon.",
      });
    }

    // Filter amenities within a 10 km radius of the centroid
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

    // Sort amenities by distance and get the closest one
    const nearestAmenity = filteredAmenities.sort((a, b) => a.distance - b.distance)[0];

    if (!nearestAmenity) {
      return res.status(200).json({
        success: true,
        data: null,
        message: "No amenities found within the 10 km radius.",
      });
    }

    // Return the nearest amenity with metadata
    return res.status(200).json({
      success: true,
      data: nearestAmenity,
      metadata: {
        distance: nearestAmenity.distance,
        centerPoint: centroidCoordinates,
        amenityType: nearestAmenity.properties.type,
      },
    });
  } catch (error) {
    console.error("Error fetching nearest amenities:", error);
    return res.status(500).json({
      success: false,
      message: "An error occurred while fetching the nearest amenity.",
      error: error.message,
    });
  }
};

export default getNearest;
