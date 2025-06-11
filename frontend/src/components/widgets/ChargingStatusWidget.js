import React from 'react';

const ChargingStatusWidget = ({ chargingState, chargeLimit, timeToFull, chargerPower, chargeRateMph, connChargeCable, fastChargerPresent }) => {
  return (
    <div className="widget charging-status-widget">
      <h3>Charging Status</h3>
      <p>State: {chargingState || 'N/A'}</p>
      <p>Limit: {typeof chargeLimit === 'number' ? `${chargeLimit}%` : 'N/A'}</p>
      <p>Time to Full: {typeof timeToFull === 'number' ? `${Math.round(timeToFull / 60)} mins` : 'N/A'}</p> {/* Assuming timeToFull might be in seconds */}
      <p>Charger Power: {typeof chargerPower === 'number' ? `${chargerPower} kW` : 'N/A'}</p>
      <p>Charge Rate: {typeof chargeRateMph === 'number' ? `${Math.round(chargeRateMph)} mph` : 'N/A'}</p>
      <p>Cable: {connChargeCable || 'N/A'}</p>
      <p>Fast Charger: {fastChargerPresent ? 'Yes' : 'No'}</p>
    </div>
  );
};

export default ChargingStatusWidget;
