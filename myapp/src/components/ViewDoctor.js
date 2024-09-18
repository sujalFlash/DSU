import React, { useState, useEffect } from 'react';

const ViewDoctors = () => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const response = await fetch(`http://127.0.0.1:8000/api/view_doctors/`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`
          }
        });

        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        const data = await response.json();
        console.log('Doctors data:', data); // Log the API response
        setDoctors(data);
      } catch (error) {
        console.error('Error fetching doctors:', error);
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchDoctors();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error fetching data: {error.message}</div>;
  }

  return (
    <div className="view-doctors-container">
      <h2>Doctors List</h2>
      {doctors.length > 0 ? (
        <ul>
          {doctors.map((doctor) => (
            <li key={doctor.id}>
              <h3>Doctor ID: {doctor.id}</h3>
              <p>Name: {doctor.name || 'N/A'}</p>
              <p>Specialization: {doctor.specialization || 'N/A'}</p>
              <p>Hospital: {doctor.hospital || 'N/A'}</p>
              <p>Shift: {doctor.shift || 'N/A'}</p>
              {/* Add more fields as needed */}
            </li>
          ))}
        </ul>
      ) : (
        <p>No doctors available.</p>
      )}
    </div>
  );
};

export default ViewDoctors;
