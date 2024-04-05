// import { render, screen, fireEvent } from '@testing-library/react';
// import { MockSessionProvider } from './MockSessionProvider'; // Import the mock provider
// import BuySellExpress from '../buySellExpress'; // Import the component

// describe('BuySellExpress component', () => {
//   it('renders without crashing', () => {
//     render(
//       <MockSessionProvider>
//         <BuySellExpress coins={[]} masterPayMethod={[]} assets={[]} />
//       </MockSessionProvider>
//     );
//     // Check if the component renders without throwing any errors
//     expect(screen.getByText(/Buy/i)).toBeInTheDocument();
//     expect(screen.getByText(/Sell/i)).toBeInTheDocument();
//   });

//   it('displays error message when spend amount is not entered', async () => {
//     render(
//       <MockSessionProvider>
//         <BuySellExpress coins={[]} masterPayMethod={[]} assets={[]} />
//       </MockSessionProvider>
//     );
//     // Trigger form submission without entering spend amount
//     fireEvent.click(screen.getByText(/Buy/i));
//     fireEvent.click(screen.getByText(/Sell/i));
//     fireEvent.click(screen.getByText(/Buy/i)); // To toggle back to Buy if Sell is selected initially
//     fireEvent.submit(screen.getByRole('button', { name: /Buy/i }));

//     // Check if error message is displayed
//     expect(await screen.findByText(/Please enter amount in INR/i)).toBeInTheDocument();
//   });

//   it('displays error message when receive amount is not entered', async () => {
//     render(
//       <MockSessionProvider>
//         <BuySellExpress coins={[]} masterPayMethod={[]} assets={[]} />
//       </MockSessionProvider>
//     );
//     // Trigger form submission without entering receive amount
//     fireEvent.click(screen.getByText(/Buy/i));
//     fireEvent.click(screen.getByText(/Sell/i));
//     fireEvent.click(screen.getByText(/Buy/i)); // To toggle back to Buy if Sell is selected initially
//     fireEvent.submit(screen.getByRole('button', { name: /Buy/i }));

//     // Check if error message is displayed
//     expect(await screen.findByText(/Please enter buy token amount/i)).toBeInTheDocument();
//   });

//   // Add more test cases as needed to cover different scenarios and functionalities
// });
