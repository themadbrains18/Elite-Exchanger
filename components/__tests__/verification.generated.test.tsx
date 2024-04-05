import { render, fireEvent, waitFor, screen } from '@testing-library/react';
import Verification from '../login-register/verification';
import { useRouter } from 'next/router';
jest.mock('next/router', () => ({
  useRouter: jest.fn(),
}));

test('sends OTP when continue button is clicked', async () => {
    // Mock props
    const mockProps = {
      step: 1,
      setStep: jest.fn(),
      isEmail: true,
      formData: { username: 'test@example.com', step: 1 },
      api: 'verify',
      setSendOtpRes: jest.fn(),
      sendOtp: jest.fn() // Define sendOtp function and mock it
    };

    render(<Verification {...mockProps} />);

    // Mock fetch response
    global.fetch = jest.fn().mockResolvedValueOnce({
      json: jest.fn().mockResolvedValueOnce({ status: 200, data: { message: 'OTP sent successfully', otp: '123456' } })
    });

    // Simulate click on continue button
    fireEvent.click(screen.getByText('Continue'));

    // Wait for API call and assertions
     waitFor(() => {
      expect(fetch).toHaveBeenCalledTimes(1);
      expect(fetch).toHaveBeenCalledWith('/api/user/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: expect.any(String)
      });

      expect(mockProps.sendOtp).toHaveBeenCalled(); // Ensure sendOtp function is called
      expect(mockProps.setSendOtpRes).toHaveBeenCalledWith("123456"); // Change the expectation to any string
      expect(mockProps.setStep).toHaveBeenCalledWith(2);
    });
});
