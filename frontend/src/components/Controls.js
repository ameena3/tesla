import React, { useState } from 'react';
import { lockVehicle, unlockVehicle } from '../services/api';

const Controls = ({ isDevMode, apiKey }) => {
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(''); // Explicit error state

  const canOperate = () => {
      if (isDevMode) return true;
      return !!apiKey;
  }

  const handleLock = async () => {
    if (!canOperate()) {
        setError("API Key required for this operation.");
        setMessage(''); // Clear previous success messages
        return;
    }
    setIsLoading(true);
    setMessage('');
    setError('');
    try {
      // Assuming the backend sends a JSON response like { message: "..." } or just success
      const response = await lockVehicle(isDevMode, apiKey);
      setMessage(response?.message || (response?.success ? 'Vehicle locked successfully.' : 'Lock command sent.'));
    } catch (err) {
      setError(err.message || 'Failed to lock vehicle.');
      console.error(err);
    }
    setIsLoading(false);
  };

  const handleUnlock = async () => {
    if (!canOperate()) {
        setError("API Key required for this operation.");
        setMessage(''); // Clear previous success messages
        return;
    }
    setIsLoading(true);
    setMessage('');
    setError('');
    try {
      const response = await unlockVehicle(isDevMode, apiKey);
      setMessage(response?.message || (response?.success ? 'Vehicle unlocked successfully.' : 'Unlock command sent.'));
    } catch (err) {
      setError(err.message || 'Failed to unlock vehicle.');
      console.error(err);
    }
    setIsLoading(false);
  };

  return (
    <div className="component-section">
      <h2>Controls</h2>
      <button onClick={handleLock} disabled={isLoading || !canOperate()}>
        {isLoading ? 'Processing...' : 'Lock Vehicle'}
      </button>
      <button onClick={handleUnlock} disabled={isLoading || !canOperate()} style={{ marginLeft: '10px' }}>
        {isLoading ? 'Processing...' : 'Unlock Vehicle'}
      </button>

      {message && <p className="message success">{message}</p>}
      {error && <p className="message error">Error: {error}</p>}
      {!canOperate() && !isDevMode && <p className="message info">API Key required to use controls.</p>}
    </div>
  );
};

export default Controls;
