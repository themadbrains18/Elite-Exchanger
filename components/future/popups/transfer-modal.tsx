import Context from "@/components/contexts/context";
import IconsComponent from "@/components/snippets/icons";
import React, { useContext, useEffect, useRef, useState } from "react";
import SelectDropdown from "../snippet/select-dropdown";
import { useSession } from "next-auth/react";
import { toast } from "react-toastify";
import clickOutSidePopupClose from "@/components/snippets/clickOutSidePopupClose";

import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { currencyFormatter } from "@/components/snippets/market/buySellCard";
import { useWebSocket } from "@/libs/WebSocketContext";

const schema = yup.object().shape({
  amount: yup.number().positive('Amount must be positive number.').required('This field is required.').typeError('This field is required.'),
  token_id: yup.string().required('This field is required.'),
});

interface TransferModalProps {
  popupMode?: number;
  setPopupMode?: any;
  setOverlay?: any;
  overlay?: boolean;
  assets?: any;
  refreshWalletAssets?: any;
  wallet_type?: string
  token?: any;
  type?: string;
  disableClick?: boolean;
}

const TransferModal = (props: TransferModalProps) => {

  const { status, data: session } = useSession();
  let { mode } = useContext(Context);
  const [coinList, setCoinList] = useState([]);
  const [Spot, setSpot] = useState("Spot");
  const [future, setFuture] = useState("Futures");
  const [userAsset, setUserAsset] = useState(Object);
  const [selectedCoin, setSelectedCoin] = useState("");
  // const [isError, setIsError] = useState(false);
  const [amount, setAmount] = useState(0);
  const [btnDisabled, setBtnDisabled] = useState(false);
  const [coinDefaultValue, setCoinDefaultValue] = useState(props?.token?.symbol)
  const wbsocket = useWebSocket();
  let {
    register,
    setValue,
    handleSubmit,
    watch,
    reset,
    setError,
    getValues,
    clearErrors,
    formState,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema)
  });

  /**
 * Toggles between "Spot" and "Futures" modes and updates states accordingly.
 * 
 * This function changes the values of `Spot` and `Futures` states to toggle
 * between two trading modes. It also triggers a filter action on assets based 
 * on the selected coin and mode.
 */
  function setValues() {
    if (Spot == "Spot") {
      setFuture("Spot");
      setSpot("Futures");
    }
    else {
      setFuture("Futures");
      setSpot("Spot");
    }


    if (selectedCoin) {
      filterAsset(selectedCoin, Spot === "Spot" ? "Futures" : "Spot");
    }
  }

  /**
 * Effect hook to handle asset filtering, coin list population, and error clearing.
 * 
 * This hook performs the following actions:
 * 1. Filters assets based on the wallet type and populates the `coins` array 
 *    with the appropriate symbols, then sets `coinList`.
 * 2. Sets the `Spot` and `Futures` labels based on `wallet_type` value.
 * 3. Calls `filterAsset` if a token is specified, using the symbol and wallet type.
 * 4. For `future` type, generates a unique list of coin symbols.
 * 5. Clears errors related to `amount` and `token_id` after a delay.
 * 
 * Dependencies:
 * - `props.assets`: Triggered when asset list changes.
 * - `errors`: To track and clear specific error messages.
 * - `props.wallet_type`, `props.token`, `props.type`: To manage state and filters based on the provided types.
 * - `userAsset`: Updates when the user asset changes.
 */
  useEffect(() => {
    let coins: any = [];
    props?.assets?.filter((item: any) => {
      if (item?.walletTtype === props.wallet_type) {
        coins.push(
          item?.token !== null ? item?.token?.symbol : item?.global_token?.symbol
        );
      }
    });
    setCoinList(coins);

    if (props?.wallet_type === "future_wallet") {
      setFuture("Spot");
      setSpot("Futures");
    }

    if (props?.token) {
      let type = props?.wallet_type === "future_wallet" ? "Futures" : "Spot"
      filterAsset(props?.token?.symbol, type)
    }

    if (props?.type === "future") {
      const coinsSet = new Set();

      props?.assets?.forEach((item: any) => {
        const symbol = item?.token !== null ? item?.token?.symbol : item?.global_token?.symbol;
        if (symbol) {
          coinsSet.add(symbol);
        }
      });

      const uniqueCoins: any = Array.from(coinsSet);
      setCoinList(uniqueCoins);
    }

    setTimeout(() => {
      if (errors.amount) {
        clearErrors('amount')
      }
      if (errors.token_id) {
        clearErrors('token_id')
      }
    }, 3000);
  }, [props?.assets, errors, props?.wallet_type, props?.token, props?.type, userAsset]);


  /**
   * Filters assets based on the provided symbol and type ("Spot" or "Futures").
   * 
   * This function does the following:
   * 1. Filters assets based on `type`. For "Spot", it looks for assets in the "main_wallet" 
   *    and matches the symbol with the provided one. For "Futures", it looks for assets in 
   *    the "future_wallet" and performs the same matching.
   * 2. Updates the `coinList` with the corresponding symbols of assets found in the selected wallet type.
   * 3. Sets the `userAsset` to the first matching asset, and updates the `token_id` value using `setValue`.
   * 4. Clears any existing errors related to the `token_id`.
   * 5. Sets the selected coin symbol.
   * 
   * Dependencies:
   * - `props.assets`: A list of assets to filter.
   * - `props.wallet_type`: Used to determine whether to filter for "main_wallet" or "future_wallet".
   * - `symbol`: The symbol to match when filtering assets.
   */
  const filterAsset = (symbol: string, type: string) => {
    let coins: any = [];
    if (type == "Spot") {
      let asset = props?.assets?.filter((item: any) => {
        let token = item?.token !== null ? item?.token : item?.global_token;
        if (symbol) {
          return item?.walletTtype === "main_wallet" && token?.symbol === symbol;
        }
        else {
          return item?.walletTtype === "main_wallet"
        }
      });
      props?.assets?.filter((item: any) => {
        if (item?.walletTtype === "main_wallet") {
          coins.push(
            item?.token !== null
              ? item?.token?.symbol
              : item?.global_token?.symbol
          );
        }
      });
      setCoinList(coins)
      setUserAsset(asset[0]);
      setValue('token_id', asset[0]?.token_id);
      clearErrors('token_id')
    } else {
      let asset = props?.assets?.filter((item: any) => {
        let token = item?.token !== null ? item?.token : item?.global_token;
        return (
          item?.walletTtype === "future_wallet" && token?.symbol === symbol
        );
      });
      props?.assets?.filter((item: any) => {
        if (item?.walletTtype === "future_wallet") {
          coins.push(
            item?.token !== null
              ? item?.token?.symbol
              : item?.global_token?.symbol
          );
        }
      });
      setCoinList(coins);  // Update the coin list with the filtered symbols.
      setUserAsset(asset[0]);  // Set the user asset to the first matched item.
      setValue('token_id', asset[0]?.token_id);  // Update the `token_id` value.
      clearErrors('token_id');  // Clear any existing errors for `token_id`.
    }

    setSelectedCoin(symbol);
  };

  /**
 * Handles the form submission for transferring assets between wallets.
 * 
 * This function performs the following actions:
 * 1. Validates the transfer amount to ensure it does not exceed the user's available balance.
 * 2. Prepares a request payload with the transfer details, including the user's ID, the wallet types, the selected token ID, and the transfer amount.
 * 3. Sends a POST request to the transfer API to execute the transfer.
 * 4. If the transfer is successful, it:
 *    - Displays a success toast message.
 *    - Resets the form values and selected coin.
 *    - Optionally triggers a WebSocket message to notify of the transfer.
 *    - Refreshes wallet assets and closes the modal after a short delay.
 * 5. If the transfer fails, it displays an error toast message.
 * 6. Handles any errors during the process and logs them.
 * 
 * Dependencies:
 * - `session.user.user_id`: User ID for the transfer.
 * - `Spot` and `future`: States to determine the source and destination wallet types.
 * - `userAsset.balance`: The user's balance used for validation.
 * - `wbsocket`: WebSocket connection used for notifications.
 * - `props.refreshWalletAssets`: A function to refresh wallet assets after a successful transfer.
 * - `props.setOverlay` and `props.setPopupMode`: Used to close the modal after a successful transfer.
 * - `toast`: To display success or error messages.
 */
  const onHandleSubmit = async (data: any) => {
    try {
      // Validate that the amount does not exceed the user's available balance.
      if (data?.amount > userAsset?.balance.toFixed(6)) {
        setError("amount", {
          type: "custom",
          message: `Insufficient balance.`,
        });
        return;
      }

      // Adjust the amount if it equals the available balance.
      if (data?.amount == userAsset?.balance.toFixed(6)) {
        data.amount = userAsset?.balance
      }

      // Create the request payload for the transfer.
      let obj = {
        user_id: session?.user?.user_id,
        from: Spot === "Spot" ? "main_wallet" : "future_wallet",
        to: future === "Futures" ? "future_wallet" : "main_wallet",
        token_id: data?.token_id,
        balance: data?.amount,
      };

      setBtnDisabled(true); // Disable the button while the request is in progress.

      // Send the transfer request.
      let assetReponse = await fetch(
        `${process.env.NEXT_PUBLIC_BASEURL}/transfer`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: session?.user?.access_token,
          },
          body: JSON.stringify(obj),
        }
      ).then((response) => response.json());

      // Handle the response after the transfer request.
      if (assetReponse?.data?.status === 200) {
        toast.success(assetReponse?.data.data.message, { autoClose: 2000 });
        // Reset the form and selected coin after successful transfer.
        setValue('token_id', '');
        setCoinDefaultValue('');
        setSelectedCoin('');
        setUserAsset(null);
        if (wbsocket) {
          let withdraw = {
            ws_type: 'transfer',
          }
          wbsocket.send(JSON.stringify(withdraw));
        }
        setTimeout(() => {
          props?.refreshWalletAssets && props?.refreshWalletAssets();
          props.setOverlay(false);
          props.setPopupMode(0);
          setBtnDisabled(false);
        }, 3000);

      } else {
        // Handle errors in the response.
        toast.error(assetReponse?.data?.data?.message !== undefined ? assetReponse?.data?.data?.message : assetReponse?.data?.data, { autoClose: 2000 });
        setTimeout(() => {
          setBtnDisabled(false);
        }, 3000);
      }
    } catch (error) {
      console.log("error in transfer modal", error);
    }
  };

  const closePopup = () => {
    props.setOverlay(false);
    props.setPopupMode(0);
  }
  const wrapperRef = useRef(null);
  clickOutSidePopupClose({ wrapperRef, closePopup });

  // Prevent Enter key from submitting the form
  const preventEnterSubmit = (e: any) => {
    if (e.key === 'Enter') {
      e.preventDefault();
    }
  };


  return (
    <div ref={wrapperRef}
      className={`max-w-[calc(100%-30px)] duration-300 md:max-w-[550px] w-full p-5 md:p-[32px] z-10 fixed rounded-10 bg-white dark:bg-[#292d38] ${props.popupMode === 3
        ? "top-[50%] opacity-1 visible"
        : "top-[52%] opacity-0 invisible"
        } left-[50%] translate-x-[-50%] translate-y-[-50%]`}
    >
      <div className="flex items-center justify-between mb-[20px]">
        <p className="sec-title !text-[20px]">Transfer</p>
        <svg
          onClick={() => {
            props.setOverlay(false);
            props.setPopupMode(0);
          }}
          enableBackground="new 0 0 60.963 60.842"
          version="1.1"
          id="Layer_1"
          xmlns="http://www.w3.org/2000/svg"
          xmlnsXlink="http://www.w3.org/1999/xlink"
          x="0px"
          y="0px"
          viewBox="0 0 60.963 60.842"
          xmlSpace="preserve"
          className="max-w-[18px] cursor-pointer w-full"
        >
          <path
            fill={mode === "dark" ? "#fff" : "#9295A6"}
            d="M59.595,52.861L37.094,30.359L59.473,7.98c1.825-1.826,1.825-4.786,0-6.611
                        c-1.826-1.825-4.785-1.825-6.611,0L30.483,23.748L8.105,1.369c-1.826-1.825-4.785-1.825-6.611,0c-1.826,1.826-1.826,4.786,0,6.611
                        l22.378,22.379L1.369,52.861c-1.826,1.826-1.826,4.785,0,6.611c0.913,0.913,2.109,1.369,3.306,1.369s2.393-0.456,3.306-1.369
                        l22.502-22.502l22.501,22.502c0.913,0.913,2.109,1.369,3.306,1.369s2.393-0.456,3.306-1.369
                        C61.42,57.647,61.42,54.687,59.595,52.861z"
          />
        </svg>
      </div>
      <div className="flex border-b dark:border-[#373d4e] border-[#e5e7eb] w-full">
        <div className="w-full max-w-[calc(100%-100px)]">
          <div className="flex items-center gap-[20px] border dark:border-[#373d4e] border-[#e5e7eb] w-full py-[12px]">
            <p className="top-label min-w-[80px] text-center">From</p>
            <p className="top-label dark:!text-white !text-black">{Spot}</p>
          </div>
          <div className="flex items-center gap-[20px] border dark:border-[#373d4e] border-[#e5e7eb] w-full py-[12px]">
            <p className="top-label min-w-[80px] text-center">To</p>
            <p className="top-label dark:!text-white !text-black">{future}</p>
          </div>
        </div>
        <div
          onClick={() => {
            !props?.disableClick && setValues();
          }}
          className="dark:bg-[#373d4e] bg-[#e5ecf0] w-full flex h-[96px]  max-w-[100px] border dark:border-[#373d4e] border-[#e5e7eb] cursor-pointer "
        >
          <div className="rotate-[90deg]">
            <IconsComponent type="transferIcon" />
          </div>
        </div>
      </div>
      <form onSubmit={handleSubmit(onHandleSubmit)} onKeyDown={preventEnterSubmit}>
        <div className="flex items-center justify-between px-[12px] py-[12px] dark:bg-[#373d4e] bg-[#e5ecf0] rounded-[4px] cursor-pointer mt-[25px] relative">
          {

            props?.wallet_type !== undefined ?
              <input defaultValue={coinDefaultValue} readOnly className='top-label py-[5px] px-[10px] w-full cursor-not-allowed bg-[transparent]  focus:outline-none' />
              :
              <SelectDropdown
                list={coinList}
                defaultValue={coinDefaultValue}
                setCoinDefaultValue={setCoinDefaultValue}
                fullWidth={true}
                whiteColor={true}
                filterAsset={filterAsset}
                Spot={Spot}
                {...register('token_id')}
              />

          }
        </div>
        {errors?.token_id && (
          <p className="errorMessage">{errors?.token_id?.message}</p>
        )}
        <div className="flex items-center bg-[#e5ecf0] dark:bg-[#373d4e] p-[11px] mt-[25px] rounded-[5px] dark:text-white text-black justify-between">
          <input
            type="number"
            step={0.000001}
            {...register('amount')}
            name="amount"
            className="outline-none  bg-[#e5ecf0] dark:bg-[#373d4e]"
            placeholder="0"
            onChange={(e: any) => {
              const value = e.target.value;
              const regex = /^\d{0,11}(\.\d{0,6})?$/;
              if (regex.test(value) || value === "") {

                if (/^\d*\.?\d{0,6}$/.test(value)) {
                  setAmount(value);
                }
              } else {
                e.target.value = value.slice(0, -1);
              }
            }}
          />
          <p className="top-label dark:!text-primary cursor-pointer" onClick={() => setValue('amount', userAsset !== undefined && userAsset !== null ? userAsset?.balance?.toFixed(6) : 0)}>All</p>
        </div>
        {errors?.amount && (
          <p className="errorMessage">{errors?.amount?.message}</p>
        )}

        <p className="top-label !text-[16px] mt-[15px]">
          Available:{" "}
          {userAsset !== undefined && userAsset !== null && Object.keys(userAsset).length > 0 ? currencyFormatter(userAsset?.balance?.toFixed(6)) : `0.00`}{""}
          {selectedCoin}
        </p>
        <button
          disabled={status === "unauthenticated" ? true : false || btnDisabled}
          className={`mt-[15px] solid-button w-full  ${status === "unauthenticated" || btnDisabled === true
            ? "cursor-not-allowed opacity-50"
            : ""
            }`}
        >{btnDisabled &&
          <svg aria-hidden="true" role="status" className="inline w-4 h-4 me-3 text-white animate-spin" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="#E5E7EB" />
            <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentColor" />
          </svg>
          }
          Transfer
        </button>
      </form>
    </div>
  );
};

export default TransferModal;
