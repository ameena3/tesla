import React from 'react';

const SecurityWidget = ({ locked, sentryMode, sentryModeAvailable }) => {
  return (
    <div className="widget security-widget">
      <h3>Security</h3>
      <p>Vehicle Lock: {typeof locked === 'boolean' ? (locked ? 'Locked' : 'Unlocked') : 'N/A'}</p>
      <p>Sentry Mode: {sentryModeAvailable ? (sentryMode ? 'On' : 'Off') : 'Not Available'}</p>
      {/* Sentry mode might have more states, e.g., "Alarming" - this can be expanded later */}
    </div>
  );
};

export default SecurityWidget;
