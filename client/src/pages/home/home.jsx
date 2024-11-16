import React from 'react';
import { Link, useLocation } from 'react-router-dom'; 
import './home.css';
import Navbar from '../../components/navbar/navbar.jsx';
import image1 from '../../assets/image.jpg';

const Home = () => {
  const location = useLocation(); 
  const path_name = location.pathname; 

  return (
    <div className='home'>
      <div className='navbar'><Navbar className="home_navbar" location={path_name}/></div>
      <div className='image_container'>
        <img src={image1} alt="Cover Image" />
        <div className='content'>
          <div className='Slogan'>Making Healthcare Accessible for all</div>
          <Link to="/dashboard"><button>Get Started</button></Link>
        </div>
      </div>
    </div>
  );
}

export default Home;
