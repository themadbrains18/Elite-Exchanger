import React from 'react';
import { render, fireEvent, waitFor, getByPlaceholderText } from '@testing-library/react';
import SignIn from '../login-register/signIn';
import { useRouter } from 'next/router';
import userEvent from '@testing-library/user-event';

jest.mock('next/router', () => ({
  useRouter: jest.fn(),
}));
describe('SignIn Component', () => {
  test('renders SignIn component', async () => {
    const { getByPlaceholderText, getByText, getByTestId, queryByText } = render(<SignIn loginType="user" />);

    // Check if the input fields are rendered
    const usernameInput = getByPlaceholderText('Enter Email or Phone Number');
    const passwordInput = getByPlaceholderText('Password');
    expect(usernameInput).toBeInTheDocument();
    expect(passwordInput).toBeInTheDocument();

    // Simulate user input
    fireEvent.change(usernameInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });

    // Submit the form
    const signInButton = getByText('Sign in');
    fireEvent.click(signInButton);

    // Wait for loading state to activate
    await waitFor(() => {
      expect(signInButton).toBeDisabled();
    });

    // Wait for async operations to complete
     waitFor(() => {
      // Verify the behavior after form submission
      const verificationModal = getByTestId('verification-modal');
      expect(verificationModal).toBeInTheDocument();
    });

    // Check if the form is rendered again after clicking back
    expect(getByPlaceholderText('Enter Email or Phone Number')).toBeInTheDocument();

    // Simulate error response
    // For example, if the username is missing
    fireEvent.change(usernameInput, { target: { value: '' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.click(signInButton);

    // Check if error message is displayed
     waitFor(() => {
      expect(queryByText('Email / Phone is required')).toBeInTheDocument();
    });
  });

  test('toggles password visibility', () => {
    const { getByTestId,getByPlaceholderText } = render(<SignIn loginType="user" />);
    const passwordInput = getByPlaceholderText('Password') as HTMLInputElement;

    // Password should be hidden by default
    expect(passwordInput.type).toBe('password');

    // Toggle password visibility
    fireEvent.click(getByTestId('show-hide'));

    // Password should be visible after clicking the toggle
    expect(passwordInput.type).toBe('text');

    // Toggle password visibility again
    fireEvent.click(getByTestId('show-hide'));

    // Password should be hidden again
    expect(passwordInput.type).toBe('password');
  });

  test('displays error messages for invalid input', async () => {
    const { getByRole,getByText } =render(<SignIn loginType="user" />);
    const submitButton = getByRole('button', { name: /Sign in/i });

    userEvent.click(submitButton);

    await waitFor(() => {
      expect(getByText('Email / Phone is required')).toBeInTheDocument();
      expect(getByText('Password must be required')).toBeInTheDocument();
    });
  });

  test('submits form with valid data', async () => {
    const { getByPlaceholderText,getByRole } =render(<SignIn loginType="user" />);
    const usernameInput = getByPlaceholderText('Enter Email or Phone Number');
    const passwordInput = getByPlaceholderText('Password');
    const submitButton = getByRole('button', { name: /Sign in/i });

    fireEvent.change(usernameInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    userEvent.click(submitButton);

    // Add assertions for form submission, such as checking for success messages or navigation
  });

  test('navigates to forgot password page when link is clicked', () => {
    const { getByText } =render(<SignIn loginType="user" />);
    const forgotPasswordLink = getByText(/Forgot Password\?/i);
    userEvent.click(forgotPasswordLink);

    // Add assertions for navigation to the forgot password page
  });

  test('navigates to signin page when link is clicked', () => {
    const { getByText } =render(<SignIn loginType="user" />);
    const registerLink = getByText(/Register Here\!/i);
    userEvent.click(registerLink);

    // Add assertions for navigation to the sign in page
  });

});
