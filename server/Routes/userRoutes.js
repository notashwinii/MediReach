const router = Router();
const getAllDatta = require("../Controllers/getAllData.js");
const getByAmenityHospital = require("../Controllers/getByAmenityByHospital.js");
const getData = rquire("../utils/getData.js");
// import { getAllData } from "../Controllers/getAllData.js";
const getNearest = require("../Controllers/getNearest.js");
const getByAmenityClinic = require("../Controllers/getByAmenityClinic");

const getByAmenityPharmacy = require("../Controllers/getByAmenityPharmacy.js");

router.post("/getNearest", getNearest);

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
// router.post("/getByAmenity", getByAmenityHospital);
router.post("/getbyamenity", getByAmenityClinic);
router.post("/GetByAmenity", getByAmenityPharmacy);

export default router;
