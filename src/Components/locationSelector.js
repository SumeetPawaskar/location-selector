// src/components/LocationSelector.js

import React, { useState, useEffect } from 'react';

const LocationSelector = () => {
  // State variables
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState('');
  const [selectedState, setSelectedState] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [selectionOutput, setSelectionOutput] = useState('');
  const [errorMessage, setErrorMessage] = useState(''); // To handle error messages

  // Fetch countries on initial load
  useEffect(() => {
    const fetchCountries = async () => {
      setErrorMessage(''); // Reset any previous errors
      try {
        const response = await fetch('https://crio-location-selector.onrender.com/countries');
        if (!response.ok) {
          throw new Error('Failed to fetch countries');
        }
        const data = await response.json();
        setCountries(data);
      } catch (error) {
        setErrorMessage('Failed to fetch countries. Please try again later.');
        console.error('Error fetching countries:', error);
      }
    };
    fetchCountries();
  }, []);

  // Fetch states when country is selected
  useEffect(() => {
    const fetchStates = async () => {
      if (selectedCountry) {
        setErrorMessage(''); // Reset any previous errors
        try {
          const response = await fetch(`https://crio-location-selector.onrender.com/country=${selectedCountry}/states`);
          if (!response.ok) {
            throw new Error('Failed to fetch states');
          }
          const data = await response.json();
          setStates(data);
          setCities([]); // Clear cities when country changes
          setSelectedState('');
          setSelectedCity('');
        } catch (error) {
          setErrorMessage('Failed to fetch states. Please try again later.');
          console.error('Error fetching states:', error);
        }
      }
    };
    fetchStates();
  }, [selectedCountry]);

  // Fetch cities when state is selected
  useEffect(() => {
    const fetchCities = async () => {
      if (selectedState) {
        setErrorMessage(''); // Reset any previous errors
        try {
          const response = await fetch(`https://crio-location-selector.onrender.com/country=${selectedCountry}/state=${selectedState}/cities`);
          if (!response.ok) {
            throw new Error('Failed to fetch cities');
          }
          const data = await response.json();
          setCities(data);
          setSelectedCity(''); // Clear city when state changes
        } catch (error) {
          setErrorMessage('Failed to fetch cities. Please try again later.');
          console.error('Error fetching cities:', error);
        }
      }
    };
    fetchCities();
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
        <div className="dropdown">
          <label htmlFor="state">Select State:</label>
          <select
            id="state"
            value={selectedState}
            onChange={(e) => setSelectedState(e.target.value)}
            disabled={!selectedCountry} // Disable if no country is selected
          >
            <option value="">--Select State--</option>
            {states.map((state) => (
              <option key={state} value={state}>
                {state}
              </option>
            ))}
          </select>
        </div>

        {/* Select City Dropdown */}
        <div className="dropdown">
          <label htmlFor="city">Select City:</label>
          <select
            id="city"
            value={selectedCity}
            onChange={handleCityChange}
            disabled={!selectedState} // Disable if no state is selected
          >
            <option value="">--Select City--</option>
            {cities.map((city) => (
              <option key={city} value={city}>
                {city}
              </option>
            ))}
          </select>
        </div>
      </form>

      {/* Display Selection Output */}
      {selectionOutput && <p>{selectionOutput}</p>}

      {/* Display Error Message */}
      {errorMessage && <p className="error-message">{errorMessage}</p>}
    </div>
  );
};

export default LocationSelector;
