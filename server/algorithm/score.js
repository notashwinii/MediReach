// Scoring Functions
export function scoreBeds(beds) {
  return beds.available / beds.total;
}

export function scoreEquipment(equipment) {
  const totalEquipment = Object.keys(equipment).length;
  const availableEquipment = Object.values(equipment).filter((value) => value).length;
  return availableEquipment / totalEquipment;
}

export function scoreAmbulance(ambulanceAvailable) {
  return ambulanceAvailable ? 1 : 0; // 1 if available, 0 if not
}

export function scoreDoctorToPatientRatio(wards) {
  const totalRatios = Object.values(wards).reduce((sum, ward) => {
    const ratio = ward.doctors / ward.patients;
    return sum + ratio;
  }, 0);
  const numWards = Object.keys(wards).length;
  return totalRatios / numWards; // Normalize across wards
}

// Final Score Aggregation
export function calculateFinalScore(hospital, selectedParams) {
  const scores = [];
  if (selectedParams.includes("beds")) {
    scores.push(scoreBeds(hospital.beds));
  }
  if (selectedParams.includes("equipment")) {
    scores.push(scoreEquipment(hospital.equipment));
  }
  if (selectedParams.includes("ambulance")) {
    scores.push(scoreAmbulance(hospital.ambulance_available));
  }
  if (selectedParams.includes("doctorToPatientRatio")) {
    scores.push(scoreDoctorToPatientRatio(hospital.wards));
  }

  const finalScore = scores.reduce((sum, score) => sum + score, 0) / scores.length;
  return finalScore;
}

// Classification Function
export function classifyHospital(score) {
  if (score >= 0.8) return "Sufficient";
  if (score >= 0.5) return "Needs Attention";
  return "Critical";
}
