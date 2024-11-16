
import express from 'express';
import { recommendHospitals } from '../algorithm/score.js';

const router = express.Router();

router.post('/recommend-hospitals', (req, res) => {
  try {
    const { userLocation, weights } = req.body; // Expect user's location and optional weights in the request

    if (!userLocation || !userLocation.lat || !userLocation.long) {
      return res.status(400).json({ success: false, message: 'Invalid user location' });
    }

    const recommendations = recommendHospitals(userLocation, weights);
    res.status(200).json({ success: true, recommendations });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
