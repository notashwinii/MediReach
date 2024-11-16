import { getData } from "../utils/getData";

const getByAmenityPharmacy = async (req, res) => {
  try {
    const { coordinates } = req.body;

    if (!coordinates || !Array.isArray(coordinates) || coordinates.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid coordinates format. Coordinates must be a non-empty array.",
      });
    }

    const amenity = "pharmacy"; // Directly set to 'pharmacy'

    const data = await getData(coordinates, [amenity]);

    res.status(200).json({
      success: true,
      data: data,
    });
  } catch (error) {
    console.error("Error in getByAmenityPharmacy:", error.message);
    res.status(500).json({
      success: false,
      message: "Failed to fetch data for the pharmacy amenity.",
    });
  }
};

export default { getByAmenityPharmacy };
