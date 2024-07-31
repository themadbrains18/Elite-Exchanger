import React, { useEffect, useState } from "react";
import Image from "next/image";
import FilterSelectMenuWithCoin from "../snippets/filter-select-menu-with-coin";
import { toast } from 'react-toastify';
import { signOut, useSession } from 'next-auth/react'
import AES from 'crypto-js/aes';
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { currencyFormatter } from "../snippets/market/buySellCard";
import { useWebSocket } from "@/libs/WebSocketContext";
import { truncateNumber } from "@/libs/subdomain";

const schema = yup.object().shape({
  spend_amount: yup.number().positive('Quantity must be positive number ').required('Please enter quantity ').typeError('Please enter quantity '),
  // receive_amount: yup.number().positive().required('Please enter amount ').typeError('Please enter amount'),
  firstCurrency: yup.string().required('Please select spend quantity currency token '),
  secondCurrency: yup.string().required('Please select receive currency token'),
});

interface DynamicId {
  id: number;
  coinList?: any;
  assets?: any;
  refreshData?: any;
}

const Exchange = (props: DynamicId): any => {
  const [active1, setActive1] = useState(1);
  const [firstCurrency, setFirstCurrency] = useState('');
  const [secondCurrency, setSecondCurrency] = useState('');
  const [selectedToken, setSelectedToken] = useState(Object);
  const [selectedSecondToken, setSelectedSecondToken] = useState(Object);
  const [firstMannual, setFirstMannual] = useState(false);
  const [secondMannual, setSecondMannual] = useState(false);
  const [amount, setAmount] = useState(0);
  const [receiveAmount, setReceivedAmount] = useState(0);
  const [requestBody, setRequestBody] = useState(Object);
  const [btnDisabled, setBtnDisabled] = useState(false);
  const [btnDisabled2, setBtnDisabled2] = useState(false);
  const [currentTokenWalletBalance, setCurrentTokenWalletBalance] = useState(0.00)

  const [isConvert, setIsConvert] = useState(false);
  let { status, data: session } = useSession();
  let list = props?.coinList;
  let newCoinListWithBalance: any = [];
  const [imgSrc, setImgSrc] = useState(false);

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

  useEffect(() => {
    if (props?.coinList !== undefined && props?.assets !== undefined) {
      // for (const ls of props?.coinList) {
      //   ls.avail_bal = 0.00;
      //   for (const as of props?.assets) {
      //     if (as.token_id === ls.id && as.balance > 0 && as.walletTtype === "main_wallet") {
      //       ls.avail_bal = as.balance;
      //       newCoinListWithBalance.push(ls)
      //     }
      //   }
      // }
      setCurrencyName(firstCurrency, 1);
    }
  }, [props?.assets])

  useEffect(() => {
    setTimeout(() => {
      if (errors.spend_amount) {
        clearErrors('spend_amount')
      }

      if (errors.firstCurrency) {
        clearErrors('firstCurrency')
      }
      if (errors.secondCurrency) {
        clearErrors('secondCurrency');
      }
    }, 3000);
  }, [errors])

  const setCurrencyName = (symbol: string, dropdown: number) => {

    if (dropdown === 1) {
      setFirstCurrency(symbol);

      setValue('firstCurrency', symbol);
      let token = props?.coinList.filter((item: any) => {
        return item.symbol === symbol
      });

      setSelectedToken(token[0]);
      let asset = props.assets.filter((item: any) => {
        return item.token_id === token[0]?.id && item?.walletTtype === "main_wallet"
      })

      setCurrentTokenWalletBalance(asset[0]?.balance);
      if (token[0]?.tokenType === 'mannual') {
        setFirstMannual(true);
      }
      else {
        setFirstMannual(false);
      }
    }
    else {
      setSecondCurrency(symbol)
      setValue('secondCurrency', symbol);
      let token = props?.coinList.filter((item: any) => {
        return item.symbol === symbol
      });
      setSelectedSecondToken(token[0]);
      
      if (token[0]?.tokenType === 'mannual') {
        setSecondMannual(true);
      }
      else {
        setSecondMannual(false);
      }
    }
  }

  const onHandleSubmit = async (data: any) => {


    try {
      if (data?.firstCurrency === data?.secondCurrency) {
        setError("secondCurrency", {
          type: "custom",
          message: `Please select different recieve currency`,
        });
        return;
      }
      if (currentTokenWalletBalance < data.spend_amount) {
        setError("spend_amount", {
          type: "custom",
          message: `Insufficient balance`,
        });
        return;
      }

      if (selectedToken?.tradepair && selectedToken?.tradepair?.maxTrade < data.spend_amount) {
        setError("spend_amount", {
          type: "custom",
          message: `You can exchange maximum of ${selectedToken?.tradepair?.maxTrade} this amount`,
        });
        return;
      }


      setBtnDisabled(true);
      let conversionPrice = 0;
      let currentPrice = 0;
      let spendBalance = 0;
      let receivedBalance = 0;

      if (firstMannual === false || secondMannual === false) {
        let priceData = await fetch("https://api.livecoinwatch.com/coins/single", {
          method: "POST",
          headers: new Headers({
            "content-type": "application/json",
            "x-api-key": `${process.env.NEXT_PUBLIC_PRICE_SINGLE_ASSET_KEY}`,
          }),
          body: JSON.stringify({
            currency: secondCurrency === 'BTCB' ? 'BTC' : secondCurrency === 'BNBT' ? 'BNB' : secondCurrency,
            code: firstCurrency === 'BTCB' ? 'BTC' : firstCurrency === 'BNBT' ? 'BNB' : firstCurrency,
            meta: false
          }),
        });

        let priceData2 = await priceData.json();

        if (firstMannual === true && priceData2?.rate === undefined) {
          currentPrice = selectedToken?.price * priceData2?.rate;
          conversionPrice = data.spend_amount * currentPrice;
        }
        else if (secondMannual === true) {
          currentPrice = priceData2?.rate / selectedSecondToken?.price;
          conversionPrice = data.spend_amount * currentPrice;
        }
        else if (firstMannual === false && secondMannual === false) {
          currentPrice = priceData2?.rate;
          conversionPrice = data.spend_amount * priceData2?.rate;
        }
      }
      else {
        currentPrice = selectedToken?.price / selectedSecondToken?.price;
        conversionPrice = data.spend_amount * currentPrice;
      }

      setReceivedAmount(conversionPrice);
      setBtnDisabled(false)
      // return;

      // get current balance of user
      for (const as of props?.assets) {
        if (as.token_id === selectedToken.id && as.balance > 0 && as.walletTtype === "main_wallet") {
          spendBalance = as.balance - data.spend_amount;
        }
        else {
          if (as.token_id === selectedSecondToken.id && as.balance > 0 && as.walletTtype === "main_wallet") {
            receivedBalance = as.balance + conversionPrice;
          }
          else {
            if (receivedBalance === 0) {
              receivedBalance = conversionPrice;
            }
          }
        }
      }

      // user_convert_history form data
      let history = [];
      let spendObj = { token_id: selectedToken.id, type: 'Consumption', amount: amount, fee: 0, balance: spendBalance };
      let receivedObj = { token_id: selectedSecondToken.id, type: 'Gain', amount: truncateNumber(conversionPrice, 8), fee: 0, balance: receivedBalance?.toFixed(8) };

      history.push(spendObj);
      history.push(receivedObj);

      // user_convert form data
      let convertPayload = {
        converted: data.spend_amount + ` ${firstCurrency}`,
        received: conversionPrice?.toFixed(8) + ` ${secondCurrency}`,
        fees: 0,
        conversion_rate: `1 ${firstCurrency} = ${currentPrice?.toFixed(8)} ${secondCurrency}`,
        consumption_token_id: selectedToken?.id,
        gain_token_id: selectedSecondToken?.id,
        consumption_amount: data.spend_amount,
        gain_amount: parseFloat(conversionPrice?.toFixed(8))
      };
      setRequestBody({ convert: convertPayload, history: history });
      setIsConvert(true);
    } catch (error) {
      console.log(error);

    }
  }

  const sendConvertRequest = async () => {
    try {
      if (status === 'authenticated') {
        setBtnDisabled2(true);
        const ciphertext = AES.encrypt(JSON.stringify(requestBody), `${process.env.NEXT_PUBLIC_SECRET_PASSPHRASE}`).toString();
        let record = encodeURIComponent(ciphertext.toString());

        let responseData = await fetch(`${process.env.NEXT_PUBLIC_BASEURL}/price`, {
          method: "POST",
          mode: "cors",
          headers: {
            'Content-Type': 'application/json',
            "Authorization": session?.user?.access_token
          },
          body: JSON.stringify(record)
        })

        let res = await responseData.json();

        if (res.data.status === 200) {
          setBtnDisabled2(false);
          setAmount(0);
          setReceivedAmount(0);
          setFirstCurrency('')
          setSecondCurrency('')
          setIsConvert(false);
          reset()
          if (wbsocket) {
            let withdraw = {
              ws_type: 'convert',
            }
            wbsocket.send(JSON.stringify(withdraw));
          }
          toast.success('Your coin conversion request has been sent successfully!!.', {
            position: 'top-center'
          });
        }
        else {
          setAmount(0);
          setBtnDisabled2(false);
          toast.error(res.data.data, {
            position: 'top-center'
          });
          setFirstCurrency('')
          setSecondCurrency('')
          setIsConvert(false)
          setReceivedAmount(0);
        }
      }

      else {
        
        setBtnDisabled2(false);
        toast.error('Your session is expired!!. You are auto redirect to login page!!');
        setTimeout(() => {
          signOut();
        }, 3000);
      }

    } catch (error) {
      setBtnDisabled2(false);
      console.log("error in sent convert request", error);

    }
  }

  return (
    <>
      <div className="p-20 md:p-40 rounded-10 bg-white dark:bg-d-bg-primary">
        <div className="flex border-b border-grey-v-1">
          <button className={`sec-text text-center text-gamma  max-w-[100%] w-full relative  after:block after:top-full after:mx-[auto] after:mt-[25px] after:h-[3px] after:w-[0%] after:bg-primary after:transition-all after:ease-linear after:duration-500 ${active1 === 1 && "text-primary border-primary after:w-[100%] after:bottom"}`} onClick={() => setActive1(1)}>
            Convert Coin
          </button>
        </div>

        <div className="flex gap-[10px] py-5">
          <Image src="/assets/market/walletpayment.svg" alt="wallet2" width={24} height={24} />
          <p className="md-text w-full">${currencyFormatter(truncateNumber(currentTokenWalletBalance, 6)) || 0.00}</p>
          <Image src={`${imgSrc?'/assets/history/Coin.svg':selectedToken !== undefined && selectedToken?.image ? selectedToken?.image : '/assets/history/Coin.svg'}`} alt="wallet2" width={24} height={24} className={`${selectedToken?.symbol ==="XRP"&&"bg-white rounded-full"} max-w-[24px] w-full`} onError={() => setImgSrc(true)}/>
          {props.coinList && props.coinList?.map((item: any) => {
            if (item.symbol === selectedToken?.symbol) {
              return <p className="md-text">${(selectedToken !== undefined && selectedToken?.price !== undefined) ? currencyFormatter(item?.price?.toFixed(5)) : '0.00'}</p>
            }

          })}
        </div>

        <form onSubmit={handleSubmit(onHandleSubmit)} onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
              }
            }}>
          <div className="mt-20 rounded-5 p-[10px] justify-between flex border items-center border-grey-v-1 dark:border-opacity-[15%] relative">
            <div className="max-w-[calc(100%-100px)] w-full">
              <p className="sm-text dark:text-white">Quantity</p>
              <input type="number" onWheel={(e) => (e.target as HTMLElement).blur()}   placeholder="$0" step={0.000001} readOnly={isConvert} {...register('spend_amount')} name="spend_amount" onChange={(e: any) => {
                // setAmount(parseFloat(e.target?.value));
                const value = e.target.value;
                const regex = /^\d{0,11}(\.\d{0,6})?$/;
                if (regex.test(value) || value === "") {

                  if (/^\d*\.?\d{0,6}$/.test(value)) {
                    setAmount(value);
                  }
                }else{
                  e.target.value = value.slice(0, -1);
                }
                


              }} className="bg-[transparent] outline-none md-text border-l px-[5px] mt-[10px] border-h-primary" />
            </div>
            <div>
              <FilterSelectMenuWithCoin data={props?.coinList} {...register('firstCurrency')} border={false} dropdown={1} setCurrencyName={setCurrencyName} value={firstCurrency} />
            </div>
          </div>
          <div className="flex gap-[1px]">
            {(errors?.spend_amount && errors?.firstCurrency) ? (
              <p className="errorMessage whitespace-nowrap mt-10">Please enter quantity and select token from quantity</p>
            )
              :
              errors?.spend_amount ? (
                <p className="errorMessage whitespace-nowrap mt-10">{errors?.spend_amount?.message}</p>
              )
                :
                errors?.firstCurrency && (
                  <p className="errorMessage inline-block mt-10">{errors?.firstCurrency?.message}</p>
                )
            }

          </div>
          <div className="py-[10px]">
            <Image src="/assets/market/exchange.svg" width={30} height={30} alt="exchange" className=" mx-auto" />
          </div>

          <div className=" rounded-5 p-[10px] justify-between flex border items-center border-grey-v-1 dark:border-opacity-[15%] relative">
            <div className="max-w-[calc(100%-100px)] w-full">
              <p className="sm-text dark:text-white">Buy For </p>
              <input type="number" onWheel={(e) => (e.target as HTMLElement).blur()} value={receiveAmount > 0 ? truncateNumber(receiveAmount,6) : ''} readOnly placeholder="$0" className="bg-[transparent] md-text outline-none border-l px-[5px] mt-[10px] border-h-primary" />
            </div>
            <div>
              <FilterSelectMenuWithCoin data={list} border={false} {...register('secondCurrency')} dropdown={2} setCurrencyName={setCurrencyName} value={secondCurrency} />
            </div>
          </div>
          {errors?.secondCurrency && (
            <p className="errorMessage mt-10">{errors?.secondCurrency?.message}</p>
          )}

          <div className="mt-5 mb-5">
            <p className="sm-text dark:text-white">No conversion fees</p>
          </div>

          {isConvert === false ? <button type="submit" className={` solid-button w-full ${btnDisabled === true ? 'cursor-not-allowed ' : ''}`} disabled={btnDisabled}>{btnDisabled &&
            <svg aria-hidden="true" role="status" className="inline w-4 h-4 me-3 text-white animate-spin" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="#E5E7EB" />
              <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentColor" />
            </svg>
          }Preview</button>
            :
            <div className="flex gap-[18px]">
              <button type="button" className="solid-button w-full bg-grey-v-2 !text-primary hover:!text-white" onClick={() => { setIsConvert(false); reset(); setSelectedToken({}); setSelectedSecondToken({}); setAmount(0); setReceivedAmount(0); setFirstCurrency(''); setSecondCurrency('') }}>Cancel</button>

              <button type="button" className=" solid-button w-full" disabled={btnDisabled2} onClick={() => sendConvertRequest()}>{btnDisabled2 &&
                <svg aria-hidden="true" role="status" className="inline w-4 h-4 me-3 text-white animate-spin" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="#E5E7EB" />
                  <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentColor" />
                </svg>
              }Convert</button>
            </div>
          }
        </form>

      </div>
    </>
  );
};

export default Exchange;
