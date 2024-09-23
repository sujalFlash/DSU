import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';

Modal.setAppElement('#root'); // Set the root element for accessibility

const ViewReceptionist = () => {
  const [receptionists, setReceptionists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingReceptionist, setEditingReceptionist] = useState(null);
  const [updatedReceptionist, setUpdatedReceptionist] = useState({});

  useEffect(() => {
    const fetchReceptionists = async () => {
      try {
        const response = await fetch(`http://127.0.0.1:8000/api/view_reception_staff/`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
          },
        });

        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        const data = await response.json();
        setReceptionists(data);
      } catch (error) {
        console.error('Error fetching receptionists:', error);
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchReceptionists();
  }, []);

  const handleDelete = async (receptionistId) => {
    if (!window.confirm('Are you sure you want to delete this receptionist?')) {
      return;
    }

    try {
      const response = await fetch(`http://127.0.0.1:8000/api/delete_reception_staff/${receptionistId}/`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to delete receptionist');
      }

      // Remove the receptionist from the UI
      setReceptionists((prevReceptionists) => prevReceptionists.filter((receptionist) => receptionist.id !== receptionistId));
      alert('Receptionist deleted successfully!');
    } catch (error) {
      setError(error.message);
    }
  };

  const handleUpdate = async () => {
    if (!editingReceptionist) {
      return;
    }

    try {
      const response = await fetch(`http://127.0.0.1:8000/api/update_reception_staff/${editingReceptionist.id}/`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
        body: JSON.stringify(updatedReceptionist),
      });

      if (!response.ok) {
        throw new Error('Failed to update receptionist');
      }

      // Update the receptionist in the UI
      setReceptionists((prevReceptionists) =>
        prevReceptionists.map((receptionist) =>
          receptionist.id === editingReceptionist.id ? { ...receptionist, ...updatedReceptionist } : receptionist
        )
      );
      alert('Receptionist updated successfully!');
      setEditingReceptionist(null);
      setUpdatedReceptionist({});
    } catch (error) {
      setError(error.message);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUpdatedReceptionist({
      ...updatedReceptionist,
      [name]: name === 'is_in_hospital' || name === 'on_duty' ? value === 'true' : value, // Ensure boolean values are properly handled
    });
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error fetching data: {error}</div>;
  }

  return (
    <div className="view-receptionists-container" style={{ overflowY: 'scroll', padding: '20px', height: '100vh' }}>
      <h2>Receptionists List</h2>
      {receptionists.length > 0 ? (
        <ul style={{ listStyleType: 'none', padding: 0 }}>
          {receptionists.map((receptionist) => (
            <li key={receptionist.id} style={{ marginBottom: '20px', padding: '15px', border: '1px solid #ccc', borderRadius: '5px' }}>
              <h3>Receptionist ID: {receptionist.id}</h3>
              <p>Name: {receptionist.name || 'N/A'}</p>
              <p>Department: {receptionist.departments && receptionist.departments[0]?.name || 'N/A'}</p>
              <p>Desk Assigned: {receptionist.desk_assigned || 'N/A'}</p>
              <p>Shift: {receptionist.shift || 'N/A'}</p>
              <p>Status: {receptionist.status || 'N/A'}</p>
              <p>In Hospital: {receptionist.is_in_hospital ? 'Yes' : 'No'}</p>
              <p>On Duty: {receptionist.on_duty ? 'Yes' : 'No'}</p>
              <button onClick={() => handleDelete(receptionist.id)} style={{ backgroundColor: 'red', color: 'white', marginRight: '10px' }}>
                Delete
              </button>
              <button onClick={() => { setEditingReceptionist(receptionist); setUpdatedReceptionist(receptionist); }} style={{ backgroundColor: 'blue', color: 'white' }}>
                Update
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p>No receptionists available.</p>
      )}

      {/* Modal for updating receptionist details */}
      <Modal
        isOpen={!!editingReceptionist}
        onRequestClose={() => setEditingReceptionist(null)}
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
        <h2>Update Receptionist</h2>
        <label style={{ display: 'block', marginBottom: '10px' }}>
          Shift:
          <select
            name="shift"
            value={updatedReceptionist.shift || ''}
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
            value={updatedReceptionist.status || ''}
            onChange={handleChange}
            style={{ display: 'block', width: '100%', marginTop: '5px' }}
          >
            <option value="">Select</option>
            <option value="free">Free</option>
            <option value="working">Working</option>
            <option value="on_leave">On Leave</option>
          </select>
        </label>
        <label style={{ display: 'block', marginBottom: '10px' }}>
          Desk Assigned:
          <input
            type="text"
            name="desk_assigned"
            value={updatedReceptionist.desk_assigned || ''}
            onChange={handleChange}
            style={{ display: 'block', width: '100%', marginTop: '5px' }}
          />
        </label>
        <label style={{ display: 'block', marginBottom: '10px' }}>
          In Hospital:
          <select
            name="is_in_hospital"
            value={updatedReceptionist.is_in_hospital }
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
            value={updatedReceptionist.on_duty }
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
        <button onClick={() => setEditingReceptionist(null)} style={{ backgroundColor: 'grey', color: 'white' }}>
          Cancel
        </button>
        {error && <p className="error">{error}</p>}
      </Modal>
    </div>
  );
};

export default ViewReceptionist;
