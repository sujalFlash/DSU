import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const CreateCleaner = () => {
  const [employeeId, setEmployeeId] = useState('');
  const [name, setName] = useState('');
  const [areaAssigned, setAreaAssigned] = useState(''); // New state for area assigned
  const [departments, setDepartments] = useState([]);
  const [selectedDepartments, setSelectedDepartments] = useState([]); // State for selected departments
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

  const handleDepartmentChange = (e) => {
    // Capture selected options and update state
    const selectedOptions = Array.from(e.target.selectedOptions, option => parseInt(option.value));
    setSelectedDepartments(selectedOptions); // Store selected department IDs as integers
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const cleanerData = {
      user_id: userid,
      employee_id: employeeId,
      name: name,
      area_assigned: areaAssigned, // Include area assigned
      departments: selectedDepartments, // Send selected department IDs as a list of integers
    };

    try {
      const response = await fetch('http://127.0.0.1:8000/api/create_customUser/add_cleaner/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(cleanerData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Error response from server:", errorData);
        throw new Error('Failed to create cleaner');
      }

      alert('Cleaner created successfully!');
      navigate('/view-cleaners'); // Navigate to view cleaner after creation
    } catch (err) {
      console.error('Error creating cleaner:', err);
      alert('Failed to create cleaner');
    }
  };

  return (
    <div className="create-cleaner-container">
      <h2>Create Cleaner</h2>
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
          multiple // Allow multiple selections
          value={selectedDepartments} // Bind the state array to the selected values
          onChange={handleDepartmentChange} // Handle multiple selections
          required
        >
          <option value="">Select Departments</option> {/* Default option */}
          {departments.map((dept) => (
            <option key={dept.id} value={dept.id}>
              {dept.name}
            </option>
          ))}
        </select>
        <button type="submit" className="btn">Create Cleaner</button>
      </form>
    </div>
  );
};

export default CreateCleaner;
