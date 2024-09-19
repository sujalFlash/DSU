import React, { useState, useEffect } from 'react';
import './ViewCleaners.css'; // Ensure you have this CSS file for styling

const ViewCleaners = () => {
  const [cleaners, setCleaners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCleaners = async () => {
      try {
        const response = await fetch('http://127.0.0.1:8000/api/view_cleaners/', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
          },
        });

        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        const data = await response.json();
        setCleaners(data);
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchCleaners();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error fetching cleaners: {error.message}</div>;
  }

  return (
    <div className="view-cleaners-container">
      <h2>Cleaners List</h2>
      {cleaners.length > 0 ? (
        <table className="cleaners-table">
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
            {cleaners.map((cleaner) => (
              <tr key={cleaner.id}>
                <td>{cleaner.id}</td>
                <td>{cleaner.name || 'N/A'}</td>
                <td>{cleaner.role || 'N/A'}</td>
                <td>{cleaner.departments && cleaner.departments[0]?.name || 'N/A'}</td>
                <td>{cleaner.departments && cleaner.departments[0]?.description || 'N/A'}</td>
                <td>{cleaner.departments && cleaner.departments[0]?.hospital || 'N/A'}</td>
                <td>{cleaner.shift || 'N/A'}</td>
                <td>{cleaner.status || 'N/A'}</td> {/* Assuming `status` is available in the data */}
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No cleaners available.</p>
      )}
    </div>
  );
};

export default ViewCleaners;
