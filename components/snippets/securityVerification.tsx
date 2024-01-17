import React, { useContext, useEffect, useRef, useState } from "react";
import Context from "../contexts/context";
import { AES } from "crypto-js";
import { ToastContainer, toast } from "react-toastify";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { signOut, useSession } from "next-auth/react";
import { Sigmar } from "next/font/google";

interface activeSection {
  setActive: Function;
  setShow: Function;
  setEnable: Function;
  session: any;
  setGoogleAuth?: Function | any;
  sendOtp?: any;
  sendOtpRes?:any;
}

type UserSubmitForm = {
  password: string;
  key: string;
  code: string;
  username?: string;
  otp?: string;
  TwoFA?: boolean;

};

const schema = yup.object().shape({
  password: yup.string().required("Account password is required"),
  key: yup.string().required("Google authenticator key is required"),
  code: yup.string().required("Google authenticator code is required"),
  otp: yup.string().required("OTP is required"),
});

const SecurityVerification = (props: activeSection) => {
  const { mode } = useContext(Context);
  const [fillOtp, setOtp] = useState("");
  const { status, data: session } = useSession()

  const Ref: any = useRef(null);
  const [timeLeft, setTimer] = useState('');
  const [enable, setEnable] = useState(false);

  let {
    register,
    setValue,
    handleSubmit,
    getValues,
    watch,
    setError,
    clearErrors,
    formState: { errors },
  } = useForm<UserSubmitForm>({
    resolver: yupResolver(schema),
  });

  useEffect(() => {
    orderTimeCalculation();
    const inputElements = document.querySelectorAll(".input_wrapper2 input");
    // console.log(inputElements.length);

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
          setValue('otp', (inputElements[0] as HTMLInputElement).value +
            "" +
            (inputElements[1] as HTMLInputElement).value +
            "" +
            (inputElements[2] as HTMLInputElement).value +
            "" +
            (inputElements[3] as HTMLInputElement).value +
            "" +
            (inputElements[4] as HTMLInputElement).value +
            "" +
            (inputElements[5] as HTMLInputElement).value)

          clearErrors("otp");
        }
      });
    });
  }, [props?.sendOtpRes]);

  const onHandleSubmit = async (data: UserSubmitForm) => {
    try {
      let username =
        props.session?.user.email !== "null"
          ? props.session?.user.email
          : props.session?.user?.number;

      if (fillOtp === '') {
        setError("otp", {
          type: "custom",
          message: `Please enter One-Time password`,
        });
        return;
      }
      let request = {
        username: username,
        password: data.password,
        token: data.code,
        secret: data.key,
        otp: fillOtp,
        TwoFA: session?.user?.TwoFA === false ? true : false,
      };

      if (status === 'authenticated') {
        const ciphertext = AES.encrypt(
          JSON.stringify(request),
          `${process.env.NEXT_PUBLIC_SECRET_PASSPHRASE}`
        );
        let record = encodeURIComponent(ciphertext.toString());
        let response = await fetch(
          `${process.env.NEXT_PUBLIC_BASEURL}/user/googleAuth`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: props?.session?.user?.access_token,
            },
            body: JSON.stringify(record),
          }
        ).then((response) => response.json());
        if (response.data.status === 200) {

          toast.success(response.data.data.message);
          setTimeout(() => {
            // signOut()
            props.setGoogleAuth(response.data.data.result)
            props.setShow(false);
            props?.setEnable(0);
          }, 1000)
        } else {
          toast.error(response.data.data);
        }
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
  };

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

  return (
    <>
      {/* <ToastContainer /> */}
      <div className="max-w-[calc(100%-30px)] md:max-w-[510px] w-full p-5 md:p-40 z-10 fixed rounded-10 bg-white dark:bg-omega top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%]">
        <div className="flex items-center justify-between gap-[10px]">
          <svg
            onClick={() => {
              props.setActive(false);
            }}
            xmlns="http://www.w3.org/2000/svg"
            width={24}
            height={24}
            viewBox="0 0 24 24"
            fill="none"
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M20 10.9999H6.135L9.768 7.63991C10.122 7.21591 10.064 6.58491 9.64 6.23191C9.215 5.87791 8.585 5.93591 8.232 6.35991L3.232 11.3599C3.193 11.4069 3.173 11.4619 3.144 11.5139C3.12 11.5559 3.091 11.5919 3.073 11.6379C3.028 11.7529 3.001 11.8739 3.001 11.9959L3 11.9999L3.001 12.0039C3.001 12.1259 3.028 12.2469 3.073 12.3619C3.091 12.4079 3.12 12.4439 3.144 12.4859C3.173 12.5379 3.193 12.5929 3.232 12.6399L8.232 17.6399C8.43 17.8769 8.714 17.9999 9 17.9999C9.226 17.9999 9.453 17.9239 9.64 17.7679C10.064 17.4149 10.122 16.7839 9.768 16.3599L6.135 12.9999H20C20.552 12.9999 21 12.5519 21 11.9999C21 11.4479 20.552 10.9999 20 10.9999Z"
              fill="#9295A6"
            />
          </svg>
          <p className="sec-title w-full">Security Verification</p>
          <svg
            onClick={() => {
              props?.setShow(false);
              props.setActive(false);
              props?.setEnable(0);
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

        <form onSubmit={handleSubmit(onHandleSubmit)}>
          <div className="py-30 md:py-40">
            <div className="flex flex-col mb-[25px] md:mb-30 gap-[10px] md:gap-20 relative">
              <label className="sm-text">Account Password</label>
              <input
                type="password"
                placeholder="Re-Enter password"
                className={`sm-text input-cta2 w-full ${errors.password && 'border-1 border-[#ff0000]'}`}
                {...register("password")}
              />
              {errors.password && (
                <p style={{ color: "red" }} className="absolute top-[100%] text-[10px] md:text-[12px]">{errors.password.message}</p>
              )}
            </div>

            <div className="flex flex-col mb-[25px] md:mb-30 gap-[10px] md:gap-20 relative">
              <label className="sm-text">GA Secret Key</label>
              <input
                type="text"
                placeholder="Enter text"
                className={`sm-text input-cta2 w-full ${errors.key && 'border-1 border-[#ff0000]'}`}
                {...register("key")}
              />
              {errors.key && <p style={{ color: "red" }} className="absolute top-[100%] text-[10px] md:text-[12px]">{errors.key.message}</p>}
            </div>

            <div className="flex flex-col mb-[25px] md:mb-30 gap-[10px] md:gap-20 relative">
              <label className="sm-text">Enter 6 Digit OTP</label>
              <div className="flex gap-[10px] justify-center items-center input_wrapper2 relative">
                <input
                  type="text"
                  autoComplete="off"
                  className={`block px-2 font-noto md:px-5  w-40 md:w-[60px] dark:bg-black bg-primary-100  text-center  rounded min-h-[40px] md:min-h-[62px] text-black dark:text-white outline-none  ${errors.otp && '!border-[1px] !border-[#ff0000]'}`}
                  name="code1"
                />
                <input
                  type="text"
                  autoComplete="off"
                  className={`block px-2 font-noto md:px-5 w-40 md:w-[60px] dark:bg-black bg-primary-100  text-center  rounded min-h-[40px] md:min-h-[62px] text-black dark:text-white outline-none focus:!border-primary ${errors.otp && '!border-[1px] !border-[#ff0000]'} `}
                  name="code2"
                />
                <input
                  type="text"
                  autoComplete="off"
                  className={`block px-2 font-noto md:px-5 w-40 md:w-[60px] dark:bg-black bg-primary-100  text-center  rounded min-h-[40px] md:min-h-[62px] text-black dark:text-white outline-none focus:!border-primary ${errors.otp && '!border-[1px] !border-[#ff0000]'}`}
                  name="code3"
                />
                <input
                  type="text"
                  autoComplete="off"
                  className={`block px-2 font-noto md:px-5 w-40 md:w-[60px] dark:bg-black bg-primary-100  text-center  rounded min-h-[40px] md:min-h-[62px] text-black dark:text-white outline-none focus:!border-primary ${errors.otp && '!border-[1px] !border-[#ff0000]'} `}
                  name="code4"
                />
                <input
                  type="text"
                  autoComplete="off"
                  className={`block px-2 font-noto md:px-5 w-40 md:w-[60px] dark:bg-black bg-primary-100  text-center  rounded min-h-[40px] md:min-h-[62px] text-black dark:text-white outline-none focus:!border-primary ${errors.otp && '!border-[1px] !border-[#ff0000]'}`}
                  name="code5"
                />
                <input
                  type="text"
                  autoComplete="off"
                  className={`block px-2 font-noto md:px-5 w-40 md:w-[60px] dark:bg-black bg-primary-100  text-center  rounded min-h-[40px] md:min-h-[62px] text-black dark:text-white outline-none focus:!border-primary ${errors.otp && '!border-[1px] !border-[#ff0000]'}`}
                  name="code6"
                />
                {errors.otp && <p style={{ color: "red" }} className="absolute top-[calc(100%+3px)] left-0 text-[10px] md:text-[12px]">{errors.otp.message}</p>}
              </div>
              <div className={`flex  ${enable === true ? '' : 'hidden'}`}>
                <p className={`info-10-14 px-2 text-end md-text`}>Your OTP will expire within </p>
                <p className={`info-10-14 text-end md-text`}> {timeLeft}</p>
              </div>
              <p className={`info-14-18 !text-primary-700 text-end cursor-pointer ${enable === true ? 'hidden' : ''}` } onClick={() => props.sendOtp()}>Resend SMS</p>
            </div>
            <div className="flex flex-col mb-[25px] md:mb-30 gap-[10px] md:gap-20 relative">
              <label className="sm-text">GA 6 Digit Security Code</label>
              <input
                type="text"
                placeholder="Enter text"
                className={`sm-text input-cta2 w-full  ${errors.code && 'border-1 border-[#ff0000]'}`}
                {...register("code")}
              />
              {errors.code && (
                <p style={{ color: "red" }} className="absolute top-[calc(100%+3px)] left-0 text-[10px] md:text-[12px]">{errors.code.message}</p>
              )}
            </div>
          </div>
          <div className="flex flex-col md:flex-row gap-[10px] md:gap-[20px]">
            <button
              className="solid-button2 w-full "
              onClick={() => {
                props.setShow(false);
                props?.setEnable(0);
              }}
            >
              Cancel
            </button>
            <button className="solid-button px-[51px] w-full" onClick={() => { }}>
              Finish Setup
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default SecurityVerification;
