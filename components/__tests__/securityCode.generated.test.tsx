import { render, fireEvent, waitFor } from '@testing-library/react';
import { act } from 'react-dom/test-utils';
import SecurityCode from '../login-register/securityCode';
import { useRouter } from 'next/router';
jest.mock('next/router', () => ({
  useRouter: jest.fn(),
}));


describe('SecurityCode component', () => {
  it('renders correctly and handles OTP input', async () => {
    const mockSendOtpRes = {
      expire: new Date(Date.now() + 60000).toISOString(), // Set expiration time 1 minute in the future
    };

    const props = {
      formData: {
        step: 2,
        otp: '',
        username: 'test@example.com',
      },
      api: 'some_api',
      sendOtpRes: mockSendOtpRes,
    };

    const { getByText, getByTestId } = render(<SecurityCode {...props} />);

    // Simulate OTP input
    const otpInputs = Array.from({ length: 6 }, (_, index) => getByTestId(`otp-input-${index + 1}`));
    otpInputs.forEach((input, index) => {
      fireEvent.change(input, { target: { value: `${index + 1}` } });
    });

    // Simulate button click to continue
    const continueButton = getByText('Continue');
    fireEvent.click(continueButton);

    // Wait for API request to resolve
    await waitFor(() => {
      // Add assertions for API requests and response handling
    });

    // Add assertions for other aspects of component behavior, such as timer display and resend code functionality
  });
  it('displays error message when OTP is not filled', async () => {
    const mockSendOtpRes = {
      expire: new Date(Date.now() + 60000).toISOString(), // Set expiration time 1 minute in the future
    };

    const props = {
      formData: {
        step: 2,
        otp: '',
        username: 'test@example.com',
      },
      api: 'some_api',
      sendOtpRes: mockSendOtpRes,
    };

    const { getByText } = render(<SecurityCode {...props} />);

    // Simulate button click to continue without filling OTP
    const continueButton = getByText('Continue');
    fireEvent.click(continueButton);

    // Expect error message to be displayed
    expect(getByText('Please enter One-Time password to authenticate.')).toBeInTheDocument();
  });

  it('redirects after successful OTP submission', async () => {
    const mockSendOtpRes = {
      expire: new Date(Date.now() + 60000).toISOString(), // Set expiration time 1 minute in the future
    };

    const props = {
      formData: {
        step: 2,
        otp: '123456', // Assuming correct OTP
        username: 'test@example.com',
      },
      api: 'some_api',
      sendOtpRes: mockSendOtpRes,
    };

    const mockRouter = { push: jest.fn() };

    const mockToast = jest.fn();

    jest.mock("react-toastify", () => ({
      toast: mockToast,
    }));

    global.fetch = jest.fn().mockResolvedValue({
      json: jest.fn().mockResolvedValue({ data: { status: 200 } }), // Mock the response data
    });
    const { getByText } = render(<SecurityCode {...props} />);

    // Simulate button click to continue with correct OTP
    const continueButton = getByText('Continue');
    fireEvent.click(continueButton);

    // Expect success message to be displayed
     waitFor(() => {
      expect(mockToast).toHaveBeenCalledWith('Otp Matched');
      expect(mockRouter.push).toHaveBeenCalledWith('/login');
    });

    // Expect redirection to login page
  });



  // Add more test cases for other scenarios and edge cases as needed
});
