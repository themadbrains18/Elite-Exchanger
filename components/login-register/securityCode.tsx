import React, { useContext, useEffect, useRef, useState } from "react";
import Image from "next/image";
import HeaderLogo from "../svg-snippets/headerLogo";
import { useRouter } from "next/router";
import { signIn } from "next-auth/react"
import { toast } from 'react-toastify';
import AES from 'crypto-js/aes';

interface propsData {
  formData?: any,
  api?: string,
  sendOtpRes?:any;
}

const SecurityCode = (props: propsData) => {

  const router = useRouter()
  const [fillOtp, setOtp] = useState('');
  const [otpMessage, setOtpMessage] = useState('');
  const Ref: any = useRef(null);
  const [timeLeft, setTimer] = useState('');
  const [enable, setEnable] = useState(false);

  useEffect(() => {

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
          // continue to input the rest of the string
          (inputElements[index + 1] as HTMLElement).focus();
          (inputElements[index + 1] as HTMLInputElement).value = rest.join("");
          inputElements[index + 1].dispatchEvent(new Event("input"));
        } else {
          setOtp((inputElements[0] as HTMLInputElement).value + '' + (inputElements[1] as HTMLInputElement).value + '' + (inputElements[2] as HTMLInputElement).value + '' + (inputElements[3] as HTMLInputElement).value + '' + (inputElements[4] as HTMLInputElement).value + '' + (inputElements[5] as HTMLInputElement).value);
        }
      });
    });

    orderTimeCalculation(props?.sendOtpRes);

  }, [])

  const matchUserOtp = async () => {
    try {
      props.formData.step = 3;
      props.formData.otp = fillOtp;

      if (fillOtp === '') {
        setOtpMessage('Please enter One-Time password to authenticate.');
        return;
      }
      setOtpMessage('');
      const ciphertext = AES.encrypt(JSON.stringify(props.formData), `${process.env.NEXT_PUBLIC_SECRET_PASSPHRASE}`);
      let record = encodeURIComponent(ciphertext.toString());

      let response = await fetch(`/api/user/${props.api}`, {
        method: "POST",
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(record)
      }).then(response => response.json());

      if (response.data.status === 200) {

        if (props.api === 'login') {
          signIn("credentials", response?.data?.data.user);
        }
        else if (props.api === 'register') {
          toast.success('Otp Matched');
          router.push('/login');
        }
        else if (props.api === 'forget') {
          toast.success(response?.data?.message);
          router.push('/login');
        }
      }
      else {
        toast.error(response.data.message!==undefined?response.data.message: response.data.data);
      }

    } catch (error) {
      console.log(error);
    }
  }

  const orderTimeCalculation = async (otpRes:any) => {
    setEnable(true);
    let deadline = new Date(otpRes?.expire);

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
      setOtp('')
      setEnable(false);
    }
  }


  /**
   * calculate time left for order to payment pay by buyer
   * @param e 
   */
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
      setOtp('');
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

  const sendOtp = async () => {
    try {
      props.formData.step = 2;
      props.formData.otp="";
      const ciphertext = AES.encrypt(
        JSON.stringify(props.formData),
        `${process.env.NEXT_PUBLIC_SECRET_PASSPHRASE}`
      );
      let record = encodeURIComponent(ciphertext.toString());

      let userExist = await fetch(
        `/api/user/${props.api}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(record),
        }
      ).then((response) => response.json());

      if (props?.api === "forget") {
        if (userExist.status === 200) {
          toast.success(userExist?.data?.message);
          orderTimeCalculation(userExist?.data?.otp);
        } else {
          setEnable(false);
          toast.error(userExist.data);
        }
      } else {
        
        if (userExist.data.status === 200) {
          setEnable(true);
          toast.success(userExist?.data?.data?.message);
          orderTimeCalculation(userExist?.data?.data?.otp);
        } else {
          setEnable(false);                 
          toast.error(userExist.data.data);
        }
      }
    } catch (error) {
      setEnable(false);
      console.log(error);
    }
  };

  return (
    <section className="bg-primary-300 lg:dark:bg-black-v-1 h-screen xl:h-full  lg:bg-bg-primary ">
      <div className="flex gap-5 bg-[url('/assets/register/ellipsebg.svg')] bg-[length:75%]  bg-no-repeat lg:bg-none">
        <div className="max-w-[1018px]  w-full lg:block hidden">
          <Image src="/assets/register/register.png" width={1018} height={1100} alt="signup" className="object-cover h-full block" />
        </div>
        <div className="max-w-[902px] w-full ">
          <div className="py-[30px] lg:py-[40px]  max-w-[710px] w-full my-0 mx-auto pr-5 flex justify-end items-center cursor-pointer" onClick={() => { router.push("/") }}>
            <HeaderLogo />
          </div>
          <div className="lg:hidden block">
            <Image src="/assets/register/loginmobile.svg" alt="forget" width={398} height={198} className="mx-auto" />
          </div>
          <div className="mt-0 lg:mt-[180px] lg:p-0 p-5  max-w-[calc(100%-30px)] md:mx-0 mx-auto  lg:bg-[transparent] lg:dark:bg-[transparent] bg-white lg:rounded-none rounded-10 dark:bg-d-bg-primary md:max-w-[562px] w-full">
            <h1 className="lg-heading text-center mb-5">Enter your security code</h1>
            <p className="mb-5 text-center  lg:mb-[70px] md-text">We texted your code to {props.formData.username}</p>
            <div className="flex gap-[10px] md:gap-[30px] justify-center items-center input_wrapper">
              <input type="text" data-testid={`otp-input-1`} autoComplete="off" className="block px-2 font-noto md:px-4 w-[40px] md:w-[46px] dark:bg-black bg-primary-100 border text-center border-black dark:border-white rounded min-h-[40px] md:min-h-[46px] text-black dark:text-white outline-none focus:!border-primary" name="code1" />
              <input type="text" data-testid={`otp-input-2`} autoComplete="off" className="block px-2 font-noto md:px-4 w-[40px] md:w-[46px] dark:bg-black bg-primary-100 border text-center border-black dark:border-white rounded min-h-[40px] md:min-h-[46px] text-black dark:text-white outline-none focus:!border-primary" name="code2" />
              <input type="text" data-testid={`otp-input-3`} autoComplete="off" className="block px-2 font-noto md:px-4 w-[40px] md:w-[46px] dark:bg-black bg-primary-100 border text-center border-black dark:border-white rounded min-h-[40px] md:min-h-[46px] text-black dark:text-white outline-none focus:!border-primary" name="code3" />
              <input type="text" data-testid={`otp-input-4`} autoComplete="off" className="block px-2 font-noto md:px-4 w-[40px] md:w-[46px] dark:bg-black bg-primary-100 border text-center border-black dark:border-white rounded min-h-[40px] md:min-h-[46px] text-black dark:text-white outline-none focus:!border-primary" name="code4" />
              <input type="text" data-testid={`otp-input-5`} autoComplete="off" className="block px-2 font-noto md:px-4 w-[40px] md:w-[46px] dark:bg-black bg-primary-100 border text-center border-black dark:border-white rounded min-h-[40px] md:min-h-[46px] text-black dark:text-white outline-none focus:!border-primary" name="code5" />
              <input type="text" data-testid={`otp-input-6`} autoComplete="off" className="block px-2 font-noto md:px-4 w-[40px] md:w-[46px] dark:bg-black bg-primary-100 border text-center border-black dark:border-white rounded min-h-[40px] md:min-h-[46px] text-black dark:text-white outline-none focus:!border-primary" name="code6" />
            </div>
            <p className="mb-5 text-center lg:mt-[20px] md-text" style={{ color: 'red' }}>{otpMessage}</p>
            <div className={`flex  ${enable === true ? '' : 'hidden'}`}>
              <p className={`info-10-14 px-2 text-end lg:pl-[60px] pl-[30px] md-text`}>Your OTP will expire within </p>
              <p className={`info-10-14 text-end md-text`}> {timeLeft}</p>
            </div>

            <p className={`info-10-14 text-end cursor-pointer lg:pr-[60px] pr-[30px] !text-primary-700 ${enable === true ? 'hidden' : ''}`} onClick={() => sendOtp()}>
              Resend Code
            </p>
            <button className="my-[30px] lg:my-[50px] solid-button w-full hover:bg-primary-600" onClick={() => {
              matchUserOtp()
            }}>Continue</button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SecurityCode;
