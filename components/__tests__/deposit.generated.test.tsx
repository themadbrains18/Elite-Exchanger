import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Deposit from '../snippets/deposit';
// import { mockClipboard } from 'jest-clipboard';

jest.mock('next/router', () => ({
  useRouter: jest.fn(),
}));


global.fetch = jest.fn().mockImplementationOnce(() =>
  Promise.resolve({
    json: () => Promise.resolve({ status: 200 }), // Mock successful response
  })
);

jest.mock('next/image', () => {
  return () => <img alt="mocked image" />;
});

const mockToken = {
  networks: [{ name: 'network1' }, { name: 'network2' }] // Example networks data
};



describe('Deposit component', () => {
  const mockProps = {
    setShow1: jest.fn(),
    networks: [
      { id: '1', fullname: 'Network 1', symbol: 'N1' },
      { id: '2', fullname: 'Network 2', symbol: 'N2' },
    ],
    session: {
      user: {
        email: 'test@example.com',
        number: '1234567890',
        user_id: '123',
        access_token: 'mockAccessToken',
      },
    },
    token: { 
      symbol: 'BTC', 
      networks: [{ id: '1', walletSupport: 'test' }], // Provide a valid networks array
      minimum_deposit: 0 // Provide a valid minimum_deposit value
    },
    coinList: [
      { id: '1', name: 'Coin 1', symbol: 'C1' },
      { id: '2', name: 'Coin 2', symbol: 'C2' },
    ],
  };

  test('renders deposit address and QR code', async () => {
    render(<Deposit {...mockProps} />);

    // Check if deposit address and QR code are rendered
    const addressElement = screen.getByText('Destination');
    expect(addressElement).toBeInTheDocument();

    const qrCodeElement = screen.getByText('Scan QR code to Deposit');
    expect(qrCodeElement).toBeInTheDocument();
  });

  test('copies deposit address to clipboard when copy button is clicked', async () => {
    render(<Deposit {...mockProps} />);

    // Mocking the clipboard API
    const originalClipboard = navigator.clipboard;
    const mockClipboard = {
      writeText: jest.fn(),
    };
    Object.defineProperty(navigator, 'clipboard', { value: mockClipboard });

    // Click the copy button
    const copyButton = screen.getByText('Copy');
    fireEvent.click(copyButton);

    // Check if deposit address is copied to clipboard
     waitFor(() => {
      expect(mockClipboard.writeText).toHaveBeenCalledWith(mockProps.session.user.user_id);
    });

    // // Restore the original clipboard API
    // Object.defineProperty(navigator, 'clipboard', { value: originalClipboard });
  });

  // Add more test cases as needed
});
