import React, { useState } from 'react';

const ImageManagement = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [augmentedImage, setAugmentedImage] = useState(null);
  const [error, setError] = useState(null);

  const handleImageUpload = (event) => {
    const file = event.target.files[0];

    if (file && file.name.endsWith('.dcm')) {
      setSelectedImage(file);
      setError(null); // Clear any previous error
    } else {
      setError('Please upload a valid .dcm image.');
    }
  };

  const handleSubmit = async () => {
    if (!selectedImage) {
      setError('No image selected.');
      return;
    }

    const formData = new FormData();
    formData.append('image', selectedImage);

    try {
      const response = await fetch('http://127.0.0.1:8000/api/image_augmentation/augment/', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const blob = await response.blob();
        const imageUrl = URL.createObjectURL(blob); // Convert blob to object URL
        setAugmentedImage(imageUrl);
        setError(null); // Clear any previous error
      } else {
        setError('Failed to augment the image.');
      }
    } catch (err) {
      console.error('Error during image augmentation:', err);
      setError('An error occurred while augmenting the image.');
    }
  };

  return (
    <div className="image-management-container">
      <h2>Image Augmentation</h2>

      <div className="image-upload">
        <input type="file" accept=".dcm" onChange={handleImageUpload} />
        {error && <p style={{ color: 'red' }}>{error}</p>}
        {selectedImage && <p>Selected Image: {selectedImage.name}</p>}
        <button onClick={handleSubmit}>Submit for Augmentation</button>
      </div>

      <div className="image-display">
        {selectedImage && (
          <div>
            <h3>Uploaded Image:</h3>
            <p>{selectedImage.name}</p> {/* You can't directly display .dcm images in the browser */}
          </div>
        )}

        {augmentedImage && (
          <div>
            <h3>Augmented Image:</h3>
            <img src={augmentedImage} alt="Augmented" style={{ maxWidth: '100%', height: 'auto' }} />
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageManagement;
