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
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
          },
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
    <div className="view-doctors-container" style={{ overflowY: 'scroll', padding: '20px', height: '100vh' }}>
      <h2>Doctors List</h2>
      {doctors.length > 0 ? (
        <ul style={{ listStyleType: 'none', padding: 0 }}>
          {doctors.map((doctor) => (
            <li key={doctor.id} style={{ marginBottom: '20px', padding: '15px', border: '1px solid #ccc', borderRadius: '5px' }}>
              <h3>Doctor ID: {doctor.id}</h3>
              <p>Name: {doctor.name || 'N/A'}</p>
              <p>Specialization: {doctor.specialization || 'N/A'}</p>
              <p>Hospital: {doctor.hospital || 'N/A'}</p>
              <p>Shift: {doctor.shift || 'N/A'}</p>
              {/* Displaying department details */}
              <h4>Departments:</h4>
              {doctor.departments && doctor.departments.length > 0 ? (
                <ul>
                  {doctor.departments.map((department, index) => (
                    <li key={index} style={{ marginLeft: '20px' }}>
                      <p><strong>Department Name:</strong> {department.name || 'N/A'}</p>
                      <p><strong>Description:</strong> {department.description || 'N/A'}</p>
                      <p><strong>Hospital:</strong> {department.hospital || 'N/A'}</p>
                    </li>
                  ))}
                </ul>
              ) : (
                <p>No departments available</p>
              )}
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
