import React, { useContext, useEffect, useRef, useState } from "react";
import Context from "../contexts/context";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { AES } from "crypto-js";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { signOut, useSession } from "next-auth/react";
import clickOutSidePopupClose from "../snippets/clickOutSidePopupClose";
import CodeNotRecieved from "../snippets/codeNotRecieved";
import Image from "next/image";

interface activeSection {
  setActive: Function;
  setShow: Function;
  setStep: Function;
  type: string;
  formData: any;
  secondExpireTime?: any;
  sendSessionOtp: Function;
}

const schema = yup.object().shape({
  password: yup.string().required("Password is required."),
});

const Password = (props: activeSection) => {
  const { mode } = useContext(Context);
  const [fillOtp2, setOtp2] = useState("");
  let { data: session, status } = useSession();
  const [popup, setPopup] = useState(false);

  const [otpMessage, setOtpMessage] = useState('');
  const [showTime, setShowTime] = useState(true);
  const [timeLeft, setTimer] = useState('');
  const Ref: any = useRef(null);
  const [statuss, setStatuss] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const [btnDisabled, setBtnDisabled] = useState(false);
  const [showpswd, setShowPswd] = useState(false);

  let {
    register,
    setValue,
    handleSubmit,
    getValues,
    watch,
    setError,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  useEffect(() => {
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
          setOtp2(
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
  }, []);


  useEffect(()=>{
    orderTimeCalculation(props.secondExpireTime);

  },[props.secondExpireTime])

  const orderTimeCalculation = async (expireTime: any) => {
    setShowTime(true);
    setStatuss(false);
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
      setShowTime(false);
      setStatuss(true);
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
      setShowTime(false);
      setStatuss(true);
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

  const onHandleSubmit = async (data: any) => {
    try {
      if (fillOtp2 === '') {
        setOtpMessage('Please enter One-Time password to authenticate.');
        setTimeout(() => {
          setOtpMessage('');
        }, 3000);
        return;
      }
      setBtnDisabled(true);
      let obj = {};
      // let type =  props.session?.user.email!=='null'?'email':'number'
      if (props?.type === "email") {
        let username =
          props?.type == "email" && session?.user.email !== "null"
            ? session?.user.email
            : session?.user?.number;
        obj = {
          username: username,
          data: props?.formData,
          otp: fillOtp2,
          password: data?.password,
        };
      }
      if (props?.type === "number") {
        let username =
          props?.type == "number" && session?.user.number !== "null"
            ? session?.user.number
            : session?.user?.email;
        obj = {
          username: username,
          data: props?.formData,
          otp: fillOtp2,
          password: data?.password,
        };
      }
      if (session !== undefined && session?.user !== undefined) {
        const ciphertext = AES.encrypt(
          JSON.stringify(obj),
          `${process.env.NEXT_PUBLIC_SECRET_PASSPHRASE}`
        );
        let record = encodeURIComponent(ciphertext.toString());

        let userExist = await fetch(
          `${process.env.NEXT_PUBLIC_BASEURL}/user/update`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: session?.user?.access_token,
            },
            body: JSON.stringify(record),
          }
        );
        let res = await userExist.json();
        // console.log(res,"res");
        

        if (res.data.message !== undefined) {
          toast.error(res.data.message, { autoClose: 2000 });
          setTimeout(() => {
            setBtnDisabled(false);
          }, 3000);
        } else {
          // return;
          // console.log(res,"=========res.data");
          
          toast.success(res.data.data + ' and you will be redirect on login page in  short time,',{position : 'top-center'});
          setTimeout(() => {
            signOut();
            // props?.setActive(0),
            // props?.setShow(false), 
            // props?.setStep(false);
          }, 1000);
        }
      } else {
        toast.error("Your session is expired. Its auto redirect to login page");
        setTimeout(() => {
          signOut();
        }, 4000);
      }
    } catch (error) {
      console.log(error, "=error password")
      setBtnDisabled(false);
    }
  };

  const closePopup = () => {
    props?.setShow(false);
    props.setActive(0);
  }
  const wrapperRef = useRef(null);
  clickOutSidePopupClose({ wrapperRef, closePopup });

  return (
    <div ref={wrapperRef} className="max-w-[calc(100%-30px)] md:max-w-[510px] w-full p-5 md:p-40 z-10 fixed rounded-10 bg-white dark:bg-omega top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%]">
      <>
        <div className="flex items-center justify-between ">
          <p className="sec-title">{props?.type === "email"
            ? "Add Email Address"
            : "Add Mobile Number"}</p>
          <svg
            onClick={() => {
              props?.setShow(false);
              props.setActive(0);
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

        <form onSubmit={handleSubmit(onHandleSubmit)} onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
              }
            }}>
          <div className="py-30 md:py-40">
            <div className="flex flex-col mb-[15px] md:mb-30 gap-20">
              <label className="sm-text">
                Enter Old {props?.type === "Email" ? "SMS" : "Email"} 6 Digit OTP
              </label>
              <div className="flex gap-10 justify-center items-center input_wrapper2">
                <input
                  type="text"
                  autoComplete="off"
                  className="block px-2 font-noto md:px-5  w-40 md:w-[60px] dark:bg-black bg-primary-100 border-solid border border-black dark:border-white  text-center  rounded min-h-[40px] md:min-h-[62px] text-black dark:text-white outline-none focus:!border-primary"
                  name="code1"
                />
                <input
                  type="text"
                  autoComplete="off"
                  className="block px-2 font-noto md:px-5 w-40 md:w-[60px] dark:bg-black bg-primary-100 border-solid border border-black dark:border-white  text-center  rounded min-h-[40px] md:min-h-[62px] text-black dark:text-white outline-none focus:!border-primary"
                  name="code2"
                />
                <input
                  type="text"
                  autoComplete="off"
                  className="block px-2 font-noto md:px-5 w-40 md:w-[60px] dark:bg-black bg-primary-100 border-solid border border-black dark:border-white  text-center  rounded min-h-[40px] md:min-h-[62px] text-black dark:text-white outline-none focus:!border-primary"
                  name="code3"
                />
                <input
                  type="text"
                  autoComplete="off"
                  className="block px-2 font-noto md:px-5 w-40 md:w-[60px] dark:bg-black bg-primary-100 border-solid border border-black dark:border-white  text-center  rounded min-h-[40px] md:min-h-[62px] text-black dark:text-white outline-none focus:!border-primary"
                  name="code4"
                />
                <input
                  type="text"
                  autoComplete="off"
                  className="block px-2 font-noto md:px-5 w-40 md:w-[60px] dark:bg-black bg-primary-100 border-solid border border-black dark:border-white  text-center  rounded min-h-[40px] md:min-h-[62px] text-black dark:text-white outline-none focus:!border-primary"
                  name="code5"
                />
                <input
                  type="text"
                  autoComplete="off"
                  className="block px-2 font-noto md:px-5 w-40 md:w-[60px] dark:bg-black bg-primary-100 border-solid border border-black dark:border-white  text-center  rounded min-h-[40px] md:min-h-[62px] text-black dark:text-white outline-none focus:!border-primary"
                  name="code6"
                />
              </div>
              <p className={` text-center lg:mt-[20px] md-text errorMessage ${otpMessage === '' ? 'hidden' : ''}`}>{otpMessage}</p>
              <div>
                <div className={`flex ${showTime === true ? '' : 'hidden'}`}>
                  <p className={`info-10-14 px-2 text-start  md-text`}>Your OTP will expire within </p>
                  <p className={`info-10-14 text-start md-text`}> {timeLeft}</p>
                </div>
                <div className="text-end">
                  {statuss &&
                    <button
                      type="button"
                      className={`info-10-14 text-end  !text-primary ${disabled === true ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                      onClick={() => disabled === false ? props.sendSessionOtp() : ''}
                      disabled={disabled}
                    >
                      Resend OTP
                    </button>
                  }
                </div>
              </div>
            </div>
            <div className="flex flex-col  gap-10">
              <label className="sm-text mb-[6px]">Enter Account Password</label>
              <div className={` relative `}>
                <input
                  type={showpswd === true ? "text" : "password"}
                  placeholder="Re-Enter password"
                  maxLength={32}
                  autoComplete="off"
                  id="reenterpass"
                  className={`sm-text w-full  input-cta2`}
                  {...register("password")}
                />
                <Image
                  src={`/assets/register/${showpswd === true ? "show.svg" : "hide.svg"}`}
                  alt="eyeicon"
                  width={24}
                  height={24}
                  onClick={() => {
                    setShowPswd(!showpswd);
                  }}
                  className="cursor-pointer absolute top-[50%] right-[20px] translate-y-[-50%]"
                />
              </div>
              {errors.password && (
                <p className="errorMessage">{errors.password.message}</p>
              )}
            </div>
          </div>
          <div className="flex gap-[20px]">
            <button
              type="button"
              className="solid-button2 w-full "
              onClick={() => {
                props?.setActive(0), props?.setShow(false), props?.setStep(false);
              }}
            >
              Cancel
            </button>
            <button disabled={btnDisabled} type="submit" className={`solid-button px-[51px] w-full ${btnDisabled === true ? 'cursor-not-allowed' : ''}`}>
              {btnDisabled &&
                <svg aria-hidden="true" role="status" className="inline w-4 h-4 me-3 text-white animate-spin" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="#E5E7EB" />
                  <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentColor" />
                </svg>
              }Add
            </button>
          </div>
          <p className={`info-10-14 text-start cursor-pointer  inline-block !text-primary mt-[10px]`} onClick={() => { setPopup(true) }}>
            Didn't receive the code?
          </p>
        </form>

      </>

      {
        popup === true &&
        <CodeNotRecieved setEnable={setPopup} />
      }

    </div>
  );
};

export default Password;
