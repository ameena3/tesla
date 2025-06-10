import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import CameraView from './CameraView';
import * as api from '../services/api';

jest.mock('../services/api');

describe('CameraView', () => {
  beforeEach(() => {
    api.getCameraFeed.mockClear();
  });

  test('shows loading message initially and fetches camera feed in dev mode', async () => {
    api.getCameraFeed.mockResolvedValueOnce({ camera_feed_url: 'http://example.com/feed.png' });
    render(<CameraView isDevMode={true} apiKey="" />);

    expect(screen.getByText(/loading camera feed.../i)).toBeInTheDocument();

    await waitFor(() => {
      expect(api.getCameraFeed).toHaveBeenCalledWith(true, "");
    });

    await waitFor(() => {
      const img = screen.getByRole('img', { name: /tesla camera feed/i });
      expect(img).toBeInTheDocument();
      expect(img).toHaveAttribute('src', 'http://example.com/feed.png');
    });
  });

  test('shows error message if API call fails', async () => {
    api.getCameraFeed.mockRejectedValueOnce(new Error('Failed to fetch camera feed'));
    render(<CameraView isDevMode={true} apiKey="" />);

    await waitFor(() => {
      expect(screen.getByText(/error: Failed to fetch camera feed/i)).toBeInTheDocument();
    });
  });

  test('shows API key required message if not in dev mode and no API key', () => {
    render(<CameraView isDevMode={false} apiKey="" />);
    expect(screen.getByText(/api key required for camera feed/i)).toBeInTheDocument();
    expect(api.getCameraFeed).not.toHaveBeenCalled();
  });

  test('fetches camera feed with API key if not in dev mode and API key is provided', async () => {
    api.getCameraFeed.mockResolvedValueOnce({ camera_feed_url: 'http://realfeed.com/live.png' });
    render(<CameraView isDevMode={false} apiKey="real-api-key" />);

    expect(screen.getByText(/loading camera feed.../i)).toBeInTheDocument();

    await waitFor(() => {
      expect(api.getCameraFeed).toHaveBeenCalledWith(false, "real-api-key");
    });

    await waitFor(() => {
      const img = screen.getByRole('img', { name: /tesla camera feed/i });
      expect(img).toBeInTheDocument();
      expect(img).toHaveAttribute('src', 'http://realfeed.com/live.png');
    });
  });

  test('shows "No camera feed to display" when URL is empty after loading', async () => {
    api.getCameraFeed.mockResolvedValueOnce({ camera_feed_url: '' });
    render(<CameraView isDevMode={true} apiKey="" />);

    await waitFor(() => {
        expect(api.getCameraFeed).toHaveBeenCalledWith(true, "");
    });

    await waitFor(() => {
        expect(screen.getByText(/No camera feed to display/i)).toBeInTheDocument();
    });
  });
});
