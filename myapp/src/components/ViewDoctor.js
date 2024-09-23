import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';

Modal.setAppElement('#root'); // Set the root element for accessibility

const ViewDoctors = () => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingDoctor, setEditingDoctor] = useState(null);
  const [updatedDoctor, setUpdatedDoctor] = useState({});

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const response = await fetch(`http://127.0.0.1:8000/api/view_doctors/`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
          },
        });

        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        const data = await response.json();
        console.log('Doctors data:', data); // Log the API response
        setDoctors(data);
      } catch (error) {
        console.error('Error fetching doctors:', error);
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchDoctors();
  }, []);

  const handleDelete = async (doctorId) => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/api/delete_doctor/${doctorId}/`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to delete doctor');
      }

      // Remove the doctor from the UI
      setDoctors((prevDoctors) => prevDoctors.filter((doctor) => doctor.id !== doctorId));
      alert('Doctor deleted successfully!');
    } catch (error) {
      setError(error.message);
    }
  };

  const handleUpdate = async () => {
    if (!editingDoctor) {
      return;
    }

    try {
      const response = await fetch(`http://127.0.0.1:8000/api/doctor_update/${editingDoctor.id}/`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
        body: JSON.stringify(updatedDoctor),
      });

      if (!response.ok) {
        console.log(response)
        console.log(await response.json());
        throw new Error('Failed to update doctor');
      }

      // Update the doctor in the UI
      setDoctors((prevDoctors) =>
        prevDoctors.map((doctor) =>
          doctor.id === editingDoctor.id ? { ...doctor, ...updatedDoctor } : doctor
        )
      );
      alert('Doctor updated successfully!');
      setEditingDoctor(null);
      setUpdatedDoctor({});
    } catch (error) {
      setError(error.message);
    }
  };

  const handleChange = (e) => {
    setUpdatedDoctor({
      ...updatedDoctor,
      [e.target.name]: e.target.value,
    });
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error fetching data: {error}</div>;
  }

  return (
    <div className="view-doctors-container" style={{ overflowY: 'scroll', padding: '20px', height: '100vh' }}>
      <h2>Doctors List</h2>
      {doctors.length > 0 ? (
        <ul style={{ listStyleType: 'none', padding: 0 }}>
          {doctors.map((doctor) => (
            <li key={doctor.id} style={{ marginBottom: '20px', padding: '15px', border: '1px solid #ccc', borderRadius: '5px' }}>
              <h3>Doctor ID: {doctor.id}</h3>
              <p>Name: {doctor.name || 'N/A'}</p>
              <p>Specialization: {doctor.specialization || 'N/A'}</p>
              <p>Hospital: {doctor.hospital || 'N/A'}</p>
              <p>Shift: {doctor.shift || 'N/A'}</p>
              <p>Status: {doctor.status || 'N/A'}</p>
              <p>In Hospital: {doctor.is_in_hospital ? 'Yes' : 'No'}</p>
              <p>On Duty: {doctor.on_duty ? 'Yes' : 'No'}</p>
              <button onClick={() => handleDelete(doctor.id)} style={{ backgroundColor: 'red', color: 'white', marginRight: '10px' }}>
                Delete
              </button>
              <button onClick={() => { setEditingDoctor(doctor); setUpdatedDoctor(doctor); }} style={{ backgroundColor: 'blue', color: 'white' }}>
                Update
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p>No doctors available.</p>
      )}

      {/* Modal for updating doctor details */}
      <Modal
        isOpen={!!editingDoctor}
        onRequestClose={() => setEditingDoctor(null)}
        style={{
          content: {
            top: '50%',
            left: '50%',
            right: 'auto',
            bottom: 'auto',
            transform: 'translate(-50%, -50%)',
            width: '400px',
            padding: '20px',
            borderRadius: '10px',
          },
        }}
      >
        <h2>Update Doctor</h2>
        <label style={{ display: 'block', marginBottom: '10px' }}>
          Shift:
          <select
            name="shift"
            value={updatedDoctor.shift || ''}
            onChange={handleChange}
            style={{ display: 'block', width: '100%', marginTop: '5px' }}
          >
            <option value="">Select</option>
            <option value="Day">Day</option>
            <option value="Night">Night</option>
            <option value="Rotating">Rotating</option>
          </select>
        </label>
        <label style={{ display: 'block', marginBottom: '10px' }}>
          Status:
          <select
            name="status"
            value={updatedDoctor.status || ''}
            onChange={handleChange}
            style={{ display: 'block', width: '100%', marginTop: '5px' }}
          >
            <option value="">Select</option>
            <option value="free">Free </option>
            <option value="working">working</option>
            <option value="on_leave">On Leave</option>
          </select>
        </label>
        <label style={{ display: 'block', marginBottom: '10px' }}>
          In Hospital:
          <select
            name="is_in_hospital"
            value={updatedDoctor.is_in_hospital }
            onChange={handleChange}
            style={{ display: 'block', width: '100%', marginTop: '5px' }}
          >
            <option value="">Select</option>
            <option value={true}>Yes</option>
            <option value={false}>No</option>
          </select>
        </label>
        <label style={{ display: 'block', marginBottom: '10px' }}>
          On Duty:
          <select
            name="on_duty"
            value={updatedDoctor.on_duty }
            onChange={handleChange}
            style={{ display: 'block', width: '100%', marginTop: '5px' }}
          >
            <option value="">Select</option>
            <option value={true}>Yes</option>
            <option value={false}>No</option>
          </select>
        </label>
        <button onClick={handleUpdate} style={{ backgroundColor: 'green', color: 'white', marginRight: '10px' }}>
          Save Changes
        </button>
        <button onClick={() => setEditingDoctor(null)} style={{ backgroundColor: 'grey', color: 'white' }}>
          Cancel
        </button>
        {error && <p className="error">{error}</p>}
      </Modal>
    </div>
  );
};

export default ViewDoctors;
