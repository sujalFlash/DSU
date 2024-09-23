import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const CreateDoctor = () => {
  const [employeeId, setEmployeeId] = useState('');
  const [name, setName] = useState('');
  const [areaAssigned, setAreaAssigned] = useState(''); // New state for area assigned
  const [departments, setDepartments] = useState([]);
  const [selectedDepartment, setSelectedDepartment] = useState(''); // State for selected department
  const navigate = useNavigate();
  const accessToken = localStorage.getItem('accessToken');
  const userid = localStorage.getItem('newUserId');

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
    const doctorData = {
      user_id: userid,
      employee_id: employeeId,
      name: name,
      area_assigned: areaAssigned, // Include area assigned
      department: parseInt(selectedDepartment), // Send selected department ID as an integer
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
        console.error("Error response from server:", errorData);
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
          placeholder="Area Assigned"
          value={areaAssigned}
          onChange={(e) => setAreaAssigned(e.target.value)}
          required
        />
        <select
          value={selectedDepartment} // Bind the state to the selected value
          onChange={(e) => setSelectedDepartment(e.target.value)} // Handle selection change
          required
        >
          <option value="">Select Department</option> {/* Default option */}
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
