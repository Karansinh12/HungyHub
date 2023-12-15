import React, { useState } from 'react';
import axios from 'axios';
import './css/SignupForm.css';

const Changepswd = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [updateStatus, setUpdateStatus] = useState(null);

  const handleResetPassword = async (e) => {
    e.preventDefault();

    try {
      // Make a request to the backend to reset the password
      await axios.put('http://localhost:5000/api/changepswd', {
        username,
     
        newPassword,
      });

      setUpdateStatus('success');
    } catch (error) {
      console.error('Error resetting password:', error);
      setUpdateStatus('error');
    }
  };

  return (
    <div className="signup-form-container">
      <h2>Change Password</h2>
      <form onSubmit={handleResetPassword} className="frm">
        <label>
          Username:
          <input type="text" value={username} className="form-group" onChange={(e) => setUsername(e.target.value)} />
        </label>
      
        <label>
          New Password:
          <input
            type="password"
            value={newPassword} className="form-group"
            onChange={(e) => setNewPassword(e.target.value)}
          />
        </label>
        <button type="submit" className="signupbtn">Reset Password</button>
      </form>
      {updateStatus === 'success' && <p>Password reset successfully!</p>}
      {updateStatus === 'error' && <p>Error resetting password. Please try again later.</p>}
    </div>
  );
};

export default Changepswd;