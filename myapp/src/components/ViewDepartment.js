import React, { useState, useEffect } from 'react';

const ViewDepartments = () => {
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const accessToken = localStorage.getItem('accessToken');

  useEffect(() => {
    // Fetch departments from the API
    const fetchDepartments = async () => {
      try {
        const response = await fetch('http://127.0.0.1:8000/api/view_department/', {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        
        if (!response.ok) {
          throw new Error('Failed to fetch departments');
        }

        const data = await response.json();
        setDepartments(data);
        setLoading(false);
      } catch (error) {
        setError(error.message);
        setLoading(false);
      }
    };

    fetchDepartments();
  }, [accessToken]);

  if (loading) {
    return <p>Loading departments...</p>;
  }

  if (error) {
    return <p>Error loading departments: {error}</p>;
  }

  return (
    <div className="department-container" style={{ overflowY: 'scroll', padding: '20px', height: '100vh' }}>
      <h2>Departments</h2>
      <ul>
        {departments.length === 0 ? (
          <p>No departments found.</p>
        ) : (
          departments.map((department) => (
            <li key={department.id}>
              <strong>{department.name}</strong>
              <p>ID: {department.id}</p>
            </li>
          ))
        )}
      </ul>
    </div>
  );
};

export default ViewDepartments;
