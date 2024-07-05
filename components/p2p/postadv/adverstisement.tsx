import React, { useEffect, useState } from "react";
import PaymentMethod from "./paymentMethod";
import Response from "./response";

import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { useRouter } from "next/router";
import { toast, ToastContainer } from "react-toastify";
import { currencyFormatter } from "@/components/snippets/market/buySellCard";
import { truncateNumber } from "@/libs/subdomain";

interface propsData {
  masterPayMethod?: any;
  userPaymentMethod?: any;
  tokenList?: any;
  assets?: any;
}

const schema = yup.object().shape({
  token_id: yup.string().required("Please select asset that you want to sell."),
  price: yup.number().positive("Price must be greater than '0'.").required("Please enter amount.").typeError("Please enter amount."),
});


const Adverstisement = (props: propsData) => {
  const [show, setShow] = useState(1);
  const [step, setStep] = useState(1);
  const [selectedAssets, setSelectedAssets] = useState(Object);
  const [inrPrice, setInrPrice] = useState(0);
  const [step1Data, setStep1Data] = useState(Object);
  const [step2Data, setStep2Data] = useState(Object);
  const [assetsBalance, setAssetsBalance] = useState(0.00);
  const [loading, setLoading] = useState(false);

  const assets = props.tokenList;
  const cash = ["INR"];

  const router = useRouter()

  useEffect(() => {
    if (Object.keys(router?.query).length > 0) {
      let token = props.tokenList.filter((item: any) => {
        return item?.id === router?.query?.token_id
      })
      selectToken(token[0]);
      let price: any = router?.query?.price;
      setValue('price', price);
    }
    // if(show){
    //   setInrPrice(0)
    //   reset()
    // }
  }, [router.query]);

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
    resolver: yupResolver(schema),
  });

  const selectToken = async (item: any) => {
    try {
      setValue('token_id', item?.id);
      clearErrors('token_id');
      setLoading(true);
      setValue('price', 0.0);
      if (item?.tokenType === 'global') {
        // let usdtToINR = await fetch(`${process.env.NEXT_PUBLIC_BASEURL}/price?fsym=${item?.symbol}&tsyms=INR`, {
        //   method: "GET",
        // }).then(response => response.json());

        let responseData = await fetch("https://api.livecoinwatch.com/coins/single", {
          method: "POST",
          headers: new Headers({
            "content-type": "application/json",
            "x-api-key": `${process.env.NEXT_PUBLIC_PRICE_SINGLE_ASSET_KEY}`,
          }),
          body: JSON.stringify({
            currency: "INR",
            code: item?.symbol === 'BTCB' ? 'BTC' : item?.symbol === 'BNBT' ? 'BNB' : item?.symbol,
            meta: false
          }),
        });
        let data = await responseData.json();
        setLoading(false);
        setInrPrice(data?.rate);
        setValue('price', truncateNumber( data?.rate,4));
      }
      else {
        // let usdtToINR = await fetch(`${process.env.NEXT_PUBLIC_BASEURL}/price?fsym=USDT&tsyms=INR`, {
        //   method: "GET",
        // }).then(response => response.json());
        let responseData = await fetch("https://api.livecoinwatch.com/coins/single", {
          method: "POST",
          headers: new Headers({
            "content-type": "application/json",
            "x-api-key": `${process.env.NEXT_PUBLIC_PRICE_SINGLE_ASSET_KEY}`,
          }),
          body: JSON.stringify({
            currency: "INR",
            code: "USDT",
            meta: false
          }),
        });
        let data = await responseData.json();
        setLoading(false);
        setInrPrice(item?.price * data?.rate);
        let price: any = item?.price * data?.rate
        setValue('price', truncateNumber( inrPrice,4));
      }

      setSelectedAssets(item);
      let balances = props?.assets?.filter((e: any) => {
        return e.token_id === item?.id && e.walletTtype === 'main_wallet'
      })
      if (balances[0] !== undefined) {
        setAssetsBalance(balances[0]?.balance);
      }
      else {
        setAssetsBalance(0);
      }
    } catch (error: any) {
      setLoading(false);
      toast.error(error?.message);
    }


  }

  const setPaymentMethod = (data: any) => {
    setStep2Data(data)
  }

  const onHandleSubmit = (data: any) => {
    // setStep1Data(data);
    // setStep(2);
    if (assetsBalance > 0) {
      data.price_type = show === 1 ? 'fixed' : 'floating';
      setStep1Data(data);
      setStep(2);
    }
    else {
      toast.error('Insufficient Balance.')
    }
  }

  return (
    <>
      <ToastContainer limit={1} position="top-center"/>
      {step == 1 && (
        <div className="mt-30 md:mt-40">
          <p className="sec-title">Set Asset Type and Price</p>
          <form onSubmit={handleSubmit(onHandleSubmit)}>
            <div className="mt-40 flex md:flex-row flex-col first-letter:  gap-30 items-start">

              <div className="max-w-[1048px] w-full">
                <div className=" md:p-40 border border-grey-v-1 dark:border-opacity-20 rounded-[6px]">
                  <p className="p-[15px] sec-title w-full md:pb-30 border-b border-grey-v-2 dark:border-opacity-20">All Coins</p>
                  <div className="mt-20 mb-20 md:mb-0 md:mt-30 grid grid-cols-3 md:flex flex-wrap gap-x-10 gap-y-30 md:gap-20 p-10 md:p-0">
                    {assets?.map((item: any, index: any) => {
                      return (
                        <div key={index} className="flex items-center md:mr-4 md:py-2 md:px-[18px] cursor-pointer">
                          <input id={`radio${item.id}`} {...register('token_id')} onChange={() => selectToken(item)} type="radio" value={item.id} name="token_id" className="w-5 h-5 hidden bg-red-400 border-[transparent] focus:ring-primary dark:focus:ring-primary dark:ring-offset-primary  dark:bg-[transparent] dark:border-[transparent]" />
                          <label
                            htmlFor={`radio${item.id}`}
                            className="ml-2 md-text dark:!text-g-secondary  cursor-pointer relative custom-radio 
                                pl-[30px] 
                                after:dark:bg-omega
                                after:bg-white
                                after:left-[0px]
                                after:w-[20px] 
                                after:h-[20px]
                                after:rounded-[50%] 
                                after:border after:border-beta
                                after:absolute
                                before:dark:bg-[transparent]
                                before:bg-white
                                before:left-[5px]
                                before:md:top-[calc(50%-7px)]
                                before:top-[calc(50%-4px)]
                                before:w-[10px] 
                                before:h-[10px]
                                before:rounded-[50%] 
                                before:absolute
                                before:z-[1]
                                "
                          >
                            {item?.symbol}
                          </label>
                        </div>
                      );
                    })}
                  </div>
                  {errors?.token_id && (
                    <p className="errorMessage">{errors?.token_id?.message}</p>
                  )}
                </div>
                <div className="md:p-40 mt-30 border border-grey-v-1 dark:border-opacity-20 rounded-[6px]">
                  <p className="p-[15px] sec-title w-full pb-30 border-b border-grey-v-2 dark:border-opacity-20">With Cash</p>
                  <div className="mt-20 mb-20 md:mb-0 md:mt-30 grid grid-cols-3 md:flex flex-wrap gap-x-10 gap-y-30 md:gap-20 p-10 md:p-0">
                    {cash?.map((item, index) => {
                      return (
                        <div key={index} className="flex items-center md:mr-4 md:py-2 md:px-[18px] cursor-pointer">
                          <input id={`radio1${index}`} type="radio" checked value="" name="colored-radio2" className="w-5 h-5 hidden bg-red-400 border-[transparent] focus:ring-primary dark:focus:ring-primary dark:ring-offset-primary  dark:bg-[transparent] dark:border-[transparent]" />
                          <label
                            htmlFor={`radio1${index}`}
                            className="md-text ml-2  dark:!text-bg-secondary relative custom-radio  cursor-pointer
                                    pl-[30px] 
                                    after:dark:bg-omega
                                    after:bg-white
                                    after:left-[0px]
                                    after:w-[20px] 
                                    after:h-[20px]
                                    after:rounded-[50%] 
                                    after:border after:border-beta
                                    after:absolute
                    
                                    before:dark:bg-[transparent]
                                    before:bg-white
                                    before:left-[5px]
                                    before:md:top-[calc(50%-7px)]
                                    before:top-[calc(50%-4px)]
                                    before:w-[10px] 
                                    before:h-[10px]
                                    before:rounded-[50%] 
                                    before:absolute
                                    before:z-[1]"
                          >
                            {item}
                          </label>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              <div className="max-[767px]:max-w-full max-[767px]:w-full p-[15px] md:p-40 border border-grey-v-1 dark:border-opacity-20 rounded-[6px]">
                <p className="sec-title">Price Type</p>
                <div className="items-center flex gap-20 md:gap-30 border-b border-grey-v-2">
                  <button
                    className={`info-14-18 max-[767px]:w-full max-[767px]:max-w-full   after:block after:top-full  after:h-[2px] after:w-[0%] after:bg-primary after:transition-all after:ease-linear after:duration-500 ${show === 1 && "border-primary after:w-[100%] after:bottom !text-primary"}`}
                    onClick={() => {
                      setShow(1);
                    }}
                    type="button"
                  >
                    <div className="flex items-center mr-4 md:justify-unset justify-center">
                      <input id="radio--btn-1" type="radio" value="" name="colored-radio-dd" checked={show === 1 ? true : false} className="w-5 h-5 hidden bg-red-400 border-[transparent] focus:ring-primary dark:focus:ring-primary dark:ring-offset-primary  dark:bg-[transparent] dark:border-[transparent]" />
                      <label
                        htmlFor="radio--btn-1"
                        className="
                          md-text py-[24px] px-[18px]  relative custom-radio  cursor-pointer
                          pl-[60px] 
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
                          before:md:top-[calc(50%-7px)]
                          before:top-[calc(50%-4px)]
                          before:w-[10px] 
                          before:h-[10px]
                          before:rounded-[50%] 
                          before:absolute
                          before:z-[1]
                          "
                      >
                        Fixed
                      </label>
                    </div>
                  </button>
                  <button
                    className={`info-14-18   max-[767px]:w-full max-[767px]:max-w-full after:block after:top-full  after:h-[2px] after:w-[0%] after:bg-primary cursor-pointer after:transition-all after:ease-linear after:duration-500 ${show === 2 && "border-primary after:w-[100%] after:bottom !text-primary"}`}
                    onClick={() => {
                      setShow(2);
                      selectToken(selectedAssets);
                      let currentPrice = (inrPrice).toFixed(2)
                      setValue('price', parseFloat(currentPrice))
                    }}
                    type="button"
                  >
                    <div className="flex items-center mr-4  md:justify-unset justify-center">
                      <input id="radio-btn2" type="radio" value="" name="colored-radio-dd" checked={show === 2 ? true : false} className="w-5 h-5 hidden bg-red-400 border-[transparent] focus:ring-primary dark:focus:ring-primary dark:ring-offset-primary  dark:bg-[transparent] dark:border-[transparent]" />
                      <label
                        htmlFor="radio-btn2"
                        className="
                        md-text py-[24px] px-[18px] relative  custom-radio  cursor-pointer
                        pl-[60px] 
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
                        before:md:top-[calc(50%-7px)]
                        before:top-[calc(50%-4px)]
                        before:w-[10px] 
                        before:h-[10px]
                        before:rounded-[50%] 
                        before:absolute
                        before:z-[1]
                        "
                      >
                        Floating
                      </label>
                    </div>
                  </button>
                </div>
                <div className="md:py-50 py-20">
                  <div className="flex items-center justify-between gap-2 pb-[15px] border-b border-grey-v-1 dark:border-opacity-20">
                    <p className="info-14-18 dark:!text-white">Your Price</p>
                    {loading === true ? <div className='loader relative w-[35px] z-[2] h-[35px] top-0 right-0 border-[6px] border-[#d9e1e7] rounded-full animate-spin border-t-primary '></div>
                      : <p className="sec-title md:!text-[18px] !text-[14px]">₹ {currencyFormatter(truncateNumber( inrPrice,4))}</p>
                    }

                  </div>
                  {/* <div className="flex items-center justify-between gap-2 pt-[15px] ">
                    <p className="info-14-18 dark:!text-white">Highest Order Price</p>
                    <p className="sec-title md:!text-[18px] !text-[14px]">₹ 79.29</p>
                  </div> */}
                  <div className="md:mt-30 mt-20">
                    <p className="info-10-14">{show === 1 ? "Fixed" : "Floating"} (INR)</p>
                    <input type="number"  onWheel={(e) => (e.target as HTMLElement).blur()}  step={0.000001} {...register('price', { required: true })} name="price" disabled={show === 2 ? true : false} placeholder="Enter Amount" className="py-[14px] px-[15px] border rounded-5 border-grey-v-1 mt-[10px] w-full bg-[transparent] dark:border-opacity-20 outline-none info-16-18" />
                  </div>
                  {errors?.price && (
                    <p className="errorMessage">{errors?.price?.message}</p>
                  )}
                  <p className="py-2 info-10-14 text-right">Bal. {assetsBalance.toFixed(4)}</p>
                </div>

                <button
                  className="solid-button w-full text-center"
                >
                  Next
                </button>
              </div>

            </div>
          </form>
        </div>
      )}
      {step === 2 && <PaymentMethod step={step} setStep={setStep} setPaymentMethod={setPaymentMethod} masterPayMethod={props.masterPayMethod} userPaymentMethod={props.userPaymentMethod} selectedAssets={selectedAssets} assetsBalance={assetsBalance} price={step1Data.price} />}
      {step === 3 && <Response step={step} setStep={setStep} step1Data={step1Data} step2Data={step2Data} />}
    </>
  );
};

export default Adverstisement;
