import React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react";
import { act } from "react-dom/test-utils";
import ResetPassword from "../login-register/resetPassword";
import { useRouter } from 'next/router';

jest.mock('next/router', () => ({
  useRouter: jest.fn(),
}));



// Mock the fetch function
global.fetch = jest.fn().mockImplementationOnce(() =>
  Promise.resolve({
    json: () => Promise.resolve({ status: 200 }), // Mock successful response
  })
);

describe("ResetPassword component", () => {
  it("submits the form and progresses to the next step", async () => {
    const { getByPlaceholderText, getByText } = render(<ResetPassword />);

    // Fill out the form fields
    const emailInput = getByPlaceholderText("Enter Email");
    fireEvent.change(emailInput, { target: { value: "test@example.com" } });

    const passwordInput = getByPlaceholderText("Password");
    fireEvent.change(passwordInput, { target: { value: "password123" } });

    const confirmPasswordInput = getByPlaceholderText("Confirm Password");
    fireEvent.change(confirmPasswordInput, { target: { value: "password123" } });

    // Submit the form
    const resetPasswordButton = getByText("Reset Password");
    fireEvent.click(resetPasswordButton);

    // Wait for the API request to resolve
     waitFor(() => {
      expect(fetch).toHaveBeenCalledWith("http://localhost:3000/api/user/forget", {
        method: "POST",
        mode: "cors",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: "test@example.com",
          password: "password123",
          confirmPassword: "password123",
        }),
      });
    });

    // Ensure that the component progresses to the next step
     waitFor(() => {
      expect(getByText("Enter your security code")).toBeInTheDocument();
    });
  });

  it("successfully resets password and redirects", async () => {
    // Mock a successful API response
    global.fetch = jest.fn().mockImplementationOnce(() =>
      Promise.resolve({
        json: () => Promise.resolve({ status: 200 }), // Mock successful response
      })
    );

    const { getByPlaceholderText, getByText } = render(<ResetPassword />);

    // Fill out the form fields with valid data
    const emailInput = getByPlaceholderText("Enter Email");
    fireEvent.change(emailInput, { target: { value: "test@example.com" } });

    const passwordInput = getByPlaceholderText("Password");
    fireEvent.change(passwordInput, { target: { value: "newPassword123" } });

    const confirmPasswordInput = getByPlaceholderText("Confirm Password");
    fireEvent.change(confirmPasswordInput, { target: { value: "newPassword123" } });

    // Submit the form
    const resetPasswordButton = getByText("Reset Password");
    fireEvent.click(resetPasswordButton);

    // Wait for redirection to occur
     waitFor(() => {
      expect(screen.history.location.pathname).toBe("/login");
    });
  });

  it("validates email and phone input fields", async () => {
    const { getByPlaceholderText, getByText } = render(<ResetPassword />);

    // Test invalid email input
    const emailInput = getByPlaceholderText("Enter Email");
    fireEvent.change(emailInput, { target: { value: "invalidEmail" } });
    fireEvent.blur(emailInput); // Trigger blur event to validate field

    // Ensure that validation error message is displayed
     waitFor(() => {
      expect(getByText("Email / Phone is invalid")).toBeInTheDocument();
    });

    // Test valid phone input
    const phoneInput = getByPlaceholderText("Enter Email");
    fireEvent.change(phoneInput, { target: { value: "1234567890" } });
    fireEvent.blur(phoneInput); // Trigger blur event to validate field

    // Ensure that validation error message is not displayed
    // expect(queryByText("Email / Phone is invalid")).not.toBeInTheDocument();
  });

  // Add more test cases as needed...
});
