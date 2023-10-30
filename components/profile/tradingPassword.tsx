import React, { useContext, useState } from 'react'
import Context from '../contexts/context'
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { AES } from 'crypto-js';
import { toast } from 'react-toastify';
import ConfirmPopup from '@/pages/profile/confirm-popup';
import { signOut, useSession } from 'next-auth/react';
import Verification from '../snippets/verification';

interface activeSection {
    setShow: Function;
    setTradePassword: Function;
    userDetail:any;
    session:any
  }

  type UserSubmitForm = {
    old_password?: string;
    new_password: string;
    confirmPassword?: string;
  };
  
  
  const schema = yup.object().shape({
    new_password: yup
      .string()
      .min(6)
      .max(6)
      .required("New password is required"),
    confirmPassword: yup
      .string()
      .oneOf([yup.ref("new_password")], "Passwords must match"),
  });
  const schema2 = yup.object().shape({
    old_password: yup.string().required("Old password is required"),
    new_password: yup
      .string()
      .min(6)
      .max(6)
      .required("New password is required"),
    confirmPassword: yup
      .string()
      .oneOf([yup.ref("new_password")], "Passwords must match"),
  });
const TradingPassword = (props:activeSection) => {
    const {mode} =useContext(Context)
    const [enable,setEnable]= useState(0)
    const [formData, setFormData] = useState<UserSubmitForm | null>();
    const { status } = useSession()
    let {
        register,
        setValue,
        handleSubmit,
        reset,
        watch,
        getValues,
        setError,
        formState: { errors },
      } = useForm<UserSubmitForm>({
        resolver: yupResolver(props?.userDetail?.User?.tradingPassword == null?schema:schema2),
      });
    
      const onHandleSubmit = async (data: UserSubmitForm) => {
        try {
          let username =
            props.session?.user.email !== "null"
              ? props.session?.user.email
              : props.session?.user?.number;
              let obj ;
              if(props?.userDetail?.User?.tradingPassword != null){
                 obj = {
                  username: username,
                  old_password: data?.old_password,
                  new_password: data?.new_password,
                  otp: "string",
                }
              }
                else{
                  obj = {
                    username: username,
                    new_password: data?.new_password,
                    otp: "string",
                  }
                }
                
              
        
          if (status === "authenticated") {
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
    

          if(props?.userDetail?.User?.tradingPassword != null){
            obj = {
             username: username,
             old_password: formData?.old_password,
             new_password: formData?.new_password,
             otp: "string",
           }
         }
           else{
             obj = {
               username: username,
               new_password: formData?.new_password,
               otp: "string",
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
              toast.success(res.data)
              setTimeout(() => {
                setEnable(1);
                props?.setShow(true)
              }, 1000)
    
            }
          }
          else {
            toast.error('Your session is expired. Its auto redirect to login page');
            setTimeout(() => {
              signOut();
            }, 4000);
    
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

              if(props?.userDetail?.User?.tradingPassword != null){
                request = {
                 username: username,
                 old_password: formData?.old_password,
                 new_password: formData?.new_password,
                 otp: otp,
               }
             }
               else{
                request = {
                   username: username,
                   new_password: formData?.new_password,
                   otp: otp,
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
            toast.success(response.data.message);
            setTimeout(() => {
              props?.setTradePassword(false);
                props?.setShow(false);
            }, 1000);
          } else {
            toast.error(response.data.message);
          }
        } catch (error) {
    
        }
      }


  return (
    <>
    {
      enable ===0 &&
    <div className="max-w-[calc(100%-30px)] md:max-w-[510px] w-full p-5 md:p-40 z-10 fixed rounded-10 bg-white dark:bg-omega top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%]">
        <div className="flex items-center justify-between ">
          <p className="sec-title">
          {props?.userDetail?.User?.tradingPassword == null ?"Add":"Edit"} Trading Password
          </p>
          <svg
            onClick={() => {
              props?.setShow(false);
              props?.setTradePassword(false);
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
        <div className="py-[30px] md:py-[50px] lg:px-0 px-20">
                <p className="info-14-18 dark:text-white text-h-primary mb-[10px]">
                  Trading Password
                </p>
                <p className="sm-text ">
                  Set a unique password to protect your trading.
                </p>
                <div className="mt-[30px] ">
                  <div className={` md:flex-row flex-col gap-[30px] ${props?.userDetail?.User?.tradingPassword == null ?'hidden':"flex"}`}>
                    <div className=" w-full">
                      <p className="sm-text mb-[10px]">Old Trading Password</p>
                      <input
                        type="password"
                        {...register("old_password")}
                        placeholder="Enter Old password"
                        className="sm-text input-cta2 w-full"
                      />
                    </div>
                  </div>
                  {props?.userDetail?.User?.tradingPassword != null && errors.old_password && (
                    <p style={{ color: "#ff0000d1" }}>
                      {errors.old_password.message}
                    </p>
                  )}
                    <div className=" my-30 w-full">
                      <p className="sm-text mb-[10px]">New Trading Password</p>

                      <input
                        type="password"
                        {...register("new_password")}
                        placeholder="Enter new password"
                        className="sm-text input-cta2 w-full"
                      />
                      {errors.new_password && (
                        <p style={{ color: "#ff0000d1" }}>
                          {errors.new_password.message}
                        </p>
                      )}
                    </div>

                    <div className=" w-full">
                      <p className="sm-text mb-[10px]">Re-enter Trading password</p>

                      <input
                        type="password"
                        {...register("confirmPassword")}
                        placeholder="Re-Enter password"
                        className="sm-text input-cta2 w-full"
                      />
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
                props?.setTradePassword(false);
                 props?.setShow(false);
              }}
            >
              Cancel
            </button>
            <button type="submit" className="solid-button px-[51px] w-full">Next</button>
          </div>
        </form>
      </div>
    }
      {enable === 1 && (
        <Verification
          setShow={props?.setShow}
          setEnable={setEnable}
          type="email"
          data={formData}
          session={props?.session}
          finalOtpVerification={finalOtpVerification}
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