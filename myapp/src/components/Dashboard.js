// src/components/Dashboard.js
import React from 'react';
import { Link } from 'react-router-dom';
import './Dashboard.css';

const Dashboard = () => {
  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1 className="dashboard-title">Manager Dashboard</h1>
        <button className="logout-btn">Logout</button>
      </div>
      <div className="dashboard-buttons">
        <Link to="/staff-management" className="btn">Staff Management</Link>
        <Link to="/image-management" className="btn">Image Management</Link>
        <Link to="/patient-management" className="btn">Patient Management</Link>
        <Link to="/create-department" className="btn">Create Department</Link>
        <Link to="/list-department" className="btn">List Department</Link> {/* Updated this button */}
        <Link to="/audit-and-logs" className="btn">Audit and Logs</Link>
        <Link to="/settings" className="btn">Settings</Link>
        <button className="btn">Reports and Analytics</button>
        <button className="btn">Notifications</button>
        <button className="btn">Help and Support</button>
      </div>
    </div>
  );
};

export default Dashboard;