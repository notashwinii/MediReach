import './navbar.css'
import logo from './logo.png'
import usericon from './profileicon.png'
 const navbar=({location})=>{
   
   console.log(location);
   var bool;
   if(location==='/')
   {
      bool=false;
   }
   else{
      bool=true;
   }   


    return (
    <nav className="navbar">
       <div className="logoplusname">
        <img src={logo} alt="Logo"/>
        <p>MediReach</p>
       </div>
       {bool?<div className='homeinfo'>
       <div className='input'><input type="text" placeholder="Search Locations..."/></div>
       
       </div>
       :null}
    </nav>
     );
}
   

export default navbar;