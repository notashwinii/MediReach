import React from 'react'
import { Link } from 'react-router-dom'
import './home.css'
const Home = () => {
  return (
    <div className='home'>
    <div className="header">
      <div className="logo">
        <span className="logo-icon">📍</span> MediReach
      </div>
      <Link to="/dashboard" className="get-started">Get-Started</Link>
   
    </div>
       
    </div>

    
)
}

export default Home;