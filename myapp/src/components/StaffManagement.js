import React, { useState } from 'react';
import './StaffManagement.css'

const StaffManagement = () => {
  const [activeModal, setActiveModal] = useState(null);

  const openModal = (modal) => setActiveModal(modal);
  const closeModal = () => setActiveModal(null);
  const [selectedValue, setSelectedValue] = useState('1');

  // Handle the change in the dropdown
  const handleChange = (e) => {
    setSelectedValue(e.target.value);
  };

  return (
    <div>
      <h1 className='sm-title'>Staff Management</h1>
      <div className='sm-buttons'>
      <button className='hbtn' onClick={() => openModal('add')}>Add Staff</button>
      <button className='hbtn'onClick={() => openModal('edit')}>Edit Staff</button>
      <button className='hbtn'onClick={() => openModal('delete')}>Delete Staff</button>
      </div>

      {/* Add Staff Modal */}
      {activeModal === 'add' && (
        <div className='modal-container' style={{ border: '1px solid black', padding: '20px', margin: '20px' }}>
          <h2>Add Staff</h2>
          <form>
            <div>
              <label>Email:</label>
              <input type="email" />
            </div>
            <div>
              <label>Password:</label>
              <input type="password" />
            </div>
            <div>
         <label htmlFor="dropdown">Access level:</label>
         <select id="dropdown" value={selectedValue} onChange={handleChange}>
        <option value="1">1</option>
        <option value="2">2</option>
        <option value="3">3</option>
        </select>
       </div>
            <div className='sline'>
            <button type="submit">Add Staff</button>
            <button type="button" onClick={closeModal}>Close</button>
            </div>
          </form>
        </div>
      )}

      {/* Edit Staff Modal */}
      {activeModal === 'edit' && (
        <div className='modal-container' style={{ border: '1px solid black', padding: '20px', margin: '20px' }}>
          <h2>Edit Staff</h2>
          <form>
            <div>
              <label>Email:</label>
              <input type="email" />
            </div>
            <div>
              <label>Password:</label>
              <input type="password" />
            </div>
            <div>
      <label htmlFor="dropdown">Choose a number:</label>
      <select id="dropdown" value={selectedValue} onChange={handleChange}>
        <option value="1">1</option>
        <option value="2">2</option>
        <option value="3">3</option>
      </select>
    </div>
            <div className='sline'>
            <button type="submit">Edit Staff</button>
            <button type="button" onClick={closeModal}>Close</button>
            </div>
          </form>
        </div>
      )}

      {/* Delete Staff Modal */}
      {activeModal === 'delete' && (
        <div className='modal-container'style={{ border: '1px solid black', padding: '20px', margin: '20px' }}>
          <h2>Delete Staff</h2>
          <form>
            <div>
              <label>Email:</label>
              <input type="email" />
            </div>
            <div className='sline'>
            <button type="submit">Delete Staff</button>
            <button type="button" onClick={closeModal}>Close</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default StaffManagement;
