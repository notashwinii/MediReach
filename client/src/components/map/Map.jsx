import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const Map = () => {
  const [userLocation, setUserLocation] = useState(null);
  const [facilities, setFacilities] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch medical facilities data from your local JSON file
  useEffect(() => {
    fetch('csvjson.json')  // Adjust the path if needed
      .then(response => response.json())
      .then(data => {
        setFacilities(data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error loading JSON:', error);
        setLoading(false);
      });
  }, []);

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

  // Function to calculate the distance between two lat/lon points (in meters)
  const getDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Radius of the Earth in kilometers
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c * 1000; // Distance in meters
  };

  // Filter facilities within a certain distance from the user's location
  const getNearbyFacilities = () => {
    if (!userLocation || !facilities.length) return [];

    return facilities.filter(facility => {
      const distance = getDistance(userLocation.lat, userLocation.lon, facility.latitude, facility.longitude);
      return distance < 5000; // Facilities within 5 km
    });
  };

  // Render loading or the map with markers
  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div style={{ width: '100%', height: '600px' }}>
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
          {/* Medical facilities markers */}
          {getNearbyFacilities().map(facility => (
            <Marker
              key={facility.osm_id}
              position={[facility.latitude, facility.longitude]}
              icon={new L.Icon({
                iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png', // Custom marker icon
                iconSize: [25, 41],
                iconAnchor: [12, 41],
                popupAnchor: [1, -34],
              })}
            >
              <Popup>
                <strong>{facility.name}</strong><br />
                Opening Hours: {facility.opening_hours}<br />
                Distance: {getDistance(userLocation.lat, userLocation.lon, facility.latitude, facility.longitude).toFixed(2)} meters
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      )}
    </div>
  );
};

export default Map;
