import React, { useState } from 'react'; // Import useState from React
import { useNavigate } from 'react-router-dom'; // Import useNavigate from react-router-dom
import './LoginPage.css'; // Import CSS for styling

const LoginPage = () => {
  const [email, setEmail] = useState(''); // State to store email input
  const [password, setPassword] = useState(''); // State to store password input
  const navigate = useNavigate(); // Hook to programmatically navigate

  // Function to handle form submission
  const handleLogin = (e) => {
    e.preventDefault(); // Prevent default form submission behavior

    // Simulate login credentials
    const validEmail = 'sujalflash@gmail.com';
    const validPassword = 'sujalShivani';

    if (email === validEmail && password === validPassword) {
      navigate('/dashboard'); // Redirect to Dashboard
    } else {
      alert('Incorrect email or password'); // Show error message
    }
  };

  return (
    <div className="login-container">
      <h1>Login</h1>
      <form onSubmit={handleLogin} className="login-form">
        <div className="form-group">
          <label className='clr' htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label className='clr' htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button className='btn' type="submit">Login</button>
      </form>
    </div>
  );
};

export default LoginPage;
