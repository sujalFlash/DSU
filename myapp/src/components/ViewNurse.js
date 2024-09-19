import React, { useState, useEffect } from 'react';

const ViewNurses = () => {
  const [nurses, setNurses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchNurses = async () => {
      try {
        const response = await fetch('http://127.0.0.1:8000/api/view_nurses/', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`
          }
        });

        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        const data = await response.json();
        setNurses(data);
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchNurses();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error fetching nurses: {error.message}</div>;
  }

  return (
    <div className="view-nurses-container">
      <h2>Nurses List</h2>
      {nurses.length > 0 ? (
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
            {nurses.map((nurse) => (
              <tr key={nurse.id}>
                <td>{nurse.id}</td>
                <td>{nurse.name || 'N/A'}</td>
                <td>{nurse.role || 'N/A'}</td>
                <td>{nurse.departments && nurse.departments[0]?.name || 'N/A'}</td>
                <td>{nurse.departments && nurse.departments[0]?.description || 'N/A'}</td>
                <td>{nurse.departments && nurse.departments[0]?.hospital || 'N/A'}</td>
                <td>{nurse.shift || 'N/A'}</td>
                <td>{nurse.status || 'N/A'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No nurses available.</p>
      )}
    </div>
  );
};

export default ViewNurses;
