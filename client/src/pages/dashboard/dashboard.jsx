import Map from '../../components/map/Map.jsx';
import './dashboard.css';
import Navbar from '../../components/navbar/navbar.jsx';
import Sidebar from '../../components/sidebar/sidebar.jsx';


const Dashboard = () => {
  return (
    <>
    <div className="app-layout">
    <header><Navbar /></header>
    
    <div className="main-content">
    <Sidebar />
    <div className="map-container">
        
            <div className="map-view">
              <Map/>
            </div>
            <div className="legend">
              <p><span className="hospital-dot"></span> Hospital</p>
              <p><span className="clinic-dot"></span> Clinic</p>
              <p><span className="pharmacy-dot"></span> Pharmacy</p>
            </div>
            <div className="zoom-controls">
              <button>+</button>
              <button>-</button>
            </div>
            </div>
    
    </div>
  </div>
    </>
  );
}

export default Dashboard;
