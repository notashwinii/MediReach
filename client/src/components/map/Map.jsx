import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polygon } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import * as turf from '@turf/turf'; // Import turf for spatial operations

const Map = () => {
  const [userLocation, setUserLocation] = useState(null);
  const [hospitals, setHospitals] = useState([]); // State to store hospital data

  // Get the user's location using the Geolocation API
  useEffect(() => {
    if (navigator.geolocation) {  
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lon: position.coords.longitude,
          });
        },
        (error) => {
          alert('Geolocation failed: ' + error.message);
        }
      );
    }
  }, []);

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

  // Handle sending location and polygon data
  const handleSendLocation = async () => {
    if (userLocation) {
      const coordinates = generatePolygonCoordinates(userLocation.lat, userLocation.lon);
      try {
        const response = await fetch('http://localhost:3000/getAllData', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ coordinates: coordinates }), // Send coordinates as polygon
        });

        const data = await response.json();
        if (response.ok && data.success) {
          // Collect all features from all amenities
          const allFeatures = data.data.flatMap(amenity => amenity.data.features);
          setHospitals(allFeatures); // Update hospitals state with all fetched data
          setErrorMessage('');
          console.log('Location sent successfully!');
        } else {
          console.error('Failed to send location');
        }
      } catch (error) {
        console.error('Error sending location:', error);
      }
    } else {
      console.log('Location is not available yet');
    }
  };

// Function to check if a point (hospital) is inside the polygon
const isHospitalInPolygon = (hospital) => {
  const hospitalCoordinates = hospital.geometry.coordinates;

  // Check if the coordinates are valid
  if (!Array.isArray(hospitalCoordinates) || hospitalCoordinates.length !== 2) {
    console.error('Invalid coordinates for hospital:', hospital);
    return false; // Skip if coordinates are invalid
  }

  const [lon, lat] = hospitalCoordinates; // Ensure correct order: [longitude, latitude]

  // Ensure the coordinates are numbers
  if (isNaN(lon) || isNaN(lat)) {
    console.error('Invalid coordinate values:', hospitalCoordinates);
    return false; // Skip if coordinates are not valid numbers
  }

  const polygon = turf.polygon([generatePolygonCoordinates(userLocation.lat, userLocation.lon)]);
  const point = turf.point([lon, lat]);

  return turf.booleanPointInPolygon(point, polygon); // Check if hospital is within the polygon
};


  return (
    <div style={{ width: '100%', height: '600px' }}>
      <button onClick={handleSendLocation} disabled={!userLocation}>
        Send Location
      </button>
      <div className="legend">
              <p><span className="hospital-dot"></span> Hospital</p>
              <p><span className="clinic-dot"></span> Clinic</p>
              <p><span className="pharmacy-dot"></span> Pharmacy</p>
            </div>
      {userLocation && (
        <MapContainer
          center={[userLocation.lat, userLocation.lon]}
          zoom={13}
          style={{ height: '100%' }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          {/* User marker */}
          <Marker position={[userLocation.lat, userLocation.lon]}>
            <Popup>You are here</Popup>
          </Marker>
          {/* Polygon around the user */}
          <Polygon positions={generatePolygonCoordinates(userLocation.lat, userLocation.lon)} />

          {/* Render hospital markers based on the fetched data */}
          {hospitals.map((hospital, index) => {
            const { name, email, internet_access,website,amenity,phone } = hospital.properties.tags;
            const lat = hospital.geometry.coordinates[1];
            const lon = hospital.geometry.coordinates[0];

            // Check if the hospital is inside the polygon before rendering the marker
            if (!isHospitalInPolygon(hospital)) {
              return null; // Skip if hospital is outside the polygon
            }

            return (
              <Marker key={index} position={[lat, lon]}>
                <Popup>
                  <h3>{name}</h3>
                  <p>email:<strong></strong> {email || 'N/A'}</p>
                  <p><strong>phone:</strong> {phone || 'N/A'}</p>
                  <p><strong>amenity:</strong> {amenity || 'N/A'}</p>
                  <p><strong>Internet Access</strong> {internet_access || 'N/A'}</p>
                  {website && <p><a href={website} target="_blank" rel="noopener noreferrer">Visit Website</a></p>}
                </Popup>
              </Marker>
            );
          })}
        </MapContainer>
      )}
    </div>
  );
};

export default Map;
