// src/pages/AdminSetup.jsx (Improved)
import React, { useState } from 'react';
import { populateSkills } from '../utils/populateSkills';
import { populateCertifications } from '../utils/populateCertifications';
import setupDatabase from '../utils/setupDatabase';

const AdminSetup = () => {
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([]);

  const addMessage = (msg, type = 'info') => {
    setMessages(prev => [...prev, { text: msg, type, timestamp: Date.now() }]);
  };

  const clearMessages = () => {
    setMessages([]);
  };

  // Populate everything at once
  const handleFullSetup = async () => {
    setLoading(true);
    clearMessages();
    addMessage('Starting full database setup...', 'info');
    
    try {
      const result = await setupDatabase();
      if (result.success) {
        addMessage('✅ Database setup completed successfully!', 'success');
      } else {
        addMessage('❌ Setup failed: ' + result.error, 'error');
      }
    } catch (error) {
      addMessage('❌ Error: ' + error.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  // Populate only skills
  const handlePopulateSkills = async () => {
    setLoading(true);
    clearMessages();
    addMessage('Populating skills...', 'info');
    
    try {
      await populateSkills();
      addMessage('✅ Skills populated successfully!', 'success');
    } catch (error) {
      addMessage('❌ Error: ' + error.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  // Populate only certifications
  const handlePopulateCertifications = async () => {
    setLoading(true);
    clearMessages();
    addMessage('Populating certifications...', 'info');
    
    try {
      await populateCertifications();
      addMessage('✅ Certifications populated successfully!', 'success');
    } catch (error) {
      addMessage('❌ Error: ' + error.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const getMessageStyle = (type) => {
    const baseStyle = {
      padding: '0.75rem 1rem',
      borderRadius: '0.5rem',
      marginTop: '0.5rem',
      textAlign: 'left'
    };

    switch (type) {
      case 'success':
        return { ...baseStyle, background: '#d4edda', color: '#155724', border: '1px solid #c3e6cb' };
      case 'error':
        return { ...baseStyle, background: '#f8d7da', color: '#721c24', border: '1px solid #f5c6cb' };
      default:
        return { ...baseStyle, background: '#d1ecf1', color: '#0c5460', border: '1px solid #bee5eb' };
    }
  };

  return (
    <div style={{ 
      padding: '2rem', 
      maxWidth: '800px', 
      margin: '0 auto',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>
      <h1 style={{ marginBottom: '0.5rem' }}>🔧 Admin Setup</h1>
      <p style={{ color: '#666', marginBottom: '2rem' }}>
        Initialize your Firebase database with skills and certifications
      </p>

      {/* Warning Box */}
      <div style={{
        background: '#fff3cd',
        border: '1px solid #ffc107',
        borderRadius: '0.5rem',
        padding: '1rem',
        marginBottom: '2rem'
      }}>
        <strong>⚠️ Warning:</strong> This will overwrite existing data in Firebase. 
        Use this only for initial setup or testing.
      </div>

      {/* Buttons */}
      <div style={{ 
        display: 'grid', 
        gap: '1rem',
        marginBottom: '2rem'
      }}>
        {/* Full Setup Button */}
        <button 
          onClick={handleFullSetup}
          disabled={loading}
          style={{
            padding: '1.25rem 2rem',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            border: 'none',
            borderRadius: '0.5rem',
            fontSize: '1.1rem',
            fontWeight: '600',
            cursor: loading ? 'not-allowed' : 'pointer',
            opacity: loading ? 0.6 : 1,
            transition: 'all 0.3s'
          }}
        >
          {loading ? '⏳ Setting up...' : '🚀 Full Setup (Skills + Certifications)'}
        </button>

        {/* Individual Buttons */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <button 
            onClick={handlePopulateSkills}
            disabled={loading}
            style={{
              padding: '1rem',
              background: '#4caf50',
              color: 'white',
              border: 'none',
              borderRadius: '0.5rem',
              fontWeight: '600',
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.6 : 1
            }}
          >
            {loading ? '⏳' : '📚'} Skills Only
          </button>

          <button 
            onClick={handlePopulateCertifications}
            disabled={loading}
            style={{
              padding: '1rem',
              background: '#ff9800',
              color: 'white',
              border: 'none',
              borderRadius: '0.5rem',
              fontWeight: '600',
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.6 : 1
            }}
          >
            {loading ? '⏳' : '🎓'} Certifications Only
          </button>
        </div>
      </div>

      {/* Messages Log */}
      {messages.length > 0 && (
        <div style={{
          background: '#f8f9fa',
          border: '1px solid #dee2e6',
          borderRadius: '0.5rem',
          padding: '1rem'
        }}>
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            marginBottom: '1rem'
          }}>
            <strong>📋 Setup Log</strong>
            <button
              onClick={clearMessages}
              style={{
                background: 'transparent',
                border: '1px solid #6c757d',
                borderRadius: '0.25rem',
                padding: '0.25rem 0.75rem',
                cursor: 'pointer',
                fontSize: '0.875rem'
              }}
            >
              Clear
            </button>
          </div>
          <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
            {messages.map((msg, index) => (
              <div key={msg.timestamp + index} style={getMessageStyle(msg.type)}>
                {msg.text}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Info Section */}
      <div style={{
        marginTop: '2rem',
        padding: '1.5rem',
        background: '#e7f3ff',
        border: '1px solid #b3d9ff',
        borderRadius: '0.5rem'
      }}>
        <h3 style={{ marginTop: 0 }}>ℹ️ What does this do?</h3>
        <ul style={{ paddingLeft: '1.5rem', lineHeight: '1.8' }}>
          <li><strong>Full Setup:</strong> Initializes both skills and certifications</li>
          <li><strong>Skills Only:</strong> Populates skill categories (Frontend, Backend, DevOps, Design)</li>
          <li><strong>Certifications Only:</strong> Populates external certification recommendations</li>
        </ul>
        <p style={{ marginBottom: 0, marginTop: '1rem', fontSize: '0.9rem', color: '#666' }}>
          💡 <strong>Tip:</strong> After running setup, you can delete this page or protect it with admin authentication.
        </p>
      </div>
    </div>
  );
};

export default AdminSetup;