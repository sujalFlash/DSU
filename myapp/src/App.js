// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './components/HomePage';
import LoginPage from './components/LoginPage';
import SignupPage from './components/SignupPage';
import Dashboard from './components/Dashboard';
import StaffManagement from './components/StaffManagement';
import ImageManagement from './components/ImageManagement';
import PatientManagement from './components/PatientManagement';
import CreateDepartment from './components/CreateDepartment';
import ListDepartment from './components/ListDepartment';
import HospitalsPage from './components/HospitalsPage';
import CreateUser from './components/CreateUser';
import CreateNurse from './components/CreateNurse';
import DiseaseHistory from './components/DiseaseHistory';
import ViewDoctor from  './components/ViewDoctor';
import ViewNurse from  './components/ViewNurse';
import ViewCleaners from  './components/ViewCleaners';
import DeleteDoctor from './components/DeleteDoctor';
import DeleteNurse from './components/DeleteNurse';
import DeleteCleaners from './components/DeleteCleaners';

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
        <Route path="/create-department" element={<CreateDepartment />} />
        <Route path="/list-department" element={<ListDepartment />} />
        <Route path="/hospitals" element={<HospitalsPage />} />
        <Route path="/create-user" element={<CreateUser />} />
        <Route path="/create-nurse" element={<CreateNurse />} /> 
        <Route path="/disease-history" element={<DiseaseHistory />} />
        <Route path="/view-doctor" element={<ViewDoctor />} />
        <Route path="/view-nurse" element={<ViewNurse />} />
        <Route path="/view-cleaners" element={<ViewCleaners />} />
        <Route path="/delete-doctor" element={<DeleteDoctor />} />
        <Route path="/delete-nurse" element={<DeleteNurse />} />
        <Route path="/delete-cleaners" element={<DeleteCleaners />} />
      </Routes>
    </Router>
  );
}

export default App;
