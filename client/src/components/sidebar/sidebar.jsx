import './sidebar.css';
import FacilityFilter from '../facilityfilter/facilitytype.jsx';
import RangeFilter from '../rangefilter/range.jsx';
import ServicesFilter from '../servicefilter/servicetype.jsx';
import { useState } from 'react';
import MultiRangeSelector from '../utils/MultiRangeSelector.jsx';

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
        <div className="sidebar p-4 space-y-4">
            <p className='text-xl font-bold text-left   '>Filters</p>
            <div className=''>
                <FacilityFilter 
                    options={facilityOptions} 
                    selectedFacilities={selectedFacilities} 
                    onFacilityChange={handleFacilityChange} 
                /> 
                <MultiRangeSelector min={0} max={10000}/ >
                <ServicesFilter 
                    options={serviceOptions} 
                    selectedServices={selectedServices} 
                    onServiceChange={handleServiceChange} 
                />
            </div>
        </div>
    );
}

export default Sidebar;