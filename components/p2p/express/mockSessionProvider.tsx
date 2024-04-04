// // MockSessionProvider.js
// import { SessionProvider } from 'next-auth/react';

// export const MockSessionProvider = ({ children }) => {
//   const mockSession = {
//     user: {
//       user_id: 'mocked_user_id',
//       access_token: 'mocked_access_token',
//       // Add any other properties your session might have
//     },
//     expires:"2h"
//     // Add any other properties your session might have
//   };

//   return <SessionProvider session={mockSession}>{children}</SessionProvider>;
// };
