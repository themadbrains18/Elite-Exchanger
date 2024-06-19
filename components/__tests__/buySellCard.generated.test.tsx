import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import BuySellCard from '../snippets/buySellCard';
import userEvent from '@testing-library/user-event';

jest.mock('next/router', () => ({
  __esModule: true,
  useRouter: jest.fn().mockReturnValue({ pathname: '/chart' }), // Mocking the pathname for testing on chart page
}));


const mockProps = {
  id: 1,
  coins: [
    // Mock data for coins
    { symbol: 'BTC', name: 'Bitcoin' },
    { symbol: 'ETH', name: 'Ethereum' },
    // Add more mock coins as needed
  ],
  session: {
    // Mock data for session
    user: {
      user_id: 123,
      access_token: 'mock_access_token',
      // Add more user data as needed
    },
  },
  token: {
    // Mock data for token
    symbol: 'BTCB',
    price: 100,
    tradepair:{
      limit_trade:true
    }
    // Add more token data as needed
  },
  assets: [
    // Mock data for assets
    { asset_id: 1, balance: 10 },
    { asset_id: 2, balance: 20 },
    // Add more mock assets as needed
  ],
  slug: 'BTC', // Example slug
  getUserOpenOrder: jest.fn(), // Mock function
  getUserTradeHistory: jest.fn(), // Mock function
};

test('renders BuySellCard component without crashing', () => {
  render(<BuySellCard {...mockProps} />);
});

test('renders Buy button', () => {
  const { getAllByText } = render(<BuySellCard {...mockProps}/>);
  const buyButton = getAllByText(/Buy/i);
  expect(buyButton[0]).toBeInTheDocument();
});

test('renders Sell button', () => {
  const { getByText } = render(<BuySellCard {...mockProps} />);
  const sellButton = getByText(/Sell/i);
  expect(sellButton).toBeInTheDocument();
});


test('initial state of component', () => {
  const { getByTestId, getByText } = render(<BuySellCard {...mockProps}/>);
  
  // For radio buttons, check if the default radio button is selected
  // const limitRadioButton = getByLabelText('Limit');
  // expect(limitRadioButton).toBeChecked();

  // For checkboxes, check if the checkbox is not checked by default
  const checkbox = getByTestId('market_type');
  expect(checkbox).toBeChecked();

  let show=2
  const condition = ((show === 1 && mockProps.token?.tradepair?.limit_trade === true) || show === 2);

  if (condition) {
    // Check initial text content
    const totalTextElement = screen.getByTestId('total');
    expect(totalTextElement).toBeInTheDocument();

    const feeTextElement = screen.getByText('Est. Fee:');
    expect(feeTextElement).toBeInTheDocument();
  }
});


test('form submits with valid input', () => {
  const { getByLabelText, getByText } = render(<BuySellCard {...mockProps}/>);
  const tokenAmountInput = getByText(/Quantity/i);
  const limitInput = getByText(/Buy For/i);
  const buyButton = getByText('Buy');

  userEvent.type(tokenAmountInput, '10');
  userEvent.type(limitInput, '50');
  userEvent.click(buyButton);

  // Add expectations for the actions you expect to occur after form submission
});


test('changes active state when Buy/Sell buttons are clicked', () => {
  render(<BuySellCard  {...mockProps}/>);
  const buyButton = screen.getByText('Buy');
  userEvent.click(buyButton);
  expect(buyButton).toHaveClass('!text-primary border-primary');

  // Add similar test for Sell button
});

test('displays error message for empty inputs on form submission', async () => {
  render(<BuySellCard {...mockProps}/>);
  const submitButton = screen.getAllByRole('button', { name: /buy/i });
  userEvent.click(submitButton[0]);
  // Ensure error messages are displayed for empty inputs
   waitFor(() => {

      expect(screen.getByText(text => text.includes('Please enter quantity'))).toBeInTheDocument();
      expect(screen.getByText(text => text.includes('Please enter limit amount'))).toBeInTheDocument();
  });

  // Add more assertions as needed...
});
