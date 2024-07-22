import FilterSelectMenuWithCoin from "@/components/snippets/filter-select-menu-with-coin";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect, useRef, useState } from "react";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import FiliterSelectMenu from "@/components/snippets/filter-select-menu";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AES from 'crypto-js/aes';
import { useSession } from "next-auth/react";
import { useWebSocket } from "@/libs/WebSocketContext";
import { currencyFormatter } from "@/components/snippets/market/buySellCard";
import AuthenticationModelPopup from "@/components/snippets/authenticationPopup";
import { truncateNumber } from "@/libs/subdomain";

const schema = yup.object().shape({
  spend_amount: yup.number().positive("Spend amount must be greater than '0'.").required('This field must be required.').typeError('This field must be required.'),
  receive_amount: yup.number().positive("Recieve amount must be greater than '0'.").required('This field must be required.').typeError('This field must be required.'),
  p_method: yup.string().required('Please select payment method.').typeError('Please select payment method.')
});


interface propsData {
  coins: any;
  session: any;
  posts?: any;
  masterPayMethod?: any;
  assets: any
}

const BuySellExpress = (props: propsData) => {
  const [active1, setActive1] = useState(1);
  const [selectedToken, setSelectedToken] = useState(Object);
  const [selectedSecondToken, setSelectedSecondToken] = useState(Object);
  const [firstCurrency, setFirstCurrency] = useState("INR");
  const [secondCurrency, setSecondCurrency] = useState("USDT");
  const [list1, setList1] = useState<any>([{ 'symbol': 'INR', 'image': 'https://lcw.nyc3.cdn.digitaloceanspaces.com/production/currencies/32/inr.png' }]);
  const [list2, setList2] = useState(props?.coins);
  const [firstMannual, setFirstMannual] = useState(false);
  const [secondMannual, setSecondMannual] = useState(false);
  const [receiveAmount, setReceivedAmount] = useState<number>();
  const [amount, setAmount] = useState<number>();
  const [usdtToInr, setUsdtToInr] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState('');
  const [finalPost, setFinalPost] = useState(Object);
  const [filterAsset, setFilterAsset] = useState(Object);
  const [changeSymbol, setChangeSymbol] = useState(false);
  const { status, data: session } = useSession();
  const [show, setShow] = useState(false);
  const [active, setActive] = useState(false);
  const route = useRouter();
  const [loader, setLoader] = useState(false)
  const router = useRouter();
  const wbsocket = useWebSocket();
  const hasRun = useRef(false);


  useEffect(() => {
    if (active1) {
      reset()
      setSecondCurrency("USDT");
    }
  }, [active1]);

  useEffect(() => {
    if (!hasRun.current) {
      getFilterAsset('');
      setCurrencyName('USDT', 2);
      hasRun.current = true;
    }
  }, [])


  console.log(paymentMethod,"=paymentMethod");
  

  useEffect(()=>{
    console.log("inside heree");
    
    filterSellerAds(paymentMethod, selectedSecondToken);

  },[amount])

  let {
    register,
    setValue,
    handleSubmit,
    setError,
    getValues,
    clearErrors,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema)
  });

  /**
   * Get initial usdt tot inr price
   */
  const getUsdtToInrPrice = async (asset: string) => {
    // let priceData = await fetch(`${process.env.NEXT_PUBLIC_BASEURL}/price?fsym=USDT&tsyms=INR`, {
    //   method: "GET"
    // }).then(response => response.json());
    setLoader(true)

    try {
      let responseData = await fetch("https://api.livecoinwatch.com/coins/single", {
        method: "POST",
        headers: new Headers({
          "content-type": "application/json",
          "x-api-key": `${process.env.NEXT_PUBLIC_PRICE_SINGLE_ASSET_KEY}`,
        }),
        body: JSON.stringify({
          currency: "INR",
          code: asset,
          meta: false
        }),
      });

      let data = await responseData?.json();

      setUsdtToInr(truncateNumber(data?.rate, 6));
      setLoader(false)

      return data;
    } catch (error: any) {
      console.log(error?.message);
      setLoader(false)
    }

  }

  /**
   * On token change
   * @param symbol 
   * @param dropdown 
   * @returns 
   */
  const setCurrencyName = async (symbol: string, dropdown: number) => {
    //================
    //Buy case
    //================

    clearErrors("spend_amount")
    clearErrors("receive_amount")

    reset()
    if (active1 === 1) {
      if (dropdown === 1) {
        setFirstCurrency(symbol);
        let token = list1?.filter((item: any) => {
          return item.symbol === symbol;
        });

        setSelectedToken(token[0]);
        if (token[0]?.tokenType === 'mannual') {
          setFirstMannual(true);
        }
        else {
          setFirstMannual(false);
        }
        return;
      }
      else {
        let token = list2?.filter((item: any) => {
          return item.symbol === symbol
        });
        setSelectedSecondToken(token[0]);
        setSecondCurrency(symbol);
        if (token[0]?.tokenType === 'mannual') {
          setSecondMannual(true);
        }
        else {
          setSecondMannual(false);
        }
      }
      let token = list2?.filter((item: any) => {
        return item.symbol === symbol
      });

      filterSellerAds(paymentMethod, token[0]);

      let conversionPrice = 0;
      let currentPrice = 0;
      setChangeSymbol(true);
      if (token[0]?.tokenType !== 'mannual') {
        // let priceData = await fetch(`${process.env.NEXT_PUBLIC_BASEURL}/price?fsym=${symbol}&tsyms=INR`, {
        //   method: "GET"
        // }).then(response => response.json());

        let asset = symbol === 'BTCB' ? 'BTC' : symbol === 'BNBT' ? 'BNB' : symbol
        // await getUsdtToInrPrice(asset);
        setChangeSymbol(false);

      }
      else {
        // let priceData = await fetch(`${process.env.NEXT_PUBLIC_BASEURL}/price?fsym=USDT&tsyms=INR`, {
        //   method: "GET"
        // }).then(response => response.json());

        let asset = symbol === 'BTCB' ? 'BTC' : symbol === 'BNBT' ? 'BNB' : symbol
        let data = await getUsdtToInrPrice(asset);

        let token = list2.filter((item: any) => {
          return item.symbol === symbol
        });
        currentPrice = (token[0]?.price * data?.rate);
        setUsdtToInr(currentPrice);
        setChangeSymbol(false);
      }
    }
    //================
    //Sell case
    //================
    else {
      if (dropdown === 2) {

        setFirstCurrency(symbol);
        let token = list1.filter((item: any) => {
          return item.symbol === symbol;
        });

        setSelectedToken(token[0]);
        if (token[0]?.tokenType === 'mannual') {
          setFirstMannual(true);
        }
        else {
          setFirstMannual(false);
        }
        return;
      }
      else {
        let token = list2.filter((item: any) => {
          return item.symbol === symbol
        });

        setSelectedSecondToken(token[0]);
        setSecondCurrency(symbol);
        getFilterAsset(token[0]?.id);
        if (token[0]?.tokenType === 'mannual') {
          setSecondMannual(true);
        }
        else {
          setSecondMannual(false);
        }
      }
      let token = list2.filter((item: any) => {
        return item.symbol === symbol
      });

      let conversionPrice = 0;
      let currentPrice = 0;
      setChangeSymbol(true);
      if (token[0]?.tokenType !== 'mannual') {
        // let priceData = await fetch(`${process.env.NEXT_PUBLIC_BASEURL}/price?fsym=${symbol}&tsyms=INR`, {
        //   method: "GET"
        // }).then(response => response.json());

        let asset = symbol === 'BTCB' ? 'BTC' : symbol === 'BNBT' ? 'BNB' : symbol
        let data = await getUsdtToInrPrice(asset);

        console.log(amount, "=amount", getValues('spend_amount'));

        if (amount !== undefined) {
          let spend_amount: any = getValues('spend_amount') * data?.rate
          setReceivedAmount(spend_amount)
          setValue('receive_amount', truncateNumber(spend_amount, 6));
        }
        else {
          setReceivedAmount(0.00)
          setValue('receive_amount', 0.00);
        }

        setChangeSymbol(false);

      }
      else {
        // let priceData = await fetch(`${process.env.NEXT_PUBLIC_BASEURL}/price?fsym=USDT&tsyms=INR`, {
        //   method: "GET"
        // }).then(response => response.json());

        let asset = "USDT";
        let data = await getUsdtToInrPrice(asset);
        let token = list2.filter((item: any) => {
          return item.symbol === symbol
        });
        currentPrice = token[0]?.price * data?.rate;
        setUsdtToInr(currentPrice);
        console.log(currentPrice, "==current");

        // if (amount !== undefined) {
        //   let spend_amount: any = amount * data?.rate
        //   setReceivedAmount(amount * data?.rate)
        //   setValue('spend_amount', spend_amount.toFixed(6));
        // }
        // else {
        //   setReceivedAmount(0.00)
        //   setValue('spend_amount', 0.00);
        // }
        setChangeSymbol(false);
      }
    }

    setAmount(0);
    setReceivedAmount(0);
    setPaymentMethod('');
    setValue('p_method', '');
  };

  /**
   * On form submit
   * @param data 
   * @returns 
   */
  const onHandleSubmit = async (data: any) => {

    try {
      let pmId = getValues("p_method")
      // p2p/postad
      if (active1 === 2) {

        console.log(data, "==daa");


        let pmMethod = props.masterPayMethod.filter((item: any) => item?.id === pmId)
        console.log(pmMethod);


        if (filterAsset?.balance == undefined) {
          setError("spend_amount", {
            type: "custom",
            message: `Insufficient balance.`,
          });
          return;
        }

        if (data?.spend_amount > filterAsset?.balance) {
          setError("spend_amount", {
            type: "custom",
            message: `Insufficient balance.`,
          });
          return;
        }
        let tokenID = selectedSecondToken?.id;
        if (session?.user?.kyc !== 'approve' || session?.user?.TwoFA === false || (session?.user?.tradingPassword === '' || session?.user?.tradingPassword === null) || (session?.user?.email === '' || session?.user?.email === null)) {
          setShow(true);
          setActive(true)
        }
        else {
          route.push(`/p2p/postad?token_id=${tokenID}&qty=${data?.spend_amount}&price=${usdtToInr}&pmid=${pmId}`);
        }
        return;
      }

      if (data.spend_amount < finalPost?.min_limit) {
        setError("spend_amount", {
          type: "custom",
          message: `Note: There's an order available in the range  ${finalPost?.min_limit} - ${finalPost?.max_limit}. Order within the range.`,
        });
        return;
      }

      if (status === 'authenticated') {
        let obj = {
          post_id: finalPost?.id,
          sell_user_id: finalPost?.user?.id,
          buy_user_id: session?.user?.user_id,
          token_id: finalPost?.token_id,
          price: finalPost?.price,
          quantity: data?.receive_amount,
          spend_amount: data?.spend_amount,
          receive_amount: data?.receive_amount,
          spend_currency: 'INR',
          receive_currency: finalPost?.token !== null ? finalPost?.token?.symbol : finalPost?.global_token?.symbol,
          p_method: '',
          type: 'buy',
          status: 'isProcess'
        }

        const ciphertext = AES.encrypt(JSON.stringify(obj), `${process.env.NEXT_PUBLIC_SECRET_PASSPHRASE}`).toString();
        let record = encodeURIComponent(ciphertext.toString());

        let responseData = await fetch(`${process.env.NEXT_PUBLIC_BASEURL}/p2p/buy`, {
          method: "POST",
          headers: {
            'Content-Type': 'application/json',
            "Authorization": session?.user?.access_token
          },
          body: JSON.stringify(record)
        })

        let res = await responseData.json();

        if (res.data.status === 200) {
          toast.success(res?.data?.data?.message);
          if (wbsocket) {
            let buy = {
              ws_type: 'buy',
              sellerid: finalPost?.User?.id
            }
            wbsocket.send(JSON.stringify(buy));
          }

          setTimeout(() => {
            route.push(`/p2p/my-orders?buy=${res?.data?.data?.result?.id}`);
          }, 3000);

        }
        else {
          toast.error(res?.data?.data);
        }
      }
      else {
        toast.error('Unauthenticated User. Please Login to buy any assets');
        return;
      }

    } catch (error) {
      console.log(error, "==error");

    }


  }

  /**
   * Filter seller ads based on payment method and token
   * @param id 
   * @param token 
   */
  const filterSellerAds = (id: string, token: any) => {
    console.log(id,"==id");
    
    setPaymentMethod(id);
    clearErrors("spend_amount")
    clearErrors("receive_amount")
    setValue('p_method', id);
    if (Object.keys(selectedSecondToken).length === 0) {
      if (token === undefined || token === null || token?.length < 1) {
        let tokenArray = list2.filter((item: any) => {
          return item.symbol === 'USDT';
        });
        token = tokenArray[0];
      }
    }
    else {
      if (token?.symbol !== undefined && token?.symbol !== selectedSecondToken?.symbol) {
        token = token;
      }
      else {
        token = selectedSecondToken;
      }

    }
    if (props?.posts && props?.posts.length > 0) {
      console.log("inside this", props?.posts);
      console.log("inside this2", token?.id);
      



      let seller = props?.posts?.filter((item: any) => {
        return item?.token_id === token?.id && session?.user?.user_id !== item?.user_id
      })

      if (seller.length > 0) {
        // console.log("=here", amount);

        let nearestObject: any = null;
        let minDifference = Infinity;
        let flag = false;
        let spendAmount = getValues('spend_amount');
        for (const post of seller) {
          let userPaymentMethod = post?.user?.user_payment_methods;
          let postPaymethod = post?.p_method;

          const filteredArray = userPaymentMethod.filter((item: any) =>
            postPaymethod?.some((upm: any) => upm.upm_id === item.id)
          );

          let sellerPost = filteredArray?.filter((item: any) => {
            return item?.pmid === id
          })

          if (sellerPost.length > 0) {
            // console.log("here ia m ",spendAmount,amount);

            if (spendAmount > 0 && (spendAmount < parseFloat(post.min_limit) || spendAmount > parseFloat(post.max_limit))) {
              flag = true;
            }
            else if (spendAmount > 0 && (spendAmount >= parseFloat(post.min_limit) || spendAmount < parseFloat(post.max_limit))) {
              flag = false;
              setPaymentMethod(id);
              setFinalPost(post);
              setUsdtToInr(post?.price);
              if (amount) {

                console.log("==here", amount,"post?.price",post?.price);

                let receiveAmount: any = amount / post?.price;
                setValue('receive_amount', truncateNumber(receiveAmount, 6));

              }
              clearErrors('spend_amount');
              break;
            }
          }
          else {
            console.log("i am here");
        
            setUsdtToInr(0.00)
            setFinalPost({});
          }
        }

        if (flag === true) {
          seller.forEach((item: any) => {
            let userPaymentMethod = item?.user?.user_payment_methods;
            let postPaymethod = item?.p_method;

            const filteredArray = userPaymentMethod.filter((item: any) =>
              postPaymethod?.some((upm: any) => upm.upm_id === item.id)
            );

            const minLimit = parseFloat(item.min_limit);
            const difference = Math.abs(minLimit - spendAmount);

            if (filteredArray.length > 0) {

              let sellerPost = filteredArray?.filter((item: any) => {
                return item?.pmid === id
              })

              if (difference < minDifference && sellerPost.length > 0) {
                minDifference = difference;
                nearestObject = item;
              }
            }
            
          });
          // setPaymentMethod('')
          setError("spend_amount", {
            type: "custom",
            message: `Note: There's an order available in the range  ${nearestObject?.min_limit} - ${nearestObject?.max_limit}. Order within the range. `,
          });

        }
      }

      else {
        console.log("i am here2");
        
        setUsdtToInr(0.00)
        setFinalPost({});
      }

    }
  }

  /**
   * In express sell case
   * @param id 
   */
  const filterBuyerAds = (id: string) => {
    setPaymentMethod(id);
    setValue('p_method', id);
    clearErrors('receive_amount');
    clearErrors('spend_amount');
    clearErrors('p_method');
  }

  /**
   * In express sell case filter asset which user sell and check sufficiant balance
   */
  const getFilterAsset = (tokenID: string) => {
    if (tokenID === null || tokenID === undefined || tokenID === "") {
      let asset = props.assets.filter((item: any) => {
        return item?.global_token?.symbol === 'USDT' && item.walletTtype === "main_wallet"

      });

      setFilterAsset(asset[0]);
    }
    else {
      let asset = props?.assets?.filter((item: any) => {
        return item?.token_id === tokenID && item.walletTtype === "main_wallet"
      });

      setFilterAsset(asset[0]);
    }
  }

  return (
    <>

      <ToastContainer position="top-center" limit={1} />
      <div className="flex items-center mt-[30px] justify-around ">

        <div className="max-w-full md:max-w-[554px] w-full hidden md:block">
          <Image src='/assets/refer/referSafe.png' width={487} height={529} alt="refr-safe-sction" />
        </div>
        <div className="p-20 md:p-20 rounded-10  bg-white dark:bg-d-bg-primary max-w-[500px] w-full border border-grey-v-1 dark:border-opacity-[15%] relative ">

          {(loader || changeSymbol) &&
            <>
              <div className="bg-black dark:bg-omega z-[1] duration-300 absolute top-0 left-0 h-full w-full opacity-50 visible  rounded-10"></div>
              <div className='loader w-[35px] z-[2] h-[35px] absolute top-[calc(50%-10px)] left-[calc(50%-10px)] border-[6px] border-[#d9e1e7] rounded-full animate-spin border-t-primary '></div>
            </>
          }
          <div className="flex border-b border-grey-v-1">
            <button
              className={`sec-text text-center text-gamma border-b-2 border-[transparent] pb-[25px] max-w-[50%] w-full ${active1 === 1 && "!text-primary border-primary"
                }`}
              onClick={() => { setActive1(1); setFinalPost({}); getUsdtToInrPrice('USDT'); setPaymentMethod('') }}
            >
              Buy
            </button>
            <button
              className={`sec-text text-center text-gamma border-b-2 border-[transparent] pb-[25px] max-w-[50%] w-full ${active1 === 2 && "!text-primary border-primary"
                }`}
              onClick={() => { setActive1(2); setSecondCurrency('USDT'); getUsdtToInrPrice('USDT'); setFinalPost({}); setPaymentMethod('') }}
            >
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

            {/* //======================*/}
            {/* //============ Express Buy process ==========*/}
            {/* //======================*/}
            {active1 === 1 &&
              <div className="py-20 relative">

                {/* First Currency Inputs */}
                <div className="mt-40 rounded-5 p-[10px] flex border items-center justify-between gap-[15px] border-grey-v-1 dark:border-opacity-[15%] relative">
                  <div className="">
                    <p className="sm-text dark:text-white">
                      I want to {active1 === 1 ? "pay ≈" : "sell ≈"}
                    </p>
                    <input
                      type="number" onWheel={(e) => (e.target as HTMLElement).blur()}
                      placeholder="$0"
                      maxLength={10}
                      step="any"
                      {...register('spend_amount')}
                      onChange={(e: any) => {
                        
                        const value = e.target.value;
                        const regex = /^\d{0,11}(\.\d{0,6})?$/;
                        if (regex.test(value) || value === "") {
                          
                          if (/^\d*\.?\d{0,6}$/.test(e?.target?.value)) {
                            setAmount(e?.target?.value);
                            setValue("spend_amount", e?.target?.value);
                          }
                          let receiveAmount: any = parseFloat(e?.target?.value) / usdtToInr;
                          setReceivedAmount(truncateNumber(receiveAmount, 6));

                          setValue('receive_amount', truncateNumber(receiveAmount, 6));
                          clearErrors('spend_amount');
                          clearErrors('receive_amount');
                          console.log(paymentMethod,"=paymentMethod",selectedSecondToken,"=selectedSecondToken")
                            
                          if (paymentMethod && selectedSecondToken) {
                            filterSellerAds(paymentMethod, selectedSecondToken);
                          }
                          if (Object.keys(finalPost).length > 0) {
                            if (finalPost?.max_limit < parseFloat(e?.target?.value)) {
                              setError("spend_amount", {
                                type: "custom",
                                message: `Note: There's an order available in the range  ${finalPost?.min_limit} - ${finalPost?.max_limit}. Order within the range.`,
                              });
                            }
                          
                            let receiveAmount = parseFloat(e?.target?.value) / usdtToInr;
                            if (finalPost?.quantity < receiveAmount) {
                              setError("receive_amount", {
                                type: "custom",
                                message: `Quantity available is ${finalPost?.quantity}`,
                              });
                            }
                          }
                        } else {
                          e.target.value = value.slice(0, -1);
                        }

                      }}
                      name="spend_amount"
                      className="bg-[transparent] max-w-full w-full outline-none md-text px-[5px] mt-[10px] md-text "
                    />
                  </div>

                  <div className="max-w-[120px] w-full">
                    {router.pathname.includes("/chart") ? (
                      <div className="flex items-center gap-[5px] rounded-[5px] mr-[15px] pl-10 border-l border-[#D9D9D9] dark:border-[#ccced94d]">
                        <p
                          className={`sm-text rounded-[5px]  cursor-pointer !text-banner-text`}
                        >
                        </p>
                      </div>
                    ) : (
                      <FilterSelectMenuWithCoin
                        data={list1}
                        border={false}
                        setCurrencyName={setCurrencyName}
                        dropdown={1}
                        value="INR"
                        disabled={true}
                      />
                    )}
                  </div>
                </div>
                {errors?.spend_amount && (
                  <p className="errorMessage">{errors?.spend_amount?.message}</p>
                )}

                {/* Second Currency Inputs */}
                <div className="mt-30 rounded-5 p-[10px] flex border items-center justify-between gap-[15px] border-grey-v-1 dark:border-opacity-[15%] relative">
                  <div className="">
                    <p className="sm-text dark:text-white">I will receive ≈</p>
                    <input
                      type="number" onWheel={(e) => (e.target as HTMLElement).blur()}
                      placeholder="$0"
                      step="any"
                      {...register('receive_amount')}
                      onChange={(e: any) => {

                        const value = e.target.value;
                        const regex = /^\d{0,10}(\.\d{0,6})?$/;
                        if (regex.test(value) || value === "") {
                          if (/^\d*\.?\d{0,6}$/.test(e?.target?.value)) {
                            setReceivedAmount(e?.target?.value);
                          }
                          let spendAmount: any = parseFloat(e.target.value) * usdtToInr;
                          setAmount(truncateNumber(spendAmount, 6));
                          setValue('spend_amount', truncateNumber(spendAmount, 6));
                          clearErrors('receive_amount');
                          clearErrors('spend_amount')
                        } else {
                          e.target.value = value.slice(0, -1);
                        }

                      }}
                      name="receive_amount"
                      className="bg-[transparent] outline-none md-text px-[5px] mt-[10px] max-w-full w-full "
                    />
                  </div>

                  <div className="max-w-[120px] w-full">
                    <FilterSelectMenuWithCoin
                      data={list2}
                      border={false}
                      setCurrencyName={setCurrencyName}
                      dropdown={2}
                      value={secondCurrency}
                    />
                  </div>
                </div>
                {errors?.receive_amount && (
                  <p className="errorMessage">{errors?.receive_amount?.message}</p>
                )}

                <div className="mt-5 flex gap-2">
                  <p className="sm-text dark:text-white sdasdasdsad">
                    Estimated price: 1 {secondCurrency} = {currencyFormatter(Number(truncateNumber(Number(usdtToInr), 6)))} INR
                  </p>
                </div>
                <div className="mt-5 flex gap-2">
                  <p className="sm-text dark:text-white">
                    Payment Method
                  </p>
                </div>
                <div className={`mt-2 flex gap-2 ${amount==0?'opacity-70 pointer-events-none' : 'opacity-100 pointer-events-auto'}`}>
                  <FiliterSelectMenu
                    data={props.masterPayMethod}
                    placeholder="Select Payment Method"
                    type="express"
                    auto={false}
                    widthFull={true}
                    onPaymentMethodChange={filterSellerAds}
                    // value={paymentMethod}
                  />
                </div>
                {errors?.p_method && (
                  <p className="errorMessage">{errors?.p_method?.message}</p>
                )}
              </div>
            }

            {/* //======================*/}
            {/* //============ Express Sell process ==========*/}
            {/* //======================*/}
            {active1 === 2 &&
              <div className="py-20">
                <div className="mt-5 flex gap-2 items-center">
                  <Image src='/assets/market/walletpayment.svg' alt="wallet2" width={24} height={24} className="min-w-[24px]" />

                  <p className="sm-text dark:text-white">
                    {filterAsset !== undefined ? currencyFormatter(truncateNumber(parseFloat(filterAsset?.balance), 6)) : '0.0'}
                  </p>
                </div>
                {/* First Currency Inputs */}
                <div className="mt-40 rounded-5 p-[10px] flex border items-center justify-between gap-[15px] border-grey-v-1 dark:border-opacity-[15%] relative">

                  <div className="">
                    <p className="sm-text dark:text-white">
                      I want to sell ≈
                    </p>
                    <input
                      type="number" onWheel={(e) => (e.target as HTMLElement).blur()}
                      placeholder="$0"
                      step="any"
                      {...register('spend_amount')}
                      onChange={(e: any) => {
                        const value = e.target.value;
                        const regex = /^\d{0,10}(\.\d{0,6})?$/;
                        if (regex.test(value) || value === "") {
                          if (/^\d*\.?\d{0,6}$/.test(e?.target?.value)) {
                            setAmount(e?.target?.value);
                          }
                          let receiveAmount: any = parseFloat(e?.target?.value) * usdtToInr;
                          setReceivedAmount(truncateNumber(receiveAmount, 6));
                          // setReceivedAmount(parseFloat(e?.target?.value) * usdtToInr);
                          setValue('receive_amount', truncateNumber(receiveAmount, 6));
                          clearErrors('spend_amount');
                          clearErrors('receive_amount');
                        } else {
                          e.target.value = value.slice(0, -1);
                        }
                      }}
                      name="spend_amount"
                      className="bg-[transparent] max-w-full w-full outline-none md-text px-[5px] mt-[10px] md-text "
                    />
                  </div>

                  <div className="max-w-max w-full">
                    {router.pathname.includes("/chart") ? (
                      <div className="flex items-center gap-[5px] rounded-[5px] mr-[15px] pl-10 border-l border-[#D9D9D9] dark:border-[#ccced94d]">
                        <p
                          className={`sm-text rounded-[5px]  cursor-pointer !text-banner-text`}
                        >
                        </p>
                      </div>
                    ) : (
                      <FilterSelectMenuWithCoin
                        data={list2}
                        border={false}
                        setCurrencyName={setCurrencyName}
                        dropdown={1}
                        value={secondCurrency}
                      />
                    )}
                  </div>
                </div>
                {errors?.spend_amount && (
                  <p className="errorMessage">{errors?.spend_amount?.message}</p>
                )}

                {/* Second Currency Inputs */}
                <div className="mt-30 rounded-5 p-[10px] flex border items-center justify-between gap-[15px] border-grey-v-1 dark:border-opacity-[15%] relative">
                  <div className="">
                    <p className="sm-text dark:text-white">I will receive ≈</p>
                    <input
                      type="number" onWheel={(e) => (e.target as HTMLElement).blur()}
                      placeholder="$0"
                      step="any"
                      {...register('receive_amount')}
                      onChange={(e: any) => {

                        const value = e.target.value;
                        const regex = /^\d{0,10}(\.\d{0,6})?$/;
                        if (regex.test(value) || value === "") {
                          if (/^\d*\.?\d{0,6}$/.test(e?.target?.value)) {
                            setReceivedAmount((e?.target?.value));
                          }
                          let spendAmount: any = parseFloat(e.target.value) / usdtToInr;
                          setAmount(truncateNumber(spendAmount, 6));
                          setValue('spend_amount', truncateNumber(spendAmount, 6));
                          clearErrors('spend_amount');
                          clearErrors('receive_amount');
                        } else {
                          e.target.value = value.slice(0, -1);
                        }


                      }}
                      name="limit_usdt"
                      className="bg-[transparent] outline-none md-text px-[5px] mt-[10px] max-w-full w-full "
                    />
                  </div>
                  <div>
                    <FilterSelectMenuWithCoin
                      data={list1}
                      border={false}
                      setCurrencyName={setCurrencyName}
                      dropdown={2}
                      value="INR"
                      disabled={true}
                    />
                  </div>
                </div>
                {errors?.receive_amount && (
                  <p className="errorMessage">{errors?.receive_amount?.message}</p>
                )}

                <div className="mt-5 flex gap-2">
                  <div className=" flex items-center relative">
                    <p className="sm-text dark:text-white">  Estimated price: 1 {secondCurrency}={currencyFormatter(Number(truncateNumber(Number(usdtToInr), 6)))} INR</p>

                  </div>
                </div>

                <div className="mt-5 flex gap-2">
                  <p className="sm-text dark:text-white">
                    Payment Method
                  </p>
                </div>
                <div className={`mt-2 flex gap-2`}>
                  <FiliterSelectMenu
                    data={props.masterPayMethod}
                    placeholder="Select Payment Method"
                    type="express"
                    auto={false}
                    widthFull={true}
                    onPaymentMethodChange={filterBuyerAds}
                  />
                </div>
                {errors?.p_method && (
                  <p className="errorMessage">{errors?.p_method?.message}</p>
                )}
              </div>
            }

            {props?.session ? (
              <button disabled={Object.keys(finalPost).length === 0 && active1 === 1 ? true : false} className={`solid-button w-full ${active1 == 1 ? 'bg-[#0ECB81] dark:bg-[#089b61]' : 'bg-[#f6465d]'} ${Object.keys(finalPost).length === 0 && active1 === 1 ? 'cursor-not-allowed opacity-25' : 'cursor-pointer'}`}>
                {active1 === 1
                  ? `Buy ${selectedToken?.symbol !== undefined
                    ? selectedToken?.symbol
                    : ""
                  }`
                  : `Sell ${selectedToken?.symbol !== undefined
                    ? selectedToken?.symbol
                    : ""
                  }`}
              </button>
            ) : (
              <Link
                href="/login"
                className="solid-button w-full block text-center"
              >
                Login
              </Link>
            )}
          </form>
        </div>
      </div>
      {show &&
        <AuthenticationModelPopup title='Confirmation' message='Please complete your kyc' setShow={setShow} setActive={setActive} show={show} />
      }
    </>

  );
};

export default BuySellExpress;
