import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import Controls from './Controls';
import * as api from '../services/api';

jest.mock('../services/api');

describe('Controls', () => {
  beforeEach(() => {
    api.lockVehicle.mockClear();
    api.unlockVehicle.mockClear();
  });

  test('renders lock and unlock buttons', () => {
    render(<Controls isDevMode={true} apiKey="" />);
    expect(screen.getByRole('button', { name: /lock vehicle/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /unlock vehicle/i })).toBeInTheDocument();
  });

  test('calls lockVehicle API on lock button click in dev mode', async () => {
    api.lockVehicle.mockResolvedValueOnce({ success: true, message: 'Locked!' });
    render(<Controls isDevMode={true} apiKey="" />);
    fireEvent.click(screen.getByRole('button', { name: /lock vehicle/i }));

    await waitFor(() => {
      expect(api.lockVehicle).toHaveBeenCalledWith(true, "");
    });
    await waitFor(() => {
      expect(screen.getByText(/Locked!/i)).toBeInTheDocument();
    });
  });

  test('calls unlockVehicle API on unlock button click in dev mode', async () => {
    api.unlockVehicle.mockResolvedValueOnce({ success: true, message: 'Unlocked!' });
    render(<Controls isDevMode={true} apiKey="" />);
    fireEvent.click(screen.getByRole('button', { name: /unlock vehicle/i }));

    await waitFor(() => {
      expect(api.unlockVehicle).toHaveBeenCalledWith(true, "");
    });
    await waitFor(() => {
      expect(screen.getByText(/Unlocked!/i)).toBeInTheDocument();
    });
  });

  test('shows error message if lockVehicle API call fails', async () => {
    api.lockVehicle.mockRejectedValueOnce(new Error('Lock failed'));
    render(<Controls isDevMode={true} apiKey="" />);
    fireEvent.click(screen.getByRole('button', { name: /lock vehicle/i }));

    await waitFor(() => {
      expect(screen.getByText(/error: Lock failed/i)).toBeInTheDocument();
    });
  });

  test('shows API key required message and disables buttons if not dev mode and no key', () => {
    render(<Controls isDevMode={false} apiKey="" />);
    expect(screen.getByText(/api key required to use controls/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /lock vehicle/i })).toBeDisabled();
    expect(screen.getByRole('button', { name: /unlock vehicle/i })).toBeDisabled();

    fireEvent.click(screen.getByRole('button', { name: /lock vehicle/i }));
    expect(api.lockVehicle).not.toHaveBeenCalled(); // Ensure API not called
     expect(screen.getByText(/API Key required for this operation./i)).toBeInTheDocument();
  });

  test('enables buttons and calls API with key if not dev mode and key is provided', async () => {
    api.lockVehicle.mockResolvedValueOnce({ success: true, message: "Locked with Key" });
    render(<Controls isDevMode={false} apiKey="test-key" />);

    const lockButton = screen.getByRole('button', { name: /lock vehicle/i });
    expect(lockButton).not.toBeDisabled();
    fireEvent.click(lockButton);

    await waitFor(() => {
      expect(api.lockVehicle).toHaveBeenCalledWith(false, "test-key");
    });
    await waitFor(() => {
        expect(screen.getByText(/Locked with Key/i)).toBeInTheDocument();
    });
  });
});
