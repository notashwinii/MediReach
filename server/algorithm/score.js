
import fs from 'fs';
import path from 'path';

export function recommendHospitals(userLocation, weights = { distance: 0.5, quality: 0.3, availability: 0.2 }) {
  const { lat: userLat, long: userLong } = userLocation;

  // Load dummy hospital data
  const dataPath = path.resolve('data/dummy_hospital.json');
  const hospitals = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));

  // Haversine formula for distance
  function calculateDistance(lat1, long1, lat2, long2) {
    const toRadians = (degrees) => (degrees * Math.PI) / 180;
    const R = 6371; // Earth's radius in km
    const dLat = toRadians(lat2 - lat1);
    const dLong = toRadians(long2 - long1);
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) *
      Math.sin(dLong / 2) * Math.sin(dLong / 2);
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)); // Distance in km
  }

  // Normalize values between 0 and 1
  function normalize(value, min, max) {
    return (value - min) / (max - min);
  }

  // Calculate scores for each hospital
  const scoredHospitals = hospitals.map((hospital) => {
    const distance = calculateDistance(userLat, userLong, hospital.location.lat, hospital.location.long);
    const distanceScore = 1 / (1 + distance); // Closer hospitals score higher

    // Quality Score: e.g., doctor-patient ratio
    let qualityScore = 0;
    if (hospital.wards) {
      let totalDoctors = 0, totalPatients = 0;
      Object.values(hospital.wards).forEach((ward) => {
        totalDoctors += ward.doctors;
        totalPatients += ward.patients;
      });
      const doctorPatientRatio = totalDoctors / (totalPatients || 1); // Avoid division by 0
      qualityScore = normalize(doctorPatientRatio, 0, 1);
    }

    // Availability Score: based on bed availability
    const availabilityScore = hospital.beds
      ? normalize(hospital.beds.available, 0, hospital.beds.total)
      : 0;

    // Total Score (weighted)
    const totalScore = (
      weights.distance * distanceScore +
      weights.quality * qualityScore +
      weights.availability * availabilityScore
    );

    return { ...hospital, score: totalScore, distance };
  });

  // Sort by score (descending)
  return scoredHospitals.sort((a, b) => b.score - a.score);
}
