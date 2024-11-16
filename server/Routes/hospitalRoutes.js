import express from "express";
import dummyData from "../data/dummy_hospital.json"; // Load hospital data
import { calculateFinalScore, classifyHospital } from "../algorithm/score.js";

const router = express.Router();

router.post("/recommend-hospitals", (req, res) => {
  try {
    const { selectedParams } = req.body;

    if (!Array.isArray(selectedParams) || selectedParams.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No parameters selected for scoring.",
      });
    }

    const recommendations = dummyData.map((hospital) => {
      const score = calculateFinalScore(hospital, selectedParams);
      const classification = classifyHospital(score);
      return {
        ...hospital,
        score,
        classification,
      };
    });

    res.status(200).json({
      success: true,
      data: recommendations,
    });
  } catch (error) {
    console.error("Error in /recommend-hospitals:", error.message);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
});

export default router;
