const getData = require("../utils/getData");

// Function for fetching hospital data
const getByAmenityHospital = async (req, res) => {
  try {
    const { coordinates } = req.body;

    if (!coordinates || !Array.isArray(coordinates) || coordinates.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid coordinates format. Coordinates must be a non-empty array.",
      });
    }

    const amenity = "hospital"; // Directly set to 'hospital'

    const data = await getData(coordinates, [amenity]);

    res.status(200).json({
      success: true,
      data: data,
    });
  } catch (error) {
    console.error("Error in getByAmenityHospital:", error.message);
    res.status(500).json({
      success: false,
      message: "Failed to fetch data for the hospital amenity.",
    });
  }
};

export default { getByAmenityHospital };
