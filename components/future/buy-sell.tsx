import React, { useEffect, useState } from "react";
import IconsComponent from "../snippets/icons";
import RangeSlider from "./range-slider";
import { useSession } from "next-auth/react";
import AES from "crypto-js/aes";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ProfitLossModal from "./popups/profit-loss-model";
import Link from "next/link";
import TradeConfirmPopupModal from "./popups/trade-confirm-modal";
import OrderPreferenceModal from "../snippets/orderPreferenceModal";
import PositionModal from "../snippets/positionModal";
import ConfirmationModel from "../snippets/confirmation";
import { useWebSocket } from "@/libs/WebSocketContext";
import { truncateNumber } from "@/libs/subdomain";
import { currencyFormatter } from "../snippets/market/buySellCard";
import { useRouter } from "next/router";

/**
 * Interface for the props used in the BuySell component.
 * 
 * @interface BuySellProps
 * 
 * @property {boolean} [fullWidth] - Optional property to make the component take full width.
 * @property {boolean} [heightAuto] - Optional property to adjust height automatically.
 * @property {string} [inputId] - Optional ID for the input field.
 * @property {string} [thumbId] - Optional ID for the thumbnail element.
 * @property {string} [lineId] - Optional ID for the line element.
 * @property {string} [radioId] - Optional ID for the radio button.
 * @property {number} [popupMode] - Optional mode to control the popup behavior.
 * @property {Function} [setPopupMode] - Optional function to set the popup mode.
 * @property {Function} [setOverlay] - Optional function to set overlay visibility.
 * @property {boolean} [overlay] - Optional flag to show or hide the overlay.
 * @property {any} [assets] - Optional property holding asset data.
 * @property {any} [currentToken] - Optional property holding current token information.
 * @property {any} [marginMode] - Optional property holding margin mode data.
 * @property {Function} [refreshWalletAssets] - Optional function to refresh wallet assets.
 * @property {any} [positions] - Optional property holding positions data.
 * @property {any} [openOrders] - Optional property holding open orders data.
 * @property {any} [rewardsList] - Optional property holding a list of rewards.
 * @property {any} [totalPoint] - Optional property holding total points data.
 * @property {any} [minTrade] - Optional property for minimum trade value.
 * @property {any} [maxTrade] - Optional property for maximum trade value.
 * @property {any} [leverage] - Optional property for leverage information.
 * @property {Function} [setOpnlong] - Optional function to handle opening long positions.
 */
interface BuySellProps {
  fullWidth?: boolean;
  heightAuto?: boolean;
  inputId?: string;
  thumbId?: string;
  lineId?: string;
  radioId?: string;
  popupMode?: number;
  setPopupMode?: any;
  setOverlay?: any;
  overlay?: boolean;
  assets?: any;
  currentToken?: any;
  marginMode?: any;
  refreshWalletAssets?: any;
  positions?: any;
  openOrders?: any;
  rewardsList?: any;
  totalPoint?: any;
  minTrade?: any;
  maxTrade?: any;
  leverage?: any;
  setOpnlong?: Function;
}

