import './range.css';
import Slider from 'react-slider';
import { useState, useEffect } from 'react';

const Distancerange = ({ minValue, maxValue }) => {
    const [values, setValues] = useState([minValue, maxValue]);

    
    useEffect(() => {
        setValues([minValue, maxValue]);
    }, [minValue, maxValue]);

    console.log('values', values);

    return (
        <div className="rangecontainer">
            <p>Distance Range</p>
            <Slider 
                className="slider"
                onChange={setValues}
                value={values} 
                min={minValue} 
                max={maxValue} 
            />
            <div className="values">
                <span className='min'><small>{values[0]}km</small></span>
                <span className='max'><small>{values[1]} km</small></span>
            </div>
        </div>
    );
};

export default Distancerange;
