import React, { useContext, useEffect, useRef, useState } from "react";
import Context from "../contexts/context";
import { AES } from "crypto-js";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { signOut } from "next-auth/react";
import EmailChangeAlert from "./emailChangeAlert";
import clickOutSidePopupClose from "./clickOutSidePopupClose";
import CodeNotRecieved from "./codeNotRecieved";

interface activeSection {
  setEnable: Function;
  setShow?: any;
  type: string;
  data: any;
  session: any;
  finalOtpVerification?: any;
  finalBtnenable?: any;
  snedOtpToUser?: any;
  sendOtpRes?: any;
}

const Verification = (props: activeSection) => {
  const { mode } = useContext(Context);
  const [fillOtp, setOtp] = useState("");
  const Ref: any = useRef(null);
  const [timeLeft, setTimer] = useState('');
  const [enable, setEnable] = useState(false);
  const [popup, setPopup] = useState(false);

  useEffect(() => {
    orderTimeCalculation();
    const inputElements = document.querySelectorAll(".input_wrapper input");

    inputElements?.forEach((ele, index) => {
      ele.addEventListener("keydown", (e: any) => {
        if (e.keyCode === 8 && e.target.value === "") {
          (inputElements[Math.max(0, index - 1)] as HTMLElement).focus();
        }
      });
      ele.addEventListener("input", (e: any) => {
        const [first, ...rest] = e.target.value;
        e.target.value = first ?? "";
        const lastInputBox = index === inputElements.length - 1;
        const didInsertContent = first !== undefined;
        if (didInsertContent && !lastInputBox) {
          (inputElements[index + 1] as HTMLElement).focus();
          (inputElements[index + 1] as HTMLInputElement).value = rest.join("");
          inputElements[index + 1].dispatchEvent(new Event("input"));
        } else {
          setOtp(
            (inputElements[0] as HTMLInputElement).value +
            "" +
            (inputElements[1] as HTMLInputElement).value +
            "" +
            (inputElements[2] as HTMLInputElement).value +
            "" +
            (inputElements[3] as HTMLInputElement).value +
            "" +
            (inputElements[4] as HTMLInputElement).value +
            "" +
            (inputElements[5] as HTMLInputElement).value
          );
        }
      });
    });


  }, [props?.sendOtpRes]);

  const orderTimeCalculation = async () => {
    setEnable(true);
    let deadline = new Date(props?.sendOtpRes?.expire);

    deadline.setMinutes(deadline.getMinutes());
    deadline.setSeconds(deadline.getSeconds() + 1);
    let currentTime = new Date();

    if (currentTime < deadline) {
      if (Ref.current) clearInterval(Ref.current);
      const timer = setInterval(() => {
        calculateTimeLeft(deadline);
      }, 1000);
      Ref.current = timer;
    }
    else if (currentTime > deadline) {
      setEnable(false);
    }
  }

  const calculateTimeLeft = (e: any) => {
    let { total, minutes, seconds }
      = getTimeRemaining(e);

    if (total >= 0) {
      setTimer(
        (minutes > 9 ? minutes : '0' + minutes) + ':'
        + (seconds > 9 ? seconds : '0' + seconds)
      )
    }
    else {
      if (Ref.current) clearInterval(Ref.current);
      setEnable(false);
    }
  }

  const getTimeRemaining = (e: any) => {
    let current: any = new Date();
    const total = Date.parse(e) - Date.parse(current);
    const seconds = Math.floor((total / 1000) % 60);
    const minutes = Math.floor((total / 1000 / 60) % 60);
    return {
      total, minutes, seconds
    };
  }

  const matchUserOtp = async () => {
    try {
      console.log(fillOtp,"==fillOtp");
      
      props.finalOtpVerification(fillOtp);
      setOtp('');
    } catch (error) {
      console.log(error);
    }
  };

  const closePopup = () => {
    props?.setShow(false);
    props.setEnable(0);
  }
  const wrapperRef = useRef(null);
  clickOutSidePopupClose({ wrapperRef, closePopup });

  return (
    <>
      {/* <ToastContainer position="top-right" /> */}

      <div ref={wrapperRef} className="max-w-[calc(100%-30px)] md:max-w-[510px] w-full p-5 md:p-40 z-10 fixed rounded-10 bg-white dark:bg-omega top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%]">
        <div className="flex items-center justify-between ">
          <p className="sec-title">Enter Otp</p>
          <svg
            onClick={() => {
              props?.setShow(false);
              props.setEnable(0);
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
              fill={mode === "dark" ? "#fff" : "#9295A6"}
              d="M59.595,52.861L37.094,30.359L59.473,7.98c1.825-1.826,1.825-4.786,0-6.611
                              c-1.826-1.825-4.785-1.825-6.611,0L30.483,23.748L8.105,1.369c-1.826-1.825-4.785-1.825-6.611,0c-1.826,1.826-1.826,4.786,0,6.611
                              l22.378,22.379L1.369,52.861c-1.826,1.826-1.826,4.785,0,6.611c0.913,0.913,2.109,1.369,3.306,1.369s2.393-0.456,3.306-1.369
                              l22.502-22.502l22.501,22.502c0.913,0.913,2.109,1.369,3.306,1.369s2.393-0.456,3.306-1.369
                              C61.42,57.647,61.42,54.687,59.595,52.861z"
            />
          </svg>
        </div>

        <div className="py-30 md:py-40">
          <div className="flex flex-col  gap-20">
            <label className="sm-text">
              {props?.type === "email"
                ? "Enter Email Verification Code"
                : "Enter SMS Verification Code"}
            </label>
            <div className="flex gap-10 justify-center items-center input_wrapper">
              <input
                type="text"
                autoComplete="off"
                className="block px-2 font-noto md:px-5 w-[40px] lg:w-[60px] dark:bg-black bg-primary-100  text-center  rounded min-h-[40px] lg:min-h-[62px] text-black dark:text-white outline-none focus:!border-primary"
                name="code1"
              />
              <input
                type="text"
                autoComplete="off"
                className="block px-2 font-noto md:px-5 w-[40px] lg:w-[60px] dark:bg-black bg-primary-100  text-center  rounded min-h-[40px] lg:min-h-[62px] text-black dark:text-white outline-none focus:!border-primary"
                name="code2"
              />
              <input
                type="text"
                autoComplete="off"
                className="block px-2 font-noto md:px-5 w-[40px] lg:w-[60px] dark:bg-black bg-primary-100  text-center  rounded min-h-[40px] lg:min-h-[62px] text-black dark:text-white outline-none focus:!border-primary"
                name="code3"
              />
              <input
                type="text"
                autoComplete="off"
                className="block px-2 font-noto md:px-5 w-[40px] lg:w-[60px] dark:bg-black bg-primary-100  text-center  rounded min-h-[40px] lg:min-h-[62px] text-black dark:text-white outline-none focus:!border-primary"
                name="code4"
              />
              <input
                type="text"
                autoComplete="off"
                className="block px-2 font-noto md:px-5 w-[40px] lg:w-[60px] dark:bg-black bg-primary-100  text-center  rounded min-h-[40px] lg:min-h-[62px] text-black dark:text-white outline-none focus:!border-primary"
                name="code5"
              />
              <input
                type="text"
                autoComplete="off"
                className="block px-2 font-noto md:px-5 w-[40px] lg:w-[60px] dark:bg-black bg-primary-100  text-center  rounded min-h-[40px] lg:min-h-[62px] text-black dark:text-white outline-none focus:!border-primary"
                name="code6"

              />
            </div>
            <div className={`flex  ${enable === true ? '' : 'hidden'}`}>
              <p className={`info-10-14 px-2 text-end md-text`}>Your OTP will expire within </p>
              <p className={`info-10-14 text-end md-text`}> {timeLeft}</p>
            </div>

            <p className={`info-10-14 text-end cursor-pointer !text-primary-700 ${enable === true ? 'hidden' : ''}`} onClick={() => props?.snedOtpToUser()}>
              Resend Code
            </p>
          </div>
        </div>
        {props.finalBtnenable !== undefined ? <button
          disabled={props.finalBtnenable}
          className={`solid-button w-full ${props.finalBtnenable === true ? 'cursor-not-allowed' : ''}`}
          onClick={() => {
            matchUserOtp();
          }}
        >
          Submit
        </button> : <button
          className={`solid-button w-full`}
          onClick={() => {
            matchUserOtp();
          }}
        >
          Submit
        </button>}
        <p className={`info-10-14 text-start cursor-pointer lg:pr-[60px] pr-[30px] !text-primary-700 mt-[10px]`} onClick={() => {setPopup(true)}}>
          Didn't receive the code?
            </p>

      </div>
      {
      popup &&
      <CodeNotRecieved setEnable={setPopup}/>
    }
    </>
  );
};

export default Verification;
