import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const CreateNurse = () => {
  const [employeeId, setEmployeeId] = useState('');
  const [name, setName] = useState('');
  const [specialization, setSpecialization] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState(''); // Store selected department ID
  const [departments, setDepartments] = useState([]);
  const navigate = useNavigate();
  const accessToken = localStorage.getItem('accessToken');
  const userId = localStorage.getItem('newUserId'); // Get user ID from localStorage

  useEffect(() => {
    // Fetch department data for the dropdown
    fetch('http://127.0.0.1:8000/api/view_department/', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
      .then(response => response.json())
      .then(data => {
        setDepartments(data);
      })
      .catch(error => console.error('Error fetching departments:', error));
  }, [accessToken]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Preparing the nurse data to be sent in the API request
    const nurseData = {
      user: userId, // Ensure user ID is included
      employee_id: employeeId,
      name: name,
      specialization: specialization,
      departments: [parseInt(selectedDepartment)], // Wrap department ID in an array
      role: 'nurse', // Set the role to 'nurse'
    };

    try {
      // Sending the POST request to create a nurse
      const response = await fetch('http://127.0.0.1:8000/api/create_customUser/add_nurse/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(nurseData), // Send nurse data as JSON
      });

      // Check if the response is not successful
      if (!response.ok) {
        const errorData = await response.json();
        console.error("Error response from server:", errorData);
        const errorMessage = errorData.message || 'Failed to create nurse';
        throw new Error(errorMessage);
      }

      // Handle successful response
      alert('Nurse created successfully!');
      navigate('/view-nurse'); // Redirect after nurse creation
    } catch (err) {
      console.error('Error creating nurse:', err.message || err);
      alert(`Failed to create nurse: ${err.message || 'Unknown error'}`);
    }
  };

  return (
    <div className="create-nurse-container">
      <h2>Create Nurse</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Employee ID"
          value={employeeId}
          onChange={(e) => setEmployeeId(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Specialization"
          value={specialization}
          onChange={(e) => setSpecialization(e.target.value)}
          required
        />
        <select
          value={selectedDepartment}
          onChange={(e) => setSelectedDepartment(e.target.value)}
          required
        >
          <option value="">Select Department</option>
          {departments.map((dept) => (
            <option key={dept.id} value={dept.id}>
              {dept.name}
            </option>
          ))}
        </select>
        <button type="submit" className="btn">Create Nurse</button>
      </form>
    </div>
  );
};

export default CreateNurse;
