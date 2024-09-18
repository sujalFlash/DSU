import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Dashboard.css';

const Dashboard = () => {
  const navigate = useNavigate();
  const accessToken = localStorage.getItem('accessToken');

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    navigate('/login'); // Redirect to login after logout
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1 className="dashboard-title">Manager Dashboard</h1>
        <button className="logout-btn" onClick={handleLogout}>Logout</button>
      </div>
      <div className="dashboard-buttons">
        <Link to="/staff-management" className="btn">Staff Management</Link>
        <Link to="/image-management" className="btn">Image Management</Link>
        <Link to="/patient-management" className="btn">Patient Management</Link>
        <Link to="/create-department" className="btn">Create Department</Link>
        <Link to="/create-user" className="btn">Create User</Link>
        <Link to="/list-department" className="btn">List Department</Link>
        <Link to="/disease-history" className="btn">View Disease History</Link> {/* Updated this line */}
        <Link to="/view-doctor" className="btn">View Doctor</Link>
        <Link to="/delete-doctor" className="btn">Delete Doctor</Link>
        <Link to="/view-nurse" className="btn">View Nurse</Link>
        <button className="btn">Delete Nurse</button>
        <Link to="/view-cleaners" className="btn">View Cleaner</Link>
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
