import fetch from "node-fetch";

const getData = async (coordinates, amenities) => {
  try {
    // Ensure `coordinates` and `amenities` are valid
    if (!Array.isArray(coordinates) || coordinates.length === 0) {
      throw new Error("Invalid input: Coordinates must be a non-empty array.");
    }
    if (!Array.isArray(amenities) || amenities.length === 0) {
      throw new Error("Invalid input: Amenities must be a non-empty array.");
    }

    console.log(amenities);

    // Construct the payload
    const payload = {
      geometry: {
        type: "Polygon",
        coordinates: [coordinates],
      },
      filters: {
        tags: {
          all_geometry: {
            join_or: {
              amenity: amenities,
              emergency: ["yes"],
            },
          },
        },
      },
      geometryType: ["point", "polygon"],
    };

    const apiUrl = "https://api-prod.raw-data.hotosm.org/v1/snapshot/plain/";

    console.log(payload);

    // Make a POST request using fetch
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error(`OSM API error: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching OSM data:", error.message);
    throw error;
  }
};

export default getData;
