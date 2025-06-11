import React from 'react';

const DriveInfoWidget = ({ shiftState, speed, power, odometer, heading, latitude, longitude }) => {
  return (
    <div className="widget drive-info-widget">
      <h3>Drive Information</h3>
      <p>Gear: {shiftState || 'N/A'}</p>
      <p>Speed: {typeof speed === 'number' ? `${speed} mph` : 'N/A'}</p>
      <p>Power: {typeof power === 'number' ? `${power} kW` : 'N/A'}</p>
      <p>Odometer: {odometer ? `${Math.round(odometer)} mi` : 'N/A'}</p>
      <h4>Location</h4>
      <p>Heading: {typeof heading === 'number' ? `${heading}°` : 'N/A'}</p>
      <p>Latitude: {typeof latitude === 'number' ? latitude.toFixed(5) : 'N/A'}</p>
      <p>Longitude: {typeof longitude === 'number' ? longitude.toFixed(5) : 'N/A'}</p>
    </div>
  );
};

export default DriveInfoWidget;
