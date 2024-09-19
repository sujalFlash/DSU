import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const CreateDoctor = () => {
  const [employeeId, setEmployeeId] = useState('');
  const [name, setName] = useState('');
  const [specialization, setSpecialization] = useState('');
  const [selectedDepartments, setSelectedDepartments] = useState([]); // Store selected department IDs
  const [departments, setDepartments] = useState([]);
  const navigate = useNavigate();
  const accessToken = localStorage.getItem('accessToken');
  const userid = localStorage.getItem('newUserId'); // Ensure user_id is correctly set

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
    const doctorData = {
      user_id: userid, // Ensure user_id is not null
      employee_id: employeeId,
      name: name,
      specialization: specialization,
      departments: selectedDepartments.map(deptId => parseInt(deptId)), // Send department IDs as integers
    };

    try {
      const response = await fetch('http://127.0.0.1:8000/api/create_customUser/doctors_create/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(doctorData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Error response from server:", errorData); // Log the error response
        throw new Error('Failed to create doctor');
      }

      alert('Doctor created successfully!');
      navigate('/view-doctor'); // Navigate to view doctor after creation
    } catch (err) {
      console.error('Error creating doctor:', err);
      alert('Failed to create doctor');
    }
  };

  return (
    <div className="create-doctor-container">
      <h2>Create Doctor</h2>
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
        <button type="submit" className="btn">Create Doctor</button>
      </form>
    </div>
  );
};

export default CreateDoctor;
