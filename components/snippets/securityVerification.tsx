import React, { useContext, useEffect, useRef, useState } from "react";
import Context from "../contexts/context";
import { AES } from "crypto-js";
import { ToastContainer, toast } from "react-toastify";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { signOut, useSession } from "next-auth/react";
import { Sigmar } from "next/font/google";
import Image from "next/image";
import QRCode from "qrcode";

interface activeSection {
  setActive: Function;
  setShow: Function;
  setEnable: Function;
  session: any;
  setGoogleAuth?: Function | any;
  sendOtp?: any;
}

type UserSubmitForm = {
  password: string;
  key: string;
  code: string;
  username?: string;
  TwoFA?: boolean;

};

const schema = yup.object().shape({
  password: yup.string().required("Account password is required"),
  key: yup.string().required("Google authenticator key is required"),
  code: yup.string().required("Google authenticator code is required"),
});

const SecurityVerification = (props: activeSection) => {
  const { mode } = useContext(Context);
  const [fillOtp, setOtp] = useState("");
  const { status, data: session } = useSession()

  const [qrImg, setImage] = useState('');

  const [secret, setSecret] = useState(props?.session?.user?.secret !== undefined && JSON.parse(props?.session?.user?.secret));

  let {
    register,
    setValue,
    handleSubmit,
    getValues,
    watch,
    setError,
    clearErrors,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  useEffect(() => {
    QRCode.toDataURL(secret.otpauth_url, (err, image_data: any) => {
      setImage(image_data);
    });

    setValue('key', secret?.base32);
    clearErrors('key');
  }, []);

  const onHandleSubmit = async (data: any) => {
    try {
      let username =
        props.session?.user.email !== "null"
          ? props.session?.user.email
          : props.session?.user?.number;

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

            <div className="py-30 md:py-40">
              <div className="py-[10px]">
                <p className="info-14-18 text-center dark:text-white text-black">Scan Qr From Google Authenticator App</p>
                <div className="mt-[15px] p-5 max-w-[154px] bg-white rounded-5 shadow-card mx-auto">
                  <Image src={qrImg} width={154} height={154} alt="QR" />
                </div>
              </div>

              <div className="pt-5 md:pt-30">
                <div className="mt-[5px] md:mt-[10px] items-center flex justify-between gap-[10px] border rounded-5 border-grey-v-1 dark:border-opacity-[15%] py-2 px-[15px]">
                  <p className="sec-text text-ellipsis overflow-hidden">{secret?.base32}</p>
                  <button className="solid-button py-2 sec-text font-normal" onClick={() => { navigator.clipboard.writeText(secret?.base32); toast.success('copy to clipboard') }}>Copy</button>
                </div>
              </div>
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
            <button type="submit" className="solid-button px-[51px] w-full">
              Finish Setup
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default SecurityVerification;
