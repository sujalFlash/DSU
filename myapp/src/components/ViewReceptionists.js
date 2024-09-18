import React, { useState, useEffect } from 'react';

const ViewReceptionists = () => {
  const [receptionists, setReceptionists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchReceptionists = async () => {
      try {
        const response = await fetch(`http://127.0.0.1:8000/api/view_reception_staff/`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`
          }
        });

        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        const data = await response.json();
        console.log('Receptionists data:', data); // Log the API response
        setReceptionists(data);
      } catch (error) {
        console.error('Error fetching receptionists:', error);
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchReceptionists();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error fetching data: {error.message}</div>;
  }

  return (
    <div className="view-receptionists-container">
      <h2>Receptionists List</h2>
      {receptionists.length > 0 ? (
        <ul>
          {receptionists.map((receptionist) => (
            <li key={receptionist.id}>
              <h3>Receptionist ID: {receptionist.id}</h3>
              <p>Name: {receptionist.name || 'N/A'}</p>
              <p>Shift: {receptionist.shift || 'N/A'}</p>
              <p>Department: {receptionist.department || 'N/A'}</p>
              <p>Hospital: {receptionist.hospital || 'N/A'}</p>
              {/* Add more fields as needed */}
            </li>
          ))}
        </ul>
      ) : (
        <p>No receptionists available.</p>
      )}
    </div>
  );
};

export default ViewReceptionists;
