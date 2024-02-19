import React, { Fragment, useContext, useState } from "react";
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

const schema = yup.object().shape({
  spend_amount: yup.number().positive().required('Please enter amount in INR').typeError('Please enter amount in INR'),
  receive_amount: yup.number().positive().required('Please enter buy token amount ').typeError('Please enter buy token amount')
});

interface activeSection {
  show1: boolean;
  setShow1: Function;
  selectedPost: any;
}

const BuyPopup = (props: activeSection) => {
  const { mode } = useContext(Context);
  const route = useRouter();
  const [receiveAmount, setReceiveAmount] = useState(0);
  const [spendAmount, setSpendAmount] = useState(0)

  const { status, data: session } = useSession();

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

  const profileImg = props?.selectedPost?.User?.profile && props?.selectedPost?.User?.profile?.image !== null ? props?.selectedPost?.User?.profile?.image : `/assets/orders/user1.png`;
  const userName = props?.selectedPost?.User?.profile && props?.selectedPost?.User?.profile?.fName !== null ? props?.selectedPost?.User?.profile?.fName : props?.selectedPost?.User?.user_kyc?.fname;

  // onClick={() => { route.push("/p2p/my-orders?buy"); }}

  const onHandleSubmit = async (data: any) => {

    if (data.spend_amount < props?.selectedPost?.min_limit) {
      setError("spend_amount", {
        type: "custom",
        message: `Please enter price greater than minimum limit ${props?.selectedPost?.min_limit}`,
      });
      return;
    }

    // if (data.receive_amount > props?.selectedPost?.quantity) {
    //   setError("receive_amount", {
    //     type: "custom",
    //     message: `Please enter quantity less or equal to available balance ${props?.selectedPost?.quantity}`,
    //   });
    //   return;
    // }

    if (status === 'authenticated') {
      let obj = {
        post_id: props?.selectedPost?.id,
        sell_user_id: props?.selectedPost?.User?.id,
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
        toast.success(res?.data?.data?.message);
        const websocket = new WebSocket('ws://localhost:3001/');
        let buy = {
          ws_type: 'buy',
          sellerid: props?.selectedPost?.User?.id
        }
        websocket.onopen = () => {
          websocket.send(JSON.stringify(buy));
        }
        setTimeout(() => {
          route.push(`/p2p/my-orders?buy=${res?.data?.data?.result?.id}`);
        }, 3000);

      }
      else {
        toast.error(res?.data?.data?.message !== undefined ? res?.data?.data?.message : res?.data?.data);
      }
    }
    else {
      toast.error('Unauthenticated User. Please Login to buy any assets');
      return;
    }

  }

  return (
    <>
      <ToastContainer />
      <div className={`bg-black  z-[9] duration-300 fixed top-0 left-0 h-full w-full ${props.show1 ? "opacity-80 visible" : "opacity-0 invisible"}`} onClick={() => { props.setShow1(false) }}></div>
      <form onSubmit={handleSubmit(onHandleSubmit)}>
        <div className={`duration-300 max-w-[calc(100%-30px)] md:max-w-[951px] w-full z-10 fixed rounded-10 md:p-0 p-20 bg-white dark:bg-omega top-[50%] left-[50%] translate-x-[-50%] ${props.show1 ? " translate-y-[-50%] opacity-1 visible" : " translate-y-[-55%] opacity-0 invisible"}`}>
          <div className="flex items-center justify-end md:px-20 md:py-10">
            <svg
              onClick={() => {
                props?.setShow1(0);
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
                <Image src={profileImg} width={44} height={44} alt="profile" className="rounded-full" />
                <div>
                  <p className="info-14-18 dark:!text-white  !text-h-primary !font-medium">{userName}</p>
                  <p className="sm-text mt-[2px]">144 Orders (s) / 80.50 %</p>
                </div>
              </div>
              <div className="mt-30 md:mt-50 grid md:grid-cols-1 grid-cols-2">
                <div className="flex md:flex-row flex-col gap-[5px] justify-between py-[10px] md:first:pt-0 md:last:pb-0 ">
                  <p className="dark:!text-grey-v-1 !text-[#232530] footer-text !font-medium w-full">Available</p>
                  <p className="sm-text w-full">{props?.selectedPost?.quantity} {props?.selectedPost?.token !== null ? props?.selectedPost?.token?.symbol : props?.selectedPost?.global_token?.symbol}</p>
                </div>
                <div className="flex md:flex-row flex-col gap-[5px] justify-between py-[10px] md:first:pt-0 md:last:pb-0 ">
                  <p className="dark:!text-grey-v-1 !text-[#232530] footer-text !font-medium w-full">Limit</p>
                  <p className="sm-text w-full">{props?.selectedPost?.min_limit} INR ~ {props?.selectedPost?.max_limit} INR</p>
                </div>
                <div className="flex md:flex-row flex-col gap-[5px] justify-between py-[10px] md:first:pt-0 md:last:pb-0 ">
                  <p className="dark:!text-grey-v-1 !text-[#232530] footer-text !font-medium w-full">Price</p>
                  <p className="sm-text w-full">{props?.selectedPost?.price} INR</p>
                </div>
                <div className="flex md:flex-row flex-col gap-[5px] justify-between py-[10px] md:first:pt-0 md:last:pb-0 ">
                  <p className="dark:!text-grey-v-1 !text-[#232530] footer-text !font-medium w-full">Payment Method</p>
                  <div className="w-full flex gap-10">
                    {
                      props?.selectedPost?.user_p_method && props?.selectedPost?.user_p_method.map((elem: any, ind: any) => {
                        return (
                          <Fragment key={ind}>
                            <Image src={`${process.env.NEXT_PUBLIC_APIURL}/payment_icon/${elem.master_payment_method.icon}`} alt='error' width={30} height={30} />
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
                        setSpendAmount(e.target.value);
                        setReceiveAmount((e?.target?.value / props?.selectedPost?.price));
                        setValue('receive_amount', e?.target?.value / props?.selectedPost?.price);
                        clearErrors('spend_amount')
                        clearErrors('receive_amount')
                      }} className="sm-text pr-10 max-w-none placeholder:text-disable-clr  dark:bg-d-bg-primary  bg-transparent  outline-none bg-transparent w-full  dark:text-white" placeholder="Enter the ammount" />
                    </div>
                    <div className="pl-10 border-l border-[#D9D9D9] dark:border-[#ccced94d]  flex gap-[5px] items-center">
                      <Image src={`/assets/currencies/3d/inr.png`} alt="error" width={20} height={20} />
                      <p className={`sm-text rounded-[5px]   !text-banner-text`}>INR</p>
                    </div>
                  </div>

                </div>
                {errors?.spend_amount && (
                  <p style={{ color: "#ff0000d1" }}>{errors?.spend_amount?.message}</p>
                )}
                <div className="border mt-[15px] border-grey-v-1 dark:border-[#ccced94d] rounded-[5px] py-[13px] px-[15px] ">
                  <div className="flex items-center ">
                    <div className="max-w-full md:max-w-[315px] w-full">
                      <input type="number" step={0.000001} id="receiveamount" value={receiveAmount} {...register('receive_amount')} name="receive_amount" onChange={(e: any) => {
                        setSpendAmount(props?.selectedPost?.price * e.target.value);
                        setReceiveAmount(e.target.value);
                        setValue('spend_amount', e?.target?.value * props?.selectedPost?.price);
                        clearErrors('spend_amount')
                        clearErrors('receive_amount')
                      }} className="sm-text pr-10 max-w-none placeholder:text-disable-clr  dark:bg-d-bg-primary  bg-transparent  outline-none bg-transparent w-full dark:text-white" placeholder="Your ammount in USDT" />
                    </div>
                    <div className="pl-10 border-l border-[#D9D9D9] dark:border-[#ccced94d] flex gap-[5px] items-center">
                      <Image src={props?.selectedPost?.token !== null ? props?.selectedPost?.token?.image : props?.selectedPost?.global_token?.image} alt="error" width={20} height={20} />
                      <p className={`sm-text rounded-[5px]   !text-banner-text`}>{props?.selectedPost?.token !== null ? props?.selectedPost?.token?.symbol : props?.selectedPost?.global_token?.symbol}</p>
                    </div>
                  </div>

                </div>
                {errors?.receive_amount && (
                  <p style={{ color: "#ff0000d1" }}>{errors?.receive_amount?.message}</p>
                )}
              </div>
            </div>
          </div>
          <div className=" border-t-[0.5px] p-0 pt-[10px] md:px-40 md:pt-20 md:pb-30 border-grey-v-1 flex md:flex-row flex-col gap-[15px] items-start md:items-center justify-between">
            <p className="sm-text text-start">The Trading Password is Required</p>
            {session &&
              <button className="solid-button w-full max-w-full md:max-w-[50%] !p-[17px]" >Place order</button>
            }
            {session === null &&
              <button type="button" className="solid-button w-full max-w-full md:max-w-[50%] !p-[17px]" onClick={()=>route.push('/login')}>Login</button>
            }
          </div>
        </div>
      </form>
    </>
  );
};

export default BuyPopup;
