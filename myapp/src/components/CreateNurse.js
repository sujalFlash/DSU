// src/components/CreateNurse.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const CreateNurse = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [empId, setEmpId] = useState('');
  const [role, setRole] = useState('');
  const [shift, setShift] = useState('');
  const [department, setDepartment] = useState('');
  const [status, setStatus] = useState('');
  const [isInHospital, setIsInHospital] = useState(false);
  const [isOnDuty, setIsOnDuty] = useState(false);
  const [hospitalName, setHospitalName] = useState('');

  const navigate = useNavigate();

  useEffect(() => {
    // Fetch hospital name (replace with appropriate logic to get the hospital name)
    fetch('http://127.0.0.1:8000/api/get_hospital_name/')
      .then(response => response.json())
      .then(data => setHospitalName(data.name));

    // Fetch departments based on hospital name (if needed)
    // For now, using a static list of departments
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Step 1: Send POST request to create user
      const userResponse = await fetch('http://127.0.0.1:8000/api/create_customUser/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      if (userResponse.ok) {
        const userData = await userResponse.json();
        const userId = userData.id;

        // Step 2: Post additional nurse details
        const nurseResponse = await fetch('http://127.0.0.1:8000/api/create_customUser/add_nurse/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            user_id: userId,
            name,
            empid: empId,
            role,
            shift,
            department,
            status,
            is_in_hospital: isInHospital,
            is_on_duty: isOnDuty,
          }),
        });

        if (nurseResponse.ok) {
          alert('Nurse created successfully!');
          navigate('/dashboard'); // Redirect after successful creation
        } else {
          const errorData = await nurseResponse.json();
          alert(`Error adding nurse: ${errorData.detail}`);
        }
      } else {
        const errorData = await userResponse.json();
        alert(`Error creating user: ${errorData.detail}`);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred. Please try again.');
    }
  };

  return (
    <div className="create-nurse-container">
      <h2>Create Nurse</h2>
      <form onSubmit={handleSubmit} className="create-nurse-form">
        <div className="form-group">
          <label htmlFor="username">Username:</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="name">Name:</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="empid">Employee ID:</label>
          <input
            type="text"
            id="empid"
            value={empId}
            onChange={(e) => setEmpId(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="role">Role:</label>
          <select
            id="role"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            required
          >
            <option value="">Select Role</option>
            <option value="nurse">Nurse</option>
            <option value="doctor">Doctor</option>
            <option value="cleaner">Cleaner</option>
            <option value="receptionist">Receptionist</option>
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="shift">Shift:</label>
          <select
            id="shift"
            value={shift}
            onChange={(e) => setShift(e.target.value)}
            required
          >
            <option value="">Select Shift</option>
            <option value="Day">Day</option>
            <option value="Night">Night</option>
            <option value="Rotating">Rotating</option>
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="department">Department:</label>
          <select
            id="department"
            value={department}
            onChange={(e) => setDepartment(e.target.value)}
            required
          >
            <option value="">Select Department</option>
            <option value="Cleaning">Cleaning</option>
            <option value="Radiologist">Radiologist</option>
            {/* Add more departments if needed */}
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="status">Status:</label>
          <select
            id="status"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            required
          >
            <option value="">Select Status</option>
            <option value="free">Free</option>
            <option value="working">Working</option>
            <option value="on_leave">On Leave</option>
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="is_in_hospital">In Hospital:</label>
          <input
            type="checkbox"
            id="is_in_hospital"
            checked={isInHospital}
            onChange={(e) => setIsInHospital(e.target.checked)}
          />
        </div>
        <div className="form-group">
          <label htmlFor="is_on_duty">On Duty:</label>
          <input
            type="checkbox"
            id="is_on_duty"
            checked={isOnDuty}
            onChange={(e) => setIsOnDuty(e.target.checked)}
          />
        </div>
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default CreateNurse;
