import React, { useEffect, useState } from "react";
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

import Pusher from 'pusher-js';
import { useWebSocket } from "@/libs/WebSocketContext";
import { currencyFormatter } from "./market/buySellCard";

const pusher = new Pusher('b275b2f9e51725c09934', {
  cluster: 'ap2'
});

const schema = yup.object().shape({
  token_amount: yup.number().positive().required('Please enter quantity').typeError('Please enter quantity'),
  limit_usdt: yup.number().positive().required('Please enter limit amount').typeError('Please enter limit amount'),
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

  useEffect(() => {
    if (props.slug) {
      setCurrencyName(props.slug, 1);
      setPriceOnChangeType(spotType, '');
    }
    Socket();
    convertTotalAmount();
    let radioCta = document.querySelector(".custom-radio") as HTMLInputElement | null;
    let prevSibling: ChildNode | null | undefined = radioCta?.previousSibling;
    if (prevSibling instanceof HTMLElement) {
      prevSibling.click();
    }
  }, [userAssets])


  // useEffect(() => {
  //   convertTotalAmount();
  // }, [props.token]);

  const Socket = () => {
    if (wbsocket) {
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

  const setCurrencyName = (symbol: string, dropdown: number) => {
    if (dropdown === 1) {
      setFirstCurrency(symbol);

      let token = list.filter((item: any) => {
        return item.symbol === symbol && item?.tradepair !== null
      });

      if (token.length > 0) {
        setSelectedToken(token[0]);
        setPriceOnChangeType(active1 === 1 ? 'buy' : 'sell', symbol);
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

  const setPriceOnChangeType = (type: string, symbol: string) => {

    setPrice(0.00);
    let token = list.filter((item: any) => {
      return item.symbol === (type === 'buy' ? 'USDT' : symbol === '' ? firstCurrency : symbol)
    });

    if (token.length > 0) {
      // get assets balance
      let selectAssets = userAssets.filter((item: any) => {
        return item.token_id === token[0].id && item?.walletTtype === "main_wallet"
      });

      if (selectAssets.length > 0) {
        setPrice(selectAssets[0].balance);
      }
    }
  }

  const onHandleSubmit = async (data: any) => {
    let type = document.querySelector('input[name="market_type"]:checked') as HTMLInputElement | null;
    if (active1 === 1 && totalAmount > price) {
      toast.error('Insufficiant balance');
      return;
    }
    else if (active1 === 2 && data.token_amount > price) {
      toast.error('Insufficiant balance');
      return;
    }

    if (props.token?.tradepair?.maxTrade < data.token_amount) {
      setError("token_amount", {
        type: "custom",
        message: "you can trade less than max amount " + props.token?.tradepair?.maxTrade,
      });
      return;
    }

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
  const actionPerform = async () => {
    try {
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
        toast.success(reponse.data?.data?.message);
        setFirstCurrency('BTCB');
        setSecondCurrency('USDT');
        setActive(false);
        reset({
          limit_usdt: props?.token?.price.toFixed(5),
          token_amount: 0.00,
        })
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
        setTimeout(async () => {
          let partialObj = {
            "user_id": props.session.user.user_id,
            "token_id": selectedToken?.id,
            "order_type": active1 === 1 ? 'buy' : 'sell',
            "market_type": show === 1? 'limit' : 'market'
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

          
          
        }, 2000);


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

      let totalAmount = qty * amount;
      let fee: any = active1 === 1 ? (qty * 0.00075).toFixed(6) : (amount * qty * 0.00075).toFixed(6);

      setEstimateFee(fee);
      setTotalAmount(totalAmount);
    }
    else {
      let qty: any = getValues('token_amount');
      let totalAmount = qty * props?.token?.price;
      let fee: any = active1 === 1 ? (qty * 0.00075).toFixed(6) : (props?.token?.price * qty * 0.00075).toFixed(6);

      setEstimateFee(fee);
      setTotalAmount(totalAmount);
    }
  }

  const getAssets = async () => {
    try {
      /**
      * Get user assets data after order create
      */
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
            if (show === 2) {
              setValue('limit_usdt', props?.token?.price.toFixed(6))
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
            setTotalAmount(0.0); setEstimateFee(0.00);
            if (show === 2) {
              setValue('limit_usdt', props?.token?.price.toFixed(6))
            }
          }}>
            Sell
          </button>
        </div>
        <form onSubmit={handleSubmit(onHandleSubmit)}>
          <div className="py-20">
            <div className="flex lg:gap-30 gap-10">
              <div className={`flex  gap-5 justify-center items-center  w-full cursor-pointer border rounded-5 border-grey-v-1 dark:border-opacity-[15%] bg-[transparent] ${show === 1 && 'bg-primary-100 dark:bg-black-v-1 border-primary'}`} onClick={() => {
                setShow(1); reset({
                  limit_usdt: 0.00,
                  token_amount: 0.00,
                })
                setTotalAmount(0.0); setEstimateFee(0.00)
              }}>
                <input id={`custom-radio${props.id}`} data-testid="market_type" type="radio" value="limit" name="market_type" className="hidden w-5 h-5 max-w-full  bg-red-400 border-[transparent] focus:ring-primary dark:focus:ring-primary dark:ring-offset-primary  dark:bg-[transparent] dark:border-[transparent]" />
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
                setValue('limit_usdt', props?.token?.price)
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
                <div className="mt-5 flex gap-[18px] items-center">
                  <Image src='/assets/market/walletpayment.svg' alt="wallet2" width={24} height={24} className="min-w-[24px]" />
                  {/* <Image src={`${selectedToken !== undefined && selectedToken?.image ? selectedToken?.image : '/assets/history/Coin.svg'}`} alt="wallet2" width={24} height={24} /> */}
                  <p className="md-text w-full">{currencyFormatter(Number(price.toFixed(6)))}({active1 === 1 ? 'USDT' : firstCurrency})</p>

                  <Image src={`${selectedToken !== undefined && selectedToken?.image ? selectedToken?.image : '/assets/history/Coin.svg'}`} className="min-w-[24px]" alt="wallet2" width={24} height={24} />
                  {router.pathname.includes("/chart") && <p className="md-text">
                    $
                    {props?.token !== undefined && props?.token?.price !== undefined
                      ? currencyFormatter(props?.token?.price?.toFixed(6))
                      : "0.00"}
                  </p>

                  }

                  {router.pathname.includes("/market") && props.coins && props.coins.map((item: any) => {
                    if (item.symbol === selectedToken?.symbol) {
                      return <p className="md-text">${selectedToken !== undefined && selectedToken?.price !== undefined ? currencyFormatter(item?.price?.toFixed(6)) : '0.00'}</p>
                    }
                  })}
                </div>

                {/* Price Inputs for limit order case */}
                {show === 1 &&
                  <div className="mt-30 rounded-5 p-[10px] flex border items-center justify-between gap-[15px] border-grey-v-1 dark:border-opacity-[15%] relative">

                    <div className="">
                      <p className="sm-text dark:text-white">{active1 === 1 ? "Buy" : "Sell"} For ({secondCurrency})</p>
                      <input type="number" placeholder="$0" step="0.000000" {...register('limit_usdt', {
                        onChange: (e) => { { convertTotalAmount(); checkInput(e, 'limit') } }
                      })} name="limit_usdt" className="bg-[transparent] outline-none md-text px-[5px] mt-[10px] max-w-full w-full " />
                    </div>

                    <div className="relative">
                      <FilterSelectMenuWithCoin data={secondList} border={false} setCurrencyName={setCurrencyName} dropdown={2} value={secondCurrency} />
                    </div>
                  </div>
                }
                {errors.limit_usdt && <p style={{ color: 'red' }}>{errors.limit_usdt.message}</p>}

                {/* coin quantity Inputs */}
                <div className="mt-40 rounded-5 p-[10px] flex border items-center justify-between gap-[15px] border-grey-v-1 dark:border-opacity-[15%] relative">
                  <div className="">
                    <p className="sm-text dark:text-white">Quantity({firstCurrency})</p>
                    <input type="number" placeholder="0" step={0.000001} {...register('token_amount', {
                      onChange: (e) => { { convertTotalAmount(); checkInput(e, 'max') } }
                    })} name="token_amount" className="bg-[transparent] max-w-full w-full outline-none md-text px-[5px] mt-[10px] md-text " />
                  </div>
                  <div>
                    {
                      router.pathname.includes('/chart') ?

                        <div className='flex  items-center gap-[5px] rounded-[5px] mr-[15px] pl-10 border-l border-[#D9D9D9] dark:border-[#ccced94d]'>
                          <Image src={`${props?.token?.image !== undefined ? props?.token?.image : '/assets/home/coinLogo.png'}`} alt="error" width={20} height={20} />
                          <p className={`sm-text rounded-[5px]  cursor-pointer !text-banner-text`}>{props?.token?.fullName}</p>
                        </div> :
                        <FilterSelectMenuWithCoin data={list} border={false} setCurrencyName={setCurrencyName} dropdown={1} />
                    }
                  </div>
                </div>
                {errors.token_amount && <p style={{ color: 'red' }}>{errors?.token_amount?.message}</p>}

                <div className="mt-5 flex gap-2 justify-between">
                  <div className="flex gap-2">
                    <p data-testid="total" className="sm-text dark:text-white">Total:</p>
                    {/* <p className="sm-text dark:text-white">(+Fee 0.2)</p> */}
                    <p className="sm-text dark:text-white">{totalAmount.toFixed(6)}</p>
                  </div>
                  <div className="flex gap-2">
                    <p className="sm-text dark:text-white">Max Trade:</p>
                    {/* <p className="sm-text dark:text-white">(+Fee 0.2)</p> */}
                    <p className="sm-text dark:text-white">{props.token?.tradepair?.maxTrade}</p>
                  </div>

                </div>
                <div className="mt-5 flex gap-2">
                  <p className="sm-text dark:text-white">Est. Fee:</p>
                  <p className="sm-text dark:text-white">{estimateFee}</p>

                </div>
              </>
            }
          </div>
          {((show === 1 && props.token?.tradepair?.limit_trade === true) || show === 2) &&
            <>
              {props?.session ?
                <button type="submit" className=" solid-button w-full" >{active1 === 1 ? `Buy ${selectedToken?.symbol !== undefined ? selectedToken?.symbol : ""}` : `Sell ${selectedToken?.symbol !== undefined ? selectedToken?.symbol : ""}`}</button>
                :
                <Link href="/login" className="solid-button w-full block text-center">Login</Link>
              }
            </>
          }
        </form>
      </div>
      {
        active &&
        <ConfirmBuy setActive={setActive} setShow={setShow} price={props?.token?.price} active1={active1} secondCurrency={secondCurrency} selectedToken={selectedToken?.symbol} actionPerform={actionPerform} objData={objData} />
      }
    </>
  )
};

export default BuySellCard;
