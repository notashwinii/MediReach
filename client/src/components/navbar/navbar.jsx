import './navbar.css'
import logo from '/logo.png'
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
    <nav className="navbar shadow-md ">
       <div className="logoplusname">
        <img src={logo} alt="Logo"/>
        <p>MediReach</p>
       </div>

       <div className='flex items-center w-full  justify-center'>
       <input type="text" className='input' placeholder="Search Locations..."/>
       

       </div>
    </nav>
     );
}
   

export default navbar;