import Image from "next/image";
import React, { useContext, useEffect, useRef, useState } from "react";
import Context from "../contexts/context";
import SecurityVerification from "./securityVerification";
import QRCode from "qrcode";
import { useSession } from "next-auth/react";
import { toast } from 'react-toastify';
import { AES } from "crypto-js";
import clickOutSidePopupClose from "./clickOutSidePopupClose";
import CodeNotRecieved from "./codeNotRecieved";


interface activeSection {
  setShow: any;
  setEnable: Function;
  session: any;
  setGoogleAuth: Function;
}

const GoogleAuth = (props: activeSection) => {
  // console.log(props?.session,"==props?.session?.secret");
  const [popup, setPopup] = useState(false);
  const { mode } = useContext(Context);
  const [active, setActive] = useState(false)
  // const [qrImg, setImage] = useState('');
  // const [sendOtpRes, setSendOtpRes] = useState<any>();
  const [enable, setEnable] = useState(false);
  const [timeLeft, setTimer] = useState('');
  const [fillOtp, setOtp] = useState("");
  const [btnDisabled, setBtnDisabled] = useState(false);
  const [otpMessage, setOtpMessage] = useState('');
  const Ref: any = useRef(null);
  const [reqCount, setReqCount] = useState(0);
  const previousToasts = useRef([]);

  useEffect(() => {
    // QRCode.toDataURL(secret.otpauth_url, (err, image_data: any) => {
    //   setImage(image_data);
    // })
    sendOtp();
    const inputElements = document.querySelectorAll(".input_wrapper2 input");
    inputElements.forEach((ele, index) => {
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
          // continue to input the rest of the string
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
  }, [])


  const sendOtp = async () => {
    try {

      let obj = {};
      let username = props.session?.user.email !== "null"
        ? props.session?.user.email
        : props.session?.user?.number;
      obj = {
        username: username,
        otp: "string",
      }
      const ciphertext = AES.encrypt(
        JSON.stringify(obj),
        `${process.env.NEXT_PUBLIC_SECRET_PASSPHRASE}`
      );
      let record = encodeURIComponent(ciphertext.toString());

      let userExist = await fetch(
        `${process.env.NEXT_PUBLIC_BASEURL}/otp/send`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: props?.session?.user?.access_token,
          },
          body: JSON.stringify(record),
        }
      );
      let res = await userExist.json();
      if (res.data.status === 200) {
        let expireTime = res?.data?.data?.otp?.expire;
        orderTimeCalculation(expireTime);
      }

    } catch (error) {
      console.log(error);
    }
  };

  const orderTimeCalculation = async (expireTime: any) => {
    setEnable(true);
    let deadline = new Date(expireTime);

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
      const inputElements = document.querySelectorAll(".input_wrapper2 input");
          inputElements.forEach((ele, index) => {
            (inputElements[index] as HTMLInputElement).value = ""
          })
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
      const inputElements = document.querySelectorAll(".input_wrapper2 input");
      inputElements.forEach((ele, index) => {
        (inputElements[index] as HTMLInputElement).value = ""
      })
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

  const confirmUserOtp = async () => {
    try {
      setBtnDisabled(true);
      // if (reqCount >= 3) {
      //   toast.error('Too many try with wrong code. Please request a new verification code.', { position: "top-center" });
      //   setTimeout(()=>{
      //     props?.setShow(false);
      //     props.setEnable(0);
      //     return;

      //   },3000)
      // }

      if (fillOtp === '') {
        setOtpMessage('Please enter One-Time password to authenticate.');
        setTimeout(() => {
          setOtpMessage('');
        }, 3000);
        setBtnDisabled(false);
        return;
      }

      let obj = {};
      let username = props.session?.user.email !== "null"
        ? props.session?.user.email
        : props.session?.user?.number;
      obj = {
        username: username,
        otp: fillOtp,
      }

      let optConfirm = await fetch(
        `${process.env.NEXT_PUBLIC_BASEURL}/otp`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: props?.session?.user?.access_token,
          },
          body: JSON.stringify(obj),
        }
      );

      let response = await optConfirm.json();

      if (response?.data?.status === 200) {
        clearInterval(Ref.current);
        const inputElements = document.querySelectorAll(".input_wrapper2 input");
        inputElements.forEach((ele, index) => {
          (inputElements[index] as HTMLInputElement).value = ""
        })
        setTimer('');
        setActive(true);
        setBtnDisabled(false);
      }
      else {
        toast.error(response?.data?.data, { autoClose: 3000 });
        setTimeout(() => {
          
          setReqCount(reqCount + 1);
          setBtnDisabled(false);
        }, 3005);
      }
    } catch (error) {
      console.log(error);
    }
  }

  const closePopup = () => {
    props?.setShow(false);
    props.setEnable(0);
  }
  const wrapperRef = useRef(null);
  clickOutSidePopupClose({ wrapperRef, closePopup });

  return (
    <div ref={wrapperRef}>
      <div className={`duration-300 max-w-[calc(100%-30px)] md:max-w-[510px] w-full p-5 md:p-40 z-10 fixed rounded-10 bg-white dark:bg-omega top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%]`}>
        <div className="flex items-center justify-between">
          <p className="sec-title" style={{ fontSize: '18px' }}>Set Up Google Two-Factor Authentication</p>
          <svg
            onClick={() => {
              props.setShow(false);
              props?.setEnable(0)
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
        <div className="flex flex-col mt-[25px] mb-[25px] md:mb-30 gap-[10px] md:gap-20 relative">
          <label className="sm-text">A verification code will be sent to {props?.session?.user?.email.split("@")[0].substring(0, 3)}***@{props?.session?.user?.email.split("@")[1]}</label>
          <div>
            <div className="flex gap-[10px] justify-center items-center input_wrapper2 relative">
              <input
                type="text"
                autoComplete="off"
                className={`block px-2 font-noto md:px-5  w-40 md:w-[60px] dark:bg-black bg-primary-100  text-center  rounded min-h-[40px] md:min-h-[62px] text-black dark:text-white outline-none `}
                name="code1"
              />
              <input
                type="text"
                autoComplete="off"
                className={`block px-2 font-noto md:px-5 w-40 md:w-[60px] dark:bg-black bg-primary-100  text-center  rounded min-h-[40px] md:min-h-[62px] text-black dark:text-white outline-none focus:!border-primary  `}
                name="code2"
              />
              <input
                type="text"
                autoComplete="off"
                className={`block px-2 font-noto md:px-5 w-40 md:w-[60px] dark:bg-black bg-primary-100  text-center  rounded min-h-[40px] md:min-h-[62px] text-black dark:text-white outline-none focus:!border-primary `}
                name="code3"
              />
              <input
                type="text"
                autoComplete="off"
                className={`block px-2 font-noto md:px-5 w-40 md:w-[60px] dark:bg-black bg-primary-100  text-center  rounded min-h-[40px] md:min-h-[62px] text-black dark:text-white outline-none focus:!border-primary  `}
                name="code4"
              />
              <input
                type="text"
                autoComplete="off"
                className={`block px-2 font-noto md:px-5 w-40 md:w-[60px] dark:bg-black bg-primary-100  text-center  rounded min-h-[40px] md:min-h-[62px] text-black dark:text-white outline-none focus:!border-primary`}
                name="code5"
              />
              <input
                type="text"
                autoComplete="off"
                className={`block px-2 font-noto md:px-5 w-40 md:w-[60px] dark:bg-black bg-primary-100  text-center  rounded min-h-[40px] md:min-h-[62px] text-black dark:text-white outline-none focus:!border-primary `}
                name="code6"
              />
              {/* {errors.otp && <p style={{ color: "red" }} className="absolute top-[calc(100%+3px)] left-0 text-[10px] md:text-[12px]">{errors.otp.message}</p>} */}
            </div>
            <p className="mb-5 text-center lg:mt-[20px] md-text" style={{ color: 'red' }}>{otpMessage}</p>
          </div>
          <div className={`flex  ${enable === true ? '' : 'hidden'}`}>
            <p className={`info-10-14 px-2 text-end md-text`}>Your OTP will expire within </p>
            <p className={`info-10-14 text-end md-text`}> {timeLeft}</p>
          </div>
          {enable === false &&
            <div className="text-end">
              <button
                className="info-10-14 text-end cursor-pointer hover:text-primary"
                onClick={() => sendOtp()}
                disabled={enable}
              >
                Resend SMS
              </button>
            </div>
          }

          {/* <p className={`info-14-18 !text-primary-700 text-end cursor-pointer ${enable === true ? 'hidden' : ''}`} onClick={() => sendOtp()}>Resend SMS</p> */}
        </div>
        <div className="flex gap-[20px]">
          <button className="solid-button2 w-full " onClick={() => {
            props.setShow(false);
            props?.setEnable(0)
          }}>Cancel</button>
          <button disabled={btnDisabled} className={`solid-button px-[51px] w-full ${btnDisabled === true?'cursor-not-allowed':""}`} onClick={() => { btnDisabled === false ? confirmUserOtp() : '' }}>{btnDisabled &&
            <svg aria-hidden="true" role="status" className="inline w-4 h-4 me-3 text-white animate-spin" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="#E5E7EB" />
              <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentColor" />
            </svg>
          }Confirm</button>
        </div>
        <p className={`info-10-14 text-start cursor-pointer  inline-block !text-primary mt-[10px]`} onClick={() => { setPopup(true); props.setShow(false); }}>
          Didn't receive the code?
        </p>
      </div>
      {
        active &&
        <SecurityVerification setShow={props?.setShow} setEnable={props.setEnable} setActive={setActive} session={props?.session} setGoogleAuth={props.setGoogleAuth} sendOtp={sendOtp} />
      }
      {
        popup &&
        <CodeNotRecieved setEnable={setPopup} setShow={props?.setShow} />
      }
    </div>
  );
};

export default GoogleAuth;
