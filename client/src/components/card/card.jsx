import React, { useState } from 'react';
import './style.css';

const Card = () => {
  const [hospitals, setHospitals] = useState([]); // State to store hospital details
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
    // Generate coordinates to form a square (or polygon) around the user's location
    const generatePolygonCoordinates = (lat, lon) => {
      const offset = 0.01; // Define the offset to create a polygon around the user's location
  
      return [
        [lon - offset, lat + offset], // Top-left
        [lon + offset, lat + offset], // Top-right
        [lon + offset, lat - offset], // Bottom-right
        [lon - offset, lat - offset], // Bottom-left
        [lon - offset, lat + offset], // Closing the polygon
      ];
    };

  const fetchRecommendations = async () => {
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
        body: JSON.stringify({ coordinates:coordinates }),
      });
      console.log('Response Fetch'+response);

      const data = await response.json();

      console.log('Data'+data);

      if (response.ok && data.success) {
        setHospitals(data.data); // Update the hospitals state with the fetched data
        setLoading(false);
      } else {
        throw new Error(data.message || 'Failed to fetch recommendations.');
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
        <button
          className="card-button"
          onClick={fetchRecommendations}
          disabled={loading}
        >
          {loading ? 'Loading...' : 'Fetch Recommendations'}
        </button>
        {error && <p className="error-message">{error}</p>}
        {hospitals.length > 0 ? (
          <div className="hospital-list">
            {hospitals.map((hospital, index) => {
          console.log(hospital); // Check the structure here
          const { name, amenity, phone } = hospital.properties.tags || {};
        return (
          <div className="hospital-item" key={index}>
            <h4>{name || "Unknown Name"}</h4>
            <p>
              <strong>Amenity:</strong> {amenity || "N/A"}
            </p>
            <p>
              <strong>Phone:</strong> {phone || "N/A"}
            </p>
          </div>
        );
        })};
      
            </div>
        ) : (
          <p>No hospitals to display. Click "Fetch Recommendations" to load data.</p>
        )}
      </div>
    </div>
  );
}
};

export default Card;
