import './facilitytype.css';

const FacilityFilter = ({ options, selectedFacilities, onFacilityChange }) => {
    return (
        <div className='facilitycheckbox'>
            <p>Facility Type</p>
            <form className='facilitycheckbox'>
                <div className='options'>
                    {options.map(option => (
                        <div className='option' key={option}>
                            <label>
                                <input 
                                    type='checkbox' 
                                    value={option} 
                                    checked={selectedFacilities.includes(option)}
                                    onChange={(e) => onFacilityChange(e.target.value, e.target.checked)} 
                                />
                                <small>{option}</small>
                            </label>
                        </div>
                    ))}
                </div>
            </form>
        </div>
    );
};

export default FacilityFilter;