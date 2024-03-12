import { AES } from 'crypto-js';
import { signOut, useSession } from 'next-auth/react';
import React from 'react'
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

  const sendOtp = async () => {
    try {

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

  return (
    <>
      {/* <ToastContainer position="top-right" /> */}

      <div className='fixed top-[50%] z-[9] left-[50%] translate-x-[-50%] translate-y-[-50%] lg:bg-white lg:dark:bg-d-bg-primary lg:p-40 max-w-[557px] w-full rounded-10'>
        <div className=" lg:p-0 p-5  max-w-[calc(100%-30px)] md:mx-0 mx-auto md:mb-0 mb-[10px]  lg:bg-[transparent] lg:dark:bg-[transparent] bg-white lg:rounded-none rounded-10 dark:bg-d-bg-primary md:max-w-[562px] w-full">
          <div className="flex flex-col gap-[15px] lg:gap-5 mb-[30px]">
            <div className={`flex gap-5 items-center  w-full cursor-pointer bg-[transparent]`} >
              <input id={`custom-radio`} type="radio" value="" name="colored-radio" disabled={props.session?.user?.number === 'null' ? true : false} checked={props.session?.user?.number === 'null' ? false : true} className="hidden w-5 h-5 max-w-full   bg-red-400 border-[transparent] focus:ring-primary dark:focus:ring-primary dark:ring-offset-primary  dark:bg-[transparent] dark:border-[transparent]" />
              <label htmlFor={`custom-radio`} className="
                custom-radio relative  px-[17px]  flex gap-2 items-center pl-[18px]
                cursor-pointer
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
    
                before:w-[10px] 
                before:h-[10px]
                before:rounded-[50%] 
                before:absolute
                before:z-[1]
                
                ">
                <p className="ml-2 md-text">  Get the code by text message</p>
              </label>
            </div>
            <input type="email" placeholder="Enter Number " className="input-cta2 bg-primary-100" disabled={true} value={props.session?.user?.number !== "null" ? props.session?.user?.number : ' '} />
          </div>
          <div className="flex flex-col gap-[15px] lg:gap-5">
            <div className={`flex gap-5 items-center  w-full cursor-pointer bg-[transparent]`} >
              <input id={`custom-radio2`} type="radio" value="" name="colored-radio" disabled={props.session?.user?.email !== "null" ? true : false} checked={props.session?.user?.email !== "null" ? true : false} className="hidden w-5 h-5 max-w-full   bg-red-400 border-[transparent] focus:ring-primary dark:focus:ring-primary dark:ring-offset-primary  dark:bg-[transparent] dark:border-[transparent]" />
              <label htmlFor={`custom-radio2`} className="
                custom-radio relative  px-[17px]  flex gap-2 items-center pl-[18px]
                cursor-pointer
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
    
                before:w-[10px] 
                before:h-[10px]
                before:rounded-[50%] 
                before:absolute
                before:z-[1]
                
                ">
                <p className="ml-2 md-text"> Get the code by email at</p>
              </label>
            </div>
            <input type="email" placeholder="Enter Email " className="input-cta2 bg-primary-100" disabled={true} value={props.session?.user?.email !== "null" ? props.session?.user?.email : ''} />
          </div>
          <button className="mt-[30px] lg:mt-[50px] solid-button w-full " onClick={() => { sendOtp() }}>Continue</button>
        </div>
      </div>
    </>
  )
}

export default ConfirmPopup;