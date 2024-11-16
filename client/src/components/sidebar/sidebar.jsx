import './sidebar.css';
import FacilityFilter from '../facilityfilter/facilitytype.jsx';
import RangeFilter from '../rangefilter/range.jsx';
import ServicesFilter from '../servicefilter/servicetype.jsx';
import Card from '../../components/card/card.jsx';
import { useState } from 'react';

const Sidebar = ({ facility, services }) => {
    const [selectedFacilities, setSelectedFacilities] = useState([]);
    const [selectedServices, setSelectedServices] = useState([]);

    

    const handleFacilityChange = (value, isChecked) => {
        if (isChecked) {
            setSelectedFacilities((prev) => [...prev, value]);
        } else {
            setSelectedFacilities((prev) => prev.filter(item => item !== value));
        }
    };

    const handleServiceChange = (value, isChecked) => {
        if (isChecked) {
            setSelectedServices((prev) => [...prev, value]);
        } else {
            setSelectedServices((prev) => prev.filter(item => item !== value));
        }
    };

    const facilityOptions=["Hospitals","Clinics","Pharmacies"];
    const serviceOptions=["Emergency Care","ICU","Pediatrics","Surgery"]

    return (
        <div className="sidebar">
            <p>Filters</p>
            <div className='Filters'>
                <FacilityFilter 
                    options={facilityOptions} 
                    selectedFacilities={selectedFacilities} 
                    onFacilityChange={handleFacilityChange} />
                <Card/>
            </div>
        </div>
    );
}

export default Sidebar;