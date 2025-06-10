import React, { useState, useEffect } from 'react';
import StatsDisplay from './StatsDisplay';
import Controls from './Controls';
import CameraView from './CameraView';
import ApiKeyInput from './ApiKeyInput';

const DashboardPage = () => {
  const [apiKey, setApiKey] = useState('');
  const [isDevMode, setIsDevMode] = useState(() => {
    const savedMode = localStorage.getItem('isDevMode');
    return savedMode ? JSON.parse(savedMode) : true;
  });
  const [isKeySubmitted, setIsKeySubmitted] = useState(() => {
    return !!localStorage.getItem('apiKey');
  });

  useEffect(() => {
    localStorage.setItem('isDevMode', JSON.stringify(isDevMode));
    if (!isDevMode) { // Only try to load API key if not in dev mode
        const storedApiKey = localStorage.getItem('apiKey');
        if (storedApiKey) {
            setApiKey(storedApiKey);
            setIsKeySubmitted(true); // Ensure this is true if key is loaded
        } else {
            setIsKeySubmitted(false); // No key, so not submitted
        }
    } else { // In dev mode
        setIsKeySubmitted(false); // Not relevant in dev mode
        setApiKey(''); // Clear API key if in dev mode
    }
  }, [isDevMode]); // Removed isKeySubmitted from dependency array to avoid potential loops with localStorage logic

  const handleApiKeySubmit = (submittedKey) => {
    setApiKey(submittedKey);
    setIsKeySubmitted(true);
    localStorage.setItem('apiKey', submittedKey);
    // Ensure we are not in dev mode if a key is submitted
    if (isDevMode) {
        localStorage.setItem('isDevMode', JSON.stringify(false));
        setIsDevMode(false);
    }
  };

  const toggleDevMode = () => {
    setIsDevMode(prevMode => {
      const newMode = !prevMode;
      localStorage.setItem('isDevMode', JSON.stringify(newMode)); // Update localStorage immediately
      if (newMode) { // Switching to Dev Mode
        localStorage.removeItem('apiKey');
        setApiKey('');
        setIsKeySubmitted(false);
      } else { // Switching to Real Mode
        const storedApiKey = localStorage.getItem('apiKey');
        if (storedApiKey) {
          setApiKey(storedApiKey);
          setIsKeySubmitted(true);
        } else {
          setIsKeySubmitted(false); // Prompt for key
        }
      }
      return newMode;
    });
  };

  const showApiKeyInput = !isDevMode && !isKeySubmitted;

  return (
    // The .App class is usually on the root div in App.js, so not needed here directly unless structure changes
    <div>
      <header className="dashboard-header">
        <h1>Tesla Dashboard</h1>
        <button onClick={toggleDevMode}>
          Switch to {isDevMode ? 'Real API Mode' : 'Developer Mode'}
        </button>
      </header>

      {isDevMode && <p className="status-message dev">Developer Mode Active (Using Mock Data)</p>}
      {!isDevMode && !isKeySubmitted && <p className="status-message real-inactive">Real API Mode: API Key Required</p>}
      {!isDevMode && isKeySubmitted && <p className="status-message real-active">Real API Mode Active (Using Your API Key)</p>}

      {showApiKeyInput && <ApiKeyInput onSubmitApiKey={handleApiKeySubmit} />}

      { (isDevMode || isKeySubmitted) && (
        <>
          <StatsDisplay isDevMode={isDevMode} apiKey={apiKey} />
          <Controls isDevMode={isDevMode} apiKey={apiKey} />
          <CameraView isDevMode={isDevMode} apiKey={apiKey} />
        </>
      )}
    </div>
  );
};

export default DashboardPage;
