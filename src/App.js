import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';

const List = () => {
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [selectedState, setSelectedState] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`http://api.minebrat.com/api/v1/states`)
      .then(response => response.json())
      .then(data => {
        //console.log(data)
        setStates(data);
        setLoading(false);
        //console.log(states)
      })
      .catch(error => console.error(error))
  });

  useEffect(() => {
    if (selectedState) {
      fetch(`https://api.minebrat.com/api/v1/states/cities/${selectedState}`)
        .then(response => response.json())
        .then(data => {
          console.log('Cities data:', data); // log the data returned from the API
          setCities(data);
          console.log('Cities data:', data)
        })
        .catch(error => console.error(error))
    }
  }, [selectedState]);

  if (loading) {
    return <div>Loading...</div>;
  }
   // Find the selected state object
   const selectedStateObj = states.find(state => state.stateId === selectedState);

   // Find the selected city object
   const selectedCityObj = cities.find(city => city.cityId === selectedCity);
 

 return (
    <div>
      <select onChange={e => setSelectedState(e.target.value)}>
        <option value="">Select a state</option>
        {states.map((state, index) => {
          //console.log('State:', state); // log each state object
          return (
            <option key={index} value={state.stateId}>
              {state.stateName}
            </option>
          );
        })}
      </select>

      <CitiesList cities={cities} onChange={setSelectedCity} />
      <Link to={`result?state=${selectedStateObj?.stateName}&city=${selectedCityObj?.cityName}`}>
        <button>Submit</button>
      </Link>
    </div>
  );
};
const CitiesList = ({ cities, onChange }) => {
  return (
    <select onChange={e => onChange(e.target.value)}>
      <option value="">Select a city</option>
      {cities.map((city, index) => {
        console.log('City:', city); // log each city object
        return (
          <option key={index} value={city.cityId}>
            {city.cityName}
          </option>
        );
      })}
    </select>
  );
};


const Result = () => {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const state = params.get('state');
  const city = params.get('city');

  return (
    <h1>
      You have selected {city}, {state}
    </h1>
  );
};

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<List />} />
        <Route path="/result" element={<Result />} />
      </Routes>
    </Router>
  );
};

export default App;
