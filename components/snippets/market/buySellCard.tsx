import React, { useEffect, useState } from "react";
import IconsComponent from "../icons";
import Image from "next/image";
import FilterSelectMenuWithCoin from "../filter-select-menu-with-coin";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { toast } from 'react-toastify';

import AES from 'crypto-js/aes';
import { useRouter } from "next/router";
import { signOut } from "next-auth/react";
import Link from "next/link";
import ConfirmBuy from "../confirmBuy";
import { useWebSocket } from "@/libs/WebSocketContext";
import { truncateNumber } from "@/libs/subdomain";

/**
 * Validation schema for token amount and USDT limit.
 *
 * This schema defines the validation rules for two fields:
 * - `token_amount`: A positive number that must be provided and is required.
 * - `limit_usdt`: A positive number that must be provided and is required.
 *
 * The validation includes:
 * - Ensuring both fields are positive numbers.
 * - Displaying specific error messages for empty or invalid input.
 *
 * @type {Yup.ObjectSchema}
 */
const schema = yup.object().shape({
  /**
  * Validates the token amount.
  * - Must be a positive number.
  * - Must be greater than 0.
  * - Required field with a custom error message.
  * 
  * @type {Yup.NumberSchema}
  */
  token_amount: yup.number().positive("Amount must be greater than '0'.").required('Please enter quantity.').typeError('Please enter quantity.'),
  /**
   * Validates the limit for USDT.
   * - Must be a positive number.
   * - Must be greater than 0.
   * - Required field with a custom error message.
   * 
   * @type {Yup.NumberSchema}
   */
  limit_usdt: yup.number().positive("Limit must be greater than '0'.").required('Please enter limit amount.').typeError('Please enter limit amount.'),
});

/**
 * Props for the BuySellCard component.
 * 
 * This interface defines the properties passed to the BuySellCard component:
 * - `id`: A unique identifier for the card (required).
 * - `coins`: List of available coins (required).
 * - `session`: The user's session information (required).
 * - `token`: An optional token data associated with the card.
 * - `assets`: Optional assets data.
 * - `slug`: Optional identifier for the specific coin or asset.
 * - `getUserOpenOrder`: Optional function to fetch the user's open orders.
 * - `getUserTradeHistory`: Optional function to fetch the user's trade history.
 * 
 * @interface BuySellCardProps
 */
interface BuySellCardProps {
  /**
  * A unique identifier for the buy/sell card.
  * 
  * @type {number}
  */
  id: number;
  /**
   * List of coins available for trading.
   * 
   * @type {any}
   */
  coins: any,
  /**
   * The user's session information, including authentication and user data.
   * 
   * @type {any}
   */
  session: any;
  /**
   * Optional token data related to the trading process.
   * 
   * @type {any}
   * @optional
   */
  token?: any;
  /**
   * Optional data about assets in the user's portfolio.
   * 
   * @type {any}
   * @optional
   */
  assets?: any;
  /**
   * An optional slug to identify the specific coin or asset.
   * 
   * @type {any}
   * @optional
   */
  slug?: any;
  /**
  * Optional function to retrieve the user's open orders.
  * 
  * @type {any}
  * @optional
  */
  getUserOpenOrder?: any;
  /**
  * Optional function to retrieve the user's trade history.
  * 
  * @type {any}
  * @optional
  */
  getUserTradeHistory?: any;
}

/**
 * Formats a given amount into currency format, including proper comma separation for thousands and decimals.
 * The amount is formatted according to the Indian numbering system (using 'en-IN' locale).
 * 
 * @param {any} amount - The amount to be formatted, which can be a string, number, or any other type convertible to a number.
 * 
 * @returns {string} - The formatted currency string. If the input is invalid, it returns "0.00".
 * 
 * @example
 * currencyFormatter(1000000) // Returns "10,00,000.00"
 * currencyFormatter(12345.67) // Returns "12,345.67"
 */
