import './facilitytype.css';

const FacilityFilter = ({ options, selectedFacilities, onFacilityChange }) => {
    return (
        <div className='bg-[#2c4b6b] p-4 space-y-4'>
            <p className='text-sm font-normal'>Facility Type</p>
            <form className=''>
                <div className=' space-y-2 '>
                    {options.map(option => (
                        <label className='flex items-center gap-2' key={option}>
                                <input 
                                    type='checkbox'
                                    value={option} 
                                    checked={selectedFacilities.includes(option)}
                                    onChange={(e) => onFacilityChange(e.target.value, e.target.checked)} 
                                    className='text-lg font-semibold'
                                />
                                <small>{option}</small>
                        </label>
                    ))}
                </div>
            </form>
        </div>
    );
};

export default FacilityFilter;