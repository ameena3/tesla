import React from 'react';

const BatteryWidget = ({ level, usableLevel, range, chargingState }) => {
  return (
    <div className="widget battery-widget">
      <h3>Battery</h3>
      <p>Level: {typeof level === 'number' ? `${level}%` : 'N/A'}</p>
      <p>Usable: {typeof usableLevel === 'number' ? `${usableLevel}%` : 'N/A'}</p>
      <p>Est. Range: {range ? `${Math.round(range)} mi` : 'N/A'}</p>
      <p>Status: {chargingState || 'N/A'}</p>
    </div>
  );
};

export default BatteryWidget;
