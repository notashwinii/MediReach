import Map from '../../components/map/Map.jsx';
import './dashboard.css';
import Navbar from '../../components/navbar/navbar.jsx';
import Sidebar from '../../components/sidebar/sidebar.jsx';


const Dashboard = () => {
  return (
    <>
    <div className="app-layout">
    <header><Navbar /></header>
    <aside> <Sidebar /></aside>
    <div className="main-content">
    <main>
    <div className="map-container">
            <div className="legend">
              <p><span className="hospital-dot"></span> Hospital</p>
              <p><span className="clinic-dot"></span> Clinic</p>
              <p><span className="pharmacy-dot"></span> Pharmacy</p>
            </div>

            <div className="map-view">
              <Map/>
            </div>


            <div className="zoom-controls">
              <button>+</button>
              <button>-</button>
            </div>
            </div>
    </main>
    </div>
  </div>
    </>
  );
}

export default Dashboard;
