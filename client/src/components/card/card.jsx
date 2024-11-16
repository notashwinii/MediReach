import React, { useState } from 'react';
import './Card.css'; // Ensure this file exists for styling

const Card = ({ setHospitals }) => {
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchRecommendedHospitals = async () => {
    setLoading(true);
    setError(null);
    if (userLocation) {
         const coordinates = generatePolygonCoordinates(userLocation.lat, userLocation.lon);
    try {
       
           

      const response = await fetch('http://localhost:3000/filteredHospitals', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ coordinates }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setHospitals(data.data); // Pass fetched data to the parent
        setLoading(false);
      } else {
        throw new Error(data.message || 'Failed to fetch recommended hospitals.');
      }
    } catch (err) {
      setLoading(false);
      setError(err.message);
    }
  };

  return (
    <div className="card">
      <div className="card-content">
        <h3 className="card-title">Recommended Hospitals</h3>
        <p className="card-description">
          Click the button below to fetch recommended hospitals near your area.
        </p>

        <button
          className="card-button"
          onClick={fetchRecommendedHospitals}
          disabled={loading}
        >
          {loading ? 'Loading...' : 'Fetch Hospitals'}
        </button>

        {error && <p className="error-message">{error}</p>}
      </div>
    </div>
  );
}
};

export default Card;
