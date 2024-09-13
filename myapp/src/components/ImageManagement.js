import React, { useState } from 'react';
import './ImageManagement.css';

const ImageManagement = () => {
  const [activeModal, setActiveModal] = useState(null);

  const openModal = (modal) => setActiveModal(modal);
  const closeModal = () => setActiveModal(null);

  return (
    <div>
      <h1 className='im-title'>Image Management</h1>
      <div className='im-buttons'>
        <button className='hbtn' onClick={() => openModal('view')}>View Images</button>
        <button className='hbtn' onClick={() => openModal('upload')}>Upload Image</button>
        <button className='hbtn' onClick={() => openModal('delete')}>Delete Image</button>
      </div>

      {/* View Images Modal */}
      {activeModal === 'view' && (
        <div className='modal-container' style={{ border: '1px solid black', padding: '20px', margin: '20px' }}>
          <h2>View Images</h2>
          {/* You can add your logic to show images here */}
          <div>
            <p>List of images will appear here...</p>
          </div>
          <button type="button" onClick={closeModal}>Close</button>
        </div>
      )}

      {/* Upload Image Modal */}
      {activeModal === 'upload' && (
        <div className='modal-container' style={{ border: '1px solid black', padding: '20px', margin: '20px' }}>
          <h2>Upload Image</h2>
          <form>
            <div>
              <label>Select Image:</label>
              <input type="file" />
            </div>
            <div className='sline'>
              <button type="submit">Upload Image</button>
              <button type="button" onClick={closeModal}>Close</button>
            </div>
          </form>
        </div>
      )}

      {/* Delete Image Modal */}
      {activeModal === 'delete' && (
        <div className='modal-container' style={{ border: '1px solid black', padding: '20px', margin: '20px' }}>
          <h2>Delete Image</h2>
          <form>
            <div>
              <label>Image ID or Name:</label>
              <input type="text" />
            </div>
            <div className='sline'>
              <button type="submit">Delete Image</button>
              <button type="button" onClick={closeModal}>Close</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default ImageManagement;
