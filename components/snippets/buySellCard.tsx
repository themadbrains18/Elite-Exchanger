import React, { useEffect, useRef, useState } from "react";
import IconsComponent from "./icons";
import Image from "next/image";
import FilterSelectMenuWithCoin from "./filter-select-menu-with-coin";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { toast } from 'react-toastify';

import AES from 'crypto-js/aes';
import { useRouter } from "next/router";
import { signOut } from "next-auth/react";
import Link from "next/link";
import ConfirmBuy from "./confirmBuy";
import { useWebSocket } from "@/libs/WebSocketContext";
import { currencyFormatter } from "./market/buySellCard";
import { truncateNumber } from "@/libs/subdomain";
import WithdrawAuthenticationModelPopup from "../wallet/withdrawAuthentication";

const schema = yup.object().shape({
  token_amount: yup.number().positive("Amount must be greater than '0'.").required('Please enter quantity.').typeError('Please enter quantity.'),
  limit_usdt: yup.number().positive("Limit must be greater than '0'.").required('Please enter limit amount.').typeError('Please enter limit amount.'),
  // market_type:yup.string().optional().default('limit')
});

interface DynamicId {
  id: number;
  coins: any,
  session: any;
  token?: any;
  assets?: any;
  slug?: any;
  getUserOpenOrder?: any;
  getUserTradeHistory?: any;
}
const BuySellCard = (props: DynamicId) => {
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
  const [authenticationPopup, setAuthenticationPopup] = useState(false)
  const [tokenInputValue, setTokenInputValue] = useState(0.000000);
  const [limitInputValue, setLimitInputValue] = useState(0.000000);

  const list = props.coins;
  const wbsocket = useWebSocket();

  let secondList = props.coins?.filter((item: any) => {
    return item.symbol === 'USDT'
  })

  let { register, setValue, getValues, handleSubmit, watch, reset, setError, formState: { errors } } = useForm({
    resolver: yupResolver(schema),
  });

  const socketListenerRef = useRef<(event: MessageEvent) => void>();

  useEffect(() => {

    const handleSocketMessage = (event: any) => {
      const data = JSON.parse(event.data).data;
      let eventDataType = JSON.parse(event.data).type;

      if (eventDataType === "market") {
        if (props.session) {
          setPriceOnChangeType(spotType, '');
        }
      }
    };
    if (wbsocket && wbsocket.readyState === WebSocket.OPEN) {
      if (socketListenerRef.current) {
        wbsocket.removeEventListener('message', socketListenerRef.current);
      }
      socketListenerRef.current = handleSocketMessage;
      wbsocket.addEventListener('message', handleSocketMessage);
    }

    convertTotalAmount();
    let radioCta = document.querySelector(".custom-radio") as HTMLInputElement | null;
    let prevSibling: ChildNode | null | undefined = radioCta?.previousSibling;
    if (prevSibling instanceof HTMLElement) {
      prevSibling.click();
    }

    return () => {
      if (wbsocket) {
        wbsocket.removeEventListener('message', handleSocketMessage);
      }
    };
  }, [wbsocket])

  const hasRun = useRef(false);


  useEffect(() => {

    setCurrencyName(props.slug, 1);

    if (props.slug && props?.coins.length > 0) {
      // if (!hasRun.current) {
      setPriceOnChangeType(spotType, '');
      if (show === 2)
        setValue('limit_usdt', props?.token?.price)
      // hasRun.current = true;
      // }
    }
  }, [props.session, props.slug, props?.coins]);

  const setCurrencyName = (symbol: string, dropdown: number) => {
    if (dropdown === 1) {
      setFirstCurrency(symbol);

      let token = list.filter((item: any) => {
        return item.symbol === symbol && item?.tradepair !== null
      });

      // console.log(token, symbol,"token symbol");


      if (token.length > 0) {
        setSelectedToken(token[0]);
        // setPriceOnChangeType(active1 === 1 ? 'buy' : 'sell', symbol);
      }

      if (userAssets.message !== undefined) {
        signOut();
        return;
      }
    }
    else {
      setSecondCurrency(symbol);
    }
  }

  const setPriceOnChangeType = async (type: string, symbol: string) => {

    // setPrice(0.00);
    let token = list.filter((item: any) => {
      return item.symbol === (type === 'buy' ? 'USDT' : symbol === '' ? firstCurrency : symbol)
    });

    if (token.length > 0) {
      if (props?.session) {
        let assets: any = await getAssets();

        // console.log(assets,"==assets");
        // console.log(firstCurrency,"==token");


        if (assets) {

          let selectAssets = assets.filter((item: any) => {
            return item.token_id === token[0].id && item?.walletTtype === "main_wallet"
          });

          // console.log(selectAssets,"===selected assets",token[0]);


          if (selectAssets.length > 0) {
            setPrice(selectAssets[0].balance);
          }
          else {
            setPrice(0.00)
          }
        }
      }
    }
  }

  const scientificToDecimal = (value: any): string => {
    let val = value.toFixed(10) // Convert to decimal format, trimming unnecessary zeros
    val = val.replace(/\.?0+$/, "");
    return val

  };

  const truncateToNumber = (num: any, decimals: number) => {
    const regex = new RegExp(`^-?\\d+(?:\\.\\d{0,${decimals}})?`);
    const match = num?.toString().match(regex);
    return match ? parseFloat(match[0]) : num;
  };

  const onHandleSubmit = async (data: any) => {

    console.log(props?.session, "==session");

    if (props?.session?.user?.kyc !== "approve") {
      setAuthenticationPopup(true)
      return;
    }

    let type = document.querySelector('input[name="market_type"]:checked') as HTMLInputElement | null;



    if (props.token?.tradepair?.min_trade > data.token_amount) {
      setError("token_amount", {
        type: "custom",
        message: "Minimum purchase requirement: " + `'${props.token?.tradepair?.min_trade}' per order`,
      });
      return;
    }
    if (props.token?.tradepair?.maxTrade < data.token_amount) {
      setError("token_amount", {
        type: "custom",
        message: "Maximum purchase requirement: " + `'${props.token?.tradepair?.maxTrade}'  per order`,
      });
      return;
    }

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

    let totalUsdtAmount: any = (data.token_amount * data.limit_usdt);
    totalUsdtAmount = scientificToDecimal(Number(truncateNumber(totalUsdtAmount.toFixed(12), 10)));
    let transactionFee: any = active1 === 1 ? (data.token_amount * 0.001).toFixed(8) : (data.token_amount * data.limit_usdt * 0.001).toFixed(8);

    let buyerFees: any = data.token_amount * 0.001;
    buyerFees = scientificToDecimal(Number(truncateNumber(buyerFees.toFixed(12), 10)));
    let sellerFees: any = (data.token_amount * data.limit_usdt * 0.001);
    sellerFees = scientificToDecimal(Number(truncateNumber(sellerFees.toFixed(12), 10)));

    // console.log(buyerFees,'======buyer fees', sellerFees,'========sellerFees',  transactionFee,'=========transactionFee');

    // console.log(data.limit_usdt, "data.limit_usdt");

    let obj = {
      "user_id": props.session.user.user_id,
      "token_id": selectedToken?.id,
      "market_type": type?.value,
      "order_type": active1 === 1 ? 'buy' : 'sell',
      "limit_usdt": data.limit_usdt,
      "volume_usdt": totalUsdtAmount,
      "token_amount": data.token_amount.toString().match(/^-?\d+(?:\.\d{0,8})?/)[0],
      "fee": active1 === 1 ? buyerFees : sellerFees, /// transactionFee.toString().match(/^-?\d+(?:\.\d{0,8})?/)[0],
      "is_fee": false,
      "status": false,
      "isCanceled": false,
      "queue": false
    }

    setObjData(obj)
    setActive(true)
  }

  // =======================================================
  // Final Action perform after popup submit
  // =======================================================
  const actionPerform = async () => {
    try {
      // console.log("herer", objData);


      const ciphertext = AES.encrypt(JSON.stringify(objData), `${process.env.NEXT_PUBLIC_SECRET_PASSPHRASE}`);
      let record = encodeURIComponent(ciphertext.toString());

      let reponse = await fetch(`${process.env.NEXT_PUBLIC_BASEURL}/market`, {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
          "Authorization": props?.session?.user?.access_token
        },
        body: JSON.stringify(record)
      }).then(response => response.json());

      if (reponse.data.status === 200) {
        // console.log("here2");
        setPriceOnChangeType(objData?.order_type, '')
        // getAssets()
        toast.success(reponse.data?.data?.message);

        setFirstCurrency('BTCB');
        setSecondCurrency('USDT');
        setActive(false);
        if (show === 1) {
          reset({
            limit_usdt: 0.00,
            token_amount: 0.00,
          })

        }

        else {
          reset({
            token_amount: 0.00,
          })
          setValue('limit_usdt', props?.token?.price)
        }

        setEstimateFee(0.00)
        setTotalAmount(0.0)
        if (wbsocket) {
          let withdraw = {
            ws_type: 'market',
          }
          wbsocket.send(JSON.stringify(withdraw));
        }


        /**
         * After order create here is partial execution request send to auto execute
         */
        // setTimeout(async () => {
        //   let partialObj = {
        //     "user_id": props.session.user.user_id,
        //     "token_id": selectedToken?.id,
        //     "order_type": active1 === 1 ? 'buy' : 'sell',
        //     "market_type": show === 1 ? 'limit' : 'market'
        //   }

        //   const ciphertext = AES.encrypt(JSON.stringify(partialObj), `${process.env.NEXT_PUBLIC_SECRET_PASSPHRASE}`);
        //   let record = encodeURIComponent(ciphertext.toString());

        //   let executionReponse = await fetch(`${process.env.NEXT_PUBLIC_BASEURL}/market`, {
        //     method: "PUT",
        //     headers: {
        //       'Content-Type': 'application/json',
        //       "Authorization": props?.session?.user?.access_token
        //     },
        //     body: JSON.stringify(record)
        //   }).then(response => response.json());

        //   if (executionReponse?.data?.message === undefined) {

        //     if (wbsocket) {
        //       let withdraw = {
        //         ws_type: 'market',
        //       }
        //       wbsocket.send(JSON.stringify(withdraw));
        //     }
        //   }
        // }, 2000);
      }
      else {
        toast.error(reponse.data?.data);
      }

    } catch (error) {
      console.log("error while create market order", error);

    }
  }

  const checkInput = (e: any, type: string) => {
    const value = e.target.value;
    if (/^\d*\.?\d{0,6}$/.test(value)) {
      type === 'limit' ? setLimitInputValue(value) : setTokenInputValue(value);
    }
  }

  const convertTotalAmount = () => {
    if (getValues('token_amount')?.toString() === '') {
      setTotalAmount(0.00);
      return;
    }
    let type = document.querySelector('input[name="market_type"]:checked') as HTMLInputElement | null;

    if (type?.value === 'limit') {
      if (getValues('limit_usdt')?.toString() === '') {
        setTotalAmount(0.00);
        return;
      }
      let qty: any = getValues('token_amount');
      let amount: any = getValues('limit_usdt');
      if (qty) {
        let totalAmount: any = qty * amount;
        let fee: any = active1 === 1 ? truncateNumber((qty * 0.001), 8) : truncateNumber((amount * qty * 0.001), 8);
        // console.log(fee,'-----------------fees');

        // return


        setEstimateFee(fee.toString().match(/^-?\d+(?:\.\d{0,8})?/)[0]);
        setTotalAmount(totalAmount.toString().match(/^-?\d+(?:\.\d{0,8})?/)[0]);
      }

    }
    else {
      let qty: any = getValues('token_amount');
      if (qty) {
        let totalAmount: any = qty * truncateNumber(props?.token?.price, 8);
        let fee: any = active1 === 1 ? truncateNumber((qty * 0.001), 8) : truncateNumber((props?.token?.price * qty * 0.001), 8);
        setEstimateFee(fee.toString().match(/^-?\d+(?:\.\d{0,8})?/)[0]);
        setTotalAmount(totalAmount.toString().match(/^-?\d+(?:\.\d{0,8})?/)[0]);
      }
    }
  }

  /**
      * Get user assets data after order create
      */
  const getAssets = async () => {
    try {
      let userAssets = await fetch(`${process.env.NEXT_PUBLIC_BASEURL}/user/assets?userid=${props.session?.user?.user_id}`, {
        method: "GET",
        headers: {
          "Authorization": props.session?.user?.access_token
        },
      }).then(response => response.json());

      setUserAssets(userAssets);
      return userAssets

    } catch (error) {
      console.log("error while fetching assets", error);

    }
  }


  // console.log(estimateFee,"=estimate fee");


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
            if (show === 2) {
              let price = truncateNumber(Number(props?.token?.price), 8)
              setValue('limit_usdt', Number(price))
            }
          }}>
            Buy
          </button>
          <button className={`sec-text text-center text-gamma border-b-2 border-[transparent] pb-[25px] max-w-[50%] w-full ${active1 === 2 && "!text-primary border-primary"}`} onClick={() => {
            setActive1(2);
            setPriceOnChangeType('sell', '');
            reset({
              limit_usdt: 0.00,
              token_amount: 0.00,
            })
            setSpotType('sell');
            setTotalAmount(0.0);
            setEstimateFee(0.00);
            if (show === 2) {
              let price = truncateNumber(Number(props?.token?.price), 8)
              setValue('limit_usdt', Number(price))

            }
          }}>
            Sell
          </button>
        </div>
        <form onSubmit={handleSubmit(onHandleSubmit)} onKeyDown={(e) => {
          if (e.key === 'Enter') {
            e.preventDefault();
          }
        }}>
          <div className="py-20">
            <div className="flex lg:gap-30 gap-10">
              <div className={`flex  gap-5 justify-center items-center  w-full cursor-pointer border rounded-5 relative border-grey-v-1 dark:border-opacity-[15%] bg-[transparent] ${show === 1 && 'bg-primary-100 dark:bg-black-v-1 border-primary'}`} onClick={() => {
                setShow(1); reset({
                  limit_usdt: 0.00,
                  token_amount: 0.00,
                })
                setTotalAmount(0.0); setEstimateFee(0.00)
              }}>
                <input id={`custom-radio${props.id}`} data-testid="market_type" type="radio" value="limit" name="market_type" className=" cursor-pointer absolute top-0 left-0  w-full h-full opacity-0 max-w-full  bg-red-400 border-[transparent] focus:ring-primary dark:focus:ring-primary dark:ring-offset-primary  dark:bg-[transparent] dark:border-[transparent]" />
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
              <div className={`flex gap-5  justify-center items-center relative  w-full cursor-pointer border rounded-5 border-grey-v-1 dark:border-opacity-[15%] bg-[transparent] ${show === 2 && 'bg-primary-100 dark:bg-black-v-1 border-primary'}`} onClick={() => {
                setShow(2);
                reset({
                  limit_usdt: 0.00,
                  token_amount: 0.00,
                })
                setTotalAmount(0.0); setEstimateFee(0.00)
                setValue('limit_usdt', props?.token?.price)
              }}>
                <input id={`custom-radio2${props.id}`} type="radio" value="market" name="market_type" className="cursor-pointer w-full h-full opacity-0 absolute max-w-full   bg-red-400 border-[transparent] focus:ring-primary dark:focus:ring-primary dark:ring-offset-primary  dark:bg-[transparent] dark:border-[transparent]" />
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

            {show === 1 && props.token?.tradepair?.limit_trade === false &&
              <>
                <p className={`mt-[60px] info-16-18 text-center`}>
                  Limit orders are unavailable for {props?.slug} at the moment
                </p>
                <p className={`mt-[20px] info-16-18 text-center`}>
                  Please check back latter
                </p>
              </>

            }
            {((show === 1 && props.token?.tradepair?.limit_trade === true) || show === 2) &&
              <>
                <div className="mt-5 flex gap-[10px] items-center">
                  <Image src='/assets/market/walletpayment.svg' alt="wallet2" width={24} height={24} className="min-w-[24px]" />
                  {/* <Image src={`${selectedToken !== undefined && selectedToken?.image ? selectedToken?.image : '/assets/history/Coin.svg'}`} alt="wallet2" width={24} height={24} /> */}
                  <p className="md-text w-full">
                    {scientificToDecimal(truncateToNumber(price.toFixed(12), 8))}

                    &nbsp;{active1 === 1 ? 'USDT' : props?.token?.symbol}</p>

                  <Image src={`${selectedToken !== undefined && selectedToken?.image ? selectedToken?.image : '/assets/history/Coin.svg'}`} className={`min-w-[24px] ${selectedToken?.symbol === "XRP" && "bg-white rounded-full "}`} alt="wallet2" width={24} height={24} />
                  {router.pathname.includes("/chart") && <p className="md-text">
                    $
                    {props?.token !== undefined && props?.token?.price !== undefined
                      ? currencyFormatter(truncateNumber(props?.token?.price, 8))
                      : "0.00"}
                  </p>

                  }

                  {router.pathname.includes("/market") && props.coins && props.coins.map((item: any) => {
                    if (item.symbol === selectedToken?.symbol) {
                      return <p className="md-text">${selectedToken !== undefined && selectedToken?.price !== undefined ? currencyFormatter(truncateNumber(item?.price, 8)) : '0.00'}</p>
                    }
                  })}
                </div>

                {/* Price Inputs for limit order case */}
                {show === 1 &&
                  <>

                    <div className="mt-30 rounded-5 p-[10px] flex border items-center justify-between gap-[15px] border-grey-v-1 dark:border-opacity-[15%] relative">

                      <div className="">
                        <p className="sm-text dark:text-white">{active1 === 1 ? "Buy" : "Sell"} For ({secondCurrency})</p>
                        <input type="number" onWheel={(e) => (e.target as HTMLElement).blur()} placeholder="$0" step="0.000001" {...register('limit_usdt', {
                          onChange: (e) => {
                            {
                              const value = e.target.value;
                              const regex = /^\d{0,11}(\.\d{0,6})?$/;
                              if (regex.test(value) || value === "") {
                                convertTotalAmount();
                                checkInput(e, 'limit');
                              } else {
                                e.target.value = value.slice(0, -1);
                              }

                            }
                          }
                        })} name="limit_usdt" className="bg-[transparent] outline-none md-text px-[5px] mt-[10px] max-w-full w-full " />
                      </div>

                      <div className="relative">
                        <FilterSelectMenuWithCoin data={secondList} border={false} setCurrencyName={setCurrencyName} dropdown={2} value={secondCurrency} disabled={true} />
                      </div>
                    </div>
                    {errors.limit_usdt && <p className="errorMessage">{errors.limit_usdt.message}</p>}
                  </>
                }

                {/* coin quantity Inputs */}
                <div className="mt-40 rounded-5 p-[10px] flex border items-center justify-between gap-[15px] border-grey-v-1 dark:border-opacity-[15%] relative">
                  <div className="">
                    <p className="sm-text dark:text-white">Quantity</p>
                    <input type="number" onWheel={(e) => (e.target as HTMLElement).blur()} placeholder="0" step={0.000001} {...register('token_amount', {
                      onChange: (e) => {
                        {
                          const value = e.target.value;
                          const regex = /^\d{0,11}(\.\d{0,6})?$/;
                          if (regex.test(value) || value === "") {
                            convertTotalAmount();
                            checkInput(e, 'max');
                          } else {
                            e.target.value = value.slice(0, -1);
                          }
                        }
                      }
                    })} name="token_amount" className="bg-[transparent] max-w-full w-full outline-none md-text px-[5px] mt-[10px] md-text " />
                  </div>
                  <div>
                    {
                      router.pathname.includes('/chart') ?

                        <div className='flex  items-center gap-[5px] mr-[15px] pl-10 border-l border-[#D9D9D9] dark:border-[#ccced94d]'>
                          <Image src={`${props?.token?.image !== undefined ? props?.token?.image : '/assets/home/coinLogo.png'}`} alt="error" width={20} height={20} className={`${props?.token?.symbol === "XRP" && "bg-white rounded-full "}`} />
                          <p className={`sm-text rounded-[5px]  cursor-pointer !text-banner-text`}>{props?.token?.symbol}</p>
                        </div> :
                        <FilterSelectMenuWithCoin data={list} border={false} setCurrencyName={setCurrencyName} dropdown={1} />
                    }
                  </div>
                </div>
                {errors.token_amount && <p className="errorMessage">{errors?.token_amount?.message}</p>}

                <div className="mt-5 flex gap-1 justify-between">
                  <div className="flex gap-1">
                    <p data-testid="total" className="sm-text dark:text-white">Total:</p>
                    {/* <p className="sm-text dark:text-white">(+Fee 0.2)</p> */}
                    <p className="sm-text dark:text-white">{truncateNumber(totalAmount, 8) || '0.000000'}</p>
                  </div>


                </div>
                <div className="mt-5 flex gap-2 justify-between flex-wrap">

                  {/* <div className=" flex gap-1">
                  <p className="sm-text dark:text-white">Est. Fee:</p>
                  <p className="sm-text dark:text-white">{truncateNumber(estimateFee,6) || '0.00'}</p>

                </div> */}
                  <div className="flex gap-1">
                    <p className="sm-text dark:text-white">Min Trade:</p>
                    {/* <p className="sm-text dark:text-white">(+Fee 0.2)</p> */}
                    <p className="sm-text dark:text-white">{props.token?.tradepair?.min_trade} {props?.token?.symbol}</p>
                  </div>
                  <div className="flex gap-1">
                    <p className="sm-text dark:text-white">Max Trade:</p>
                    {/* <p className="sm-text dark:text-white">(+Fee 0.2)</p> */}
                    <p className="sm-text dark:text-white">{props.token?.tradepair?.maxTrade || '0.00'} {props?.token?.symbol}</p>
                  </div>
                </div>
              </>
            }
          </div>
          {((show === 1 && props.token?.tradepair?.limit_trade === true) || show === 2) &&
            <>
              {props?.session ?
                <button type="submit" className={`solid-button w-full ${disabled === true ? 'opacity-70 cursor-not-allowed' : ''}`} disabled={disabled} >{active1 === 1 ? `Buy ${selectedToken?.symbol !== undefined ? selectedToken?.symbol : ""}` : `Sell ${selectedToken?.symbol !== undefined ? selectedToken?.symbol : ""}`}</button>
                :
                <Link prefetch={false} href="/login" className="solid-button w-full block text-center">Login</Link>
              }
            </>
          }
        </form>
      </div>
      {
        active &&
        <ConfirmBuy setActive={setActive} setShow={setShow} price={props?.token?.price} active1={active1} secondCurrency={secondCurrency} selectedToken={selectedToken?.symbol} actionPerform={actionPerform} objData={objData} />
      }
      {
        authenticationPopup &&
        <WithdrawAuthenticationModelPopup setActive={setAuthenticationPopup} title="Verification Status" type="deposit" />
      }
    </>
  )
};

export default BuySellCard;
