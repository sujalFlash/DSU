import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './components/HomePage';
import LoginPage from './components/LoginPage';
import SignupPage from './components/SignupPage';
import Dashboard from './components/Dashboard';
import StaffManagement from './components/StaffManagement';
import ImageManagement from './components/ImageManagement';
import PatientManagement from './components/PatientManagement';



function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/staff-management" element={<StaffManagement />} />
        <Route path="/image-management" element={<ImageManagement />} />
        <Route path="/patient-management" element={<PatientManagement />} />
      </Routes>
    </Router>
  );
}

export default App;
