import React, { useEffect, useState } from 'react';

// Function to get access token from localStorage
const getAccessToken = () => {
  return localStorage.getItem('accessToken');
};

const DiseaseHistory = () => {
  const [diseaseHistory, setDiseaseHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Function to fetch disease history from API
    const fetchDiseaseHistory = async () => {
        const accessToken = getAccessToken();
    
        if (!accessToken) {
            setError('Access token is missing');
            setLoading(false);
            return;
        }
    
        try {
            const response = await fetch('http://127.0.0.1:8000/api/view_diesease_history/', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`,
                },
            });
    
            if (response.ok) {
                const data = await response.json();
                setDiseaseHistory(data);
            } else {
                const errorData = await response.json();
                setError('Failed to fetch disease history: ' + errorData.detail);
            }
        } catch (err) {
            console.error('Network error:', err);
            setError('An error occurred while fetching disease history');
        } finally {
            setLoading(false);
        }
    };
    

    fetchDiseaseHistory();
  }, []); // Fetch data once when component mounts

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="disease-history-container">
      <h2>Disease History</h2>
      {diseaseHistory.length > 0 ? (
        <table className="disease-history-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Patient Name</th>
              <th>Disease</th>
              <th>Hospital</th>
              <th>Date Diagnosed</th>
              <th>Status</th>
              <th>Severity</th>
              <th>Admitted</th>
            </tr>
          </thead>
          <tbody>
            {diseaseHistory.map((history) => (
              <tr key={history.id}>
                <td>{history.id}</td>
                <td>{history.patient_name}</td>
                <td>{history.disease_name}</td>
                <td>{history.hospital_name}</td>
                <td>{history.date_diagnosed}</td>
                <td>{history.status}</td>
                <td>{history.severity}</td>
                <td>{history.is_admitted ? 'Yes' : 'No'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No disease history found.</p>
      )}
    </div>
  );
};

export default DiseaseHistory;
