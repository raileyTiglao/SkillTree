// src/pages/AdminSetup.jsx
import React, { useState } from 'react';
import { populateSkills } from '../utils/populateSkills';

const AdminSetup = () => {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handlePopulateSkills = async () => {
    setLoading(true);
    try {
      await populateSkills();
      setMessage('Skills populated successfully!');
    } catch (error) {
      setMessage('Error: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '2rem', textAlign: 'center' }}>
      <h1>Admin Setup</h1>
      <button 
        onClick={handlePopulateSkills}
        disabled={loading}
        style={{
          padding: '1rem 2rem',
          background: '#667eea',
          color: 'white',
          border: 'none',
          borderRadius: '0.5rem',
          cursor: loading ? 'not-allowed' : 'pointer'
        }}
      >
        {loading ? 'Populating...' : 'Populate Skills Database'}
      </button>
      {message && <p style={{ marginTop: '1rem' }}>{message}</p>}
    </div>
  );
};

export default AdminSetup;