import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event'; // Import userEvent for simulating user interactions
import SignUp from '../login-register/signUp'; // Assuming this is the correct import path
import { useSearchParams } from 'next/navigation';

// Mock the behavior of useSearchParams
// jest.mock('next/navigation', () => ({
//   useSearchParams: jest.fn(),
// }));
jest.mock('next/router', () => ({
  useRouter: jest.fn(),
}));

jest.mock('next/navigation', () => ({
  useSearchParams: jest.fn().mockReturnValue({
    get: jest.fn().mockImplementation((param) => {
      if (param === 'r') {
        return 'mockedRValue';
      } else if (param === 'e') {
        return 'mockedEValue';
      }
      return null;
    }),
  }),
}));
describe('SignUp component', () => {
  it('renders SignUp form', () => {
    
    const { getAllByPlaceholderText,getByPlaceholderText } =  render(<SignUp />);
    // Add your assertions here to check if the form elements are rendered correctly
    expect(getByPlaceholderText('Enter Email / Phone Number')).toBeInTheDocument();
    expect(getAllByPlaceholderText('Password')[0]).toBeInTheDocument();
    // Add more assertions as needed
  });

  it('shows password when toggle button is clicked', () => {
    render(<SignUp />);
    const passwordInput = screen.getByPlaceholderText('Password');
    const toggleButton = screen.getByTestId('show-hide');

    fireEvent.click(toggleButton); // Simulate click event on toggle button

    // Check if the password input type is now 'text'
    expect(passwordInput).toHaveAttribute('type', 'text');
  });

  it('displays error messages for invalid input', async () => {
    render(<SignUp />);
    const submitButton = screen.getByText('Register');

    fireEvent.click(submitButton); // Simulate form submission without filling in any details

    // Wait for error messages to appear
     waitFor(() => {
      expect(screen.getByText('Email / Phone is required')).toBeInTheDocument();
      expect(screen.getByText('Password is required')).toBeInTheDocument();
      // Add more assertions for other error messages
    });
  });

  it('submits form with valid data', async () => {
    render(<SignUp />);
    const usernameInput = screen.getByPlaceholderText('Enter Email / Phone Number');
    const passwordInput = screen.getByPlaceholderText('Password');
    const confirmPasswordInput = screen.getByPlaceholderText('Confirm Password');
    const submitButton = screen.getByText('Register');

    // Fill in valid data
    userEvent.type(usernameInput, 'test@example.com');
    userEvent.type(passwordInput, 'TestPassword123');
    userEvent.type(confirmPasswordInput, 'TestPassword123');

    fireEvent.click(submitButton); // Simulate form submission

    // Wait for the verification modal to appear
     waitFor(() => {
      expect(screen.getByTestId('verification-modal')).toBeInTheDocument();
    });
  });

  it('navigates to signin page when link is clicked', () => {
    render(<SignUp />);
    const signInLink = screen.getByText('Sign in');

    fireEvent.click(signInLink); // Simulate click on the sign in link

    // Check if the URL changes or if the sign in page is rendered
    // You can use react-router testing utilities if you're using react-router for navigation
    // Example: expect(history.location.pathname).toEqual('/signin');
  });

  it('displays error message when password and confirm password do not match', async () => {
    const { getByLabelText, getByText,getByPlaceholderText } = render(<SignUp />);

    // Enter password
    const passwordInput = getByPlaceholderText('Password');
    userEvent.type(passwordInput, 'password123');

    // Enter different confirm password
    const confirmPasswordInput = getByPlaceholderText('Confirm Password');
    userEvent.type(confirmPasswordInput, 'differentpassword');

    // Click on Register button
    const registerButton = getByText('Register');
    fireEvent.click(registerButton);

    // Wait for validation errors to appear
     waitFor(() => {
      // Confirm that error message is displayed
      expect(getByText('Passwords must match')).toBeInTheDocument();
    });
  });
});
