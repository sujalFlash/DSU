import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ViewMedicine = () => {
  const [medicines, setMedicines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const accessToken = localStorage.getItem('accessToken');
  console.log('Access Token:', accessToken); // Ensure this returns the expected token

  useEffect(() => {
    const fetchMedicines = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:8000/api/medicine_view/', {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`
          },
        });
        console.log('API Response:', response.data); // Log the API response
        setMedicines(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching medicines:', error); // Log full error details
        setError(error.response ? error.response.data : error.message);
        setLoading(false);
      }
    };

    fetchMedicines();
  }, [accessToken]); // Ensure useEffect runs when accessToken changes

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <h1>Medicine List</h1>
      {medicines.length === 0 ? (
        <p>No medicines available</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Description</th>
              <th>Price</th>
              <th>Quantity</th>
            </tr>
          </thead>
          <tbody>
            {medicines.map((medicine) => (
              <tr key={medicine.id}>
                <td>{medicine.id}</td>
                <td>{medicine.name}</td>
                <td>{medicine.description}</td>
                <td>{medicine.price}</td>
                <td>{medicine.quantity}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ViewMedicine;
