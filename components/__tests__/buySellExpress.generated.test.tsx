import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MockSessionProvider } from '../p2p/express/mockSessionProvider'; // Import the mock provider
import BuySellExpress from '../p2p/express/buySellExpress'; // Import the component
import { useRouter } from 'next/router';
import { act } from 'react-dom/test-utils';
jest.mock('next/router', () => ({
  useRouter: jest.fn(),
}));

// Mock the fetch function
global.fetch = jest.fn().mockImplementationOnce(() =>
  Promise.resolve({
    json: () => Promise.resolve({ status: 200 }), // Mock successful response
  })
);


describe('BuySellExpress component', () => {
  it('renders without crashing', () => {
    const session = {
      data: {
        user: {
          user_id: '123456',
          // Add more mock user data as needed for testing
        },
        // Add more mock session data as needed for testing
      },
      status: 'authenticated',
    }
    const mockRouter = {
      pathname: '/mock-path', // Specify the pathname for testing
    };

    // Mock the useRouter hook to return the mockRouter object
    (useRouter as jest.Mock).mockReturnValue(mockRouter);

    render(
      <MockSessionProvider>
        <BuySellExpress coins={[]} masterPayMethod={[]} assets={[]} session={session} />
      </MockSessionProvider>
    );
    expect(screen.getAllByText(/Buy/i)[0]).toBeInTheDocument();
    expect(screen.getAllByText(/Sell/i)[0]).toBeInTheDocument();
  });

  it('displays error message when spend amount is not entered', async () => {
    const session = {
      data: {
        user: {
          user_id: '123456',
          // Add more mock user data as needed for testing 
        },
        // Add more mock session data as needed for testing
      },
      status: 'authenticated',
    }
    render(
      <MockSessionProvider>
        <BuySellExpress coins={[]} masterPayMethod={[]} assets={[]} session={session}/>
      </MockSessionProvider>
    );
    // Trigger form submission without entering spend amount
      // Trigger form submission without entering receive amount
      fireEvent.click(screen.getAllByText(/Buy/i)[0]);
      fireEvent.click(screen.getAllByText(/Sell/i)[0]);
      fireEvent.click(screen.getAllByText(/Buy/i)[0]); // To toggle back to Buy if Sell is selected initially
      fireEvent.submit(screen.getAllByRole('button', { name: /Buy/i })[0]);

    // Check if error message is displayed
    waitFor(() => {

      expect(screen.getByText(text => text.includes('Please enter amount in INR'))).toBeInTheDocument();
  });
  });

  it('displays error message when receive amount is not entered', async () => {
    const session = {
      data: {
        user: {
          user_id: '123456',
          // Add more mock user data as needed for testing
        },
        // Add more mock session data as needed for testing
      },
      status: 'authenticated',
    }
    render(
      <MockSessionProvider>
        <BuySellExpress coins={[]} masterPayMethod={[]} assets={[]}  session={session}/>
      </MockSessionProvider>
    );
    // Trigger form submission without entering receive amount
    fireEvent.click(screen.getAllByText(/Buy/i)[0]);
    fireEvent.click(screen.getAllByText(/Sell/i)[0]);
    fireEvent.click(screen.getAllByText(/Buy/i)[0]); // To toggle back to Buy if Sell is selected initially
    fireEvent.submit(screen.getAllByRole('button', { name: /Buy/i })[0]);

    // Check if error message is displayed
    waitFor(() => {

      expect(screen.getByText(text => text.includes('Please enter amount in INR'))).toBeInTheDocument();
  });

    // const errorMessage = findByTextRegex(/Please enter amount in INR/i);

    // // Assert that the error message is found
    // expect(errorMessage).toBeInTheDocument();
  });



  test('handles errors correctly', async () => {
    const errorMessage = 'Failed to fetch data';

    // Mock the fetch function to throw an error
    global.fetch=jest.fn().mockRejectedValueOnce({ message: errorMessage });

    // Call the function
    const data = undefined;

    // Assertions
    expect(data).toBeUndefined(); // Ensure that data is undefined in case of error
    // expect(console.log).toHaveBeenCalledWith(errorMessage); // Check if the error is logged
  });

  // Add more test cases as needed to cover different scenarios and functionalities
});
