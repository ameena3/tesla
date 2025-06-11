import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import ApiKeyInput from './ApiKeyInput';

describe('ApiKeyInput', () => {
  test('renders input field and submit button', () => {
    render(<ApiKeyInput onSubmitApiKey={() => {}} />);
    expect(screen.getByPlaceholderText(/your tesla api key/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /submit key/i })).toBeInTheDocument();
  });

  test('calls onSubmitApiKey with the key when form is submitted', () => {
    const mockSubmit = jest.fn();
    render(<ApiKeyInput onSubmitApiKey={mockSubmit} />);

    const input = screen.getByPlaceholderText(/your tesla api key/i);
    const button = screen.getByRole('button', { name: /submit key/i });

    fireEvent.change(input, { target: { value: 'test-api-key' } });
    fireEvent.click(button);

    expect(mockSubmit).toHaveBeenCalledWith('test-api-key');
  });
});
