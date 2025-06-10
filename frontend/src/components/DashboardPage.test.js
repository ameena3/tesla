import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import DashboardPage from './DashboardPage';
import * as api from '../services/api';

// Mock the entire api module
jest.mock('../services/api');

// Mock localStorage
let store = {};
const mockLocalStorage = {
  getItem: jest.fn((key) => store[key] || null),
  setItem: jest.fn((key, value) => {
    store[key] = value.toString();
  }),
  removeItem: jest.fn((key) => {
    delete store[key];
  }),
  clear: jest.fn(() => {
    store = {};
  }),
};

Object.defineProperty(window, 'localStorage', {
  value: mockLocalStorage,
});

describe('DashboardPage', () => {
  beforeEach(() => {
    // Clear localStorage mock and API mocks before each test
    mockLocalStorage.clear();
    jest.clearAllMocks(); // Clears all mocks including api calls and localStorage calls

    // Default mock implementations for API calls to prevent errors in child components
    api.getStats.mockResolvedValue({ vehicle_name: 'Mock Vehicle', battery_level: 100 });
    api.getCameraFeed.mockResolvedValue({ camera_feed_url: 'http://place.holder/mock_feed.png' });
    api.lockVehicle.mockResolvedValue({ success: true });
    api.unlockVehicle.mockResolvedValue({ success: true });
  });

  test('renders the main heading and starts in dev mode by default', () => {
    render(<DashboardPage />);
    expect(screen.getByRole('heading', { name: /tesla dashboard/i })).toBeInTheDocument();
    expect(screen.getByText(/developer mode active/i)).toBeInTheDocument();
    // Child components should render in dev mode
    expect(screen.getByText(/vehicle stats/i)).toBeInTheDocument();
    expect(screen.getByText(/controls/i)).toBeInTheDocument();
    expect(screen.getByText(/camera view/i)).toBeInTheDocument();
  });

  test('ApiKeyInput is not visible in dev mode', () => {
    render(<DashboardPage />);
    expect(screen.queryByPlaceholderText(/your tesla api key/i)).not.toBeInTheDocument();
  });

  test('toggles to Real API Mode and shows ApiKeyInput if no key is stored', () => {
    render(<DashboardPage />);
    const toggleButton = screen.getByRole('button', { name: /switch to real api mode/i });
    fireEvent.click(toggleButton);

    expect(screen.getByText(/real api mode: api key required/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/your tesla api key/i)).toBeInTheDocument();
    // Child components should not render data sections if API key is needed
    expect(screen.getByText(/api key required for real stats/i)).toBeInTheDocument();
  });

  test('submitting an API key switches to Real API Mode with key and hides ApiKeyInput', async () => {
    render(<DashboardPage />);
    const toggleButton = screen.getByRole('button', { name: /switch to real api mode/i });
    fireEvent.click(toggleButton); // Switch to Real Mode

    const apiKeyInput = screen.getByPlaceholderText(/your tesla api key/i);
    const submitButton = screen.getByRole('button', { name: /submit key/i });

    fireEvent.change(apiKeyInput, { target: { value: 'test-key' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/real api mode active/i)).toBeInTheDocument();
    });
    expect(screen.queryByPlaceholderText(/your tesla api key/i)).not.toBeInTheDocument();
    expect(mockLocalStorage.setItem).toHaveBeenCalledWith('apiKey', 'test-key');
    // Child components should now attempt to fetch with the new key
    expect(api.getStats).toHaveBeenCalledWith(false, 'test-key');
  });

  test('loads API key from localStorage if already in Real API Mode', () => {
    mockLocalStorage.setItem('isDevMode', 'false'); // Start in real mode
    mockLocalStorage.setItem('apiKey', 'stored-key');

    render(<DashboardPage />);

    expect(screen.getByText(/real api mode active/i)).toBeInTheDocument();
    expect(mockLocalStorage.getItem).toHaveBeenCalledWith('apiKey');
    expect(api.getStats).toHaveBeenCalledWith(false, 'stored-key');
  });

  test('switching to Dev Mode clears API key and localStorage for key', () => {
    mockLocalStorage.setItem('isDevMode', 'false');
    mockLocalStorage.setItem('apiKey', 'stored-key');
    render(<DashboardPage />);

    expect(screen.getByText(/real api mode active/i)).toBeInTheDocument();

    const toggleButton = screen.getByRole('button', { name: /switch to developer mode/i });
    fireEvent.click(toggleButton);

    expect(screen.getByText(/developer mode active/i)).toBeInTheDocument();
    expect(mockLocalStorage.removeItem).toHaveBeenCalledWith('apiKey');
    // Child components should now use dev mode
    expect(api.getStats).toHaveBeenCalledWith(true, '');
  });

  test('child components are displayed when in dev mode or key is submitted in real mode', () => {
    render(<DashboardPage />); // Starts in dev mode
    expect(screen.getByText(/Vehicle Stats/i)).toBeInTheDocument();
    expect(screen.getByText(/Controls/i)).toBeInTheDocument();
    expect(screen.getByText(/Camera View/i)).toBeInTheDocument();

    // Switch to real mode, submit key
    fireEvent.click(screen.getByRole('button', { name: /Switch to Real API Mode/i }));
    fireEvent.change(screen.getByPlaceholderText(/Your Tesla API Key/i), { target: { value: 'testkey' } });
    fireEvent.click(screen.getByRole('button', { name: /Submit Key/i }));

    waitFor(() => {
        expect(screen.getByText(/Vehicle Stats/i)).toBeInTheDocument();
        expect(screen.getByText(/Controls/i)).toBeInTheDocument();
        expect(screen.getByText(/Camera View/i)).toBeInTheDocument();
    });
  });

});
