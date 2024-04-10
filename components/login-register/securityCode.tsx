import React, { useContext, useEffect, useRef, useState } from "react";
import Image from "next/image";
import HeaderLogo from "../svg-snippets/headerLogo";
import { useRouter } from "next/router";
import { signIn } from "next-auth/react"
import { toast } from 'react-toastify';
import AES from 'crypto-js/aes';
import ResetSuccessful from "../snippets/resetSuccessful";
import CodeNotRecieved from "../snippets/codeNotRecieved";

interface propsData {
  formData?: any,
  data?: any,
  api?: string,
  setStep?: Function | undefined,
  sendOtpRes?: any;
  isEmail?: boolean;
  isNumber?: boolean;
}

const SecurityCode = (props: propsData) => {

  const router = useRouter()
  const [fillOtp, setOtp] = useState('');
  const [fillOtp2, setOtp2] = useState('');
  const [otpMessage, setOtpMessage] = useState('');
  const Ref: any = useRef(null);
  const [timeLeft, setTimer] = useState('');
  const [enable, setEnable] = useState(false);
  const [popup, setPopup] = useState(false);
  const [btnDisabled, setBtnDisabled] = useState(false);
  const [emailSplit, setEmailSplit] = useState('');

  const [reqCount, setReqCount] = useState(0);

  useEffect(() => {

    if (props.isEmail && props.formData?.username !== null) {

      let str = props.formData?.username.split('@');
      let substring = str[0].substring(0, 3);
      setEmailSplit(substring + '****@' + str[1])
    }
    const inputElements = document.querySelectorAll(".input_wrapper input");
    const inputElements2 = document.querySelectorAll(".input_wrapper2 input");
    inputElements?.forEach((ele, index) => {
      ele.addEventListener("keydown", (e: any) => {
        if (e.keyCode === 8 && e.target.value === "") {
          (inputElements[Math.max(0, index - 1)] as HTMLElement).focus();
        }
      });
      ele.addEventListener("input", (e: any) => {
        setOtpMessage('');
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

    inputElements2?.forEach((ele, index) => {
      ele.addEventListener("keydown", (e: any) => {
        if (e.keyCode === 8 && e.target.value === "") {
          (inputElements[Math.max(0, index - 1)] as HTMLElement).focus();
        }
      });
      ele.addEventListener("input", (e: any) => {
        setOtpMessage('');
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
          setOtp2((inputElements[0] as HTMLInputElement).value + '' + (inputElements[1] as HTMLInputElement).value + '' + (inputElements[2] as HTMLInputElement).value + '' + (inputElements[3] as HTMLInputElement).value + '' + (inputElements[4] as HTMLInputElement).value + '' + (inputElements[5] as HTMLInputElement).value);
        }
      });
    });

  }, [])

  const matchUserOtp = async () => {
    try {
      setBtnDisabled(true);
      if (reqCount >= 3) {
        toast.error('Too many try with wrong code. Please request a new verification code.', { position: "top-center" });
        setTimeout(() => {
          router.reload()
        }, 4000);
      }
      props.formData.step = 3;
      props.formData.otp = fillOtp;

      if (fillOtp === '') {
        setOtpMessage('Please enter One-Time password to authenticate.');
        setTimeout(() => {
          setOtpMessage('');
        }, 3000);
        setBtnDisabled(false);
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
          toast.success('You are register successfully and it redirect to login page in short time and login to access your account.', { position: 'top-center' });
          setTimeout(() => {
            router.push('/login');
          }, 5000);
        }
        else if (props.api === 'forget') {
          props?.setStep !== undefined && props?.setStep(3)
          // setSuccessModal(true)
          // toast.success(response?.data?.message);
          // router.push('/login');
        }
      }
      else {
        toast.error(response.data.message !== undefined ? response.data.message : response.data.data, { autoClose: 2500 });
        setTimeout(() => {
          setBtnDisabled(false);
          setReqCount(reqCount + 1);
        }, 3000);
      }
    } catch (error) {
      console.log(error);
    }
  }

  const orderTimeCalculation = async (otpRes: any) => {

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
      const inputElements = document.querySelectorAll(".input_wrapper input");
      inputElements?.forEach((ele, index) => {
        (inputElements[index] as HTMLInputElement).value = ""
      });
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
      const inputElements = document.querySelectorAll(".input_wrapper input");
      inputElements?.forEach((ele, index) => {
        (inputElements[index] as HTMLInputElement).value = ""
      });
      setOtp('');
      props.formData.step = 2;
      props.formData.otp = "";
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
        if (userExist.data?.otp !== undefined) {
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

  const handleKeyDown = (event: any) => {
    if (event.key === "Enter") {
      if (fillOtp.length === 6) {
        matchUserOtp();

      }
      else {
        setOtpMessage('Please enter One-Time password to authenticate.');
        setTimeout(() => {
          setOtpMessage('');
        }, 3000);
        return;
      }
    }

  };

  return (
    <>
      <section className="bg-primary-300 lg:dark:bg-black-v-1 xl:h-full  lg:bg-bg-primary ">
        <div className="flex min-h-screen h-full gap-5 bg-[url('/assets/register/ellipsebg.svg')] bg-[length:75%]  bg-no-repeat lg:bg-none ">
          <div className="max-w-full lg:max-w-[50%]  w-full lg:block hidden">
            <Image src={props.api === 'forget' ? '/assets/register/forget.png' : "/assets/register/register.png"} width={1018} height={1100} alt="signup" className="object-cover h-screen block w-full" />
          </div>
          <div className={`max-w-full lg:max-w-[50%] flex flex-col justify-center w-full ${props.api === 'forget' ? 'items-center' : ''}`}>
            <div className="max-w-[460px] w-full] max-[1023px]:mx-auto">
              <div className="py-[30px] lg:py-[40px]  max-w-[460px] w-full my-0 pr-5 flex justify-end items-center cursor-pointer" onClick={() => { router.push("/") }}>
                <HeaderLogo />
              </div>
              <div className="lg:hidden block">
                <Image src="/assets/register/loginmobile.svg" alt="forget" width={398} height={198} className="mx-auto" />
              </div>
              <div className="mt-0 lg:mt-[180px]  max-[1023px]:!mx-auto lg:p-0 p-5  max-w-[calc(100%-30px)] mx-auto  lg:bg-[transparent] lg:dark:bg-[transparent] bg-white lg:rounded-none rounded-10 dark:bg-d-bg-primary md:max-w-[460px] w-full">
                <h1 className="lg-heading  mb-5">Enter your security code</h1>
                {props.isEmail && <div>
                  <p className="mb-5  md-text">We texted your code to {props.formData?.username !== null && emailSplit}</p>
                  <div className="flex gap-[10px] md:gap-[30px] justify-between items-center input_wrapper">
                    <input type="text" onKeyDown={(e) => { handleKeyDown(e) }} data-testid={`otp-input-1`} autoComplete="off" className="block px-2 font-noto  md:px-3 w-[40px] md:w-[46px] dark:bg-black bg-primary-100 border text-center border-black dark:border-white rounded min-h-[40px] md:min-h-[46px] text-black dark:text-white outline-none focus:!border-primary" name="code1" />
                    <input type="text" onKeyDown={(e) => { handleKeyDown(e) }} data-testid={`otp-input-2`} autoComplete="off" className="block px-2 font-noto  md:px-3 w-[40px] md:w-[46px] dark:bg-black bg-primary-100 border text-center border-black dark:border-white rounded min-h-[40px] md:min-h-[46px] text-black dark:text-white outline-none focus:!border-primary" name="code2" />
                    <input type="text" onKeyDown={(e) => { handleKeyDown(e) }} data-testid={`otp-input-3`} autoComplete="off" className="block px-2 font-noto  md:px-3 w-[40px] md:w-[46px] dark:bg-black bg-primary-100 border text-center border-black dark:border-white rounded min-h-[40px] md:min-h-[46px] text-black dark:text-white outline-none focus:!border-primary" name="code3" />
                    <input type="text" onKeyDown={(e) => { handleKeyDown(e) }} data-testid={`otp-input-4`} autoComplete="off" className="block px-2 font-noto  md:px-3 w-[40px] md:w-[46px] dark:bg-black bg-primary-100 border text-center border-black dark:border-white rounded min-h-[40px] md:min-h-[46px] text-black dark:text-white outline-none focus:!border-primary" name="code4" />
                    <input type="text" onKeyDown={(e) => { handleKeyDown(e) }} data-testid={`otp-input-5`} autoComplete="off" className="block px-2 font-noto  md:px-3 w-[40px] md:w-[46px] dark:bg-black bg-primary-100 border text-center border-black dark:border-white rounded min-h-[40px] md:min-h-[46px] text-black dark:text-white outline-none focus:!border-primary" name="code5" />
                    <input type="text" onKeyDown={(e) => { handleKeyDown(e) }} data-testid={`otp-input-6`} autoComplete="off" className="block px-2 font-noto  md:px-3 w-[40px] md:w-[46px] dark:bg-black bg-primary-100 border text-center border-black dark:border-white rounded min-h-[40px] md:min-h-[46px] text-black dark:text-white outline-none focus:!border-primary" name="code6" />
                  </div>
                  <p className="mb-5 text-center lg:mt-[20px] md-text" style={{ color: 'red' }}>{otpMessage}</p>
                  <div className={`flex  ${enable === true ? '' : 'hidden'}`}>
                    <p className={`info-10-14 text-end  px-2 pl-0 md-text`}>Your OTP will expire within </p>
                    <p className={`info-10-14 text-end md-text`}> {timeLeft}</p>
                  </div>

                  <p className={`info-10-14 text-end cursor-pointer  !text-primary-700 ${enable === true ? 'hidden' : ''}`} onClick={() => { setEnable(true); sendOtp() }}>
                    Resend Code
                  </p>

                </div>}


                {(props?.isEmail == false || (props.data !== undefined && props.data?.number !== null)) && <div className="mt-[20px]">
                  <p className="mb-5  md-text">We texted your code to {props?.isEmail == false ? props?.formData?.username : props.data?.number !== null && props?.data?.number}</p>
                  <div className="flex gap-[10px] md:gap-[30px] justify-between items-center input_wrapper2">
                    <input type="text" onKeyDown={(e) => { handleKeyDown(e) }} data-testid={`otp-input-11`} autoComplete="off" className="block px-2 font-noto  md:px-3 w-[40px] md:w-[46px] dark:bg-black bg-primary-100 border text-center border-black dark:border-white rounded min-h-[40px] md:min-h-[46px] text-black dark:text-white outline-none focus:!border-primary" name="code21" />
                    <input type="text" onKeyDown={(e) => { handleKeyDown(e) }} data-testid={`otp-input-22`} autoComplete="off" className="block px-2 font-noto  md:px-3 w-[40px] md:w-[46px] dark:bg-black bg-primary-100 border text-center border-black dark:border-white rounded min-h-[40px] md:min-h-[46px] text-black dark:text-white outline-none focus:!border-primary" name="code22" />
                    <input type="text" onKeyDown={(e) => { handleKeyDown(e) }} data-testid={`otp-input-33`} autoComplete="off" className="block px-2 font-noto  md:px-3 w-[40px] md:w-[46px] dark:bg-black bg-primary-100 border text-center border-black dark:border-white rounded min-h-[40px] md:min-h-[46px] text-black dark:text-white outline-none focus:!border-primary" name="code23" />
                    <input type="text" onKeyDown={(e) => { handleKeyDown(e) }} data-testid={`otp-input-44`} autoComplete="off" className="block px-2 font-noto  md:px-3 w-[40px] md:w-[46px] dark:bg-black bg-primary-100 border text-center border-black dark:border-white rounded min-h-[40px] md:min-h-[46px] text-black dark:text-white outline-none focus:!border-primary" name="code24" />
                    <input type="text" onKeyDown={(e) => { handleKeyDown(e) }} data-testid={`otp-input-55`} autoComplete="off" className="block px-2 font-noto  md:px-3 w-[40px] md:w-[46px] dark:bg-black bg-primary-100 border text-center border-black dark:border-white rounded min-h-[40px] md:min-h-[46px] text-black dark:text-white outline-none focus:!border-primary" name="code25" />
                    <input type="text" onKeyDown={(e) => { handleKeyDown(e) }} data-testid={`otp-input-66`} autoComplete="off" className="block px-2 font-noto  md:px-3 w-[40px] md:w-[46px] dark:bg-black bg-primary-100 border text-center border-black dark:border-white rounded min-h-[40px] md:min-h-[46px] text-black dark:text-white outline-none focus:!border-primary" name="code26" />
                  </div>
                  <p className="mb-5 text-center lg:mt-[20px] md-text" style={{ color: 'red' }}>{otpMessage}</p>
                  <div className={`flex  ${enable === true ? '' : 'hidden'}`}>
                    <p className={`info-10-14 px-2 pl-0 text-end  md-text`}>Your OTP will expire within </p>
                    <p className={`info-10-14 text-end md-text`}> {timeLeft}</p>
                  </div>

                  <p className={`info-10-14 text-end cursor-pointer  !text-primary-700 ${enable === true ? 'hidden' : ''}`} onClick={() => { setEnable(true); sendOtp(); setReqCount(0); }}>
                    Resend Code
                  </p>

                </div>}
                <button disabled={btnDisabled} className={`my-[30px] lg:mt-[50px] mb-[10px] solid-button w-full hover:bg-primary-800 ${btnDisabled === true ? 'cursor-not-allowed ':''}`} onClick={() => {
                  btnDisabled === false ? matchUserOtp() : ''
                }}>
                  {btnDisabled &&
                    <svg aria-hidden="true" role="status" className="inline w-4 h-4 me-3 text-white animate-spin" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="#E5E7EB" />
                      <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentColor" />
                    </svg>
                  }Continue</button>
              </div>
              <p className={`info-10-14 text-start cursor-pointer max-[1023px]:px-[20px] inline-block !text-primary `} onClick={() => { setPopup(true) }}>
                Didn't receive the code?
              </p>
            </div>
          </div>
        </div>
      </section>
      {
        popup &&
        <CodeNotRecieved setEnable={setPopup} />
      }

    </>
  );
};

export default SecurityCode;
