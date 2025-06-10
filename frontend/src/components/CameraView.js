import React, { useState, useEffect } from 'react';
import { getCameraFeed } from '../services/api';

const CameraView = ({ isDevMode, apiKey }) => {
  const [cameraFeedUrl, setCameraFeedUrl] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!isDevMode && !apiKey) {
        setCameraFeedUrl('');
        setIsLoading(false);
        setError("API Key required for camera feed.");
        return;
    }

    const fetchCameraFeed = async () => {
      setIsLoading(true);
      setError('');
      try {
        const data = await getCameraFeed(isDevMode, apiKey);
        setCameraFeedUrl(data.camera_feed_url);
      } catch (err) {
        setError(err.message || 'Failed to fetch camera feed');
        console.error(err);
        setCameraFeedUrl('');
      } finally {
        setIsLoading(false);
      }
    };

    fetchCameraFeed();
  }, [isDevMode, apiKey]);

  if (isLoading) return <p className="loading-text">Loading camera feed...</p>;
  if (error) return <p className="error-text">Error: {error}</p>;

  return (
    <div className="component-section">
      <h2>Camera View</h2>
      {cameraFeedUrl ? (
        <div className="camera-feed">
          <img src={cameraFeedUrl} alt="Tesla Camera Feed" />
        </div>
      ) : (
        <p className="info-text">No camera feed to display. {isDevMode ? "" : "Ensure API key is correct or submit one."}</p>
      )}
    </div>
  );
};

export default CameraView;
