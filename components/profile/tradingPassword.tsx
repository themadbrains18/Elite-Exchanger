import React, { useContext, useEffect, useRef, useState } from 'react'
import Context from '../contexts/context'
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { AES } from 'crypto-js';
import {  toast } from 'react-toastify';
import { signOut, useSession } from 'next-auth/react';
import Image from "next/image";
import clickOutSidePopupClose from '../snippets/clickOutSidePopupClose';
import ConfirmPopupNew from '../snippets/confirm-popup-new';
import VerificationNew from '../snippets/verificationNew';
import Link from 'next/link';

interface activeSection {
  setShow?: any;
  setTradePassword?: any;
  session?: any;
  setEnable?: any;
  tradePassword?: any
  setShowForgetPopup?: any
  showForgetPopup?: any
}

type UserSubmitForm = {
  old_password?: string;
  new_password: string;
  confirmPassword?: string;
};


// const schema = yup.object().shape({
//   new_password: yup
//     .string()
//     .min(6)
//     .max(6)
//     .required("New password is required"),
//   confirmPassword: yup
//     .string()
//     .oneOf([yup.ref("new_password")], "Passwords must match"),
// });


// .when('exist_password', {
//   is: true,
//   then(schema) {
//     return schema.notOneOf([yup.ref('old_password')], 'New password must be different from the old password');
//   }
// })
const TradingPassword = (props: activeSection) => {
  const { mode } = useContext(Context)
  const [enable, setEnable] = useState(1)
  const [formData, setFormData] = useState<UserSubmitForm | null>();
  const { status, data: session } = useSession()
  const [sendOtpRes, setSendOtpRes] = useState<any>();
  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const [showReset, setShowReset] = useState(true);
  const [forgetPassword, setForgetPassword] = useState(props?.showForgetPopup || false);

  // console.log(props?.showForgetPopup,"============props?.showForgetPopup");
  // console.log(forgetPassword,"============forgetPassword");
  
  const schema2 = yup.object().shape({
  
    exist_password: yup.boolean(),
    old_password: yup.string().when('exist_password', {
      is: true,
      then(schema) {
        return forgetPassword ? schema.notRequired() : schema.required('Must enter old password.');
      },
    }),
    new_password: yup
      .string()
      .required("This field is required.").min(8,"Password must be at least of '8' characters.").max(32,"Password length maximum '32' character"),
    confirmPassword: yup
      .string().required("This field is required.")
      .oneOf([yup.ref("new_password")], "Passwords must match."),
  });
  let {
    register,
    setValue,
    handleSubmit,
    reset,
    watch,
    getValues,
    clearErrors,
    setError,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema2),
  });


  // console.log(forgetPassword,"=forgetPassword");
  

  const onHandleSubmit = async (data: any) => {
    try {

      let username =
        props.session?.user.email !== "null"
          ? props.session?.user.email
          : props.session?.user?.number;
      let obj;
      if ((props?.session?.user?.tradingPassword !== null && props.tradePassword === false && !forgetPassword)) {
        if (data?.old_password === data?.new_password) {
          setError("new_password", {
            type: "custom",
            message: `New password must be different from the old password.`,
          });
          return;
        }
        obj = {
          username: username,
          old_password: data?.old_password,
          new_password: data?.new_password,
          otp: "string",
          step: 1
        }
      }
      else {
        obj = {
          username: username,
          new_password: data?.new_password,
          otp: "string",
          step: 1
        }

      }

      setDisabled(true);
      if (session !== undefined && session?.user !== undefined) {
        const ciphertext = AES.encrypt(
          JSON.stringify(obj),
          `${process.env.NEXT_PUBLIC_SECRET_PASSPHRASE}`
        );
        let record = encodeURIComponent(ciphertext.toString());

        let userExist = await fetch(
          `${process.env.NEXT_PUBLIC_BASEURL}/user/tradePassword`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: props?.session?.user?.access_token,
            },
            body: JSON.stringify(record),
          }
        );
        let res = await userExist.json();
        if (res.data.message) {
          toast.error(`${res.data.message}`, { autoClose: 2000 });
          setTimeout(() => {
            setDisabled(false);
          }, 3000)
        } else {
          setEnable(4);
          setFormData(data);
          reset();
          setDisabled(false);
        }
      } else {
        toast.error("Your session is expired. Its auto redirect to login page");
        setTimeout(() => {
          signOut();
        }, 4000);
      }
    } catch (error) {
      console.log(error, "security settings");
    }
  };

  const finalOtpVerification = async (otp: any) => {
    try {
      setDisabled(true);
      let username =
        props.session?.user.email !== "null"
          ? props.session?.user.email
          : props.session?.user?.number;
      let request;

      if ((props?.session?.user?.tradingPassword !== null && props.tradePassword === true && !forgetPassword)) {
        request = {
          username: username,
          old_password: formData?.old_password,
          new_password: formData?.new_password,
          otp: otp,
          step: 3
        }
      }
      else {
        request = {
          username: username,
          new_password: formData?.new_password,
          otp: otp,
          step: 3
        }
      }


      const ciphertext = AES.encrypt(
        JSON.stringify(request),
        `${process.env.NEXT_PUBLIC_SECRET_PASSPHRASE}`
      );

      let record = encodeURIComponent(ciphertext.toString());
      let response = await fetch(
        `${process.env.NEXT_PUBLIC_BASEURL}/user/tradePassword`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: props?.session?.user?.access_token,
          },
          body: JSON.stringify(record),
        }
      ).then((response) => response.json());
      if (response.data.result) {
        toast.success(response.data.message, { autoClose: 2000 });
        setTimeout(() => {
          setEnable(1);
          props?.setEnable && props.setEnable(0);
          props.setTradePassword && props.setTradePassword(true);
          props.setShow && props.setShow(false);
          props?.setShowForgetPopup && props?.setShowForgetPopup(false)
          setDisabled(false);
        }, 3000);
        return true
      } else {


        toast.error(`${response.data.message}`, { autoClose: 2000 });
        console.log("sdhfsdfhksh");
        
        setTimeout(() => {
          setDisabled(false);

        }, 3000)
      }
    } catch (error) {

    }
  }

  useEffect(() => {
    if (props?.session?.user?.tradingPassword === null && props.tradePassword === false ) {
      setValue('exist_password', false);
    }
    else {
      setValue('exist_password', true);
    }

    setTimeout(() => {
      if (errors.old_password) {
        clearErrors('old_password');
      }
      if (errors.new_password) {
        clearErrors('new_password');
      }
      if (errors.confirmPassword) {
        clearErrors('confirmPassword');
      }
    }, 3000);

  }, [errors]);

  const closePopup = () => {
    props?.setShow(false);
   props?.setEnable&& props.setEnable(0);
   props?.setShowForgetPopup && props?.setShowForgetPopup(false)
  }
  const wrapperRef = useRef(null);
  clickOutSidePopupClose({ wrapperRef, closePopup });

  return (
    <>
      {/* <ToastContainer position="top-right" /> */}
      {
        enable === 1 &&
        <div ref={wrapperRef} className="max-w-[calc(100%-30px)] md:max-w-[510px] w-full p-5 md:p-40 z-10 fixed rounded-10 bg-white dark:bg-omega top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%]">
          <div className="flex items-center justify-between ">
            <p className="sec-title">
              {(props?.session?.user?.tradingPassword === null && props.tradePassword === false) ? "Add" : forgetPassword? "Forget": "Edit"} Trading Password
            </p>
            <svg
              onClick={() => {
                props?.setShow(false);
                props?.setEnable&& props.setEnable(0);
                props?.setShowForgetPopup && props?.setShowForgetPopup(false)
                //   props.setActive(0);
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

          <form onSubmit={handleSubmit(onHandleSubmit)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
              }
            }}>
            <div className="py-[30px] md:py-[50px] md:pt-[30px]">
              <p className="sm-text">
                Set a unique password to protect your trading.
              </p>
              <div className="mt-[30px] ">
                {
                  showReset && !forgetPassword && (
                    <div className={` md:flex-row flex-col gap-[30px] ${(props?.session?.user?.tradingPassword === null && props.tradePassword === false) ? 'hidden' : "flex"}`}>
                      <div className=" w-full">
                        <p className="sm-text mb-[10px]">Old Trading Password</p>
                        <div className='relative'>
                          <input
                            type={`${showOld === true ? "text" : "password"}`}
                            {...register("old_password")}
                            name='old_password'
                            minLength={8}
                            maxLength={32}
                            placeholder="Enter Old password"
                            className="sm-text input-cta2 w-full"
                          />
                          <Image
                            src={`/assets/register/${showOld === true ? "show.svg" : "hide.svg"}`}
                            alt="eyeicon"
                            width={24}
                            height={24}
                            onClick={() => {
                              setShowOld(!showOld);
                            }}
                            className="cursor-pointer absolute top-[50%] right-[20px] translate-y-[-50%]"
                          />
                        </div>

                      </div>
                    </div>
                  )
                }

                {( showReset && props?.session?.user?.tradingPassword !== null) && errors.old_password && (
                  <p className="errorMessage mt-2">
                    {errors.old_password.message}
                  </p>
                )}
                <div className=" my-30 w-full">
                  <p className="sm-text mb-[10px]">New Trading Password</p>
                  <div className='relative'>
                    <input
                      type={`${showNew === true ? "text" : "password"}`}
                      {...register("new_password")}
                      name='new_password'
                      maxLength={32}
                      placeholder="Enter new password"
                      className="sm-text input-cta2 w-full"
                    />
                    <Image
                      src={`/assets/register/${showNew === true ? "show.svg" : "hide.svg"}`}
                      alt="eyeicon"
                      width={24}
                      height={24}
                      onClick={() => {
                        setShowNew(!showNew);
                      }}
                      className="cursor-pointer absolute top-[50%] right-[20px] translate-y-[-50%]"
                    />
                  </div>

                  {errors.new_password && (
                    <p className="errorMessage mt-2">
                      {errors.new_password.message}
                    </p>
                  )}
                </div>

                <div className=" w-full">
                  <p className="sm-text mb-[10px]">Re-enter Trading password</p>
                  <div className='relative'>
                    <input
                      type={`${showNew === true ? "text" : "password"}`}
                      {...register("confirmPassword")}
                      name='confirmPassword'
                      minLength={8}
                      maxLength={32}
                      placeholder="Re-Enter password"
                      className="sm-text input-cta2 w-full"
                      autoComplete="off"
                    />
                    <Image
                      src={`/assets/register/${showNew === true ? "show.svg" : "hide.svg"}`}
                      alt="eyeicon"
                      width={24}
                      height={24}
                      onClick={() => {
                        setShowNew(!showNew);
                      }}
                      className="cursor-pointer absolute top-[50%] right-[20px] translate-y-[-50%]"
                    />
                  </div>

                  {errors.confirmPassword && (
                    <p className="errorMessage mt-2">
                      {errors.confirmPassword.message}
                    </p>
                  )}
                </div>
              </div>
            </div>
            <div className="flex gap-[20px]">
              <button
                className="solid-button2 w-full "
                onClick={() => {
                  props?.setShow(false);
                  props?.setEnable&& props.setEnable(0);
                  props?.setShowForgetPopup && props?.setShowForgetPopup(false)
                }}
              >
                Cancel
              </button>
              <button type="submit" disabled={disabled} className={`solid-button px-[51px] w-full ${disabled ? "cursor-not-allowed" : ""}`}>
                {disabled &&
                  <svg aria-hidden="true" role="status" className="inline w-4 h-4 me-3 text-white animate-spin" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="#E5E7EB" />
                    <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentColor" />
                  </svg>
                }Next</button>

            </div>

                {/* {
                  console.log(props?.session?.user,"============props?.session?.user")
                  
                } */}
          {props?.session?.user?.tradingPassword != null || forgetPassword != true && (
            <Link onClick={(e)=>{e.preventDefault(); setForgetPassword(true)}} className="sec-text text-[14px]  !text-primary mt-2 inline-block" href="#">Forget trading password?</Link>
          )  
          }
          </form>
        </div>
      }
      {enable === 2 && (
        <VerificationNew
          setShow={props?.setShow}
          setEnable={setEnable}
          parentSetEnable={props.setEnable}
          type="email"
          data={formData}
          session={props?.session}
          finalOtpVerification={finalOtpVerification}
        />
      )}
      {enable === 4 && (
        <ConfirmPopupNew
          setEnable={setEnable}
          setShow={props?.setShow}
          parentSetEnable={props.setEnable}
          type="number" 
          data={formData}
          session={props?.session}
        />
      )}
    </>
  )
}

export default TradingPassword