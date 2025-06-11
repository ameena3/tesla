import React, { useState, useEffect } from 'react';
import { getStats } from '../services/api';
import BatteryWidget from './widgets/BatteryWidget';
import ChargingStatusWidget from './widgets/ChargingStatusWidget';
import ClimateWidget from './widgets/ClimateWidget';
import SecurityWidget from './widgets/SecurityWidget';
import DoorsWidget from './widgets/DoorsWidget';
import DriveInfoWidget from './widgets/DriveInfoWidget';

const StatsDisplay = ({ isDevMode, apiKey }) => {
  const [stats, setStats] = useState(null);
  // Helper function to safely access nested properties, especially for protobuf wrapper types
  const getValue = (obj, defaultValue = 'N/A') => {
    if (obj && typeof obj === 'object' && obj.hasOwnProperty('value')) {
      return obj.value;
    }
    return obj !== undefined && obj !== null ? obj : defaultValue;
  };
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

  // Destructure states for easier access, assuming they exist based on carserver.VehicleData structure
  const chargeState = stats.chargeState || {};
  const climateState = stats.climateState || {};
  const closuresState = stats.closuresState || {};
  const driveState = stats.driveState || {};
  const vehicleState = stats.vehicleState || {}; // For Sentry Mode, Lock status etc.
  const locationState = stats.locationState || {}; // For heading, latitude, longitude

  return (
    <div className="component-section stats-display-container">
      <h2>Vehicle Dashboard</h2>
      <div className="widgets-container">
        <BatteryWidget
          level={getValue(chargeState.batteryLevel, null)}
          usableLevel={getValue(chargeState.usableBatteryLevel, null)}
          range={getValue(chargeState.batteryRange, null)} // Assuming batteryRange is 'charge_energy_added' / efficiency or similar
          chargingState={getValue(chargeState.chargingState, '')} // e.g. "Charging", "Stopped"
        />
        <ChargingStatusWidget
          chargingState={getValue(chargeState.chargingState, '')}
          chargeLimit={getValue(chargeState.chargeLimitSoc, null)}
          timeToFull={getValue(chargeState.minutesToFullCharge, null)}
          chargerPower={getValue(chargeState.chargerPower, null)}
          chargeRateMph={getValue(chargeState.chargeRate, null)} // chargeRate is often in mi/hr or km/hr
          connChargeCable={getValue(chargeState.connChargeCable, '')}
          fastChargerPresent={getValue(chargeState.fastChargerPresent, false)}
        />
        <ClimateWidget
          insideTemp={getValue(climateState.insideTemp, null)}
          outsideTemp={getValue(climateState.outsideTemp, null)}
          isClimateOn={getValue(climateState.isClimateOn, false)}
          fanStatus={getValue(climateState.fanStatus, null)}
          driverTempSetting={getValue(climateState.driverTempSetting, null)}
          passengerTempSetting={getValue(climateState.passengerTempSetting, null)}
        />
        <SecurityWidget
          locked={getValue(vehicleState.locked, null)} // VehicleState often has lock status
          sentryMode={getValue(vehicleState.sentryMode, false)} // And Sentry mode
          sentryModeAvailable={getValue(vehicleState.sentryModeAvailable, false)}
        />
        <DoorsWidget
          doorDriverFrontOpen={getValue(closuresState.df, false)} // df, pf, dr, pr are common Tesla API closure names
          doorPassengerFrontOpen={getValue(closuresState.pf, false)}
          doorDriverRearOpen={getValue(closuresState.dr, false)}
          doorPassengerRearOpen={getValue(closuresState.pr, false)}
          frunkOpen={getValue(closuresState.ft, false)} // ft for frunk
          trunkOpen={getValue(closuresState.rt, false)} // rt for rear trunk
          windowDriverFrontOpen={getValue(closuresState.fdWindow, false)} // Example, actual names may vary
          windowPassengerFrontOpen={getValue(closuresState.fpWindow, false)}
          windowDriverRearOpen={getValue(closuresState.rdWindow, false)}
          windowPassengerRearOpen={getValue(closuresState.rpWindow, false)}
        />
        <DriveInfoWidget
          shiftState={getValue(driveState.shiftState, '')} // E.g., "P", "D", "R"
          speed={getValue(driveState.speed, null)} // Speed might be in a different field or nested
          power={getValue(driveState.power, null)}
          odometer={getValue(vehicleState.odometer, null)} // Odometer is often in VehicleState
          heading={getValue(locationState.heading, null)}
          latitude={getValue(locationState.latitude, null)}
          longitude={getValue(locationState.longitude, null)}
        />
      </div>
    </div>
  );
};

export default StatsDisplay;
