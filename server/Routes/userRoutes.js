import express from "express";
import { getAllData } from "../Controllers/getAllData.js";
import { getByAmenity } from "../Controllers/getByAmenity.js";
import getData from "../utils/getData.js";
import getNearest from "../Controllers/getNearest.js";
import { getRecommendedHospitals } from "../Controllers/getRecomendedByHospitals.js";
import searchUser from "../Controllers/search.js";

const router = express.Router();

// Route to fetch amenities within a radius
router.post("/getdistances", getNearest);
router.post("/getdistances", getNearest);

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
router.post("/filteredHospitals", getRecommendedHospitals);
router.post("/search", searchUser);

export default router;