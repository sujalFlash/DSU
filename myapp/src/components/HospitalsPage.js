import React, { useState, useEffect } from 'react';
import './HospitalsPage.css';

const HospitalsPage = () => {
  const [hospitals, setHospitals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [facilities, setFacilities] = useState({}); // To store facilities for each hospital
  const [clickCounts, setClickCounts] = useState({}); // To track clicks for each hospital

  useEffect(() => {
    // Fetch hospitals data from backend
    fetch('http://127.0.0.1:8000/hospitals/')
      .then(response => response.json())
      .then(data => {
        setHospitals(data);
        setLoading(false);
      })
      .catch(error => {
        console.error("Error fetching hospitals:", error);
        setLoading(false);
      });
  }, []);

  const viewFacilities = (hospitalId) => {
    // Update click count for the specific hospital
    setClickCounts(prevCounts => ({
      ...prevCounts,
      [hospitalId]: (prevCounts[hospitalId] || 0) + 1
    }));

    // Fetch facilities only if it's an odd click
    if ((clickCounts[hospitalId] || 0) % 2 === 0) {
      fetch('http://127.0.0.1:8000/view_facilities/')
        .then(response => response.json())
        .then(data => {
          // Filter facilities matching the hospital ID
          const hospitalFacilities = data.filter(facility => facility.hospital === hospitalId);
          setFacilities(prevFacilities => ({
            ...prevFacilities,
            [hospitalId]: hospitalFacilities.length > 0 ? hospitalFacilities : null
          }));
        })
        .catch(error => {
          console.error("Error fetching facilities:", error);
        });
    } else {
      // On even clicks, hide the facilities by setting the value to undefined
      setFacilities(prevFacilities => ({
        ...prevFacilities,
        [hospitalId]: undefined
      }));
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1 className='hp-title'>Hospital List</h1>
      <ul>
        {hospitals.map((hospital) => (
          <li key={hospital.id} className='hospital-item'>
            <h2>{hospital.name}</h2>
            <p>Address: {hospital.address}</p>
            <p>Contact: {hospital.contact_number}</p>
            <p>Email: {hospital.email}</p>
            <button
              className='view-facilities-btn'
              onClick={() => viewFacilities(hospital.id)}
            >
              View Facilities
            </button>

            {/* Conditionally render facilities if they are fetched */}
            {facilities[hospital.id] && (
              <div className='hospital-facilities'>
                <h3>Facilities:</h3>
                <ul>
                  {facilities[hospital.id].map(facility => (
                    <li key={facility.id}>
                      <strong>Disease:</strong> {facility.name}
                      <br />
                      <strong>Available Facilities:</strong> {facility.facilities}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* If there are no facilities found */}
            {facilities[hospital.id] === null && (
              <p>No facilities available for this hospital.</p>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default HospitalsPage;
