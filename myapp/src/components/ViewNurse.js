import React, { useState, useEffect } from 'react';
import './ViewNurse.css';
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
      <h2>Nurse List</h2>
      {nurses.length > 0 ? (
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Department Name</th>
              <th>Department Description</th>
              <th>Department Hospital</th>
              <th>Shift</th>
            </tr>
          </thead>
          <tbody>
            {nurses.map((nurse) => (
              <tr key={nurse.id}>
                <td>{nurse.id}</td>
                <td>{nurse.name}</td>
                <td>{nurse.departments[0].name}</td>
                <td>{nurse.departments[0].description}</td>
                <td>{nurse.departments[0].hospital}</td>
                <td>{nurse.shift}</td>
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
