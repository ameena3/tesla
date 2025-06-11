import React, { useState } from 'react';

const ApiKeyInput = ({ onSubmitApiKey }) => {
  const [key, setKey] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSubmitApiKey) {
      onSubmitApiKey(key);
    }
    // setKey(''); // Keep key for a bit in case of error, parent will clear/hide if successful
  };

  return (
    <form onSubmit={handleSubmit} className="api-key-form">
      <h3>Enter Tesla API Key</h3>
      <input
        type="password" // Use password type for keys
        value={key}
        onChange={(e) => setKey(e.target.value)}
        placeholder="Your Tesla API Key"
        required
        // Removed inline styles, now handled by App.css
      />
      <button type="submit">Submit Key</button>
    </form>
  );
};

export default ApiKeyInput;
