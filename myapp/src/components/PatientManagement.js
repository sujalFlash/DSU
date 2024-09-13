
  import React, { useState } from 'react';
  import './PatientManagement.css';
  
  const PatientManagement = () => {
    // State to store patients
    const [patients, setPatients] = useState([
      { id: 1, name: 'John Doe', age: 30, contactNumber: '123-456-7890', diseaseDetected: 'Yes', imageStatus: 'Uploaded' },
      { id: 2, name: 'Jane Smith', age: 45, contactNumber: '234-567-8901', diseaseDetected: 'No', imageStatus: 'Not Uploaded' },
      { id: 3, name: 'Michael Johnson', age: 50, contactNumber: '345-678-9012', diseaseDetected: 'Yes', imageStatus: 'Uploaded' },
      { id: 4, name: 'Emily Davis', age: 60, contactNumber: '456-789-0123', diseaseDetected: 'No', imageStatus: 'Not Uploaded' },
      { id: 5, name: 'William Brown', age: 33, contactNumber: '567-890-1234', diseaseDetected: 'Yes', imageStatus: 'Uploaded' },
      { id: 6, name: 'Sophia Wilson', age: 28, contactNumber: '678-901-2345', diseaseDetected: 'No', imageStatus: 'Uploaded' },
      { id: 7, name: 'James Jones', age: 40, contactNumber: '789-012-3456', diseaseDetected: 'Yes', imageStatus: 'Not Uploaded' },
      { id: 8, name: 'Olivia Garcia', age: 50, contactNumber: '890-123-4567', diseaseDetected: 'No', imageStatus: 'Uploaded' },
      { id: 9, name: 'Liam Martinez', age: 37, contactNumber: '901-234-5678', diseaseDetected: 'Yes', imageStatus: 'Not Uploaded' },
      { id: 10, name: 'Isabella Anderson', age: 29, contactNumber: '012-345-6789', diseaseDetected: 'No', imageStatus: 'Uploaded' },
    ]);
  
    // Modal visibility state for creating and updating
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedPatient, setSelectedPatient] = useState(null);
  
    // State to track if it's creating a new patient
    const [isCreating, setIsCreating] = useState(false);
  
    // Delete patient
    const handleDelete = (id) => {
      const updatedPatients = patients.filter((patient) => patient.id !== id);
      setPatients(updatedPatients);
    };
  
    // Open modal to create a new patient
    const handleCreate = () => {
      setIsCreating(true);
      setSelectedPatient({
        id: patients.length + 1,
        name: '',
        age: '',
        contactNumber: '',
        diseaseDetected: '',
        imageStatus: '',
      });
      setIsModalOpen(true);
    };
  
    // Open modal and set selected patient for editing
    const handleUpdate = (patient) => {
      setIsCreating(false);
      setSelectedPatient(patient);
      setIsModalOpen(true);
    };
  
    // Handle form change
    const handleInputChange = (e) => {
      const { name, value } = e.target;
      setSelectedPatient((prevPatient) => ({ ...prevPatient, [name]: value }));
    };
  
    // Save new or updated patient details
    const handleSave = () => {
      if (isCreating) {
        setPatients([...patients, selectedPatient]); // Add new patient
      } else {
        const updatedPatients = patients.map((patient) =>
          patient.id === selectedPatient.id ? selectedPatient : patient
        );
        setPatients(updatedPatients); // Update existing patient
      }
      setIsModalOpen(false); // Close the modal
    };
  
    return (
      <div className="patient-management-container">
        <h1 className="pm-title">Patient Management</h1>
        {/* Create Button */}
        <button className="pm-create-btn" onClick={handleCreate}>
          Create
        </button>
  
        <table className="pm-table">
          <thead>
            <tr>
              <th>Patient Name</th>
              <th>Age</th>
              <th>Contact Number</th>
              <th>Disease Detected</th>
              <th>Image Uploaded</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {patients.map((patient) => (
              <tr key={patient.id}>
                <td>{patient.name}</td>
                <td>{patient.age}</td>
                <td>{patient.contactNumber}</td>
                <td>{patient.diseaseDetected}</td>
                <td>{patient.imageStatus}</td>
                <td>
                  <button className="pm-btn" onClick={() => handleUpdate(patient)}>Update</button>
                  <button className="pm-btn" onClick={() => handleDelete(patient.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
  
        {/* Modal for creating or updating patient details */}
        {isModalOpen && selectedPatient && (
          <div className="modal">
            <div className="modal-content">
              <h2>{isCreating ? 'Create New Patient' : 'Update Patient Details'}</h2>
              <form className='forms'>
                <label>
                  Name:
                  <input
                    type="text"
                    name="name"
                    value={selectedPatient.name}
                    onChange={handleInputChange}
                    className='size'
                  />
                </label>
                <label>
                  Age:
                  <input
                    type="number"
                    name="age"
                    value={selectedPatient.age}
                    onChange={handleInputChange}
                    className='size'
                  />
                </label>
                <label>
                  Contact:
                  <input
                    type="text"
                    name="contactNumber"
                    value={selectedPatient.contactNumber}
                    onChange={handleInputChange}
                    className='size'
                  />
                </label>
                <label>
                  Disease Detected:
                  <input
                    type="text"
                    name="diseaseDetected"
                    value={selectedPatient.diseaseDetected}
                    onChange={handleInputChange}
                    className='size'
                  />
                </label>
                <label>
                  Image Status:
                  <input
                    type="text"
                    name="imageStatus"
                    value={selectedPatient.imageStatus}
                    onChange={handleInputChange}
                    className='size'
                  />
                </label>
              </form>
              <div className='sc-btn'>
                <button className="pm-btn" onClick={handleSave}>Save</button>
                <button className="pm-btn" onClick={() => setIsModalOpen(false)}>Close</button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };
  
  export default PatientManagement;
  