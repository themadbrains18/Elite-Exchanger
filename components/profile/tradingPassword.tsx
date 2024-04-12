import React, { useContext, useEffect, useRef, useState } from 'react'
import Context from '../contexts/context'
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { AES } from 'crypto-js';
import { ToastContainer, toast } from 'react-toastify';
import ConfirmPopup from '@/admin/admin-snippet/confirm-popup';
import { signOut, useSession } from 'next-auth/react';
import Verification from '../snippets/verification';
import Image from "next/image";
import clickOutSidePopupClose from '../snippets/clickOutSidePopupClose';

interface activeSection {
  setShow?: any;
  setTradePassword?: any;
  session?: any;
  setEnable?: any;
  tradePassword?: any
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
const schema2 = yup.object().shape({
  exist_password: yup.boolean(),
  old_password: yup.string().when('exist_password', {
    is: true,
    then(schema) {
      return schema.required('Must enter Old password');
    },
  }),
  new_password: yup
    .string()
    .required("This field is required").min(8).max(32),
  confirmPassword: yup
    .string().required("This field is required")
    .oneOf([yup.ref("new_password")], "Passwords must match"),
});
const TradingPassword = (props: activeSection) => {
  const { mode } = useContext(Context)
  const [enable, setEnable] = useState(1)
  const [formData, setFormData] = useState<UserSubmitForm | null>();
  const { status, data: session } = useSession()
  const [sendOtpRes, setSendOtpRes] = useState<any>();
  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

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

  const onHandleSubmit = async (data: any) => {
    try {
      let username =
        props.session?.user.email !== "null"
          ? props.session?.user.email
          : props.session?.user?.number;
      let obj;
      if ((props?.session?.user?.tradingPassword === null && props.tradePassword === false)) {
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
          toast.error(res.data.message);
        } else {
          setEnable(4);
          setFormData(data);
          reset();
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

  const snedOtpToUser = async () => {
    try {
      let username = props.session?.user.email !== 'null' ? props.session?.user.email : props.session?.user?.number

      let obj;
      if ((props?.session?.user?.tradingPassword !== null && props.tradePassword === true)) {
        obj = {
          username: username,
          old_password: formData?.old_password,
          new_password: formData?.new_password,
          otp: "string",
          step: 2
        }
      }
      else {
        obj = {
          username: username,
          new_password: formData?.new_password,
          otp: "string",
          step: 2
        }
      }

      if (status === 'authenticated') {
        const ciphertext = AES.encrypt(JSON.stringify(obj), `${process.env.NEXT_PUBLIC_SECRET_PASSPHRASE}`);
        let record = encodeURIComponent(ciphertext.toString());

        let userExist = await fetch(`${process.env.NEXT_PUBLIC_BASEURL}/user/tradePassword`, {
          method: "PUT",
          headers: {
            'Content-Type': 'application/json',
            "Authorization": props?.session?.user?.access_token
          },
          body: JSON.stringify(record)
        })
        let res = await userExist.json();

        if (res.status === 200) {
          toast.success(res?.data?.message);

          setTimeout(() => {
            setEnable(2);
            setSendOtpRes(res?.data?.otp);
            props?.setShow(true)
          }, 1000)

        }
      }
      else {
        toast.error('Your session is expired. Its auto redirect to login page');
        setTimeout(() => {
          signOut();
        }, 1000);

      }
    } catch (error) {

    }
  }

  const finalOtpVerification = async (otp: any) => {
    try {
      let username =
        props.session?.user.email !== "null"
          ? props.session?.user.email
          : props.session?.user?.number;
      let request;

      if ((props?.session?.user?.tradingPassword !== null && props.tradePassword === true)) {
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
        toast.success(response.data.message,{autoClose:2000});
        setTimeout(() => {
          setEnable(1);
          props.setEnable(0);
          props.setTradePassword(true);
          props.setShow(false);
        }, 3000);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {

    }
  }

  useEffect(() => {
    if (props?.session?.user?.tradingPassword === null && props.tradePassword === false) {
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
    props.setEnable(0);
  }
  const wrapperRef = useRef(null);
  clickOutSidePopupClose({ wrapperRef, closePopup });


  return (
    <>
      <ToastContainer position="top-right" />
      {
        enable === 1 &&
        <div ref={wrapperRef} className="max-w-[calc(100%-30px)] md:max-w-[510px] w-full p-5 md:p-40 z-10 fixed rounded-10 bg-white dark:bg-omega top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%]">
          <div className="flex items-center justify-between ">
            <p className="sec-title">
              {(props?.session?.user?.tradingPassword === null && props.tradePassword === false) ? "Add" : "Edit"} Trading Password
            </p>
            <svg
              onClick={() => {
                props?.setShow(false);
                props.setEnable(0);
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

          <form onSubmit={handleSubmit(onHandleSubmit)}>
            <div className="py-[30px] md:py-[50px] px-0 lg:px-20">
              <p className="info-14-18 dark:text-white text-h-primary mb-[10px]">
                Trading Password
              </p>
              <p className="sm-text ">
                Set a unique password to protect your trading.
              </p>
              <div className="mt-[30px] ">
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
                {(props?.session?.user?.tradingPassword !== null && props?.tradePassword === true) && errors.old_password && (
                  <p style={{ color: "#ff0000d1" }}>
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
                    <p style={{ color: "#ff0000d1" }}>
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
                    <p style={{ color: "#ff0000d1" }}>
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
                  props.setEnable(0)
                }}
              >
                Cancel
              </button>
              <button type="submit" className="solid-button px-[51px] w-full">Next</button>
            </div>
          </form>
        </div>
      }
      {enable === 2 && (
        <Verification
          setShow={props?.setShow}
          setEnable={setEnable}
          type="email"
          data={formData}
          session={props?.session}
          finalOtpVerification={finalOtpVerification}
          snedOtpToUser={snedOtpToUser}
          sendOtpRes={sendOtpRes}
        />
      )}
      {enable === 4 && (
        <ConfirmPopup
          setEnable={setEnable}
          setShow={props?.setShow}
          type="number"
          data={formData}
          session={props?.session}
          snedOtpToUser={snedOtpToUser}
        />
      )}
    </>
  )
}

export default TradingPassword