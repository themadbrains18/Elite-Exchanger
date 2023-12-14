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

const schema = yup.object().shape({
  token_amount: yup.number().positive().required('Please enter quantity').typeError('Please enter quantity').default(0),
  limit_usdt: yup.number().positive().required('Please enter limit amount').typeError('Please enter limit amount').default(0),
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
  const [firstCurrency, setFirstCurrency] = useState('');
  const [secondCurrency, setSecondCurrency] = useState('');
  const [totalAmount, setTotalAmount] = useState(0.0);
  const [selectedToken, setSelectedToken] = useState(Object);
  const [price, setPrice] = useState(0.00);
  const [userAssets, setUserAssets] = useState(props.assets);
  const [show, setShow] = useState(1);

  const router = useRouter()

  const list = props.coins;

  let secondList = props.coins?.filter((item: any) => {
    return item.symbol === 'USDT'
  })

  let { register, setValue, getValues, handleSubmit, watch, reset, setError, formState: { errors } } = useForm({
    resolver: yupResolver(schema),
  });

  useEffect(() => {
    if (props.slug) {
      setCurrencyName(props.slug, 1);
    }
  }, [props.slug, userAssets])

  useEffect(() => {
    const websocket = new WebSocket('ws://localhost:3001/');

    websocket.onopen = () => {
      console.log('connected');
    }

    websocket.onmessage = (event) => {
      const data = JSON.parse(event.data).data;
      let eventDataType = JSON.parse(event.data).type;

      if (eventDataType === "market") {
        if (props.session) {
          getAssets();
        }
      }
    }
  }, []);

  const setCurrencyName = (symbol: string, dropdown: number) => {
    if (dropdown === 1) {
      setFirstCurrency(symbol);
      let token = list.filter((item: any) => {
        return item.symbol === symbol
      });

      setSelectedToken(token[0]);

      if (userAssets.message !== undefined) {
        signOut();
        return;
      }
      // get assets balance
      let selectAssets = userAssets.filter((item: any) => {
        return item.token_id === token[0].id
      });
      if (selectAssets.length > 0) {
        setPrice(selectAssets[0].balance);
      }
      else {
        setPrice(0.00);
      }
    }
    else {
      setSecondCurrency(symbol)
    }
  }

  const onHandleSubmit = async (data: any) => {

    let type = document.querySelector('input[name="market_type"]:checked') as HTMLInputElement | null;

    let obj = {
      "user_id": props.session.user.user_id,
      "token_id": selectedToken?.id,
      "market_type": type?.value,
      "order_type": active1 === 1 ? 'buy' : 'sell',
      "limit_usdt": data.limit_usdt,
      "volume_usdt": totalAmount,
      "token_amount": data.token_amount,
      "status": false,
      "isCanceled": false,
      "queue": false
    }

    const ciphertext = AES.encrypt(JSON.stringify(obj), `${process.env.NEXT_PUBLIC_SECRET_PASSPHRASE}`);
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
      setFirstCurrency('BLC');
      setSecondCurrency('USDT');

      const websocket = new WebSocket('ws://localhost:3001/');
      let withdraw = {
        ws_type: 'market',
      }
      websocket.onopen = () => {
        websocket.send(JSON.stringify(withdraw));
      }

      /**
       * After order create here is partial execution request send to auto execute
       */
      let partialObj = {
        "user_id": props.session.user.user_id,
        "token_id": selectedToken?.id,
        "order_type": active1 === 1 ? 'buy' : 'sell',
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
        const websocket = new WebSocket('ws://localhost:3001/');
        let withdraw = {
          ws_type: 'market',
        }
        websocket.onopen = () => {
          websocket.send(JSON.stringify(withdraw));
        }
      }


      reset({
        limit_usdt: 0.00,
        token_amount: 0.00,
      })
      setTotalAmount(0.0)

    }
    else {
      toast.error(reponse.data?.data);
    }
  }

  const convertTotalAmount = () => {
    if (getValues('token_amount').toString() === '') {
      setTotalAmount(0.00);
      return;
    }
    let type = document.querySelector('input[name="market_type"]:checked') as HTMLInputElement | null;

    if (type?.value === 'limit') {
      if (getValues('limit_usdt').toString() === '') {
        setTotalAmount(0.00);
        return;
      }
      let qty: any = getValues('token_amount');
      let amount: any = getValues('limit_usdt');

      let totalAmount = qty * amount;
      setTotalAmount(totalAmount);
    }
    else {

    }
  }

  const getAssets = async () => {
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
  }

  useEffect(() => {
    let radioCta = document.querySelector(".custom-radio") as HTMLInputElement | null;
    let prevSibling: ChildNode | null | undefined = radioCta?.previousSibling;
    if (prevSibling instanceof HTMLElement) {
      prevSibling.click();
    }

  }, []);


  return (
    <div className="p-20 md:p-20 rounded-10  bg-white dark:bg-d-bg-primary">
      <div className="flex border-b border-grey-v-1">
        <button className={`sec-text text-center text-gamma border-b-2 border-[transparent] pb-[25px] max-w-[50%] w-full ${active1 === 1 && "!text-primary border-primary"}`} onClick={() => setActive1(1)}>
          Buy
        </button>
        <button className={`sec-text text-center text-gamma border-b-2 border-[transparent] pb-[25px] max-w-[50%] w-full ${active1 === 2 && "!text-primary border-primary"}`} onClick={() => setActive1(2)}>
          Sell
        </button>
      </div>
      <form onSubmit={handleSubmit(onHandleSubmit)}>
        <div className="py-20">
          <div className="flex lg:gap-30 gap-10">
            <div className={`flex  gap-5 justify-center items-center  w-full cursor-pointer border rounded-5 border-grey-v-1 dark:border-opacity-[15%] bg-[transparent] ${show === 1 && 'bg-primary-100 dark:bg-black-v-1 border-primary'}`} onClick={() => { setShow(1) }}>
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
            <div className={`flex gap-5  justify-center items-center   w-full cursor-pointer border rounded-5 border-grey-v-1 dark:border-opacity-[15%] bg-[transparent] ${show === 2 && 'bg-primary-100 dark:bg-black-v-1 border-primary'}`} onClick={() => { setShow(2) }}>
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

          <div className="mt-5 flex gap-[18px] items-center">
            <Image src='/assets/market/walletpayment.svg' alt="wallet2" width={24} height={24} className="min-w-[24px]" />
            {/* <Image src={`${selectedToken !== undefined && selectedToken?.image ? selectedToken?.image : '/assets/history/Coin.svg'}`} alt="wallet2" width={24} height={24} /> */}
            <p className="md-text w-full">{price}({firstCurrency})</p>
            <Image src={`${selectedToken !== undefined && selectedToken?.image ? selectedToken?.image : '/assets/history/Coin.svg'}`} className="min-w-[24px]" alt="wallet2" width={24} height={24} />
            {router.pathname.includes("/chart") && <p className="md-text">
              $
              {props?.token !== undefined && props?.token?.price !== undefined
                ? props?.token?.price?.toFixed(5)
                : "0.00"}
            </p>
              // <p className="md-text">
              //   $
              //   {selectedToken !== undefined && selectedToken?.price !== undefined
              //     ? selectedToken?.price?.toFixed(5)
              //     : "0.00"}
              // </p>

            }

            {router.pathname.includes("/market") && props.coins && props.coins.map((item: any) => {
              if (item.symbol === selectedToken?.symbol) {
                return <p className="md-text">${selectedToken !== undefined && selectedToken?.price !== undefined ? item?.price?.toFixed(5) : '0.00'}</p>
              }
            })}
          </div>

          {/* First Currency Inputs */}
          <div className="mt-40 rounded-5 p-[10px] flex border items-center justify-between gap-[15px] border-grey-v-1 dark:border-opacity-[15%] relative">

            <div className="">
              <p className="sm-text dark:text-white">Quantity({firstCurrency})</p>
              <input type="number" placeholder="$0" step="any" {...register('token_amount', {
                onChange: () => { convertTotalAmount() }
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

          {/* Second Currency Inputs */}
          <div className="mt-30 rounded-5 p-[10px] flex border items-center justify-between gap-[15px] border-grey-v-1 dark:border-opacity-[15%] relative">

            <div className="">
              <p className="sm-text dark:text-white">{active1 === 1 ? "Buy" : "Sell"} For ({secondCurrency})</p>
              <input type="number" placeholder="$0" step="any" {...register('limit_usdt', {
                onChange: () => { convertTotalAmount() }
              })} name="limit_usdt" className="bg-[transparent] outline-none md-text px-[5px] mt-[10px] max-w-full w-full " />
            </div>

            <div className="relative">
              <FilterSelectMenuWithCoin data={secondList} border={false} setCurrencyName={setCurrencyName} dropdown={2} />
            </div>
          </div>
          {errors.limit_usdt && <p style={{ color: 'red' }}>{errors.limit_usdt.message}</p>}

          <div className="mt-5 flex gap-2">
            <p className="sm-text dark:text-white">Total:</p>
            {/* <p className="sm-text dark:text-white">(+Fee 0.2)</p> */}
            <p className="sm-text dark:text-white">{totalAmount}</p>

          </div>
        </div>
        {props?.session ?
          <button type="submit" className=" solid-button w-full">{active1 === 1 ? `Buy ${selectedToken?.symbol !== undefined ? selectedToken?.symbol : ""}` : `Sell ${selectedToken?.symbol !== undefined ? selectedToken?.symbol : ""}`}</button>
          :
          <Link href="/login" className="solid-button w-full block text-center">Login</Link>
        }

      </form>
    </div>
  )
};

export default BuySellCard;
