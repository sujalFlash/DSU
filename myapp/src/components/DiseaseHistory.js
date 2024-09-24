import React, { useEffect, useState } from 'react';
import Modal from 'react-modal'; // You can also use another modal library

// Function to get access token from localStorage
const getAccessToken = () => {
  return localStorage.getItem('accessToken');
};

// Set up the modal root element (required for react-modal)
Modal.setAppElement('#root');

const DiseaseHistory = () => {
  const [diseaseHistory, setDiseaseHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [currentSeverity, setCurrentSeverity] = useState('M'); // Default value
  const [currentId, setCurrentId] = useState(null);

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

  useEffect(() => {
    fetchDiseaseHistory();
  }, []); // Fetch data once when component mounts

  const openModal = (id, severity) => {
    setCurrentId(id);
    setCurrentSeverity(severity);
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
  };

  const handleUpdateSeverity = async () => {
    const accessToken = getAccessToken();
    
    if (!accessToken) {
      setError('Access token is missing');
      return;
    }

    try {
      const response = await fetch(`http://127.0.0.1:8000/disease-history/${currentId}/`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ severity: currentSeverity }), // Only sending severity
      });

      if (response.ok) {
        // Refresh the disease history after update
        await fetchDiseaseHistory();
        closeModal();
      } else {
        const responseText = await response.text();
        setError('Failed to update severity: ' + responseText);
      }
    } catch (err) {
      console.error('Network error:', err);
      setError('An error occurred while updating severity');
    }
  };

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
              <th>Actions</th>
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
                <td>
                  <button onClick={() => openModal(history.id, history.severity)}>Update Severity</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No disease history found.</p>
      )}

      {/* Modal for updating severity */}
      <Modal isOpen={modalIsOpen} onRequestClose={closeModal}>
        <h2>Update Severity</h2>
        <label>
          Severity:
          <select
            value={currentSeverity}
            onChange={(e) => setCurrentSeverity(e.target.value)}
          >
            <option value="M">M</option>
            <option value="MO">MO</option>
            <option value="S">S</option>
          </select>
        </label>
        <button onClick={handleUpdateSeverity}>Update</button>
        <button onClick={closeModal}>Close</button>
      </Modal>
    </div>
  );
};

export default DiseaseHistory;
