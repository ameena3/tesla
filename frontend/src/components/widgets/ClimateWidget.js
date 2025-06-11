import React from 'react';

const ClimateWidget = ({ insideTemp, outsideTemp, isClimateOn, fanStatus, driverTempSetting, passengerTempSetting }) => {
  return (
    <div className="widget climate-widget">
      <h3>Climate Control</h3>
      <p>Inside Temp: {typeof insideTemp === 'number' ? `${insideTemp}°C` : 'N/A'}</p>
      <p>Outside Temp: {typeof outsideTemp === 'number' ? `${outsideTemp}°C` : 'N/A'}</p>
      <p>Climate: {isClimateOn ? 'On' : 'Off'}</p>
      <p>Fan Level: {typeof fanStatus === 'number' ? fanStatus : 'N/A'}</p>
      <p>Driver Set: {typeof driverTempSetting === 'number' ? `${driverTempSetting}°C` : 'N/A'}</p>
      <p>Passenger Set: {typeof passengerTempSetting === 'number' ? `${passengerTempSetting}°C` : 'N/A'}</p>
    </div>
  );
};

export default ClimateWidget;
