import React, { useState } from 'react';

const ImageProcessing = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [normalization, setNormalization] = useState(0); // Default normalization value
  const [resizeWidth, setResizeWidth] = useState(''); // Resize width input
  const [resizeHeight, setResizeHeight] = useState(''); // Resize height input
  const [processedImage, setProcessedImage] = useState(null); // To store the processed image URL
  const [error, setError] = useState(null);
  const accessToken = localStorage.getItem('accessToken'); // Retrieve the access token from localStorage

  // Handle image file upload
  const handleImageUpload = (event) => {
    const file = event.target.files[0];

    if (file && file.name.endsWith('.dcm')) {
      setSelectedImage(file);
      setError(null); // Clear any previous error
    } else {
      setError('Please upload a valid .dcm image.');
    }
  };

  // Handle form submission and API request
  const handleSubmit = async () => {
    if (!selectedImage) {
      setError('No image selected.');
      return;
    }

    if (normalization < 0 || normalization > 1) {
      setError('Normalization value must be between 0 and 1.');
      return;
    }

    if (!resizeWidth || !resizeHeight) {
      setError('Please provide both resize width and height.');
      return;
    }

    const formData = new FormData();
    formData.append('image', selectedImage);
    formData.append('normalization', normalization);
    formData.append('resize_width', resizeWidth);
    formData.append('resize_height', resizeHeight);

    try {
      const response = await fetch('http://127.0.0.1:8000/api/image_processing/', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`, // Include the access token in the Authorization header
        },
        body: formData,
      });

      if (response.ok) {
        const blob = await response.blob(); // Get the processed image as a blob
        const imageUrl = URL.createObjectURL(blob); // Convert blob to object URL
        setProcessedImage(imageUrl); // Store the processed image URL
        setError(null); // Clear any previous error
      } else {
        setError('Failed to process the image.');
      }
    } catch (err) {
      console.error('Error during image processing:', err);
      setError('An error occurred while processing the image.');
    }
  };

  return (
    <div className="image-processing-container" style={{ overflowY: 'scroll', padding: '20px', height: '100vh' }}>
      <h2>Image Processing</h2>

      <div className="image-upload">
        <label>Upload .dcm Image:</label>
        <input type="file" accept=".dcm" onChange={handleImageUpload} />
        {error && <p style={{ color: 'red' }}>{error}</p>}
        {selectedImage && <p>Selected Image: {selectedImage.name}</p>}
      </div>

      <div className="input-fields">
        <label>Normalization (0-1):</label>
        <input 
          type="number" 
          min="0" 
          max="1" 
          step="0.01" 
          value={normalization} 
          onChange={(e) => setNormalization(e.target.value)} 
        />

        <label>Resize Width:</label>
        <input 
          type="number" 
          value={resizeWidth} 
          onChange={(e) => setResizeWidth(e.target.value)} 
        />

        <label>Resize Height:</label>
        <input 
          type="number" 
          value={resizeHeight} 
          onChange={(e) => setResizeHeight(e.target.value)} 
        />
      </div>

      <button onClick={handleSubmit}>Submit for Processing</button>

      <div className="image-display">
        {processedImage && (
          <div>
            <h3>Processed Image:</h3>
            <img 
              src={processedImage} 
              alt="Processed" 
              style={{ width: '500px', height: '500px', objectFit: 'contain' }} 
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageProcessing;
