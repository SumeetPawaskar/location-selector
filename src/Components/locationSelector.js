// src/components/LocationSelector.js

import React, { useState, useEffect } from 'react';
import axios from 'axios';

const LocationSelector = () => {
  // State variables
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState('');
  const [selectedState, setSelectedState] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [selectionOutput, setSelectionOutput] = useState('');

  // Fetch countries on initial load
  useEffect(() => {
    axios
      .get('https://crio-location-selector.onrender.com/countries')
      .then((response) => {
        setCountries(response.data);
      })
      .catch((error) => {
        console.error('Error fetching countries:', error);
      });
  }, []);

  
  useEffect(() => {
    if (selectedCountry) {
      axios
        .get(`https://crio-location-selector.onrender.com/country=${selectedCountry}/states`)
        .then((response) => {
          setStates(response.data);
          setCities([]); 
          setSelectedState('');
          setSelectedCity('');
        })
        .catch((error) => {
          console.error('Error fetching states:', error);
        });
    }
  }, [selectedCountry]);

  
  useEffect(() => {
    if (selectedState) {
      axios
        .get(`https://crio-location-selector.onrender.com/country=${selectedCountry}/state=${selectedState}/cities`)
        .then((response) => {
          setCities(response.data);
          setSelectedCity(''); // Clear city when state changes
        })
        .catch((error) => {
          console.error('Error fetching cities:', error);
        });
    }
  }, [selectedState, selectedCountry]);

  // Handle city selection
  const handleCityChange = (e) => {
    const city = e.target.value;
    setSelectedCity(city);
    if (city) {
      setSelectionOutput(`You selected ${city}, ${selectedState}, ${selectedCountry}`);
    }
  };

  return (
    <div className="location-selector">
      <h1>Location Selector</h1>
      <form>
        {/* Select Country Dropdown */}
        <div className="dropdown">
          <label htmlFor="country">Select Country:</label>
          <select
            id="country"
            value={selectedCountry}
            onChange={(e) => setSelectedCountry(e.target.value)}
          >
            <option value="">--Select Country--</option>
            {countries.map((country) => (
              <option key={country} value={country}>
                {country}
              </option>
            ))}
          </select>
        </div>

        {/* Select State Dropdown */}
        {
        //selectedCountry && (
          <div className="dropdown">
            <label htmlFor="state">Select State:</label>
            <select
              id="state"
              value={selectedState}
              onChange={(e) => setSelectedState(e.target.value)}
            >
              <option value="">--Select State--</option>
              {states.map((state) => (
                <option key={state} value={state}>
                  {state}
                </option>
              ))}
            </select>
          </div>
       // )
        }

        {/* Select City Dropdown */}
        {
        // selectedState && (
          <div className="dropdown">
            <label htmlFor="city">Select City:</label>
            <select
              id="city"
              value={selectedCity}
              onChange={handleCityChange}
            >
              <option value="">--Select City--</option>
              {cities.map((city) => (
                <option key={city} value={city}>
                  {city}
                </option>
              ))}
            </select>
          </div>
        // )
        }
      </form>

      {/* Display Selection Output */}
      {selectionOutput && <p>{selectionOutput}</p>}
    </div>
  );
};

export default LocationSelector;
