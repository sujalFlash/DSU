import React, { useState } from 'react';

const ImageAugmentation = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [augmentedImage, setAugmentedImage] = useState(null);
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false); // New state to handle submission
  const accessToken = localStorage.getItem('accessToken'); // Retrieve the access token from localStorage

  const handleImageUpload = (event) => {
    const file = event.target.files[0];

    if (file && file.name.endsWith('.dcm')) {
      setSelectedImage(file);
      setAugmentedImage(null); // Clear previously augmented image if a new one is selected
      setError(null); // Clear any previous error
      setIsSubmitting(false); // Reset submission state when a new image is uploaded
    } else {
      setError('Please upload a valid .dcm image.');
    }
  };

  const handleSubmit = async () => {
    if (!selectedImage) {
      setError('No image selected.');
      return;
    }

    setIsSubmitting(true); // Disable button after submission

    const formData = new FormData();
    formData.append('image', selectedImage);

    try {
      const response = await fetch('http://127.0.0.1:8000/api/image_augmentation/augment/', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`, // Include the access token in the Authorization header
        },
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
    } finally {
      setIsSubmitting(false); // Re-enable button after submission is complete
    }
  };

  return (
    <div className="image-management-container" style={{ overflowY: 'scroll', padding: '20px', height: '100vh' }}>
      <h2>Image Augmentation</h2>

      <div className="image-upload">
        <input type="file" accept=".dcm" onChange={handleImageUpload} />
        {error && <p style={{ color: 'red' }}>{error}</p>}
        {selectedImage && <p>Selected Image: {selectedImage.name}</p>}
        <button onClick={handleSubmit} disabled={isSubmitting}> {/* Disable button during submission */}
          {isSubmitting ? 'Processing...' : 'Submit for Augmentation'}
        </button>
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
            <img 
              src={augmentedImage} 
              alt="Augmented" 
              style={{ 
                width: '600px', 
                height: '400px', 
                objectFit: 'contain', 
              }} 
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageAugmentation;
