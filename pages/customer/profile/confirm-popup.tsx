import Context from '@/components/contexts/context';
import clickOutSidePopupClose from '@/components/snippets/clickOutSidePopupClose';
import { AES } from 'crypto-js';
import { signOut, useSession } from 'next-auth/react';
import React, { useContext, useRef, useState } from 'react'
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface activeSection {
  setEnable?: any,
  setShow?: any,
  type?: string,
  session?: any,
  data?: any;
  snedOtpToUser?: any
}

const ConfirmPopup = (props: activeSection) => {
  const { status } = useSession()
  const { mode } = useContext(Context);
  const [disable, setDisable] = useState(false);

  const sendOtp = async () => {
    try {

      setDisable(true);
      if (status === 'authenticated') {
        props.snedOtpToUser();
      }
      else {
        toast.error('Your session is expired. Its auto redirect to login page');
        setTimeout(() => {
          signOut();
        }, 4000);

      }
    } catch (error) {
      console.log(error);
    }
  }

  const closePopup = () => {
    props.setShow !== undefined && props?.setShow(false);
    props?.setEnable(0);
  }
  const wrapperRef = useRef(null);
  clickOutSidePopupClose({ wrapperRef, closePopup });

  return (
    <>
      <ToastContainer position="top-right" limit={1}/>


      <div ref={wrapperRef} className='fixed top-[50%] z-[9] left-[50%] translate-x-[-50%] translate-y-[-50%] lg:bg-white lg:dark:bg-d-bg-primary lg:p-40 max-w-[557px] w-full rounded-10'>

        <div className="flex items-center justify-end pb-[10px] md:pb-[15px] ">

          <svg
            onClick={() => {
              props.setShow !== undefined && props?.setShow(false);
              props?.setEnable !== undefined && props?.setEnable(0);
            }}
            enableBackground="new 0 0 60.963 60.842"
            version="1.1"
            id="Layer_1"
            xmlns="http://www.w3.org/2000/svg"
            xmlnsXlink="http://www.w3.org/1999/xlink"
            x="0px"
            y="0px"
            viewBox="0 0 60.963 60.842"
            xmlSpace="preserve"
            className="max-w-[18px] cursor-pointer w-full"
          >
            <path
              fill={mode === "dark" ? "#fff" : "#000"}
              d="M59.595,52.861L37.094,30.359L59.473,7.98c1.825-1.826,1.825-4.786,0-6.611
                          c-1.826-1.825-4.785-1.825-6.611,0L30.483,23.748L8.105,1.369c-1.826-1.825-4.785-1.825-6.611,0c-1.826,1.826-1.826,4.786,0,6.611
                          l22.378,22.379L1.369,52.861c-1.826,1.826-1.826,4.785,0,6.611c0.913,0.913,2.109,1.369,3.306,1.369s2.393-0.456,3.306-1.369
                          l22.502-22.502l22.501,22.502c0.913,0.913,2.109,1.369,3.306,1.369s2.393-0.456,3.306-1.369
                          C61.42,57.647,61.42,54.687,59.595,52.861z"
            />
          </svg>
        </div>

        <div className=" lg:p-0 p-5  max-w-[calc(100%-30px)] md:mx-0 mx-auto md:mb-0 mb-[10px]  lg:bg-[transparent] lg:dark:bg-[transparent] bg-white lg:rounded-none rounded-10 dark:bg-d-bg-primary md:max-w-[562px] w-full">
          {props.session?.user?.number !== "null" && <div className="flex flex-col gap-[15px] lg:gap-5 mb-[30px]">
            <div className={`flex gap-5 items-center  w-full cursor-pointer bg-[transparent]`} >
              <p className="ml-2 md-text">  Get the code by text message</p>
            </div>
            <input type="email" placeholder="Enter Number " className="input-cta2 bg-primary-100" disabled={true} value={props.session?.user?.number !== "null" ? props.session?.user?.number : ' '} />
          </div>}
          {props.session?.user?.mail !== "null" && <div className="flex flex-col gap-[15px] lg:gap-5">
            <div className={`flex gap-5 items-center  w-full cursor-pointer bg-[transparent]`} >

              <p className="ml-2 md-text"> Get the code by email at</p>
            </div>
            <input type="email" placeholder="Enter Email " className="input-cta2 bg-primary-100" disabled={true} value={props.session?.user?.email !== "null" ? props.session?.user?.email : ''} />
          </div>}
          <button className={`mt-[30px] lg:mt-[50px] solid-button w-full flex items-center gap-[10px] justify-center ${disable && "cursor-not-allowed"}`} disabled={disable} onClick={() => { sendOtp() }}>
            {disable === true &&
              <svg
              className="w-5 h-5 mr-3 -ml-1 text-white animate-spin"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx={12}
                cy={12}
                r={10}
                stroke="currentColor"
                strokeWidth={4}
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            
            }
           <span className='block'>Continue</span> </button>
        </div>
      </div>
    </>
  )
}

export default ConfirmPopup;