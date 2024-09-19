import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';


const CreateUser = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const accessToken = localStorage.getItem('accessToken');

  const handleCreateUser = (e) => {
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
      }),
    })
      .then(response => response.json())
      .then(data => {
        const userId = data.id; // Get the user ID returned by the API
        localStorage.setItem('newUserId', userId); // Save the ID in localStorage
        console.log(userId)
        alert('User created successfully!');
        navigate('/dashboard'); // Redirect to dashboard or any other page after creation
      })
      .catch(error => {
        console.error('Error creating user:', error);
        alert('Error creating user. Please try again.');
      });
  };

  return (
    <div className="create-user-container">
      <h1>Create New User</h1>
      <form onSubmit={handleCreateUser}>
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
    </div>
  );
};

export default CreateUser;
