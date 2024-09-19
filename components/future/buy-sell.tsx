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
import { scientificToDecimal, truncateNumber } from "@/libs/subdomain";
import { currencyFormatter } from "../snippets/market/buySellCard";
import { useRouter } from "next/router";

interface fullWidth {
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

const BuySell = (props: fullWidth) => {
  // main tabs
  const [show, setShow] = useState(1);
  const { status, data: session } = useSession();
  const list = ["USDT", props?.currentToken?.coin_symbol];
  // const timeInForceList = ['GTC', 'FOK', 'IOC'];
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
  let marketPrice =
    props?.currentToken?.token !== null
      ? props?.currentToken?.token?.price
      : props?.currentToken?.global_token?.price;


  useEffect(() => {

    let value = localStorage.getItem('preference') || "Qty"
    setPreferenceSymbol(value)

    if (showNes === 2 && percentage > 0) {
      onChangeSizeInPercentage(percentage)
    }
  }, [marketPrice])

  useEffect(() => {
    
    setButtonStyle(false)

    let futureAssets = props?.assets?.filter((item: any) => {
      return item.walletTtype === "future_wallet";
    });

    console.log("inside this");
    

    // console.log(futureAssets,"=futureAssets");


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

    // console.log("here", asset);

    if (asset?.length > 0) {
      // if (asset[0].balance === 0) {
      //   setButtonStyle(true);
      // } else {
      //   setButtonStyle(false);
      // }
      let bal = Number(truncateNumber(Number(asset[0].balance) + rewardsAmount, 6))
      let assetbal = truncateNumber(Number(asset[0].balance), 6)
      // console.log(assetbal,"=jsdsajhdkas");

      setAssetsBalance(assetbal);
      setAvailBalance(bal);
    } else {

      // console.log("in else part");

      setAvailBalance(rewardsAmount);
      // setButtonStyle(true);
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

  // ===================================================================//
  // =======Change wallet balance according to token change=============//
  // ===================================================================//
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
      // if (asset[0].balance === 0) {
      //   setButtonStyle(true);
      // } else {
      //   setButtonStyle(false);
      // }
      let bal = Number(asset[0].balance) + rewardsAmount;
      setAssetsBalance(Number(asset[0].balance));
      setAvailBalance(bal);

    } else {
      setAvailBalance(rewardsAmount);
      // setButtonStyle(true);
      setAssetsBalance(0);
    }
    setSymbol(token);
  };




  // ===================================================================//
  // asset amount value using range slider //
  // ===================================================================//
  const onChangeSizeInPercentage = (value: number) => {


    setButtonStyle(false)

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

  };

  // ===================================================================//
  // Submit form data in case of limit and market trading//
  // ===================================================================//
  const submitForm = async (orderMarkeType: string) => {

    console.log("hererere"
    );

    let obj;

    console.log('============heer================');

    if (orderMarkeType === "market") {
      if (showNes === 1 && (entryPrice == undefined || entryPrice == null || entryPrice === 0 || entryPrice < 0 || entryPrice === "")) {
        setEntryPriceValidate("Price must be greater than '0'");
        return
      }

      if (sizeValue === 0 || sizeValue < 0 || sizeValue === "") {
        setSizeValidate("Amount must be greater than '0'");
        return;
      }

      let Liquidation_Price: any = (marketType === 'limit' ? entryPrice : marketPrice * (1 - 0.01)) / props?.marginMode?.leverage;

      // Liquidation Price for long case
      if (show === 1) {
        Liquidation_Price = (marketType === 'limit' ? entryPrice : marketPrice) - Liquidation_Price;
      }

      // Liquidation Price for short case
      if (show === 2) {
        Liquidation_Price = (marketType === 'limit' ? entryPrice : marketPrice) + Liquidation_Price;
      }

      let qty: any = sizeValue / marketPrice;
      qty = qty.toString().match(/^-?\d+(?:\.\d{0,6})?/)[0];


      if (orderType === "qty") {
        qty = sizeValue.toString();
      }

      if (qty < props?.minTrade) {
        toast.error('Order cost falls below the min. amount.', { autoClose: 2000 })
        return;
      }
      let value: any = truncateNumber((qty * 0.055),8);
      // console.log(value,"==value");
      
      let releazedPnl: any = (marketPrice * value) / 100;
      // console.log(releazedPnl,"==relaized pnl");
      
      let size: any = truncateNumber(qty * marketPrice, 8);

      // let marginValue = size / props?.marginMode?.leverage;

      // console.log(marketPrice,'=======entryPrice', sizeValue,'======sizeValue', props?.marginMode?.leverage,'=======leverage');
      let marginValue = orderType === "qty" ? (marketPrice * sizeValue) / props?.marginMode?.leverage : marketPrice / props?.marginMode?.leverage;
      // orderType === "qty" ? size / props?.marginMode?.leverage : sizeValue / props?.marginMode?.leverage;
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
        order_type: orderType,
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

      let qty: any = sizeValue / marketPrice;
      qty = qty.toString().match(/^-?\d+(?:\.\d{0,8})?/)[0];


      if (orderType === "qty") {
        qty = sizeValue.toString();
        // console.log(qty, "==qty", props?.minTrade, "==props?.minTrade");

      }
      if (qty < props?.minTrade) {
        toast.error('Order cost falls below the min. threshold.', { autoClose: 2000 })
        return;
      }


      let enter_Price: any = entryPrice;
      let amount: any = qty * entryPrice;
      
      
      let marginValue = orderType === "qty" ? ((entryPrice * sizeValue) / props?.marginMode?.leverage) : sizeValue / props?.marginMode?.leverage;
      console.log(marginValue,"=======marginValue");
      

      obj = {
        position_id: "--",
        user_id: session?.user?.user_id,
        symbol:
          props?.currentToken?.coin_symbol + props?.currentToken?.usdt_symbol,
        side: show === 1 ? "open long" : "open short",
        type: orderMarkeType, //e.g limit, take profit market, stop market
        amount: amount.toString().match(/^-?\d+(?:\.\d{0,8})?/)[0], // limit order amount, close position
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
        order_type: orderType,
        leverage_type: props?.marginMode?.margin,
        coin_id: props?.currentToken?.coin_id,
        qty: parseFloat(qty.toString().match(/^-?\d+(?:\.\d{0,8})?/)[0]),
        position_mode: positionMode
      };
    }
    // console.log(props?.marginMode?.leverage,"==props?.marginMode?.leverage");
    // console.log(entryPrice,"==entryPrice");
    // console.log(sizeValue,"==sizeValue");

    // console.log(obj,"===sell order");


    setConfirmOrderData(obj);
    setConfirmModelPopup(1);
    setConfirmModelOverlay(true);

  };

  const confirmOrder = async () => {
    try {
      if (truncateNumber(usedQty + confirmOrderData?.qty, 3) > props?.maxTrade) {

        toast.error("Order failed. Order quantity is greater than maximum order quantity", { autoClose: 2000 })

        setButtonStyle(false);
        // props?.refreshWalletAssets();
        setConfirmModelOverlay(false);
        setConfirmModelPopup(0);
        setFinalOrderSubmit(false);

        return;
      }

      else {
        setButtonStyle(true);
        setFinalOrderSubmit(true);
        const ciphertext = AES.encrypt(
          JSON.stringify(confirmOrderData),
          `${process.env.NEXT_PUBLIC_SECRET_PASSPHRASE}`
        );
        let record = encodeURIComponent(ciphertext.toString());


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
  // =======Take Profit and Sop Loss popup hide and shoow===============//
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

  // ===================================================================//
  // =====Validation in case of amount more than enter wallet value=====//
  // ===================================================================//
  const onChangeSizeValue = (e: React.ChangeEvent<HTMLInputElement>) => {

    console.log("hereer i am");
    

    let value: any = e.target.value

    const regex = /^\d{0,10}(\.\d{0,4})?$/;


    setLerverage(0);
    let sliderThumb = document.getElementById("rangeThumb") as HTMLDivElement;
    let rangeLine = document.getElementById("rangeLine") as HTMLDivElement;
    let inputPercent = document.querySelector('.inputPercent') as HTMLInputElement;

    if (leverage == 0) {
      sliderThumb.setAttribute("style", 'left:0;');
      sliderThumb.innerText = "0X";
      inputPercent?.value == "0";
      rangeLine.setAttribute("style", 'width:0;');
    }
    if (regex.test(value) || value === "") {

      value = parseFloat(e.target.value) == 0 ? 0.00 : parseFloat(e.target.value);
   

      let propsLeverage= props?.marginMode?.leverage || props?.leverage

      let marginValue = orderType === "qty" ? (marketType === 'limit' ? ((entryPrice * parseFloat(e.target.value)) /propsLeverage ):( (marketPrice * parseFloat(e.target.value))) / propsLeverage) : (parseFloat(e.target.value) / propsLeverage);

      if (isNaN(value)) {
        setSizeValue(''); // Reset sizeValue to its current state
        return; // Exit early without updating state or applying further logic
      }

      else if (value !== 0 && value < props?.minTrade) {
        setSizeValidate(`Minimum value: ${props?.minTrade}`)
        // console.log(sizeValue,"==sizeValue");
        return;
      }
      else {
        setSizeValidate('')
        setSizeValue(value);
        setButtonStyle(false);

        let leverage = propsLeverage


        console.log(marginValue, "margin value");
        console.log(avaibalance, "avaibalance value");



        if (marginValue > avaibalance) {
          setButtonStyle(true);
        }

        const openPositionFee = (marginValue * 0.055) / 100;
        const longClosePositionFee = ((marginValue * (leverage - 1)) / leverage * 0.055) / 100;
        const shortClosePositionFee = (marginValue * ((leverage + 1) / leverage) * 0.055) / 100;

        const longCost = marginValue / leverage + openPositionFee + longClosePositionFee;
        const shortCost = marginValue / leverage + openPositionFee + shortClosePositionFee;

        // console.log(longCost * leverage, '===========long Cost==========', shortCost * leverage, '============short Cost============');


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
    if(show === 1 && showNes === 1 && !shortConfirm){
      submitForm('limit');
      setMarketType('limit')
    }else{
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

  // useEffect(() =>{
  //   console.log(entryPrice,"========truncateNumber(sizeValue / entryPrice, 3)");
  //   console.log(avaibalance,"========avaibalance");
  //   let tokenAmount = document.querySelector('[name="token_amount"]');

  //   // if(avaibalance > isNaN(truncateNumber(sizeValue / marketPrice, 3)) ){
  //   //   setButtonStyle(true);
  //   // }
  // },[avaibalance,sizeValue,entryPrice])

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
                  // onInput={()=>{
                  //   setLerverage(true)
                  // }}
                  step="0.001"
                  min={props?.minTrade}
                  name="token_amount"
                  pattern="^\d{0,10}(\.\d{0,4})?$"
                  className="bg-[transparent] max-w-full w-full outline-none md-text px-[5px] asdsadsad"
                />
              </div>
              <div className="cursor-default">
                <p className='admin-body-text !text-[12px] dark:!text-white'>
                  {prefernceSymbol === "Qty" ? props.currentToken?.coin_symbol : props.currentToken?.usdt_symbol}
                </p>
              </div>
            </div>
            <p className="errorMessage">{sizeValidate}</p>
          </>
        )}
        <RangeSlider
          inputId="rangeInput"
          thumbId="rangeThumb"
          lineId="rangeLine"
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
            {/* <div className="flex items-center justify-between mt-[20px]">
              <div
                className={`flex gap-5 items-center  w-full cursor-pointer bg-[transparent] prefrence`}
              >
                <input
                  id={`custom-radio${props.radioId}`}
                  type="checkbox"
                  onChange={(e) => {
                    profitlosspopupenable(e);
                  }}
                  value=""
                  name="colored-radio"
                  checked={profitLossConfirm}
                  className="hidden w-5 h-5 max-w-full   bg-red-400 border-[transparent] focus:ring-primary dark:focus:ring-primary dark:ring-offset-primary  dark:bg-[transparent] dark:border-[transparent]"
                />
                <label
                  htmlFor={`custom-radio${props.radioId}`}
                  className="
                                    custom-radio relative  px-[17px]  flex gap-2 items-center pl-[18px]
                                    cursor-pointer
                                    after:dark:bg-omega
                                    after:bg-white
                                    after:left-[0px]
                                    after:w-[20px] 
                                    after:h-[20px]
                                    after:border after:border-beta
                                    after:absolute

                                    before:dark:bg-[transparent]
                                    before:bg-white
                                    before:left-[5px]

                                    before:w-[10px] 
                                    before:h-[10px]
                                    before:absolute
                                    before:z-[1]
                                    "
                >
                  <p className="ml-2 md-text !text-[14px]">TP/SL</p>
                </label>
              </div>
            </div> */}
            {session && (
              <div className="mt-[20px]">
                {orderType === "value" && (
                  <div className="flex gap-5 items-center justify-between">
                    <p className="top-label">Qty</p>
                    <p className="top-label !text-[#000] dark:!text-[#fff]">
                      {showNes === 1
                        ? sizeValue === 0
                          ? 0.00 : isNaN(truncateNumber(sizeValue / entryPrice, 3)) ? 0.00 : truncateNumber(sizeValue / entryPrice, 3) : isNaN(truncateNumber(sizeValue / marketPrice, 3)) ? 0.00 : truncateNumber(sizeValue / marketPrice, 3)}{" "}
                      {props?.currentToken?.coin_symbol}
                    </p>
                  </div>
                )}

                {orderType === "qty" && (
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
                          // console.log("heresadasda");
                          let market_price = props?.currentToken?.token !== null ? props?.currentToken?.token?.price : props?.currentToken?.global_token?.price;
                          if (market_price < entryPrice) {
                            // console.log("in this", market_price, "entry pricesada", entryPrice);

                            setShortConfirm(true);
                          }
                          else {
                            // console.log("here in elseewrwee");
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
                          console.log("here");

                          let market_price = props?.currentToken?.token !== null ? props?.currentToken?.token?.price : props?.currentToken?.global_token?.price;
                          if (market_price > entryPrice) {
                            console.log("in this", market_price, "entry price", entryPrice);

                            setShortConfirm(true);
                          }
                          else {
                            console.log("here in else");

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
                      truncateNumber(Number(scientificToDecimal(0 / props?.marginMode?.leverage)), 6)
                      :

                      truncateNumber(Number(scientificToDecimal(sizeValue / props?.marginMode?.leverage)), 6)
                    }
                  </p>

                </div>
                <div className="flex gap-5 items-center justify-between mt-[5px]">
                  <p className="top-label">Max trade value</p>
                  <p className="top-label !text-[#000] dark:!text-[#fff]">
                    {`${truncateNumber(props?.maxTrade - usedQty, 3)} ${props?.currentToken?.coin_symbol}`}
                    {/* {orderType === "qty"
                      ? `${props?.maxTrade} ${props?.currentToken?.coin_symbol}`
                      : `${truncateNumber(props?.maxTrade * marketPrice, 6)} ${symbol}`} */}
                  </p>

                </div>
              </div>
            )}
            {status === "unauthenticated" && (
              <div className="mt-[20px]">
                <Link
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
            // onClick={() => {
            //   props.setOverlay(true);
            //   props.setPopupMode(4);
            // }}
            >
              <div className="flex items-center gap-10">
                <p className="top-label dark:!text-white !text-[#000]">
                  Fee Rate
                </p>
              </div>
              {/* <IconsComponent type="rightArrowWithoutBg" /> */}
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
            <div className="flex gap-5 items-center justify-between">
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