export function currencyFormatter(amount: any) {
  // Ensure the amount is a number
  const number = Number(amount);
  // Split the number into integer and decimal parts
  const [integerPart, decimalPart] = number.toString().split('.');
  // Format the integer part using toLocaleString
  const formattedInteger = Number(integerPart).toLocaleString('en-IN');
  // Combine the formatted integer part and the decimal part
  if (formattedInteger !== 'NaN') {
    return decimalPart ? `${formattedInteger}.${decimalPart}` : formattedInteger + '.00';

  }
  else {
    return 0.00
  }
}


const BuySellCard = (props: BuySellCardProps) => {
  const [active1, setActive1] = useState(1);
  const [active, setActive] = useState(false);
  const [firstCurrency, setFirstCurrency] = useState('');
  const [secondCurrency, setSecondCurrency] = useState('USDT');
  const [totalAmount, setTotalAmount] = useState(0.0);
  const [selectedToken, setSelectedToken] = useState(Object);
  const [price, setPrice] = useState(0.00);
  const [userAssets, setUserAssets] = useState(props.assets);
  const [show, setShow] = useState(1);
  const [estimateFee, setEstimateFee] = useState(0);
  const [objData, setObjData] = useState(Object);
  const router = useRouter()
  const [spotType, setSpotType] = useState('buy');
  const [disabled, setDisabled] = useState(false);

  const wbsocket = useWebSocket();
  const list = props.coins;

  /**
   * Filters the coins list to exclude 'USDT' and any coins where the tradepair is null.
   * 
   * @param {Array} props.coins - The array of coin objects to be filtered.
   * 
   * @returns {Array} - A filtered array of coins, excluding 'USDT' and coins with a null tradepair.
   * 
   * @example
   * const qtylist = props.coins.filter((item) => item.symbol !== 'USDT' && item?.tradepair !== null);
   */
  const qtylist = props.coins.filter((item: any) => {
    return item.symbol !== 'USDT' && item?.tradepair !== null
  });

  /**
   * Filters the coins list to include only those with the symbol 'USDT'.
   * 
   * @param {Array} props.coins - The array of coin objects to be filtered.
   * 
   * @returns {Array} - A filtered array containing only the coins with the symbol 'USDT'.
   * 
   * @example
   * let secondList = props.coins?.filter((item) => item.symbol === 'USDT');
   */
  let secondList = props.coins?.filter((item: any) => {
    return item.symbol === 'USDT'
  })

  let { register, setValue, getValues, handleSubmit, clearErrors, watch, reset, setError, formState: { errors } } = useForm({
    resolver: yupResolver(schema),
  });

  /**
 * Effect hook that runs when the `userAssets` state changes.
 * 
 * - Sets the currency name to 'USDT' with 2 decimal places.
 * - Sets the price change type based on `spotType`.
 * - Calls the `Socket` function to establish a WebSocket connection.
 * - Calls the `convertTotalAmount` function to update the total amount.
 * - Finds the `.custom-radio` element and simulates a click on its previous sibling if it exists.
 * 
 * @example
 * useEffect(() => {
 *   // Sets the currency name and price change type, handles socket and amount conversion
 * }, [userAssets]);
 */
  useEffect(() => {
    setCurrencyName('USDT', 2);
    setPriceOnChangeType(spotType, '');

    Socket();
    convertTotalAmount();
    let radioCta = document.querySelector(".custom-radio") as HTMLInputElement | null;
    let prevSibling: ChildNode | null | undefined = radioCta?.previousSibling;
    if (prevSibling instanceof HTMLElement) {
      prevSibling.click();
    }
  }, [userAssets])

  /**
   * Function to handle WebSocket messages.
   * 
   * This function listens for incoming WebSocket messages and processes them based on their type.
   * - If the message type is "market", it calls `getAssets` to update asset information if the `session` is available.
   * 
   * @example
   * Socket(); // Starts listening for WebSocket messages and handles them accordingly.
   */
  const Socket = () => {
    // Check if WebSocket connection is established
    if (wbsocket) {
      // Define what to do when a message is received
      wbsocket.onmessage = (event) => {
        const data = JSON.parse(event.data).data;
        let eventDataType = JSON.parse(event.data).type;

        if (eventDataType === "market") {
          if (props.session) {
            getAssets();
          }
        }
      }
    }

  };

  /**
   * Sets the currency name and updates related state and form values based on the selected currency symbol.
   * 
   * This function handles the selection of the currency in the dropdown and updates various states
   * such as the first or second currency, token details, fee estimates, and total amount based on the
   * selected currency symbol.
   * 
   * - If `dropdown` is `1`, it updates the first currency and performs calculations for `limit_usdt`, 
   *   total amount, and estimated fee.
   * - If `dropdown` is not `1`, it updates the second currency.
   * 
   * @param {string} symbol - The symbol of the selected currency (e.g., 'USDT').
   * @param {number} dropdown - Determines whether it's the first or second currency selection.
   * @example
   * setCurrencyName('USDT', 1); // Sets 'USDT' as the first currency and updates form values.
   */
  const setCurrencyName = (symbol: string, dropdown: number) => {
    // Check if the dropdown is the first one
    if (dropdown === 1) {
      clearErrors('token_amount');
      setFirstCurrency(symbol);

      // Find the token data for the selected symbol
      let token = list && list?.length > 0 && list?.filter((item: any) => {
        return item.symbol === symbol && item?.tradepair !== null
      });

      // If token data is found, update form values and perform calculations
      if (token.length > 0) {
        setValue('limit_usdt', token[0].price.toFixed(6))
        setSelectedToken(token[0]);
        setPriceOnChangeType(active1 === 1 ? 'buy' : 'sell', symbol);
        let qty: any = getValues('token_amount');
        let totalAmount = qty * token[0].price;
        let fee: any = active1 === 1 ? (qty * 0.001).toFixed(8) : (token[0].price * qty * 0.001).toFixed(8);

        setEstimateFee(fee);
        setTotalAmount(totalAmount);
      }
      // If there is a session message indicating expired session, sign out
      if (userAssets.message !== undefined) {
        signOut();
        return;
      }
    }
    else {
      setSecondCurrency(symbol);
    }
  }

  /**
   * Sets the price based on the selected type ('buy' or 'sell') and the currency symbol.
   * 
   * This function determines the appropriate token from the list and updates the price based on the 
   * selected currency symbol and the available balance in the user's assets. 
   * - If the type is 'buy', it checks for 'USDT' as the token.
   * - If the type is not 'buy', it checks the selected symbol (or the first currency if symbol is empty).
   * 
   * The price is updated based on the balance of the selected token in the user's main wallet.
   * 
   * @param {string} type - The type of transaction, either 'buy' or 'sell'.
   * @param {string} symbol - The symbol of the token (e.g., 'BTC', 'ETH').
   * @example
   * setPriceOnChangeType('buy', 'BTC'); // Sets the price for 'BTC' based on available balance in main wallet.
   */
  const setPriceOnChangeType = (type: string, symbol: string) => {
    try {
      setPrice(0.00);
      // Find the token based on type and symbol
      let token = list.filter((item: any) => {
        return item.symbol === (type === 'buy' ? 'USDT' : symbol === '' ? firstCurrency : symbol)
      });
      // If a matching token is found
      if (token.length > 0) {
        let selectAssets = userAssets.filter((item: any) => {
          return item.token_id === token[0].id && item?.walletTtype === "main_wallet"
        });
        // If asset found, update the price with the available balance
        if (selectAssets.length > 0) {
          setPrice(selectAssets[0].balance);
        }
      }
    } catch (error: any) {
      toast.error(error);
    }
  }

  /**
 * Handles form submission for placing a market or limit order, based on the user's selection.
 * 
 * This function performs validation checks for the selected token, available balance, 
 * and trading conditions (e.g., market type, limit trade availability, maximum trade amount).
 * It processes the data from the form and constructs an order object to be submitted.
 * 
 * - If limit orders are unavailable for the selected token, an error message is shown.
 * - It checks whether the user has sufficient balance for the trade.
 * - It verifies if the user is attempting to trade more than the allowed maximum amount.
 * - The order object is then prepared with the necessary data like user ID, token ID, order type, and fees.
 * 
 * @param {any} data - The form data containing information like token amount, limit amount, etc.
 * @returns {void} 
 * @throws {Error} If an error occurs during submission.
 * 
 * @example
 * // Example usage when the user submits the form:
 * onHandleSubmit(formData);  // Processes the order and handles validation.
 */
  const onHandleSubmit = async (data: any) => {
    try {
      // Check if limit orders are unavailable for the selected token
      if (show === 1 && selectedToken?.tradepair?.limit_trade === false) {
        setDisabled(true)

        toast.error(`Limit orders are unavailable for ${selectedToken?.symbol} at the moment. Please check later`, { autoClose: 2000 })
        setTimeout(() => {
          setDisabled(false)

        }, 3000)
        return;
      }
      else {
        // Get the selected market type (buy/sell)
        let type = document.querySelector('input[name="market_type"]:checked') as HTMLInputElement | null;

        // Validate if the user has selected a coin for the transaction
        if (firstCurrency === '') {
          setError('token_amount', { type: 'custom', message: 'Please select coin that you want to buy.' });
          return
        }
        // Validate if the user has sufficient balance for the transaction
        if (active1 === 1 && totalAmount > price) {
          setDisabled(true);
          toast.error('Insufficient balance.', { autoClose: 2000 });
          setTimeout(() => {
            setDisabled(false);
          }, 3000);
          return;
        }
        else if (active1 === 2 && data.token_amount > price) {
          setDisabled(true);
          toast.error('Insufficient balance.', { autoClose: 2000 });
          setTimeout(() => {
            setDisabled(false);
          }, 3000);
          return;
        }

        // Check if the user is exceeding the maximum allowed trade amount
        if (selectedToken?.tradepair?.maxTrade < data.token_amount) {
          setError("token_amount", {
            type: "custom",
            message: "you can trade less than max amount " + `'${selectedToken?.tradepair?.maxTrade}.'`,
          });
          return;
        }

        // Prepare the order object with necessary information
        let obj = {
          "user_id": props.session.user.user_id,
          "token_id": selectedToken?.id,
          "market_type": type?.value,
          "order_type": active1 === 1 ? 'buy' : 'sell',
          "limit_usdt": data.limit_usdt,
          "volume_usdt": totalAmount,
          "token_amount": data.token_amount,
          "fee": active1 === 1 ? data.token_amount * 0.00075 : data.token_amount * data.limit_usdt * 0.00075,
          "is_fee": false,
          "status": false,
          "isCanceled": false,
          "queue": false
        }
        setObjData(obj)
        setActive(true)
      }
    } catch (error: any) {
      toast.error(error);
    }
  }

  /**
   * Handles the process of submitting a market order, including encryption of order data,
   * making a POST request to the server, and performing additional actions based on the response.
   * 
   * This function first encrypts the order data (`objData`) and sends it to the server as a POST request.
   * If the server responds with a success status, it resets form fields, clears the selected token, and
   * sends a WebSocket message to update the market status. Additionally, after a short delay, the function
   * sends a partial execution request for the market order.
   * 
   * @returns {Promise<void>} A promise that resolves when the action is complete.
   * @throws {Error} If an error occurs during the fetch request or encryption process.
   * 
   * @example
   * // Example usage when the user performs an action:
   * await actionPerform();  // Submits the market order and handles the response.
   */
  const actionPerform = async () => {
    try {
      // Encrypt the order data and prepare it for transmission
      const ciphertext = AES.encrypt(JSON.stringify(objData), `${process.env.NEXT_PUBLIC_SECRET_PASSPHRASE}`);
      let record = encodeURIComponent(ciphertext.toString());

      // Send the encrypted order data to the server via POST request
      let reponse = await fetch(`${process.env.NEXT_PUBLIC_BASEURL}/market`, {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
          "Authorization": props?.session?.user?.access_token
        },
        body: JSON.stringify(record)
      }).then(response => response.json());

      // Handle successful response from the server
      if (reponse.data.status === 200) {
        toast.success(reponse.data?.data?.message);
        setFirstCurrency('');
        setSecondCurrency('USDT');
        setSelectedToken('')
        setEstimateFee(0)
        reset({
          limit_usdt: 0,
          token_amount: 0.00,
        })
        setEstimateFee(0.00)
        setTotalAmount(0.0)
        setActive(false);
        // Send a WebSocket message to update the market status
        if (wbsocket) {
          let withdraw = {
            ws_type: 'market',
          }
          wbsocket.send(JSON.stringify(withdraw));
        }

        setTimeout(async () => {
          let partialObj = {
            "user_id": props.session.user.user_id,
            "token_id": selectedToken?.id,
            "order_type": active1 === 1 ? 'buy' : 'sell',
            "market_type": show === 1 ? 'limit' : 'market'
          }

          const ciphertext = AES.encrypt(JSON.stringify(partialObj), `${process.env.NEXT_PUBLIC_SECRET_PASSPHRASE}`);
          let record = encodeURIComponent(ciphertext.toString());

          let executionReponse = await fetch(`${process.env.NEXT_PUBLIC_BASEURL}/market`, {
            method: "PUT",
            headers: {
              'Content-Type': 'application/json',
              "Authorization": props?.session?.user?.access_token
            },
            body: JSON.stringify(record)
          }).then(response => response.json());

          if (executionReponse?.data?.message === undefined) {
            if (wbsocket) {
              let withdraw = {
                ws_type: 'market',
              }
              wbsocket.send(JSON.stringify(withdraw));
            }
          }

          reset({
            limit_usdt: selectedToken?.price.toFixed(6),
            token_amount: 0.00,
          })
          setEstimateFee(0.00)
          setTotalAmount(0.0)
        }, 2000);


      }
      else {
        toast.error(reponse.data?.data);
      }

    } catch (error) {
      console.log("error while create market order", error);

    }
  }

  /**
 * Calculates and updates the total amount and estimated fee based on the selected market type,
 * token amount, and limit price. 
 * 
 * If the market type is "limit", the calculation is done using the `limit_usdt` value. If it's "market",
 * the total amount is calculated using the `selectedToken.price`. The fee is calculated as a 0.1% fee on
 * the total amount.
 * 
 * If no valid values are provided for token amount or limit price, the total amount is set to 0.00.
 */
  const convertTotalAmount = () => {
    // Check if the token amount is empty
    if (getValues('token_amount')?.toString() === '') {
      setTotalAmount(0.00);
      return;
    }
    // Get the selected market type (either 'market' or 'limit')
    let type = document.querySelector('input[name="market_type"]:checked') as HTMLInputElement | null;

    if (type?.value === 'limit') {
      if (getValues('limit_usdt')?.toString() === '') {
        setTotalAmount(0.00);
        return;
      }
      // Get the token amount and limit price from form values
      let qty: any = getValues('token_amount');
      let amount: any = getValues('limit_usdt');

      // Calculate total amount and fee
      let totalAmount = qty * amount;
      let fee: any = active1 === 1 ? truncateNumber((qty * 0.001), 8) : truncateNumber((amount * qty * 0.001), 8);

      setEstimateFee(fee);
      setTotalAmount(totalAmount);
    }
    else {
      // If the market type is not 'limit', calculate based on the selected token's price
      let qty: any = getValues('token_amount');
      let totalAmount = qty * selectedToken?.price;
      let fee: any = active1 === 1 ? truncateNumber((qty * 0.001), 8) : truncateNumber((selectedToken?.price * qty * 0.001), 8);

      setEstimateFee(fee);
      setTotalAmount(totalAmount);
    }
  }

  /**
 * Fetches the assets for the user from the API and updates the state.
 * 
 * This function sends a GET request to fetch the user's assets using their user ID
 * and access token from the session. On success, it updates the `userAssets` state
 * with the fetched data. If an error occurs during the fetch process, it displays
 * an error message using a toast notification.
 */
  const getAssets = async () => {
    try {
      // Fetch user assets from the API
      let userAssets = await fetch(`${process.env.NEXT_PUBLIC_BASEURL}/user/assets?userid=${props.session?.user?.user_id}`, {
        method: "GET",
        headers: {
          "Authorization": props.session?.user?.access_token
        },
      }).then(response => response.json());

      setUserAssets(userAssets);

    } catch (error) {
      console.log("error while fetching assets", error);

    }
  }

  return (
    <>
      <div className="p-20 md:p-20 rounded-10  bg-white dark:bg-d-bg-primary">
        <div className="flex border-b border-grey-v-1">
          <button className={`sec-text text-center text-gamma border-b-2 border-[transparent] pb-[25px] max-w-[50%] w-full ${active1 === 1 && "!text-primary border-primary"}`} onClick={() => {
            setActive1(1); setPriceOnChangeType('buy', ''); reset({
              limit_usdt: 0.00,
              token_amount: 0.00,
            })
            setSpotType('buy');
            setTotalAmount(0.0); setEstimateFee(0.00)
            if (show === 2 && selectedToken?.price) {
              setValue('limit_usdt', selectedToken?.price.toFixed(6))
            }
            else if (show === 2) {
              setValue('limit_usdt', 1)
            }
          }}>
            Buy
          </button>
          <button className={`sec-text text-center text-gamma border-b-2 border-[transparent] pb-[25px] max-w-[50%] w-full ${active1 === 2 && "!text-primary border-primary"}`} onClick={() => {
            setActive1(2); setPriceOnChangeType('sell', ''); reset({
              limit_usdt: 0.00,
              token_amount: 0.00,
            })
            setSpotType('sell');
            setTotalAmount(0.0); setEstimateFee(0.00)
            if (show === 2 && selectedToken?.price) {
              setValue('limit_usdt', selectedToken?.price.toFixed(6))
            }
            else if (show === 2) {
              setValue('limit_usdt', 1)
            }
          }}>
            Sell
          </button>
        </div>
        <form onSubmit={handleSubmit(onHandleSubmit)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
            }
          }}

        >
          <div className="py-20">
            <div className="flex lg:gap-30 gap-10">
              <div className={`flex  gap-5 justify-center items-center  w-full cursor-pointer border rounded-5 border-grey-v-1 dark:border-opacity-[15%] bg-[transparent] ${show === 1 && 'bg-primary-100 dark:bg-black-v-1 border-primary'}`} onClick={() => {
                setShow(1); reset({
                  limit_usdt: 0.00,
                  token_amount: 0.00,
                })
                setTotalAmount(0.0); setEstimateFee(0.00)
              }}>
                <input id={`custom-radio${props.id}`} type="radio" value="limit" name="market_type" className="hidden w-5 h-5 max-w-full  bg-red-400 border-[transparent] focus:ring-primary dark:focus:ring-primary dark:ring-offset-primary  dark:bg-[transparent] dark:border-[transparent]" />
                <label htmlFor={`custom-radio${props.id}`}
                  className="custom-radio cursor-pointer py-5 px-[17px]  relative 
              flex gap-2 items-center pl-[60px] 
                after:dark:bg-omega
                after:bg-white
                after:lg:left-[29px]
                after:left-[16px]
                after:w-[20px] 
                after:h-[20px]
                after:rounded-[50%] 
                after:border after:border-beta
                after:absolute

                before:dark:bg-[transparent]
                before:bg-white
                before:lg:left-[34px]
                before:left-[21px]
                before:w-[10px] 
                before:h-[10px]
                before:rounded-[50%] 
                before:absolute
                before:z-[1]
                   
                   ">
                  <IconsComponent type="flag" hover={true} active={show === 1 ? true : false} />
                  <p className={`info-16-18 !text-gamma ${show === 1 && '!text-primary'}`}>Limit</p>
                </label>
              </div>
              <div className={`flex gap-5  justify-center items-center   w-full cursor-pointer border rounded-5 border-grey-v-1 dark:border-opacity-[15%] bg-[transparent] ${show === 2 && 'bg-primary-100 dark:bg-black-v-1 border-primary'}`} onClick={() => {
                setShow(2);
                reset({
                  limit_usdt: 0.00,
                  token_amount: 0.00,
                })
                setTotalAmount(0.0); setEstimateFee(0.00)
                setValue('limit_usdt', 1)
              }}>
                <input id={`custom-radio2${props.id}`} type="radio" value="market" name="market_type" className="hidden w-5 h-5 max-w-full   bg-red-400 border-[transparent] focus:ring-primary dark:focus:ring-primary dark:ring-offset-primary  dark:bg-[transparent] dark:border-[transparent]" />
                <label htmlFor={`custom-radio2${props.id}`} className="
                    custom-radio relative py-5 px-[17px]  flex gap-2 items-center pl-[60px]
                    cursor-pointer
                    after:dark:bg-omega
                    after:bg-white
                    after:lg:left-[29px]
                    after:left-[16px]
                    after:w-[20px] 
                    after:h-[20px]
                    after:rounded-[50%] 
                    after:border after:border-beta
                    after:absolute

                    before:dark:bg-[transparent]
                    before:bg-white
                    before:lg:left-[34px]
                    before:left-[21px]
                    before:w-[10px] 
                    before:h-[10px]
                    before:rounded-[50%] 
                    before:absolute
                    before:z-[1]
                    
                    ">
                  <IconsComponent type="light" hover={true} active={show === 2 ? true : false} />
                  <p className={`info-16-18 !text-gamma ${show === 2 && '!text-primary'}`}>Market</p>
                </label>
              </div>
            </div>


            {(show === 1 || show === 2) &&
              <>
                <div className="mt-5 flex gap-[5px] items-center">
                  <Image src='/assets/market/walletpayment.svg' alt="wallet2" width={24} height={24} className="min-w-[24px]" />
                  <p className="md-text w-full">
                    {currencyFormatter(Number(price.toFixed(6)))}
                    &nbsp;{active1 === 1 ? 'USDT' : firstCurrency}
                  </p>
                  <Image src={`${selectedToken !== undefined && selectedToken?.image ? selectedToken?.image : '/assets/history/Coin.svg'}`} className={`${selectedToken?.symbol === "XRP" && "bg-white rounded-full"} min-w-[24px]`} alt="wallet2" width={24} height={24} />
                  {router.pathname.includes("/chart") && <p className="md-text">
                    $
                    {props?.token !== undefined && props?.token?.price !== undefined
                      ? truncateNumber(props?.token?.price, 6)
                      : "0.00"}
                  </p>
                  }
                  {router.pathname.includes("/market") && props.coins && props.coins.map((item: any) => {
                    if (item.symbol === selectedToken?.symbol) {
                      return <p className="md-text">${selectedToken !== undefined && selectedToken?.price !== undefined ? currencyFormatter(truncateNumber(item?.price, 6)) : '0.00'}</p>
                    }
                  })}
                </div>

                {/* Price Inputs for limit order case */}
                {show === 1 &&
                  <div className="mt-30 rounded-5 p-[10px] flex border items-center justify-between gap-[15px] border-grey-v-1 dark:border-opacity-[15%] relative">

                    <div className="">
                      {/* <p className="sm-text dark:text-white">{active1 === 1 ? "Buy" : "Sell"} For ({secondCurrency})</p> */}
                      <p className="sm-text dark:text-white">Order Price</p>
                      <input type="number" onWheel={(e) => (e.target as HTMLElement).blur()} placeholder="$0" step="any" {...register('limit_usdt', {
                        onChange: (e) => {
                          const value = e.target.value;
                          const regex = /^\d{0,11}(\.\d{0,8})?$/;
                          if (regex.test(value) || value === "") {
                            convertTotalAmount();
                          }
                          else {
                            e.target.value = value.slice(0, -1);
                          }
                        }
                      })} name="limit_usdt" className="bg-[transparent] outline-none md-text px-[5px] mt-[10px] max-w-full w-full " />
                    </div>

                    <div className="relative">
                      <FilterSelectMenuWithCoin data={secondList} border={false} setCurrencyName={setCurrencyName} dropdown={2} value={secondCurrency} disabled={true} />
                    </div>
                  </div>
                }
                {errors.limit_usdt && <p className="errorMessage mt-10">{errors.limit_usdt.message}</p>}

                {/* coin quantity Inputs */}
                <div className="mt-40 rounded-5 p-[10px] flex border items-center justify-between gap-[15px] border-grey-v-1 dark:border-opacity-[15%] relative">
                  <div className="">
                    <p className="sm-text dark:text-white">Quantity</p>
                    <input type="number" onWheel={(e) => (e.target as HTMLElement).blur()} placeholder="0" min={0} step=".00001" {...register('token_amount', {
                      onChange: (e) => {
                        const value = e.target.value;
                        const regex = /^\d{0,10}(\.\d{0,8})?$/;
                        if (regex.test(value) || value === "") { convertTotalAmount() }
                        else {
                          e.target.value = value.slice(0, -1);
                        }
                      }
                    })} name="token_amount" className="bg-[transparent] max-w-full w-full outline-none md-text px-[5px] mt-[10px] md-text " />
                  </div>
                  <div>
                    {
                      router.pathname.includes('/chart') ?

                        <div className='flex  items-center gap-[5px] rounded-[5px] mr-[15px] pl-10 border-l border-[#D9D9D9] dark:border-[#ccced94d]'>
                          <Image src={`${props?.token?.image !== undefined ? props?.token?.image : '/assets/home/coinLogo.png'}`} alt="error" width={20} height={20} />
                          <p className={`sm-text rounded-[5px]  cursor-pointer !text-banner-text`}>{props?.token?.fullName}</p>
                        </div> :
                        <FilterSelectMenuWithCoin data={qtylist} border={false} setCurrencyName={setCurrencyName} dropdown={1} value={firstCurrency} />
                    }
                  </div>
                </div>
                {errors.token_amount && <p className="errorMessage mt-10">{errors?.token_amount?.message}</p>}
                <div className="mt-5 flex gap-2 justify-between">
                  <div className=" flex gap-1">
                    <p className="sm-text dark:text-white">Total:</p>
                    <p className="sm-text dark:text-white">{truncateNumber(totalAmount, 6) || '0.000000'}</p>

                  </div>
                  <div className="flex gap-1">
                    <p className="sm-text dark:text-white">Max Trade:</p>
                    <p className="sm-text dark:text-white">{selectedToken?.tradepair?.maxTrade || '0.00'}</p>
                  </div>
                </div>
                <div className="mt-5 flex gap-1">
                  <p className="sm-text dark:text-white">Est. Fee:</p>
                  <p className="sm-text dark:text-white">{estimateFee || '0.00'}</p>

                </div>
              </>
            }
          </div>

          {(show === 1 || show === 2) &&
            <>
              {props?.session ?
                <button type="submit" className={`solid-button w-full ${disabled === true ? 'opacity-70 cursor-not-allowed' : ''}`} disabled={disabled}>{active1 === 1 ? `Buy ${selectedToken?.symbol !== undefined ? selectedToken?.symbol : ""}` : `Sell ${selectedToken?.symbol !== undefined ? selectedToken?.symbol : ""}`}</button>
                :
                <Link prefetch={false} href="/login" className="solid-button w-full block text-center">Login</Link>
              }
            </>
          }


        </form>
      </div>
      {
        active &&
        <ConfirmBuy setActive={setActive} setShow={setShow} price={selectedToken?.price} active1={active1} secondCurrency={secondCurrency} selectedToken={selectedToken?.symbol} actionPerform={actionPerform} objData={objData} />
      }
    </>
  )
};

export default BuySellCard;
