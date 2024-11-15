const express = require("express");
const router = express.Router();
const { getAllData } = require("../Controllers/getAllData");
const { getByAmenity } = require("../Controllers/getByAmenity");
const { getData } = require("../utils/getData");


// Route to fetch amenities within a radius


router.post("/get-data", async (req, res) => {
  try {
    const { coordinates, amenity } = req.body;

    if (!coordinates || !Array.isArray(coordinates)) {
      return res.status(400).json({ success: false, message: "Invalid coordinates format" });
    }
    if (!amenity || !Array.isArray(amenity) || amenity.length === 0) {
      return res.status(400).json({ success: false, message: "Invalid input: Amenities must be a non-empty array." });
    }

    const data = await getData(coordinates, amenity);
    res.status(200).json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.post("/getAllData", getAllData);
router.post("/getByAmenity", getByAmenity);

export default router;
