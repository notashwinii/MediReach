import React, { useState } from 'react';
import Map from '@/components/map/Map';
import './dashboard.css';

const Dashboard = () => {
  const [filters, setFilters] = useState({
    facilityType: {
      hospitals: false,
      clinics: false,
      pharmacies: false,
    },
    distanceRange: 50,
    services: {
      emergencyCare: false,
      icu: false,
      pediatrics: false,
      surgery: false,
    },
  });

  const handleFacilityTypeChange = (e) => {
    const { name, checked } = e.target;
    setFilters((prevFilters) => ({
      ...prevFilters,
      facilityType: {
        ...prevFilters.facilityType,
        [name]: checked,
      },
    }));
  };

  const handleDistanceRangeChange = (e) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      distanceRange: e.target.value,
    }));
  };

  const handleServicesChange = (e) => {
    const { name, checked } = e.target;
    setFilters((prevFilters) => ({
      ...prevFilters,
      services: {
        ...prevFilters.services,
        [name]: checked,
      },
    }));
  };

  return (
    <div className='dashboard'>
      <div className="map-interface">
        <aside className="sidebar">
          <div className="logo">
            <span className="logo-icon">💊</span>
            <h1>MediReach</h1>
          </div>

          <div className="filters">
            <div className="filter-section">
              <h3>Facility Type</h3>
              <label><input type="checkbox" name="hospitals" onChange={handleFacilityTypeChange} /> Hospitals</label>
              <label><input type="checkbox" name="clinics" onChange={handleFacilityTypeChange} /> Clinics</label>
              <label><input type="checkbox" name="pharmacies" onChange={handleFacilityTypeChange} /> Pharmacies</label>
            </div>

            <div className="filter-section">
              <h3>Distance Range</h3>
              <input type="range" min="0" max="50" value={filters.distanceRange} onChange={handleDistanceRangeChange} />
              <div className="range-labels">
                <span>0 km</span>
                <span>50 km</span>
              </div>
            </div>

            <div className="filter-section">
              <h3>Services Available</h3>
              <label><input type="checkbox" name="emergencyCare" onChange={handleServicesChange} /> Emergency Care</label>
              <label><input type="checkbox" name="icu" onChange={handleServicesChange} /> ICU</label>
              <label><input type="checkbox" name="pediatrics" onChange={handleServicesChange} /> Pediatrics</label>
              <label><input type="checkbox" name="surgery" onChange={handleServicesChange} /> Surgery</label>
            </div>
          </div>
        </aside>

        <main className="map-content">
          <header className="search-bar">
            <input type="text" placeholder="Search locations..." />
          </header>

          <div className="map-container">
            <div className="legend">
              <p><span className="hospital-dot"></span> Hospital</p>
              <p><span className="clinic-dot"></span> Clinic</p>
              <p><span className="pharmacy-dot"></span> Pharmacy</p>
            </div>

            <div className="map-view">
              <Map filters={filters} />
            </div>


            <div className="zoom-controls">
              <button>+</button>
              <button>-</button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default Dashboard;
