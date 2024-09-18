// src/components/CreateUser.js
import React from 'react';
import { Link } from 'react-router-dom';


const CreateUser = () => {
  return (
    <div className="create-user-container">
      <h2>Create User</h2>
      <div className="create-user-buttons">
        <Link to="/create-cleaner" className="btn">Create Cleaner</Link>
        <Link to="/create-receptionist" className="btn">Create Receptionist</Link>
        <Link to="/create-nurse" className="btn">Create Nurse</Link>
        <Link to="/create-doctor" className="btn">Create Doctor</Link>
      </div>
    </div>
  );
};

export default CreateUser;
