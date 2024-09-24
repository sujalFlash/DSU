import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AddDisease = () => {
  const [diseaseName, setDiseaseName] = useState('');
  const [facilities, setFacilities] = useState(''); // State for facilities input
  const navigate = useNavigate();
  const accessToken = localStorage.getItem('accessToken');

  const handleAddDisease = (e) => {
    e.preventDefault();

    // Create the disease data object
    const diseaseData = {
      name: diseaseName,   // Input disease name
      facilities,          // Input facilities
    };

    // Log the data to be sent for debugging
    console.log('Disease data being sent:', diseaseData);

    // Send the POST request to add a disease
    fetch('http://127.0.0.1:8000/api/add_disease/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`, // Include the access token for authentication
      },
      body: JSON.stringify(diseaseData), // Send the disease data
    })
      .then((response) => {
        if (response.ok) {
          return response.json(); // Parse the JSON response
        } else {
          return response.json().then((errData) => {
            console.error('Error details:', errData); // Log error details
            throw new Error(`Error ${response.status}: ${errData.message || response.statusText}`);
          });
        }
      })
      .then((data) => {
        alert('Disease added successfully'); // Alert on success
        setDiseaseName(''); // Clear the disease name input
        setFacilities('');  // Clear the facilities input
        navigate('/hospitals'); // Redirect after adding disease
      })
      .catch((error) => {
        console.error('Error adding disease:', error.message); // Log error message
        alert('There was an error adding the disease. Please try again.'); // Alert user on error
      });
  };

  return (
    <div className="add-disease-container">
      <h2>Add a New Disease</h2>
      <form onSubmit={handleAddDisease}>
        <div className="form-group">
          <label htmlFor="diseaseName">Disease Name</label>
          <input
            type="text"
            id="diseaseName"
            value={diseaseName} // Bind input value to state
            onChange={(e) => setDiseaseName(e.target.value)} // Update disease name
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="facilities">Facilities</label>
          <input
            type="text"
            id="facilities"
            value={facilities} // Bind input value to state
            onChange={(e) => setFacilities(e.target.value)} // Update facilities
            required
          />
        </div>
        <button type="submit" className="btn">Add Disease</button>
      </form>
    </div>
  );
};

export default AddDisease;
