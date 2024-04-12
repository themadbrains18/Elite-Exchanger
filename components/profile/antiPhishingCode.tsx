import React, { useContext, useEffect, useRef, useState } from "react";
import Context from "../contexts/context";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { AES } from "crypto-js";
import { ToastContainer, toast } from "react-toastify";
import ConfirmPopup from "@/admin/admin-snippet/confirm-popup";
import { signOut, useSession } from "next-auth/react";
import Verification from "../snippets/verification";
import Image from "next/image";
import clickOutSidePopupClose from "../snippets/clickOutSidePopupClose";

interface activeSection {
  setShow?: any;
  session?: any;
  setEnable?: any;
  setAntiFishingCode?:any;
}

type UserSubmitForm = {
  antiphishing?: string;
};

const schema2 = yup.object().shape({
  antiphishing: yup
    .string()
    .min(4)
    .max(20)
    .required("Antiphishing is required"),
});
const AntiPhishingCode = (props: activeSection) => {
  const { mode } = useContext(Context);
  const [enable, setEnable] = useState(1);
  const [formData, setFormData] = useState<UserSubmitForm | null>();
  const { status, data:session } = useSession();
  const [sendOtpRes, setSendOtpRes] = useState<any>();

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
      
      setEnable(4);
      setFormData(data);
    } catch (error) {
      console.log(error, "security settings");
    }
  };

  const snedOtpToUser = async () => {
    try {
      let username =
        props.session?.user.email !== "null"
          ? props.session?.user.email
          : props.session?.user?.number;

      let obj = {
        username: username,
        antiphishing: formData?.antiphishing,
        otp: "string",
      };

      if (session !== undefined && session?.user !== undefined) {
        const ciphertext = AES.encrypt(
          JSON.stringify(obj),
          `${process.env.NEXT_PUBLIC_SECRET_PASSPHRASE}`
        );
        let record = encodeURIComponent(ciphertext.toString());

        let userExist = await fetch(
          `${process.env.NEXT_PUBLIC_BASEURL}/user/antiPhishing`,
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

        if (res.status === 200) {
          toast.success(res?.data?.message);

          setTimeout(() => {
            setEnable(2);
            setSendOtpRes(res?.data?.otp);
            props?.setShow(true);
          }, 1000);
        }
      } else {
        toast.error("Your session is expired. Its auto redirect to login page");
        setTimeout(() => {
          signOut();
        }, 1000);
      }
    } catch (error) { }
  };

  const finalOtpVerification = async (otp: any) => {
    try {
      // console.log(otp, "==otp");

      let username =
        props.session?.user.email !== "null"
          ? props.session?.user.email
          : props.session?.user?.number;
      let request = {
        username: username,
        antiphishing: formData?.antiphishing,
        otp: otp,
      };

      const ciphertext = AES.encrypt(
        JSON.stringify(request),
        `${process.env.NEXT_PUBLIC_SECRET_PASSPHRASE}`
      );

      let record = encodeURIComponent(ciphertext.toString());
      // console.log("hete");

      let response = await fetch(
        `${process.env.NEXT_PUBLIC_BASEURL}/user/antiPhishing`,
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
        props.setAntiFishingCode(true);
        setTimeout(() => {
          setEnable(1);
          props.setEnable(0);
          props.setShow(false);
        }, 1000);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) { }
  };

  const closePopup = () => {
    props?.setShow(false);
    props.setEnable(0);
  }
  const wrapperRef = useRef(null);
  clickOutSidePopupClose({ wrapperRef, closePopup });

  return (
    <>
      <ToastContainer position="top-right" />
      {enable === 1 && (
        <div ref={wrapperRef} className="max-w-[calc(100%-30px)] md:max-w-[400px] w-full p-5 md:p-20 z-10 fixed rounded-10 bg-white dark:bg-omega top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%]">
          <div className="flex items-center justify-between ">
            <p className="sec-title">

              {props?.session?.user?.antiphishing === null ? "Create" : "Change"} Anti-Phishing Code
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
            <div className="py-[30px]  px-0 lg:px-20">
              <div className="">
                <div
                  className={` md:flex-row flex-col gap-[30px] flex`}
                >
                  <div className=" w-full">
                    <p className="sm-text mb-[10px]">Anti-Phishing Code</p>

                    <input
                      type="text"
                      {...register("antiphishing")}
                      placeholder="Anti-Phishing Code"
                      className="sm-text input-cta2 w-full"
                    />

                  </div>
                </div>

                <p className={`
                    ${errors.antiphishing ? "text-red-dark" : "text-[#b7bdc6]"} text-[16px] mt-[5px]`
                  }
                >
                  Please enter 4-20 characters.
                </p>
              </div>
            </div>

            <button type="submit" className="solid-button px-[51px] w-full">
              Submit
            </button>
          </form>
        </div>
      )}
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
          setEnable={props?.setEnable}
          setShow={props?.setShow}
          type="number"
          data={formData}
          session={props?.session}
          snedOtpToUser={snedOtpToUser}
        />
      )}
    </>
  );
};

export default AntiPhishingCode;
