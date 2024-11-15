const { getData } = require("../utils/getData");

const getByAmenity = async (req, res) => {
  try {
    const { coordinates } = req.body;
    const { amenity } = req.query;

    if (!coordinates || !Array.isArray(coordinates) || coordinates.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid coordinates format. Coordinates must be a non-empty array.",
      });
    }

    // console.log(amenity);

    if (!amenity) {
      return res.status(400).json({
        success: false,
        message: "Invalid amenity. Amenity must be one of 'hospital', 'clinic', 'pharmacy', or 'doctor'.",
      });
    }

    const data = await getData(coordinates, amenity.split(","));

    res.status(200).json({
      success: true,
      data: data,
    });
  } catch (error) {
    console.error("Error in getAmenityData:", error.message);
    res.status(500).json({
      success: false,
      message: "Failed to fetch data for the selected amenity.",
    });
  }
};

module.exports = { getByAmenity };
