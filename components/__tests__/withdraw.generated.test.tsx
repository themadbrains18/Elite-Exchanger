import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MockSessionProvider } from '../p2p/express/mockSessionProvider'; // Import the mock provider
import Withdraw from '../snippets/withdraw';

jest.mock('next/router', () => ({
  useRouter: jest.fn(),
}));

global.fetch = jest.fn().mockImplementationOnce(() =>
  Promise.resolve({
    json: () => Promise.resolve({ address: 'mockedAddress' }), // Mock the response JSON data
  })
);
describe('Withdraw component', () => {
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
      id: 'mockTokenId',
      fullName: 'Mock Token',
      symbol: 'MT',
      withdraw_fee: 0.01, // Example withdraw fee
    },
    selectedCoinBalance: 100, // Example selected coin balance
    refreshData: jest.fn(), // Mock refreshData function
  };
  test('renders withdrawal form correctly', async () => {
    render(<MockSessionProvider><Withdraw {...mockProps} /></MockSessionProvider>);

    // Check if the form elements are rendered
    expect(screen.getByText(/Select Coin/i)).toBeInTheDocument();
    expect(screen.getByText(/Transfer Network/i)).toBeInTheDocument();
    expect(screen.getAllByText(/Destination Address/i)[0]).toBeInTheDocument();
    expect(screen.getByText(/Amount/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Proceed Withdrawal/i })).toBeInTheDocument();
  });
  

  test('allows user to fill and submit withdrawal form', async () => {
    render(<MockSessionProvider><Withdraw {...mockProps} /></MockSessionProvider>);

    // Simulate user interactions (filling form fields)
    fireEvent.change(screen.getByLabelText(/Destination Address/i), { target: { value: 'sampleAddress' } });
    fireEvent.change(screen.getByLabelText(/Amount/i), { target: { value: '100' } });

    // Submit the form
    fireEvent.submit(screen.getByRole('button', { name: /Proceed Withdrawal/i }));

    // Wait for async tasks (API call) to finish
     waitFor(() => {
      // Check if the confirmation popup is displayed after form submission
      expect(screen.getByText(/Confirm Withdrawal/i)).toBeInTheDocument();
    });
  });

  test('displays error message if required fields are not filled', async () => {
    render(<MockSessionProvider><Withdraw {...mockProps} /></MockSessionProvider>);

    // Submit the form without filling required fields
    fireEvent.submit(screen.getByRole('button', { name: /Proceed Withdrawal/i }));

    // Check if error messages are displayed
     waitFor(() => {
      expect(screen.getByText(/Please select network/i)).toBeInTheDocument();
      expect(screen.getByText(/This field is required/i)).toBeInTheDocument();
    });
  });

  // Add more test cases for other functionalities such as error handling, API calls, etc.
});
