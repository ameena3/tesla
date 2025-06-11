import React from 'react';

// Helper to convert boolean to Open/Closed/N/A
const formatOpenClosed = (value) => {
  if (typeof value === 'boolean') {
    return value ? 'Open' : 'Closed';
  }
  return 'N/A';
};

const DoorsWidget = ({
  doorDriverFrontOpen,
  doorPassengerFrontOpen,
  doorDriverRearOpen,
  doorPassengerRearOpen,
  frunkOpen,
  trunkOpen,
  windowDriverFrontOpen,
  windowPassengerFrontOpen,
  windowDriverRearOpen,
  windowPassengerRearOpen,
}) => {
  return (
    <div className="widget doors-widget">
      <h3>Doors & Closures</h3>
      <p>Driver Front: {formatOpenClosed(doorDriverFrontOpen)}</p>
      <p>Passenger Front: {formatOpenClosed(doorPassengerFrontOpen)}</p>
      <p>Driver Rear: {formatOpenClosed(doorDriverRearOpen)}</p>
      <p>Passenger Rear: {formatOpenClosed(doorPassengerRearOpen)}</p>
      <p>Frunk: {formatOpenClosed(frunkOpen)}</p>
      <p>Trunk: {formatOpenClosed(trunkOpen)}</p>
      <h4>Windows</h4>
      <p>Driver Front Window: {formatOpenClosed(windowDriverFrontOpen)}</p>
      <p>Passenger Front Window: {formatOpenClosed(windowPassengerFrontOpen)}</p>
      <p>Driver Rear Window: {formatOpenClosed(windowDriverRearOpen)}</p>
      <p>Passenger Rear Window: {formatOpenClosed(windowPassengerRearOpen)}</p>
    </div>
  );
};

export default DoorsWidget;
