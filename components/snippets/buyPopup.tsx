import React, { Fragment, useContext, useEffect, useRef, useState } from "react";
import Image from "next/image";
import Context from "../contexts/context";
import { useRouter } from "next/router";

import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { useSession } from "next-auth/react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AES from 'crypto-js/aes';
import clickOutSidePopupClose from "./clickOutSidePopupClose";
import { useWebSocket } from "@/libs/WebSocketContext";
import { currencyFormatter } from "./market/buySellCard";

const schema = yup.object().shape({
  spend_amount: yup.number().positive("Spend amount must be greater than '0'.").required('Please enter amount in INR.').typeError('Please enter amount in INR.'),
  receive_amount: yup.number().positive("Recieve amount must be greater than '0'.").required('Please enter buy token amount.').typeError('Please enter buy token amount.')
});

interface activeSection {
  show1: boolean;
  setShow1: Function;
  selectedPost: any;
}

const BuyPopup = (props: activeSection) => {
  const { mode } = useContext(Context);
  const route = useRouter();
  const [receiveAmount, setReceiveAmount] = useState<any>();
  const [spendAmount, setSpendAmount] = useState<any>()
  const [btnDisabled, setBtnDisabled] = useState(false);
  const { status, data: session } = useSession();
  const wbsocket = useWebSocket();
  const [totalOrder, setTotalOrder] = useState(0);

  
  
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
    reset()
  }, [props.show1])

  useEffect(() => {
    getUserTotalOrders();
  }, [props?.selectedPost?.user]);

  const getUserTotalOrders = async () => {
    let masterPaymentMethod = await fetch(`${process.env.NEXT_PUBLIC_BASEURL}/p2p/postad?user_id=${props?.selectedPost?.user?.id}`, {
      method: "GET",
    }).then(response => response.json());

    setTotalOrder(masterPaymentMethod?.data);
  }

  const profileImg = props?.selectedPost?.user?.profile && props?.selectedPost?.user?.profile?.image !== null ? props?.selectedPost?.user?.profile?.image : `/assets/orders/user1.png`;
  const userName = props?.selectedPost?.user?.profile && props?.selectedPost?.user?.profile?.dName !== null ? props?.selectedPost?.user?.profile?.dName : props?.selectedPost?.user?.user_kyc?.fname;

  // onClick={() => { route.push("/p2p/my-orders?buy"); }}

  const onHandleSubmit = async (data: any,e:any) => {

    if (data.spend_amount < props?.selectedPost?.min_limit) {
      setError("spend_amount", {
        type: "custom",
        message: `Please enter price greater than or equal  minimum limit '${props?.selectedPost?.min_limit}'.`,
      });
      return;
    }

    if (data.spend_amount > props?.selectedPost?.max_limit) {
      setError("spend_amount", {
        type: "custom",
        message: `Please enter price less than or equal to maximum limit '${props?.selectedPost?.max_limit}'.`,
      });
      return;
    }
    setBtnDisabled(true);
    if (status === 'authenticated') {
      setBtnDisabled(true);
      let obj = {
        post_id: props?.selectedPost?.id,
        sell_user_id: props?.selectedPost?.user?.id,
        buy_user_id: session?.user?.user_id,
        token_id: props?.selectedPost?.token_id,
        price: props?.selectedPost?.price,
        quantity: data?.receive_amount,
        spend_amount: data?.spend_amount,
        receive_amount: data?.receive_amount,
        spend_currency: 'INR',
        receive_currency: props?.selectedPost?.token !== null ? props?.selectedPost?.token?.symbol : props?.selectedPost?.global_token?.symbol,
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
        toast.success(res?.data?.data?.message,{autoClose:2000});
        
        if (wbsocket) {
          let buy = {
            ws_type: 'buy',
            sellerid: props?.selectedPost?.user?.id,
            orderId: res?.data?.data?.result?.id
          }
          wbsocket.send(JSON.stringify(buy));

          let orderData = {
            ws_type: 'order',
            orderid: res?.data?.data?.result?.id
          }
          wbsocket.send(JSON.stringify(orderData));
        }

        setTimeout(() => {
          route.push(`/p2p/my-orders?buy=${res?.data?.data?.result?.id}`);
        }, 3000);

      }
      else {
        toast.error(res?.data?.data?.message !== undefined ? res?.data?.data?.message : res?.data?.data,{autoClose:2000});
        setTimeout(()=>{
          setBtnDisabled(false)
        },2500)
      }
      setTimeout(()=>{
        setBtnDisabled(false);
      },2500)
    }
    else {
      toast.error('Unauthenticated User. Please Login to buy any assets',{autoClose:2000});
      setTimeout(()=>{
        setBtnDisabled(false)
      },2500)
      return;
    }

  }

  const closePopup = () => {
    props?.setShow1(false);
    setBtnDisabled(false)
    setSpendAmount('')
    setReceiveAmount('')
    reset()
  }
  const wrapperRef = useRef(null);
  clickOutSidePopupClose({ wrapperRef, closePopup });

  let payment_method: any = [];

  for (const upid of props?.selectedPost?.user?.user_payment_methods) {
    props?.selectedPost?.p_method.filter((e: any) => {
      if (e?.upm_id === upid?.id) {
        payment_method.push(upid);
      }
    })
  }

  return (
    <div ref={wrapperRef}>
      <ToastContainer limit={1} />
      <div className={`bg-black  z-[9] duration-300 fixed top-0 left-0 h-full w-full ${props.show1 ? "opacity-80 visible" : "opacity-0 invisible"}`} onClick={() => { props.setShow1(false) }}></div>
      <form 
          onSubmit={handleSubmit(onHandleSubmit)}  
          onKeyDown={(e) => {
            
            if (e.key.includes('Enter') ) {
              e.preventDefault();
                // console.log(e,"===========");
                // console.log(spendAmount,"====");
                // console.log(receiveAmount,"====");
                // if(!spendAmount || !receiveAmount){
                // }
              }
            }}
          >

        <div className={`duration-300 max-w-[calc(100%-30px)] md:max-w-[951px] w-full z-10 fixed rounded-10 md:p-0 p-20 bg-white dark:bg-omega top-[50%] left-[50%] translate-x-[-50%] ${props.show1 ? " translate-y-[-50%] opacity-1 visible" : " translate-y-[-55%] opacity-0 invisible"}`}>
          <div className="flex items-center justify-end md:px-20 md:py-10">
            <svg
              onClick={() => {
                props?.setShow1(0);
                setSpendAmount('')
                setReceiveAmount('')
                reset()
              }}
              xmlns="http://www.w3.org/2000/svg"
              width={30}
              height={30}
              viewBox="0 0 30 30"
              className="max-w-[30px] cursor-pointer w-full"
            >
              <path
                fill="#9295A6"
                fillRule="evenodd"
                clipRule="evenodd"
                d="M16.7678 15.0003L22.1341 9.63406C22.6228 9.14531 22.6228 8.35531 22.1341 7.86656C21.6453 7.37781 20.8553 7.37781 20.3666 7.86656L15.0003 13.2328L9.63406 7.86656C9.14531 7.37781 8.35531 7.37781 7.86656 7.86656C7.37781 8.35531 7.37781 9.14531 7.86656 9.63406L13.2328 15.0003L7.86656 20.3666C7.37781 20.8553 7.37781 21.6453 7.86656 22.1341C8.11031 22.3778 8.43031 22.5003 8.75031 22.5003C9.07031 22.5003 9.39031 22.3778 9.63406 22.1341L15.0003 16.7678L20.3666 22.1341C20.6103 22.3778 20.9303 22.5003 21.2503 22.5003C21.5703 22.5003 21.8903 22.3778 22.1341 22.1341C22.6228 21.6453 22.6228 20.8553 22.1341 20.3666L16.7678 15.0003Z"
              />
            </svg>
          </div>
          <div className="p-0 md:py-30 md:px-40 flex md:flex-row flex-col gap-30 ">
            <div className="max-w-full md:max-w-[50%] w-full">
              <div className="flex gap-3">
                <Image src={profileImg} width={44} height={44} alt="profile" className="rounded-full w-[40px] h-[40px] object-cover object-top" />
                <div>
                  <p className="info-14-18 dark:!text-white  !text-h-primary !font-medium">{userName}</p>
                  <p className="sm-text mt-[2px]">{(totalOrder) || 0} Orders </p>
                </div>
              </div>
              <div className="mt-30 md:mt-50 grid md:grid-cols-1 grid-cols-2">
                <div className="flex md:flex-row flex-col gap-[5px] justify-between py-[10px] md:first:pt-0 md:last:pb-0 ">
                  <p className="dark:!text-grey-v-1 !text-[#232530] footer-text !font-medium w-full">Available :</p>
                  <p className="sm-text w-full">{props?.selectedPost?.quantity} {props?.selectedPost?.token !== null ? props?.selectedPost?.token?.symbol : props?.selectedPost?.global_token?.symbol}</p>
                </div>
                <div className="flex md:flex-row flex-col gap-[5px] justify-between py-[10px] md:first:pt-0 md:last:pb-0 ">
                  <p className="dark:!text-grey-v-1 !text-[#232530] footer-text !font-medium w-full">Limit :</p>
                  <p className="sm-text w-full">{currencyFormatter(props?.selectedPost?.min_limit)} INR ~ {currencyFormatter(props?.selectedPost?.max_limit)} INR</p>
                </div>
                <div className="flex md:flex-row flex-col gap-[5px] justify-between py-[10px] md:first:pt-0 md:last:pb-0 ">
                  <p className="dark:!text-grey-v-1 !text-[#232530] footer-text !font-medium w-full">Market Price :</p>
                  <p className="sm-text w-full">{currencyFormatter(props?.selectedPost?.price)} INR</p>
                </div>
                <div className="flex md:flex-row flex-col gap-[5px] justify-between py-[10px] md:first:pt-0 md:last:pb-0 ">
                  <p className="dark:!text-grey-v-1 !text-[#232530] footer-text !font-medium w-full">Payment Methods :</p>
                  <div className="w-full flex">
                    {
                      payment_method && payment_method.map((elem: any, ind: number) => {
                        const iconClass = ind === 0 ? 'mr-[10px]' : 'ml-[-20px]';
                        return (
                          <Fragment key={ind}>
                            <Image src={`${elem.master_payment_method.icon}`} alt='error' width={30} height={30} className={iconClass} />
                          </Fragment>
                        )
                      })
                    }
                  </div>
                </div>
              </div>
            </div>
            <div className="max-w-full md:max-w-[50%] w-full">
              {/* <p className="sm-heading dark:!text-white">Remarks</p>
              <p className="mt-10 md:mt-[15px] info-10-14 !text-[14px]">Please Submit Your Payment</p> */}
              <div className="mt-20 mb-20 md:mb-0">
                <p className="info-12 ">Buy </p>
                <div className="border mt-[10px] border-grey-v-1 dark:border-[#ccced94d] rounded-[5px] py-[13px] px-[15px] ">
                  <div className="flex items-center ">
                    <div className="max-w-full md:max-w-[315px] w-full">
                      <input type="number" step={0.000001} id="spendamount" {...register('spend_amount')} name="spend_amount" value={spendAmount} onChange={(e: any) => {
                        if (/^\d*\.?\d{0,2}$/.test(e?.target?.value)) {
                          setSpendAmount(e?.target?.value);
                        }
                        // setSpendAmount(e.target.value);
                        let receiveAmount: any = (e?.target?.value / props?.selectedPost?.price);
                        setReceiveAmount(receiveAmount.toFixed(6));
                        setValue('receive_amount', receiveAmount.toFixed(6));
                        clearErrors('spend_amount')
                        clearErrors('receive_amount')
                      }} className="sm-text pr-10 max-w-none placeholder:text-disable-clr  dark:bg-d-bg-primary  bg-transparent  outline-none bg-transparent w-full  dark:text-white" placeholder="0" />
                    </div>
                    <div className="pl-10 border-l border-[#D9D9D9] dark:border-[#ccced94d]  flex gap-[5px] items-center">
                      <Image src={`/assets/currencies/3d/inr.png`} alt="error" width={20} height={20} />
                      <p className={`sm-text rounded-[5px]   !text-banner-text`}>INR</p>
                    </div>
                  </div>

                </div>
                {errors?.spend_amount && (
                  <p className="errorMessage">{errors?.spend_amount?.message}</p>
                )}
                <div className="border mt-[15px] border-grey-v-1 dark:border-[#ccced94d] rounded-[5px] py-[13px] px-[15px] ">
                  <div className="flex items-center ">
                    <div className="max-w-full md:max-w-[315px] w-full">
                      <input type="number" step={0.000001} id="receiveamount" value={receiveAmount} {...register('receive_amount')} name="receive_amount" onChange={(e: any) => {
                        if (/^\d*\.?\d{0,6}$/.test(e?.target?.value)) {
                          setReceiveAmount(e?.target?.value);
                        }
                        let spendAmount: any = props?.selectedPost?.price * e.target.value;
                        setSpendAmount(spendAmount.toFixed(2));
                        // setReceiveAmount(e.target.value);
                        setValue('spend_amount', spendAmount.toFixed(2));
                        clearErrors('spend_amount')
                        clearErrors('receive_amount')
                      }} className="sm-text pr-10 max-w-none placeholder:text-disable-clr  dark:bg-d-bg-primary  bg-transparent  outline-none bg-transparent w-full dark:text-white" placeholder="0" />
                    </div>
                    <div className="pl-10 border-l border-[#D9D9D9] dark:border-[#ccced94d] flex gap-[5px] items-center">
                      <Image src={props?.selectedPost?.token !== null ? props?.selectedPost?.token?.image : props?.selectedPost?.global_token?.image} alt="error" width={20} height={20} />
                      <p className={`sm-text rounded-[5px]   !text-banner-text`}>{props?.selectedPost?.token !== null ? props?.selectedPost?.token?.symbol : props?.selectedPost?.global_token?.symbol}</p>
                    </div>
                  </div>

                </div>
                {errors?.receive_amount && (
                  <p className="errorMessage">{errors?.receive_amount?.message}</p>
                )}
              </div>
            </div>
          </div>
          <div className=" border-t-[0.5px] p-0 pt-[10px] mx-0 md:mx-[20px] md:px-40 md:pt-20 md:pb-30 border-grey-v-1 flex md:flex-row flex-col gap-[15px] items-start md:items-center justify-end">
            {/* <p className="sm-text text-start">The Trading Password is Required</p> */}
            {session &&
              <button disabled={btnDisabled} className={`solid-button w-full max-w-full md:max-w-[50%] !p-[17px] ${btnDisabled === true ? 'cursor-not-allowed' : ''}`} >
                {btnDisabled &&
                  <svg aria-hidden="true" role="status" className="inline w-4 h-4 me-3 text-white animate-spin" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="#E5E7EB" />
                    <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentColor" />
                  </svg>
                }Place order</button>
            }
            {session === null &&
              <button type="button" className="solid-button w-full max-w-full md:max-w-[50%] !p-[17px]" onClick={() => route.push('/login')}>Login</button>
            }
          </div>
        </div>
      </form>
    </div>
  );
};

export default BuyPopup;
