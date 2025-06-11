import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import StatsDisplay from './StatsDisplay';
import * as api from '../services/api'; // Import all exports

// Mock the api module
jest.mock('../services/api');

describe('StatsDisplay', () => {
  beforeEach(() => {
    // Reset mocks before each test
    api.getStats.mockClear();
  });

  test('shows loading message initially and fetches stats in dev mode', async () => {
    api.getStats.mockResolvedValueOnce({ battery_level: 80, vehicle_name: "Testla" });
    render(<StatsDisplay isDevMode={true} apiKey="" />);

    expect(screen.getByText(/loading stats.../i)).toBeInTheDocument();

    await waitFor(() => {
      expect(api.getStats).toHaveBeenCalledWith(true, "");
    });

    await waitFor(() => {
      expect(screen.getByText(/vehicle stats/i)).toBeInTheDocument();
      expect(screen.getByText(/"battery_level": 80/i)).toBeInTheDocument();
    });
  });

  test('shows error message if API call fails', async () => {
    api.getStats.mockRejectedValueOnce(new Error('Failed to fetch stats')); // Use the specific error message
    render(<StatsDisplay isDevMode={true} apiKey="" />);

    await waitFor(() => {
      // Check for the exact error message produced by the component
      expect(screen.getByText(/error: Failed to fetch stats/i)).toBeInTheDocument();
    });
  });

  test('shows API key required message if not in dev mode and no API key', () => {
    render(<StatsDisplay isDevMode={false} apiKey="" />);
    expect(screen.getByText(/api key required for real stats/i)).toBeInTheDocument();
    // Ensure getStats is not called when API key is missing in real mode
    expect(api.getStats).not.toHaveBeenCalled();
  });

  test('fetches stats with API key if not in dev mode and API key is provided', async () => {
    api.getStats.mockResolvedValueOnce({ battery_level: 90, vehicle_name: "RealTesla" });
    render(<StatsDisplay isDevMode={false} apiKey="fake-key" />);

    expect(screen.getByText(/loading stats.../i)).toBeInTheDocument();

    await waitFor(() => {
      expect(api.getStats).toHaveBeenCalledWith(false, "fake-key");
    });

    await waitFor(() => {
      expect(screen.getByText(/"battery_level": 90/i)).toBeInTheDocument();
    });
  });
});
