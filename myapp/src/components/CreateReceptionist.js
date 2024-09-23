import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const CreateReceptionist = () => {
  const [employeeId, setEmployeeId] = useState('');
  const [name, setName] = useState('');
  const [deskAssigned, setDeskAssigned] = useState(''); // Added state for deskAssigned
  const [selectedDepartments, setSelectedDepartments] = useState([]); // Store selected department IDs
  const [departments, setDepartments] = useState([]);
  const navigate = useNavigate();
  const accessToken = localStorage.getItem('accessToken');

  // Get the user ID passed from the CreateUser component
  const { state } = useLocation();
  const userid = state?.userId || localStorage.getItem('newUserId'); // Fallback to localStorage if userId is not passed

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

  const handleDepartmentChange = (e) => {
    // Capture selected options and update state
    const selectedOptions = Array.from(e.target.selectedOptions, option => option.value);
    setSelectedDepartments(selectedOptions); // Store selected department IDs
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Preparing the receptionist data to be sent in the API request
    const receptionistData = {
      user_id: userid, // Ensure user_id is not null
      employee_id: employeeId,
      name: name,
      departments: selectedDepartments.map(deptId => parseInt(deptId)), // Convert department IDs to integers
      desk_assigned: deskAssigned, // Include deskAssigned in the API request
    };

    try {
      // Sending the POST request to create a receptionist
      const response = await fetch('http://127.0.0.1:8000/api/create_customUser/add_reception_staff/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(receptionistData), // Send receptionist data as JSON
      });

      // Check if the response is not successful
      if (!response.ok) {
        const errorData = await response.json();
        console.error("Error response from server:", errorData); // Log the error details
        const errorMessage = errorData.message || 'Failed to create receptionist';
        throw new Error(errorMessage); // Throw a more descriptive error
      }

      // Handle successful response
      alert('Receptionist created successfully!');
      navigate('/view-receptionist'); // Redirect after receptionist creation
    } catch (err) {
      console.error('Error creating receptionist:', err.message || err); // Log the error
      alert(`Failed to create receptionist: ${err.message || 'Unknown error'}`); // Show error to the user
    }
  };

  return (
    <div className="create-receptionist-container">
      <h2>Create Receptionist</h2>
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
          type='text'
          placeholder='Desk Assigned'
          value={deskAssigned}
          onChange={(e)=> setDeskAssigned(e.target.value)} // Updated to set deskAssigned
          required
        />
        <select
          multiple // Allow multiple selections
          value={selectedDepartments} // Bind the state array to the selected values
          onChange={handleDepartmentChange} // Handle multiple selections
          required
        >
          {departments.map((dept) => (
            <option key={dept.id} value={dept.id}>
              {dept.name}
            </option>
          ))}
        </select>
        <button type="submit" className="btn">Create Receptionist</button>
      </form>
    </div>
  );
};

export default CreateReceptionist;
