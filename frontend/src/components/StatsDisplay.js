import React, { useState, useEffect } from 'react';
import { getStats } from '../services/api';

const StatsDisplay = ({ isDevMode, apiKey }) => {
  const [stats, setStats] = useState(null);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!isDevMode && !apiKey) {
        setStats(null);
        setIsLoading(false);
        setError("API Key required for real stats.");
        return;
    }

    const fetchStats = async () => {
      setIsLoading(true);
      setError('');
      try {
        const data = await getStats(isDevMode, apiKey);
        setStats(data);
      } catch (err) {
        setError(err.message || 'Failed to fetch stats');
        console.error(err);
        setStats(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, [isDevMode, apiKey]);

  if (isLoading) return <p className="loading-text">Loading stats...</p>;
  if (error) return <p className="error-text">Error: {error}</p>;
  if (!stats) return <p className="info-text">No stats to display. {isDevMode ? "" : "Ensure API key is correct or submit one."}</p>;

  return (
    <div className="component-section">
      <h2>Vehicle Stats</h2>
      <pre>{JSON.stringify(stats, null, 2)}</pre>
    </div>
  );
};

export default StatsDisplay;
