import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const CreateUser = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const accessToken = localStorage.getItem('accessToken');

  const handleCreateUser = (e, role) => {
    e.preventDefault();

    fetch('http://127.0.0.1:8000/api/create_customUser/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        username: username,
        password: password,
        role: role, // Pass the role (doctor, nurse, etc.)
      }),
    })
      .then(response => response.json())
      .then(data => {
        const userId = data.id; // Get the user ID returned by the API
        if (userId) {
          localStorage.setItem('newUserId', userId); // Save the ID in localStorage
          console.log('User ID stored:', userId); // Confirm storage
          if (userId) {
           alert('User Created Successfully');
          } else {
            alert(`${role.charAt(0).toUpperCase() + role.slice(1)} created successfully!`);
          }
        } else {
          alert('Error: No user ID returned from the server.');
        }
      })
      .catch(error => {
        console.error(`Error creating ${role}:`, error);
        alert(`Error creating ${role}. Please try again.`);
      });
  };

  const handleUser =(e,role)=>{
       if(role=='doctor')navigate('../create-doctor')
        else if(role=='nurse')navigate('../create-nurse')
        else if(role=='receptionist')navigate('../create-receptionist')
          else if(role=='cleaner')navigate('../create-cleaner')
  }

  return (
    <div className="create-user-container">
      <h1>Create New User</h1>
      <form onSubmit={(e) => handleCreateUser(e, 'user')}>
        <label>Username:</label>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <label>Password:</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Create User</button>
      </form>

      <h2>Create with Specific Roles</h2>
      <div className="role-buttons">
        <button onClick={(e) => handleUser(e, 'doctor')}>Create Doctor</button>
        <button onClick={(e) => handleUser(e, 'nurse')}>Create Nurse</button>
        <button onClick={(e) => handleUser(e, 'receptionist')}>Create Receptionist</button>
        <button onClick={(e) => handleUser(e, 'cleaner')}>Create Cleaner</button>
      </div>
    </div>
  );
};

export default CreateUser;
