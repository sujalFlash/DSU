import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';


Modal.setAppElement('#root'); // Set the root element for accessibility

const ViewCleaners = () => {
  const [cleaners, setCleaners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingCleaner, setEditingCleaner] = useState(null);
  const [updatedCleaner, setUpdatedCleaner] = useState({});

  useEffect(() => {
    const fetchCleaners = async () => {
      try {
        const response = await fetch(`http://127.0.0.1:8000/api/view_cleaners/`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
          },
        });

        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        const data = await response.json();
        setCleaners(data);
      } catch (error) {
        console.error('Error fetching cleaners:', error);
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchCleaners();
  }, []);

  const handleDelete = async (cleanerId) => {
    if (!window.confirm('Are you sure you want to delete this cleaner?')) {
      return;
    }

    try {
      const response = await fetch(`http://127.0.0.1:8000/api/delete_cleaner/${cleanerId}/`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Error deleting cleaner:", errorData);
        throw new Error(errorData.message || 'Failed to delete cleaner');
      }

      // Remove the cleaner from the UI
      setCleaners((prevCleaners) => prevCleaners.filter((cleaner) => cleaner.id !== cleanerId));
      alert('Cleaner deleted successfully!');
    } catch (error) {
      console.error('Error deleting cleaner:', error);
      setError(error.message);
    }
  };

  const handleUpdate = async () => {
    if (!editingCleaner) {
      return;
    }

    console.log('Updating cleaner with ID:', editingCleaner.id);
    console.log('Updated data:', updatedCleaner);

    try {
      const response = await fetch(`http://127.0.0.1:8000/api/cleaner_update/${editingCleaner.id}/`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
        body: JSON.stringify(updatedCleaner),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Error updating cleaner:", errorData);
        throw new Error(errorData.message || 'Failed to update cleaner');
      }

      // Update the cleaner in the UI
      setCleaners((prevCleaners) =>
        prevCleaners.map((cleaner) =>
          cleaner.id === editingCleaner.id ? { ...cleaner, ...updatedCleaner } : cleaner
        )
      );
      alert('Cleaner updated successfully!');
      setEditingCleaner(null);
      setUpdatedCleaner({});
    } catch (error) {
      console.error('Error updating cleaner:', error);
      setError(error.message);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUpdatedCleaner({
      ...updatedCleaner,
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
    <div className="view-cleaners-container" style={{ overflowY: 'scroll', padding: '20px', height: '100vh' }}>
      <h2>Cleaners List</h2>
      {cleaners.length > 0 ? (
        <ul style={{ listStyleType: 'none', padding: 0 }}>
          {cleaners.map((cleaner) => (
            <li key={cleaner.id} style={{ marginBottom: '20px', padding: '15px', border: '1px solid #ccc', borderRadius: '5px' }}>
              <h3>{cleaner.name || 'N/A'}</h3>
              <p><strong>ID:</strong> {cleaner.id}</p>
              <p><strong>Department Name:</strong> {cleaner.departments && cleaner.departments[0]?.name || 'N/A'}</p>
              <p><strong>Department Description:</strong> {cleaner.departments && cleaner.departments[0]?.description || 'N/A'}</p>
              <p><strong>Department Hospital:</strong> {cleaner.departments && cleaner.departments[0]?.hospital || 'N/A'}</p>
              <p><strong>Shift:</strong> {cleaner.shift || 'N/A'}</p>
              <p><strong>Status:</strong> {cleaner.status || 'N/A'}</p>
              <p><strong>Area Assigned:</strong> {cleaner.area_assigned || 'N/A'}</p>
              <p><strong>In Hospital:</strong> {cleaner.is_in_hospital ? 'Yes' : 'No'}</p>
              <p><strong>On Duty:</strong> {cleaner.on_duty ? 'Yes' : 'No'}</p>
              <div className="cleaner-actions">
                <button onClick={() => { setEditingCleaner(cleaner); setUpdatedCleaner(cleaner); }} style={{ backgroundColor: 'blue', color: 'white', marginRight: '10px' }}>
                  Update
                </button>
                <button onClick={() => handleDelete(cleaner.id)} style={{ backgroundColor: 'red', color: 'white' }}>
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p>No cleaners available.</p>
      )}

      {/* Modal for updating cleaner details */}
      <Modal
        isOpen={!!editingCleaner}
        onRequestClose={() => setEditingCleaner(null)}
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
        <h2>Update Cleaner</h2>
        <label style={{ display: 'block', marginBottom: '10px' }}>
          Area Assigned:
          <input
            type="text"
            name="area_assigned"
            value={updatedCleaner.area_assigned || ''}
            onChange={handleChange}
            style={{ display: 'block', width: '100%', marginTop: '5px' }}
            required
          />
        </label>
        <label style={{ display: 'block', marginBottom: '10px' }}>
          Shift:
          <select
            name="shift"
            value={updatedCleaner.shift || ''}
            onChange={handleChange}
            style={{ display: 'block', width: '100%', marginTop: '5px' }}
            required
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
            value={updatedCleaner.status || ''}
            onChange={handleChange}
            style={{ display: 'block', width: '100%', marginTop: '5px' }}
            required
          >
            <option value="">Select</option>
            <option value="free">Free</option>
            <option value="working">Working</option>
            <option value="on_leave">On Leave</option>
          </select>
        </label>
        <label style={{ display: 'block', marginBottom: '10px' }}>
          In Hospital:
          <select
            name="is_in_hospital"
            value={updatedCleaner.is_in_hospital }
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
            value={updatedCleaner.on_duty}
            onChange={handleChange}
            style={{ display: 'block', width: '100%', marginTop: '5px' }}
            required
          >
            <option value="">Select</option>
            <option value={true}>Yes</option>
            <option value={false}>No</option>
          </select>
        </label>
        <button onClick={handleUpdate} style={{ backgroundColor: 'green', color: 'white', marginRight: '10px' }}>
          Save Changes
        </button>
        <button onClick={() => setEditingCleaner(null)} style={{ backgroundColor: 'grey', color: 'white' }}>
          Cancel
        </button>
        {error && <p className="error">{error}</p>}
      </Modal>
    </div>
  );
};

export default ViewCleaners;
