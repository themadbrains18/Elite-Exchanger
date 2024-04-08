import { SessionProvider } from 'next-auth/react';

export const MockSessionProvider = ({ children }:any) => {
  const mockSession = {
    user:{
      "name": "Joh Doe",
      "email": "xyz@gmail.com",
      "number": "null",
      "user_id": "123",
      "access_token": "mock_token",
      "refer_code": "9wuSBjnJsy",
      "TwoFA": true,
      "secret": "{\"ascii\":\"1Ur@SmXpX}e[WL1nM>0U\",\"hex\":\"31557240536d5870587d655b574c316e4d3e3055\",\"base32\":\"GFKXEQCTNVMHAWD5MVNVOTBRNZGT4MCV\",\"otpauth_url\":\"otpauth://totp/SecretKey?secret=GFKXEQCTNVMHAWD5MVNVOTBRNZGT4MCV\"}",
      "role": "admin",
      "tradingPassword": "$2b$10$9HtYdBuQdeOt4bQTsZdXhu205Vju5cZAIGC8f3D.hoHQhZnv7Ik1.",
      "antiphishing": "323232",
      "whitelist": true,
      "kyc": "approve",
      "createdAt": "2024-02-26T11:34:34.000Z",
      "pwdupdatedAt": "2024-03-19T11:55:45.000Z"
  },
      // Add more mock session data as needed for testing
      expires:"2024-05-08T05:10:37.557Z",
    // Add more mock session status as needed for testing
  };

  return (
    <SessionProvider session={mockSession}>
      {children}
    </SessionProvider>
  );
};