const BuySell = (props: BuySellProps) => {
  // main tabs
  const [show, setShow] = useState(1);
  const { status, data: session } = useSession();
  const list = ["USDT", props?.currentToken?.coin_symbol];
  const [modelPopup, setModelPopup] = useState(0);
  const [modelOverlay, setModelOverlay] = useState(false);
  // nested tabs
  const [showNes, setShowNes] = useState(1);
  const [symbol, setSymbol] = useState("USDT");
  const [avaibalance, setAvailBalance] = useState(0);
  const [sizeValue, setSizeValue] = useState<any>();
  const [marketType, setMarketType] = useState("limit");
  const [entryPrice, setEntryPrice] = useState<any>();
  const [istpslchecked, setIsTpSlchecked] = useState(false);
  const [buttonStyle, setButtonStyle] = useState(false);
  const [stopPrice, setStopPrice] = useState("0");
  const [sizeValidate, setSizeValidate] = useState("");
  const [entryPriceValidate, setEntryPriceValidate] = useState("");
  const [stopPriceValidate, setStopPriceValidate] = useState("");
  const [confirmModelPopup, setConfirmModelPopup] = useState(0);
  const [confirmModelOverlay, setConfirmModelOverlay] = useState(false);
  const [confirmOrderData, setConfirmOrderData] = useState(Object);
  const [orderType, setOrderType] = useState("qty");
  const [isShow, setIsShow] = useState(false);
  const [prefernce, setPreference] = useState(false);
  const [prefernceSymbol, setPreferenceSymbol] = useState('Qty')
  const [positionMode, setPositionMode] = useState('oneWay');
  const [assetsBalance, setAssetsBalance] = useState(0);
  const [assetsList, setAssetsList] = useState();
  const [percentage, setPercentage] = useState(0)


  const [leverage, setLerverage] = useState(0)

  const [shortConfirm, setShortConfirm] = useState(false);
  const [active, setActive] = useState(false);
  const [finalOrderSubmit, setFinalOrderSubmit] = useState(false);
  const [profitLossConfirm, setProfitLossConfirm] = useState(false)

  const [usedQty, setUsedQty] = useState(0);
  const wbsocket = useWebSocket();

  let openOrderObj = {
    position_id: "--",
    user_id: session?.user?.user_id,
    symbol: props?.currentToken?.coin_symbol + props?.currentToken?.usdt_symbol,
    side: "",
    type: "stop market", //e.g limit, take profit market, stop market
    amount: "close position", // limit order amount, close position
    price_usdt: 0.0, // limit order price
    trigger: "", // TP/SL posiotion amount , limit order --
    reduce_only: "Yes", // TP/SL case Yes, limit order No
    post_only: "No", //No
    status: false,
    leverage: 0,
    margin: 0.0,
    liq_price: 0.0,
    market_price: 0.0,
    order_type: "value",
    leverage_type: "--",
    coin_id: "",
  };

  const [tpsl, setTpSl] = useState({
    profit: openOrderObj,
    stopls: openOrderObj,
  });
  const router = useRouter()
  // ------------------------------
  // Initial market price
  // ------------------------------
  let marketPrice = props?.currentToken?.token !== null
    ? props?.currentToken?.token?.price
    : props?.currentToken?.global_token?.price;

  /**
* Converts a scientific notation number to a decimal format.
* 
* This function takes a value, converts it to a float, and then converts it
* to a decimal format by trimming unnecessary trailing zeros after the decimal point.
*
* @param {any} value - The value to be converted. It can be a string or number in scientific notation.
* @returns {any} The value converted to decimal format, or undefined if the input is invalid or falsy.
*/
  const scientificToDecimal = (value: any): any => {
    if (value) {
      let val = parseFloat(value).toFixed(10) // Convert to decimal format, trimming unnecessary zeros
      val = val.replace(/\.?0+$/, "");
      return val
    }
  };

  /**
 * Truncates a number to a specified number of decimal places.
 * 
 * This function truncates a given number to a specific number of decimal places
 * without rounding, using regular expressions to limit the number of decimal digits.
 *
 * @param {any} num - The number to be truncated. It can be a number or string.
 * @param {number} decimals - The number of decimal places to keep after truncating.
 * @returns {number} The truncated number with the specified decimal places.
 */
  const truncateToSixNumber = (num: any, decimals: number) => {
    const regex = new RegExp(`^-?\\d+(?:\\.\\d{0,${decimals}})?`);
    const match = num?.toString().match(regex);
    return match ? parseFloat(match[0]) : num;
  };

  /**
   * Effect that runs when the `marketPrice` changes.
   * 
   * This hook does the following:
   * - Retrieves the 'preference' value from `localStorage`, defaulting to "Qty" if not found,
   *   and sets it to the `preferenceSymbol` state.
   * - If `showNes` is 2 and `percentage` is greater than 0, it calls `onChangeSizeInPercentage` 
   *   with the `percentage` value.
   *
   * @param {number} marketPrice - The market price that triggers the effect when it changes.
   */
  useEffect(() => {
    let value = localStorage.getItem('preference') || "Qty"
    setPreferenceSymbol(value)
    if (showNes === 2 && percentage > 0) {
      onChangeSizeInPercentage(percentage)
    }
  }, [marketPrice])

  /**
 * Effect that updates various states based on changes in `props` and `tpsl`.
 * 
 * This hook performs the following actions:
 * - Filters the assets to get the ones related to the "future_wallet" and with the token symbol 'USDT'.
 * - Updates the `assetsList`, `assetsBalance`, and `availBalance` based on the filtered asset data.
 * - If the symbol is 'USDT', it adds the `totalPoint` to the `rewardsAmount` and updates the balances.
 * - Sets `profitLossConfirm` to true if both `tpsl.profit.leverage` and `tpsl.stopls.leverage` are non-zero.
 * - Calculates the total `usedQty` by summing the quantities from the `positions` and `openOrders` and updates `positionMode` accordingly.
 * 
 * @param {string} props.currentToken.coin_symbol - The current token symbol used to trigger the effect.
 * @param {Array} props.assets - The list of assets to filter and calculate balances from.
 * @param {Object} tpsl - Contains profit and stop-loss leverage values.
 * @param {string} prefernceSymbol - The user's symbol preference.
 * @param {Array} props.positions - The list of positions that might influence `usedQty` and `positionMode`.
 * @param {Array} props.openOrders - The list of open orders that might also influence `usedQty` and `positionMode`.
 */
  useEffect(() => {
    let futureAssets = props?.assets?.filter((item: any) => {
      return item.walletTtype === "future_wallet";
    });

    let asset = futureAssets?.filter((item: any) => {
      let tokenSymbol =
        item?.token !== null ? item?.token?.symbol : item?.global_token?.symbol;
      return tokenSymbol === 'USDT'
    });
    setAssetsList(asset)

    // ---------------------------------------
    // Rewards points add to derivative
    // ---------------------------------------
    let rewardsAmount = 0;
    if (symbol === "USDT") {
      rewardsAmount = props?.totalPoint || 0;
    }

    if (asset?.length > 0) {
      let bal = Number(truncateNumber(Number(asset[0].balance) + rewardsAmount, 6))
      let assetbal = truncateNumber(Number(asset[0].balance), 6)
      setAssetsBalance(assetbal);
      setAvailBalance(bal);
    } else {
      setAvailBalance(rewardsAmount);
      setAssetsBalance(0);
    }
    if (tpsl.profit.leverage != 0 && tpsl.stopls.leverage !== 0) {
      setProfitLossConfirm(true)
    }

    let usedQty = 0;
    if (props.positions && props.positions.length > 0) {
      props.positions.map((item: any) => {
        usedQty += item.qty
      })
      setPositionMode(props.positions[0]?.position_mode);
    }
    if (props.openOrders && props.openOrders.length > 0) {
      props.openOrders.map((item: any) => {
        usedQty += item.qty
      })
      setPositionMode(props.openOrders[0]?.position_mode);
    }

    setUsedQty(usedQty)
  }, [props?.currentToken?.coin_symbol, props.assets, tpsl, prefernceSymbol, props.positions, props?.refreshWalletAssets]);


  /**
 * Handles the change in selected coin from the dropdown and updates related states.
 * 
 * This function performs the following actions:
 * - Sets the order type based on the selected token: 
 *   - If the selected token is not "USDT", it sets the order type to "qty".
 *   - If the selected token is "USDT", it sets the order type to "value".
 * - Filters the assets to get the ones related to the "future_wallet" and with the selected token.
 * - Adds `totalPoint` as `rewardsAmount` when the token is "USDT" and updates the `assetsBalance` and `availBalance`.
 * - Updates the `symbol` state with the selected token symbol.
 * 
 * @param {string} token - The selected token symbol (e.g., "USDT", "BTC", etc.) from the dropdown.
 */
  const onCoinDropDownChange = (token: any) => {
    if (token !== "USDT") {
      setOrderType("qty");
    } else {
      setOrderType("value");
    }
    let futureAssets = props?.assets?.filter((item: any) => {
      return item.walletTtype === "future_wallet";
    });
    let asset = futureAssets?.filter((item: any) => {
      let tokenSymbol =
        item?.token !== null ? item?.token?.symbol : item?.global_token?.symbol;
      return tokenSymbol === token;
    });

    // ---------------------------------------
    // Rewards points add to derivative
    // ---------------------------------------
    let rewardsAmount = 0;
    if (token === "USDT") {
      rewardsAmount = props?.totalPoint;
    }

    if (asset?.length > 0) {
      let bal = Number(asset[0].balance) + rewardsAmount;
      setAssetsBalance(Number(asset[0].balance));
      setAvailBalance(bal);

    } else {
      setAvailBalance(rewardsAmount);
      setAssetsBalance(0);
    }
    setSymbol(token);
  };

  /**
 * Handles the change in size based on the given percentage value and updates related states.
 * 
 * This function calculates the final size value based on the provided percentage (`value`) 
 * and updates the `sizeValue` and validation messages accordingly. It considers various 
 * conditions such as the `prefernceSymbol`, the `marketType`, and leverages the `maxTrade`, 
 * `minTrade`, `entryPrice`, and `marketPrice` values. It also checks if the calculated margin 
 * is greater than the available balance and updates the UI accordingly.
 * 
 * @param {number} value - The percentage value (e.g., 10 for 10%).
 * @returns {number} The final calculated size value based on the given percentage.
 */
  const onChangeSizeInPercentage = (value: number) => {
    setButtonStyle(true)
    setPercentage(Math.trunc(value));
    let finalValue = 0;
    if (showNes === 1) {
      if (prefernceSymbol === "Qty") {
        finalValue = (props.maxTrade) * (value / 100);
        setSizeValue(truncateNumber(finalValue, 6));
      } else {

        finalValue = (entryPrice * props.maxTrade) * (value / 100);
        setSizeValue(truncateNumber(finalValue, 6));
      }
    }
    else {
      if (prefernceSymbol === "Qty") {
        finalValue = (props.maxTrade) * (value / 100);
        setSizeValue(truncateNumber(finalValue, 6));
      } else {
        finalValue = (Number(truncateNumber(marketPrice, 6)) * props.maxTrade) * (value / 100);
        setSizeValue(truncateNumber(finalValue, 6));
      }
    }

    let propsLeverage = props?.marginMode?.leverage || props?.leverage
    let marginValue = prefernceSymbol === "Qty" ? (marketType === 'limit' ? ((entryPrice * finalValue) / propsLeverage) : ((marketPrice / finalValue)) / propsLeverage) : (finalValue / propsLeverage);

    if (finalValue !== 0 && finalValue < props?.minTrade) {
      setSizeValidate(`Minimum value: ${props?.minTrade}`)
      return;
    }
    else {
      if (marginValue > avaibalance) {
        setButtonStyle(true);
      }
      else {
        setSizeValidate('')
        setButtonStyle(false);

      }
    }
    return finalValue;
  };

  /**
 * Handles form submission for placing an order based on the selected order type (market or limit).
 * 
 * This function validates the input fields (entry price, size value) and calculates various 
 * parameters like liquidation price, margin, and quantity before submitting the order. It 
 * generates an order object with the necessary details and sets the `confirmOrderData` 
 * for the confirmation popup.
 * 
 * The function performs checks based on whether the order type is a market or limit order, 
 * handling both cases differently for quantity and liquidation price calculations. It also 
 * ensures that the order does not fall below the minimum trade amount and adjusts the 
 * margin based on the leverage value.
 * 
 * @param {string} orderMarkeType - The type of order, either 'market' or 'limit'.
 * 
 * @returns {void} 
 */
  const submitForm = async (orderMarkeType: string) => {
    let obj;

    if (orderMarkeType === "market") {
      if (showNes === 1 && (entryPrice == undefined || entryPrice == null || entryPrice === 0 || entryPrice < 0 || entryPrice === "")) {
        setEntryPriceValidate("Price must be greater than '0'");
        return
      }

      if (sizeValue === 0 || sizeValue < 0 || sizeValue === "") {
        setSizeValidate("Amount must be greater than '0'");
        return;
      }
      let Liquidation_Price: any = ((marketType === 'limit' ? entryPrice : marketPrice) * (1 - 0.01)) / props?.marginMode?.leverage;
      if (show === 1) {
        Liquidation_Price = (marketType === 'limit' ? entryPrice : marketPrice) - Liquidation_Price;
      }

      if (show === 2) {
        Liquidation_Price = (marketType === 'limit' ? entryPrice : marketPrice) + Liquidation_Price;
      }

      let qty: any = scientificToDecimal(truncateToSixNumber((sizeValue / marketPrice).toFixed(12), 4));
      qty = qty?.toString().match(/^-?\d+(?:\.\d{0,4})?/)[0];

      if (prefernceSymbol === "Qty") {
        qty = sizeValue.toString();
      }

      if (qty < props?.minTrade) {
        toast.error('Order cost falls below the min. amount.', { autoClose: 2000 })
        return;
      }
      let value: any = truncateNumber((qty * 0.055), 8);
      let releazedPnl: any = (marketPrice * value) / 100;
      let size: any = truncateNumber(qty * marketPrice, 8);
      let marginValue = prefernceSymbol === "Qty" ? (marketPrice * sizeValue) / props?.marginMode?.leverage : (sizeValue / props?.marginMode?.leverage);
      obj = {
        symbol:
          props?.currentToken?.coin_symbol + props?.currentToken?.usdt_symbol,
        user_id: session?.user?.user_id,
        coin_id: props?.currentToken?.coin_id,
        leverage: props?.marginMode?.leverage,
        size: size.toString().match(/^-?\d+(?:\.\d{0,8})?/)[0],
        entry_price: marketType === 'limit' ? entryPrice.toString() : marketPrice.toString().match(/^-?\d+(?:\.\d{0,8})?/)[0],
        market_price: marketType === 'limit' ? entryPrice.toString() : marketPrice.toString().match(/^-?\d+(?:\.\d{0,8})?/)[0],
        liq_price: Liquidation_Price.toString().match(/^-?\d+(?:\.\d{0,8})?/)[0],
        margin: truncateNumber(marginValue, 8),
        margin_ratio: 0.01,
        pnl: 0,
        realized_pnl: releazedPnl.toString().match(/^-?\d+(?:\.\d{0,8})?/)[0],
        tp_sl: "--",
        status: false,
        queue: false,
        direction: show === 1 ? "long" : "short",
        order_type: prefernceSymbol,
        leverage_type: props?.marginMode?.margin,
        market_type: orderMarkeType,
        qty: parseFloat(qty.toString().match(/^-?\d+(?:\.\d{0,8})?/)[0]),
        position_mode: positionMode
      };
    }
    else {
      if (entryPrice == undefined || entryPrice == null || entryPrice === 0 || entryPrice < 0 || entryPrice === "") {
        setEntryPriceValidate("Price must be greater than '0'");
        return;
      }

      if (isNaN(sizeValue) || sizeValue == undefined || sizeValue == null || sizeValue === 0 || sizeValue < 0 || sizeValue === "") {
        setSizeValidate("Amount must be greater than '0'");
        return;
      }

      let Liquidation_Price: any =
        (entryPrice * (1 - 0.01)) / props?.marginMode?.leverage;

      // Liquidation Price for long case
      if (show === 1) {
        Liquidation_Price = entryPrice - Liquidation_Price;
      }

      // Liquidation Price for short case
      if (show === 2) {
        Liquidation_Price = entryPrice + Liquidation_Price;
      }

      let qty: any = scientificToDecimal(truncateToSixNumber((sizeValue / entryPrice).toFixed(12), 4));
      qty = qty?.toString().match(/^-?\d+(?:\.\d{0,4})?/)[0];

      if (prefernceSymbol === "Qty") {
        qty = sizeValue.toString();

      }
      if (qty < props?.minTrade) {
        toast.error('Order cost falls below the min. threshold.', { autoClose: 2000 })
        return;
      }

      let enter_Price: any = entryPrice;
      let amount: any = qty * entryPrice;

      if (isNaN(amount)) {
        setButtonStyle(false)
        return;
      }

      let marginValue = prefernceSymbol === "Qty" ? ((entryPrice * sizeValue) / props?.marginMode?.leverage) : sizeValue / props?.marginMode?.leverage;
      obj = {
        position_id: "--",
        user_id: session?.user?.user_id,
        symbol:
          props?.currentToken?.coin_symbol + props?.currentToken?.usdt_symbol,
        side: show === 1 ? "open long" : "open short",
        type: orderMarkeType, //e.g limit, take profit market, stop market
        amount: amount?.toString()?.match(/^-?\d+(?:\.\d{0,8})?/)[0], // limit order amount, close position
        price_usdt: enter_Price.toString().match(/^-?\d+(?:\.\d{0,8})?/)[0], // limit order price
        trigger: "--", // TP/SL posiotion amount , limit order --
        reduce_only: "No", // TP/SL case Yes, limit order No
        post_only: "No", //No
        status: false,
        leverage: props?.marginMode?.leverage,
        margin: truncateNumber(marginValue, 8),
        liq_price: Liquidation_Price.toString().match(/^-?\d+(?:\.\d{0,8})?/)[0],
        market_price:
          props?.currentToken?.token !== null
            ? props?.currentToken?.token?.price
            : props?.currentToken?.global_token?.price,
        order_type: prefernceSymbol,
        leverage_type: props?.marginMode?.margin,
        coin_id: props?.currentToken?.coin_id,
        qty: parseFloat(qty.toString().match(/^-?\d+(?:\.\d{0,8})?/)[0]),
        position_mode: positionMode
      };
    }
    setConfirmOrderData(obj);
    setConfirmModelPopup(1);
    setConfirmModelOverlay(true);
  };

  /**
 * Confirms the order by performing the necessary validations and submitting the order to the server.
 * This function handles both the validation of the order quantity and available balance,
 * as well as encrypting and sending the order data to the server for execution.
 *
 * @async
 * @function confirmOrder
 */
  const confirmOrder = async () => {
    try {
      /**
     * Validates if the order quantity exceeds the maximum allowed trade quantity.
     * If exceeded, an error is shown and the submission is halted.
     */
      if (truncateNumber(usedQty + confirmOrderData?.qty, 3) > props?.maxTrade) {
        toast.error("Order failed. Order quantity is greater than maximum order quantity", { autoClose: 2000 })
        setButtonStyle(false);
        setConfirmModelOverlay(false);
        setConfirmModelPopup(0);
        setFinalOrderSubmit(false);
        return;
      }
      /**
     * Validates if the total order amount including realized PnL exceeds the available balance.
     * If exceeded, an error is shown and the submission is halted.
     */
      if ((confirmOrderData.amount + (confirmOrderData?.realized_pnl || 0)) > avaibalance) {
        toast.error("Order failed. Order quantity is greater than maximum order quantity", { autoClose: 2000 })
        setButtonStyle(false);
        setConfirmModelOverlay(false);
        setConfirmModelPopup(0);
        setFinalOrderSubmit(false);
        return;
      }

      else {
        setButtonStyle(true);
        setFinalOrderSubmit(true);
        /**
       * Encrypts the order data before sending it to the server for processing.
       * The encryption uses a secret passphrase from environment variables.
       */
        const ciphertext = AES.encrypt(
          JSON.stringify(confirmOrderData),
          `${process.env.NEXT_PUBLIC_SECRET_PASSPHRASE}`
        );
        let record = encodeURIComponent(ciphertext.toString());

        /**
      * Sends the order data to the appropriate server endpoint based on the market type.
      * The request is a POST request with the encrypted order data.
      */
        let reponse = await fetch(
          `${process.env.NEXT_PUBLIC_BASEURL}/future/${(marketType === "market" || (show === 2 && marketType === 'limit')) ? "position" : "openorder"
          }`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: session?.user?.access_token,
            },
            body: JSON.stringify(record),
          }
        ).then((response) => response.json());

        /**
       * Handles the response from the server after the order submission.
       * If the order submission fails, an error message is displayed.
       * If the order is successful, it checks if Take Profit / Stop Loss (TP/SL) is enabled and submits those orders.
       */
        if (reponse?.data?.status !== 200) {
          toast.error(
            reponse?.data?.data?.message !== undefined
              ? reponse?.data?.data?.message
              : reponse?.data?.data, {
            position: 'top-center'
          }
          );
          setButtonStyle(false);
          setFinalOrderSubmit(false);
          props?.refreshWalletAssets();

        }
        else {
          if (istpslchecked === true) {
            /**
           * If TP/SL is checked, send separate orders for Take Profit and Stop Loss.
           * The respective order IDs are assigned to the TP/SL orders.
           */
            if (tpsl.profit) {
              tpsl.profit.position_id = reponse?.data?.data?.result?.id;
            }
            const ciphertext = AES.encrypt(
              JSON.stringify(tpsl?.profit),
              `${process.env.NEXT_PUBLIC_SECRET_PASSPHRASE}`
            );
            let record = encodeURIComponent(ciphertext.toString());
            let profitreponse = await fetch(
              `${process.env.NEXT_PUBLIC_BASEURL}/future/openorder`,
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: session?.user?.access_token,
                },
                body: JSON.stringify(record),
              }
            ).then((response) => response.json());

            if (tpsl.stopls) {
              tpsl.stopls.position_id = reponse?.data?.data?.result?.id;
            }

            const ciphertext1 = AES.encrypt(
              JSON.stringify(tpsl?.stopls),
              `${process.env.NEXT_PUBLIC_SECRET_PASSPHRASE}`
            );
            let record1 = encodeURIComponent(ciphertext1.toString());
            let stopreponse = await fetch(
              `${process.env.NEXT_PUBLIC_BASEURL}/future/openorder`,
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: session?.user?.access_token,
                },
                body: JSON.stringify(record1),
              }
            ).then((response) => response.json());
          }

          if (wbsocket) {
            let position = {
              ws_type: "position",
            };
            wbsocket.send(JSON.stringify(position));
          }

          /**
         * Show success toast and reset the order form.
         * The success message is derived from the server response.
         */
          toast.success(reponse?.data?.data?.message, {
            position: 'top-center'
          });

          setButtonStyle(false);
          setEntryPrice('');
          setSizeValue('');
          props?.refreshWalletAssets();
          setConfirmModelOverlay(false);
          setConfirmModelPopup(0);
          setFinalOrderSubmit(false);

        }

      }
    } catch (error) {
      setFinalOrderSubmit(false);
    }
  };

  // ===================================================================//
  // =======Take Profit and Sop Loss popup hide and show===============//
  // ===================================================================//
  const profitlosspopupenable = (event: any) => {

    if (event.currentTarget.checked === true) {
      setModelPopup(1);
    } else {
      setProfitLossConfirm(false)
      setModelPopup(0);
    }
    setModelOverlay(event?.currentTarget?.checked);
    setIsTpSlchecked(event?.currentTarget?.checked);
  };

  /**
 * Handles the change in the size value input field and updates the related state and UI elements.
 * This function performs validation on the input value, calculates the margin value, 
 * updates the leverage slider, and determines whether the button should be enabled or disabled.
 *
 * @param {React.ChangeEvent<HTMLInputElement>} e - The event triggered by changing the input value.
 */
  const onChangeSizeValue = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPercentage(0)
    let value: any = e.target.value
    const regex = /^\d{0,10}(\.\d{0,4})?$/;

    setLerverage(0);
    let sliderThumb = document.getElementById("rangeThumb3") as HTMLDivElement;
    let rangeLine = document.getElementById("rangeLine3") as HTMLDivElement;
    let inputPercent = document.querySelector('.inputPercent') as HTMLInputElement;

    /**
   * If leverage is 0, reset the slider thumb position, input value, and range line width.
   */
    if (leverage == 0) {
      sliderThumb?.setAttribute("style", 'left:0;');
      sliderThumb.innerText = "0X";
      inputPercent?.value == "0";
      rangeLine.setAttribute("style", 'width:0;');
    }
    if (regex.test(value) || value === "") {
      value = parseFloat(e.target.value) == 0 ? 0.00 : parseFloat(e.target.value);
      let propsLeverage = props?.marginMode?.leverage || props?.leverage

      /**
     * Calculate the margin value based on the preference symbol, market type, and leverage.
     * It adjusts for the entry or market price based on the trade type.
     */
      let marginValue = prefernceSymbol === "Qty" ? (marketType === 'limit' ? ((entryPrice * parseFloat(e.target.value)) / propsLeverage) : ((marketPrice * parseFloat(e.target.value))) / propsLeverage) : (parseFloat(e.target.value) / propsLeverage);
      if (isNaN(value)) {
        setSizeValue(''); // Reset sizeValue to its current state
        return; // Exit early without updating state or applying further logic
      }

      /**
     * Validate the size value against the minimum trade value.
     * If the value is below the minimum trade value, show a validation message and stop further execution.
     */
      else if (value !== 0 && value < props?.minTrade) {
        setSizeValidate(`Minimum value: ${props?.minTrade}`)
        return;
      }
      else {
        setSizeValidate('')
        setSizeValue(value);
        setButtonStyle(true);
        let leverage = propsLeverage;
        /**
      * Calculate and validate the quantity based on whether the preference symbol is 'Value' or 'Qty'.
      * If the margin value is greater than the available balance, disable the button.
      */
        if (prefernceSymbol === "Value") {
          let qty = marketType === 'limit' ? truncateToSixNumber((parseFloat(e.target.value) / entryPrice).toFixed(12), 3) : truncateToSixNumber((parseFloat(e.target.value) / marketPrice).toFixed(12), 3)
          if (qty >= 0.001 && marginValue < avaibalance) {
            setButtonStyle(false);
          }
          else {
            setButtonStyle(true)
          }
        }
        else {
          if (marginValue > avaibalance) {
            setButtonStyle(true);
          }
          else {
            setButtonStyle(false)
          }
        }

        /**
       * Calculate the various fees involved in opening and closing positions (long and short).
       * These fees are based on the margin value and leverage.
       */
        const openPositionFee = (marginValue * 0.055) / 100;
        const longClosePositionFee = ((marginValue * (leverage - 1)) / leverage * 0.055) / 100;
        const shortClosePositionFee = (marginValue * ((leverage + 1) / leverage) * 0.055) / 100;

        const longCost = marginValue / leverage + openPositionFee + longClosePositionFee;
        const shortCost = marginValue / leverage + openPositionFee + shortClosePositionFee;
      }
    }
  };

  // ===================================================================//
  // =====Submit form data in case of stop limit trading ===============//
  // ===================================================================//
  const submitStopLimitForm = async (type: any) => {
    try {
      if (parseFloat(stopPrice) === 0 || parseFloat(stopPrice) < 0) {
        setStopPriceValidate("Stop Price must be positive number!");
        return;
      }

      if (entryPrice === 0 || entryPrice < 0) {
        setEntryPriceValidate("Price must be positive number!");
        return;
      }

      if (sizeValue === 0 || sizeValue < 0) {
        setSizeValidate("Amount must be positive number!");
        return;
      }

      let Liquidation_Price =
        (entryPrice * (1 - 0.01)) / props?.marginMode?.leverage;

      // Liquidation Price for long case
      Liquidation_Price = entryPrice - Liquidation_Price;

      // Liquidation Price for short case
      if (show === 2) {
        Liquidation_Price = entryPrice + Liquidation_Price;
      }

      let obj = {
        position_id: "--",
        user_id: session?.user?.user_id,
        symbol:
          props?.currentToken?.coin_symbol + props?.currentToken?.usdt_symbol,
        side: type === "Buy" ? "open long" : "open short",
        type: type.toLowerCase(), //e.g limit, take profit market, stop market
        amount: sizeValue.toString(), // limit order amount, close position
        price_usdt: entryPrice, // limit order price
        trigger: stopPrice, // TP/SL posiotion amount , limit order --
        reduce_only: "No", // TP/SL case Yes, limit order No
        post_only: "No", //No
        status: false,
        leverage: props?.marginMode?.leverage,
        margin: sizeValue / props?.marginMode?.leverage,
        liq_price: Liquidation_Price,
        market_price:
          props?.currentToken?.token !== null
            ? props?.currentToken?.token?.price
            : props?.currentToken?.global_token?.price,
        order_type: "value",
        leverage_type: props?.marginMode?.margin,
        coin_id: props?.currentToken?.coin_id,
        qty: sizeValue / entryPrice,
      };

      const ciphertext = AES.encrypt(
        JSON.stringify(obj),
        `${process.env.NEXT_PUBLIC_SECRET_PASSPHRASE}`
      );
      let record = encodeURIComponent(ciphertext.toString());

      let reponse = await fetch(
        `${process.env.NEXT_PUBLIC_BASEURL}/future/openorder`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: session?.user?.access_token,
          },
          body: JSON.stringify(record),
        }
      ).then((response) => response.json());

      if (reponse?.data?.status !== 200) {
        toast.error(
          reponse?.data?.data?.message !== undefined
            ? reponse?.data?.data?.message
            : reponse?.data?.data, {
          position: 'top-center'
        }
        );
        setButtonStyle(false);
      } else {
        if (wbsocket) {
          let position = {
            ws_type: "position",
          };
          wbsocket.send(JSON.stringify(position));
        }
        toast.success(reponse?.data?.data?.message, {
          position: 'top-center'
        });
        setButtonStyle(false);
        props?.refreshWalletAssets();
      }
    } catch (error) { }
  };

  const actionPerform = async () => {
    setShortConfirm(false);
    setActive(false);
    if (show === 1 && showNes === 1 && !shortConfirm) {
      submitForm('limit');
      setMarketType('limit')
    } else {
      submitForm('market');
      setMarketType('market')
    }
  }

  useEffect(() => {
    const storedPositionMode = localStorage.getItem('positionMode');
    if (storedPositionMode == "Hedge") {
      setPositionMode('Hedge');
    } else {
      setPositionMode('oneWay');
    }
  }, [])



  return (
    <>
      <div
        className={`p-[16px] dark:bg-[#1f2127] bg-[#fff] ${props.fullWidth ? "max-w-full h-auto" : "max-w-[300px] h-[677px]"
          } w-full border-b dark:border-[#25262a] border-[#e5e7eb]`}
      >
        <div className="flex  gap-2 w-full items-center">
          <div
            className="flex items-center justify-between px-[12px] py-[7px] dark:bg-[#373d4e] bg-[#e5ecf0] rounded-[4px] cursor-pointer w-full"
            onClick={() => {
              props.setOverlay(true);
              props.setPopupMode(1);
            }}
          >
            <div className="flex items-center gap-[2px] w-full">
              <p className="top-label dark:!text-white !text-[#000]">
                {props?.marginMode?.margin ? (
                  <span>{props?.marginMode?.margin}</span>
                ) : (
                  <span>Isolated </span>
                )}
              </p>
              <p className="px-[5px] text-primary text-[12px]">
                {props?.marginMode?.leverage}X
              </p>
            </div>
          </div>

          <div className="px-[12px] py-[7px] dark:bg-[#373d4e] bg-[#e5ecf0] rounded-[4px] cursor-pointer w-full">
            <p className="top-label dark:!text-white !text-[#000] whitespace-nowrap">
              {positionMode === "oneWay" ? (
                <span>One Way Mode</span>
              ) : (
                <span>Hedge Mode </span>
              )}
            </p>
          </div>
          <div className="cursor-pointer" onClick={() => { setIsShow(true) }}>
            <IconsComponent type="settingIcon" />
          </div>
        </div>
        {/* main tabs */}
        <div className="flex items-center dark:bg-[#373d4e] bg-[#e5ecf0] rounded-[2px] mt-10">
          <button
            className={`w-full p-[5px] rounded-[4px] border ${show === 1
              ? "text-buy border-buy"
              : "text-[#a3a8b7] border-[#f0f8ff00]"
              }`}
            onClick={() => {
              setShow(1);
              setSizeValue(0);
              setPercentage(0)
              props?.setOpnlong && props?.setOpnlong('Long');
              setEntryPrice(0);
              setEntryPriceValidate("");
              setSizeValidate('')

              if (showNes === 3) {
                onCoinDropDownChange("USDT");
              }
              if (showNes === 1) {
                setMarketType('limit')
              }
              else {
                setMarketType('market')
              }
            }}
          >
            Buy
          </button>
          <button
            className={`w-full p-[5px] rounded-[4px] border ${show === 2
              ? "text-sell border-sell "
              : "text-[#a3a8b7] border-[#f0f8ff00]"
              }`}
            onClick={() => {
              setShow(2);
              setSizeValue(0);
              setPercentage(0)
              setMarketType('market')
              props?.setOpnlong && props?.setOpnlong('Short');
              setEntryPrice(0);

              setEntryPriceValidate("");
              setSizeValidate('')
              if (showNes === 3) {
                onCoinDropDownChange(props?.currentToken?.coin_symbol);
              }
            }}
          >
            Sell
          </button>
        </div>

        {/* nested tabs */}
        <div className="flex items-center justify-between  mt-10">
          <div className="flex items-center gap-[10px]">
            <button
              className={`admin-body-text ${showNes === 1
                ? "!text-black dark:!text-white"
                : "!text-[#a3a8b7]"
                }`}
              onClick={() => {
                setShowNes(1);
                setPercentage(0)
                setMarketType("limit");
                setSizeValidate("");
                setEntryPriceValidate("");
                setSizeValue("");
                setEntryPrice("");
                setStopPrice("0");
              }}
            >
              Limit
            </button>
            <button
              className={`admin-body-text ${showNes === 2
                ? "!text-black dark:!text-white"
                : "!text-[#a3a8b7]"
                }`}
              onClick={() => {
                setShowNes(2);
                setPercentage(0)
                setMarketType("market");
                setSizeValidate("");
                setEntryPriceValidate("");
                setSizeValue("");
                setEntryPrice("");
                setStopPrice('0');
              }}
            >
              Market
            </button>
          </div>
        </div>
        {/* available Balance*/}
        <div className="flex items-center gap-[8px] mt-10">
          <p className="admin-body-text !text-[12px]">
            Available: {avaibalance}
          </p>
          <p className="admin-body-text !text-[12px] dark:!text-white"> {symbol}</p>
          <div
            onClick={() => {
              if (session?.user) {
                props.setOverlay(true);
                props.setPopupMode(3);
              }
              else {
                router.push('/login')
              }
            }}
          >
            <IconsComponent type="swap-calender-with-circle" />
          </div>
        </div>

        {/* ================================= */}
        {/* Future trading in limit case and market case */}
        {/* ================================= */}
        {/* price input */}
        {showNes === 1 && (
          <>
            <div className="mt-10 rounded-5 py-[6px] px-[10px] flex border items-center justify-between gap-[15px] dark:border-[#25262a] border-[#e5e7eb] relative dark:bg-[#373d4e] bg-[#e5ecf0]">
              <div>
                <p className="top-label">Price </p>
                <input
                  type="number" onWheel={(e) => (e.target as HTMLElement).blur()}
                  placeholder="$0"
                  step="0.000001"
                  value={entryPrice}
                  onChange={(e) => {
                    const value = e.target.value;
                    const regex = /^\d{0,10}(\.\d{0,6})?$/;

                    if (regex.test(value) || value === "") {
                      setEntryPrice(value === "" ? '' : parseFloat(value));
                      setEntryPriceValidate("");
                    } else {
                      setEntryPriceValidate("Invalid format: up to 10 digits before decimal and up to 6 digits after decimal.");
                      e.target.value = value.slice(0, -1);
                    }

                  }}
                  name="token_amount"
                  className="bg-[transparent] max-w-full w-full outline-none md-text px-[5px] md-text "
                  pattern="^\d{0,10}(\.\d{0,6})?$"
                />

              </div>
              <div>
                <p className="admin-body-text !text-[12px] dark:!text-white">
                  {" "}
                  {symbol}
                </p>
              </div>
            </div>
            <p className="errorMessage">{entryPriceValidate}</p>
            <p className="top-label mt-[5px]">Current Price : {currencyFormatter(truncateNumber(marketPrice, 6))}</p>
          </>
        )}
        {(showNes === 1 || showNes === 2) && (
          <>
            <div className="flex gap-1 mt-10 items-center"  >
              <p className="top-label ">{prefernceSymbol === "Qty" ? "Order by Qty" : "Order by Value"}</p>
              <div onClick={() => { setPreference(true) }}>
                <IconsComponent type="swap-calender-with-circle" />
              </div>
            </div>
            <div className="mt-2 z-[5] rounded-5 py-[6px] px-[10px] flex border items-center justify-between gap-[15px] dark:border-[#25262a] border-[#e5e7eb] relative dark:bg-[#373d4e] bg-[#e5ecf0]">
              <div>
                <p className="top-label">Amount</p>
                <input
                  type="number"
                  onWheel={(e) => (e.target as HTMLElement).blur()}
                  value={sizeValue}
                  placeholder="0.00"
                  onChange={onChangeSizeValue}
                  step="0.001"
                  min={props?.minTrade}
                  name="token_amount"
                  pattern="^\d{0,10}(\.\d{0,4})?$"
                  className="bg-[transparent] max-w-full w-full outline-none md-text px-[5px] asdsadsad"
                />
              </div>
              <div className="cursor-default">
                <p className='admin-body-text !text-[12px] dark:!text-white '>
                  {prefernceSymbol === "Qty" ? props.currentToken?.coin_symbol : props.currentToken?.usdt_symbol}
                </p>
              </div>
            </div>
            <p className="errorMessage">{sizeValidate}</p>
          </>
        )}
        <RangeSlider
          inputId="rangeInput3"
          thumbId="rangeThumb3"
          lineId="rangeLine3"
          onChangeSizeInPercentage={onChangeSizeInPercentage}
          rangetype="X"
          step={1}
          levrageValue={leverage}
          min={0}
        />

        {/* ================================= */}
        {/* Future trading in stop limit case */}
        {/* ================================= */}
        {showNes === 3 && (
          <>
            <div className="mt-10 z-[5] rounded-5 py-[6px] px-[10px] flex border items-center justify-between gap-[15px] dark:border-[#25262a] border-[#e5e7eb] relative dark:bg-[#373d4e] bg-[#e5ecf0]">
              <div>
                <p className="top-label">Stop Price </p>
                <input
                  type="number" onWheel={(e) => (e.target as HTMLElement).blur()}
                  placeholder="0"
                  onChange={(e) => {
                    setStopPrice(e.target?.value);
                    setStopPriceValidate("");
                  }}
                  step="any"
                  name="token_amount"
                  className="bg-[transparent] max-w-full w-full outline-none md-text px-[5px] md-text dddddddddd"
                />
              </div>
              <div>
                <p className="admin-body-text !text-[12px] dark:!text-white">
                  {" "}
                  USDT
                </p>
              </div>
            </div>
            <p className="errorMessage">{stopPriceValidate}</p>

            <div className="mt-10 z-[5] rounded-5 py-[6px] px-[10px] flex border items-center justify-between gap-[15px] dark:border-[#25262a] border-[#e5e7eb] relative dark:bg-[#373d4e] bg-[#e5ecf0]">
              <div>
                <p className="top-label">Price </p>
                <input
                  type="number" onWheel={(e) => (e.target as HTMLElement).blur()}
                  placeholder="0"
                  onChange={(e) => {

                    setEntryPrice(
                      e.target.value === "" ? '' : parseFloat(e.target.value)
                    );
                    setEntryPriceValidate("");
                  }}
                  step="any"
                  name="token_amount"
                  className="bg-[transparent] max-w-full w-full outline-none md-text px-[5px] md-text dssdaaafw"
                />
              </div>
              <div>
                <p className="admin-body-text !text-[12px] dark:!text-white">
                  {" "}
                  USDT
                </p>
              </div>
            </div>
            <p className="errorMessage">{entryPriceValidate}</p>

            <div className="mt-10 z-[5] rounded-5 py-[6px] px-[10px] flex border items-center justify-between gap-[15px] dark:border-[#25262a] border-[#e5e7eb] relative dark:bg-[#373d4e] bg-[#e5ecf0]">
              <div>
                <p className="top-label">Amount</p>
                <input
                  type="number" onWheel={(e) => (e.target as HTMLElement).blur()}
                  placeholder="0"
                  onChange={(e) => {

                    setSizeValue(
                      e.target.value === "" ? 0.00 : parseFloat(e.target.value)
                    );
                    setSizeValidate("");
                  }}
                  step="any"
                  name="token_amount"
                  className="bg-[transparent] max-w-full w-full outline-none md-text px-[5px] md-text rrreyyy"
                />
              </div>
              <div>
                <p className="admin-body-text !text-[12px] dark:!text-white">
                  {" "}
                  {symbol}
                </p>
              </div>
            </div>
            <p className="errorMessage">{sizeValidate}</p>
          </>
        )}

        {/* ================================= */}
        {/* Future trading in limit case and market case */}
        {/* ================================= */}
        {(showNes === 1 || showNes === 2) && (
          <>

            {session && (
              <div className="mt-[20px] tmb-qty-value">
                {prefernceSymbol === "Value" && (
                  <div className="flex gap-5 items-center justify-between">
                    <p className="top-label">Qty</p>
                    <p className="top-label !text-[#000] dark:!text-[#fff]">

                      {
                        showNes === 1
                          ? (sizeValue === 0 || sizeValue == Infinity || isNaN(sizeValue))
                            ? 0.00 : (isNaN(parseFloat(scientificToDecimal(truncateToSixNumber((sizeValue / entryPrice).toFixed(12), 4)))) || parseFloat(scientificToDecimal(truncateToSixNumber((sizeValue / entryPrice).toFixed(12), 3))) == Infinity) ? 0.00 : scientificToDecimal(truncateToSixNumber((sizeValue / entryPrice).toFixed(12), 3)) : isNaN(parseFloat(scientificToDecimal(truncateToSixNumber((sizeValue / marketPrice).toFixed(12), 3)))) ? 0.00 : scientificToDecimal(truncateToSixNumber((sizeValue / marketPrice).toFixed(12), 3))}{" "}
                      {props?.currentToken?.coin_symbol}
                    </p>
                  </div>
                )}

                {prefernceSymbol === "Qty" && (
                  <div className="flex gap-5 items-center justify-between">
                    <p className="top-label">Value</p>
                    <p className="top-label !text-[#000] dark:!text-[#fff]">
                      {showNes === 1
                        ? sizeValue === 0
                          ? 0.00
                          : isNaN(truncateNumber(sizeValue * entryPrice, 5))
                            ? 0.00
                            : truncateNumber(sizeValue * entryPrice, 5)
                        : isNaN(truncateNumber(sizeValue * marketPrice, 5))
                          ? 0.00
                          : truncateNumber(sizeValue * marketPrice, 5)}{" "}
                      USDT
                    </p>
                  </div>
                )}



                {show === 1 && (
                  <div className="mt-[5px]">
                    <button
                      disabled={buttonStyle}
                      className={` solid-button w-full !bg-[#03A66D]  !rounded-[8px] py-[10px] px-[15px] !text-[14px] ${buttonStyle === true
                        ? "cursor-not-allowed opacity-50"
                        : ""
                        }`}
                      onClick={() => {
                        if (marketType === "market") {
                          submitForm('market');
                        }
                        else if (marketType === "limit") {
                          let market_price = props?.currentToken?.token !== null ? props?.currentToken?.token?.price : props?.currentToken?.global_token?.price;
                          if (market_price < entryPrice) {

                            setShortConfirm(true);
                          }
                          else {
                            submitForm('limit')
                          }
                        }
                      }}
                    >
                      Open Long
                    </button>
                  </div>
                )}
                {show === 2 && (
                  <div className="mt-[5px]">
                    <button
                      disabled={buttonStyle}
                      className={`solid-button w-full !bg-sell !rounded-[8px] py-[10px] px-[15px] !text-[14px] ${buttonStyle === true
                        ? "cursor-not-allowed opacity-50"
                        : ""
                        }`}
                      onClick={() => {
                        if (marketType === "market") {
                          submitForm('market');
                        }
                        else if (marketType === "limit") {
                          let market_price = props?.currentToken?.token !== null ? props?.currentToken?.token?.price : props?.currentToken?.global_token?.price;
                          if (market_price > entryPrice) {
                            setShortConfirm(true);
                          }
                          else {
                            submitForm('limit')
                          }
                        }
                      }}
                    >
                      Open Short
                    </button>
                  </div>
                )}
                <div className="flex gap-5 items-center justify-between mt-[5px]">
                  <p className="top-label">Margin</p>
                  <p className="top-label !text-[#000] dark:!text-[#fff]">

                    {isNaN(sizeValue / props?.marginMode?.leverage)
                      ?
                      isNaN(truncateNumber(Number(scientificToDecimal(0 / props?.marginMode?.leverage)), 6)) ? '0.00' : truncateNumber(Number(scientificToDecimal(0 / props?.marginMode?.leverage)), 6)
                      :

                      isNaN(truncateNumber(Number(scientificToDecimal(sizeValue / props?.marginMode?.leverage)), 6)) ? '0.00' : truncateNumber(Number(scientificToDecimal(sizeValue / props?.marginMode?.leverage)), 6)
                    }
                  </p>

                </div>
                <div className="flex gap-5 items-center justify-between mt-[5px]">
                  <p className="top-label">Max trade value</p>
                  <p className="top-label !text-[#000] dark:!text-[#fff]">
                    {`${truncateNumber(props?.maxTrade - usedQty, 3)} ${props?.currentToken?.coin_symbol}`}
                  </p>

                </div>
              </div>
            )}
            {status === "unauthenticated" && (
              <div className="mt-[20px]">
                <Link
                  prefetch={false}
                  href="/login"
                  className="solid-button w-full block text-center !rounded-[8px] py-[10px] px-[15px] !text-[14px]"
                >
                  Login
                </Link>
              </div>
            )}
            {/* open long */}
            <div
              className="flex items-center justify-between px-[12px] py-[7px] dark:bg-[#373d4e] bg-[#e5ecf0] rounded-[4px] cursor-pointer mt-[10px]"
            >
              <div className="flex items-center gap-10">
                <p className="top-label dark:!text-white !text-[#000]">
                  Fee Rate
                </p>
              </div>
            </div>
            <div className=' mt-10 '>
              <div className="flex gap-5 items-center justify-between mb-[5px]">
                <p className='top-label'>Maker fee</p>
                <p className='top-label !text-[#000] dark:!text-white'>0.02%</p>
              </div>
              <div className="flex gap-5 items-center justify-between">
                <p className='top-label'>Taker fee</p>
                <p className='top-label !text-[#000] dark:!text-white'>0.06%</p>
              </div>
            </div>
          </>
        )}

        {/* ================================= */}
        {/* Future trading in stop limit case */}
        {/* ================================= */}

        {showNes === 3 && status !== "unauthenticated" && (
          <div className="mt-[20px]">
            <div className="flex gap-5 items-center justify-between ">
              <p className="top-label">Qty</p>
              <p className="top-label !text-[#000] dark:!text-[#fff]">
                {showNes === 3
                  ? sizeValue === 0
                    ? 0.0
                    : (sizeValue / entryPrice).toFixed(5)
                  : (sizeValue / marketPrice).toFixed(5)}{" "}
                {props?.currentToken?.coin_symbol}
              </p>
            </div>
            {show === 1 && (
              <div className="mt-[5px]">
                <button
                  disabled={buttonStyle}
                  className={` solid-button w-full !bg-[#03A66D] !rounded-[8px] py-[10px] px-[15px] !text-[14px] ${buttonStyle === true ? "cursor-not-allowed opacity-50" : ""
                    }`}
                  onClick={() => {
                    setIsShow(true);
                    submitStopLimitForm("Buy");
                  }}
                >
                  Buy Long
                </button>
              </div>
            )}
            {show === 2 && (
              <div className="mt-[5px]">
                <button
                  disabled={buttonStyle}
                  className={`solid-button w-full !bg-sell !rounded-[8px] py-[10px] px-[15px] !text-[14px] ${buttonStyle === true ? "cursor-not-allowed opacity-50" : ""
                    }`}
                  onClick={() => submitStopLimitForm("Sell")}
                >
                  Sell Short
                </button>
              </div>
            )}
          </div>
        )}
        {showNes === 3 && status === "unauthenticated" && (
          <div className="mt-[20px]">
            <Link
              prefetch={false}
              href="/login"
              className="solid-button w-full block text-center !rounded-[8px] py-[10px] px-[15px] !text-[14px]"
            >
              Login
            </Link>
          </div>
        )}
      </div >

      {/* overlay */}
      < div
        className={`sdsadsadd bg-black z-[9] duration-300 fixed top-0 left-0 h-full w-full opacity-0 invisible ${(modelOverlay || confirmModelOverlay || active) && "!opacity-[70%] !visible"
          }`
        }
      ></div >
      <ProfitLossModal
        setModelOverlay={setModelOverlay}
        setModelPopup={setModelPopup}
        modelPopup={modelPopup}
        modelOverlay={modelOverlay}
        entryPrice={showNes === 1 ? entryPrice : marketPrice}
        currentToken={props?.currentToken}
        leverage={props?.marginMode?.leverage}
        sizeValue={sizeValue}
        show={show === 1 ? "long" : "short"}
        setTpSl={setTpSl}
        actionType="buysell"
        setProfitLossConfirm={setProfitLossConfirm}
      />

      {/* Trade confirm order popup */}
      <TradeConfirmPopupModal
        leverage={props?.marginMode?.leverage}
        setConfirmModelOverlay={setConfirmModelOverlay}
        setConfirmModelPopup={setConfirmModelPopup}
        modelPopup={confirmModelPopup}
        modelOverlay={confirmModelOverlay}
        confirmOrder={confirmOrder}
        confirmOrderData={confirmOrderData}
        finalOrderSubmit={finalOrderSubmit}
        symbol={props?.currentToken?.coin_symbol}
      />
      {
        prefernce &&
        <OrderPreferenceModal setPreference={setPreference} currentToken={props?.currentToken} setPreferenceSymbol={setPreferenceSymbol} prefernceSymbol={prefernceSymbol} setOrderType={setOrderType} setSizeValue={setSizeValue} />
      }
      {isShow && <PositionModal setIsShow={setIsShow} positionMode={positionMode} setPositionMode={setPositionMode} positions={props.positions} openOrders={props.openOrders} />}

      {
        shortConfirm &&
        (
          <>
            <div className="bg-black  z-[9] duration-300 fixed top-0 left-0 h-full w-full opacity-[0.5]"></div>
            <ConfirmationModel textColor={"#a3a8b7"} bgColor={'#292d38'} setActive={setActive} setShow={setShortConfirm} title="Risk Alert"
              message={'The current order may encounter the following circumstances.\nPlease confirm before you proceed.\n1. The current order may be executed immediately  as a market order.'} actionPerform={actionPerform} />
          </>
        )
      }
    </>
  );
};

export default BuySell;