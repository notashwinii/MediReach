import './navbar.css'
import logo from './logo.png'
import usericon from './profileicon.png'
 const navbar=()=>{
    
    return (
    <nav className="navbar">
       <div className="logoplusname">
        <img src={logo} alt="Logo"/>
        <p>MediReach</p>
       </div>
       <div className='input'><input type="text" placeholder="Search Locations..."/></div>
       <div className='profile'><a><img src={usericon}/></a></div>
    </nav>
     );
}
   

export default navbar;