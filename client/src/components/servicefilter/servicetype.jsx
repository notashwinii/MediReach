import './servicetype.css';

const ServicesFilter = ({ options, selectedServices, onServiceChange }) => {
    return (
        <div className='servicescheckbox'>
            <p>Service Type</p>
            <form className='servicescheckbox'>
                <div className='options'>
                    {options.map(option => (
                        <div className='option' key={option}>
                            <label>
                                <input 
                                    type='checkbox' 
                                    value={option} 
                                    checked={selectedServices.includes(option)}
                                    onChange={(e) => onServiceChange(e.target.value, e.target.checked)} 
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

export default ServicesFilter;