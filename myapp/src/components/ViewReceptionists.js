import React, { useState, useEffect } from 'react';


const ViewReceptionists = () => {
  const [receptionists, setReceptionists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchReceptionists = async () => {
      try {
        const response = await fetch('http://127.0.0.1:8000/api/view_reception_staff/', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`
          }
        });

        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        const data = await response.json();
        setReceptionists(data);
      } catch (error) {
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
    return <div>Error fetching receptionists: {error.message}</div>;
  }

  return (
    <div className="view-receptionists-container" style={{ overflowY: 'scroll', padding: '20px', height: '100vh' }}>
      <h2>Receptionists List</h2>
      {receptionists.length > 0 ? (
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Role</th>
              <th>Department Name</th>
              <th>Department Description</th>
              <th>Department Hospital</th>
              <th>Shift</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {receptionists.map((receptionist) => (
              <tr key={receptionist.id}>
                <td>{receptionist.id}</td>
                <td>{receptionist.name || 'N/A'}</td>
                <td>{receptionist.role || 'N/A'}</td>
                <td>{receptionist.departments && receptionist.departments[0]?.name || 'N/A'}</td>
                <td>{receptionist.departments && receptionist.departments[0]?.description || 'N/A'}</td>
                <td>{receptionist.departments && receptionist.departments[0]?.hospital || 'N/A'}</td>
                <td>{receptionist.shift || 'N/A'}</td>
                <td>{receptionist.status || 'N/A'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No receptionists available.</p>
      )}
    </div>
  );
};

export default ViewReceptionists;
