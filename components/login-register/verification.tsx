import React, { useContext, useEffect, useState } from "react";
import Context from "../contexts/context";
import Image from "next/image";
import HeaderLogo from "../svg-snippets/headerLogo";
import { useRouter } from "next/router";
import { toast } from "react-toastify";

import AES from "crypto-js/aes";

interface propsData {
  step: number;
  setStep: Function;
  isEmail?: boolean;
  isNumber?: boolean;
  formData?: any;
  api: string;
  setSendOtpRes?: any;
  data?: any;
}

const Verification = (props: propsData) => {
  const { mode } = useContext(Context);
  const router = useRouter();
  const [btnDisabled, setBtnDisabled] = useState(false);

  const sendOtp = async () => {
    try {
      props.formData.step = 2;
      setBtnDisabled(true);
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
          toast.success(userExist?.data?.message, { autoClose: 2000 });
          props.setSendOtpRes(userExist?.data?.otp);
          props.setStep(2);
        } else {
          toast.error(userExist.data);
        }
      } else {
        if (userExist.data.status === 200) {
          toast.success(userExist?.data?.data?.message, { autoClose: 2000 });
          props.setSendOtpRes(userExist?.data?.data?.otp);
          props.setStep(2);
        } else {
          toast.error(userExist.data.data);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <section className="bg-primary-300 lg:dark:bg-black-v-1 h-full  lg:bg-bg-primary overflow-hidden">
      <div className="h-full min-h-screen  flex gap-5 bg-[url('/assets/register/ellipsebg.svg')] bg-[length:75%]  bg-no-repeat lg:bg-none ">
        <div className="max-w-full lg:max-w-[50%]  w-full lg:block hidden">
          <Image
            src="/assets/register/register.png"
            width={1018}
            height={1100}
            alt="signup"
            className="object-cover h-full block w-full"
          />
        </div>
        <div className="max-w-full lg:max-w-[50%] w-full">
          <div  className="my-[30px] lg:my-[40px] w-full  lg:max-w-[600px] mr-auto">
            <div className="max-w-[183px] w-full max-[1023px]:mx-auto lg:ml-auto cursor-pointer" onClick={() => { router.push("/"); }}>
              <HeaderLogo />
            </div>
          </div>
          <div className="lg:hidden block">
            <Image
              src="/assets/register/loginmobile.svg"
              alt="forget"
              width={398}
              height={198}
              className="mx-auto"
            />
          </div>

          <div className="lg:h-full flex">  
              <div className="max-[1023px]:!mx-auto p-5  max-w-[calc(100%-30px)] lg:my-auto lg:bg-[transparent] lg:dark:bg-[transparent] bg-white lg:rounded-none rounded-10 dark:bg-d-bg-primary md:max-w-[562px] w-full">
                <h1 className="lg-heading mb-5">Let’s Confirm it’s really you</h1>

                {(props?.isNumber || !props?.isEmail) &&
                  <div className="flex flex-col gap-[15px] lg:gap-5 mb-[30px]">
                    <div
                      className={`flex gap-5 items-center  w-full cursor-pointer bg-[transparent]`}
                    >
                      <input
                        id={`custom-radio`}
                        type="radio"
                        value=""
                        disabled={props.isEmail === true ? true : false}
                        checked={props.isEmail === true ? false : true}
                        name="colored-radio"
                        className="hidden w-5 h-5 max-w-full   bg-red-400 border-[transparent] focus:ring-primary dark:focus:ring-primary dark:ring-offset-primary  dark:bg-[transparent] dark:border-[transparent]"
                      />
                      <label
                        htmlFor={`custom-radio`}
                      >
                        <p className="ml-2 md-text"> Get the code by text message</p>
                      </label>
                    </div>
                    <input
                      id="securityNumber"
                      name="securityNumber"
                      type="number" onWheel={(e) => (e.target as HTMLElement).blur()}
                      placeholder="Enter Phone Number "
                      className="input-cta"
                      disabled={true}
                      value={props.isEmail === false ? props.formData.username : props?.data?.number}
                    />
                  </div>}

                {props?.isEmail && <div className="flex flex-col gap-[15px] lg:gap-5">
                  <div
                    className={`flex gap-5 items-center  w-full cursor-pointer bg-[transparent]`}
                  >
                    <input
                      id={`custom-radio2`}
                      type="radio"
                      value=""
                      name="colored-radio"
                      className="hidden w-5 h-5 max-w-full   bg-red-400 border-[transparent] focus:ring-primary dark:focus:ring-primary dark:ring-offset-primary  dark:bg-[transparent] dark:border-[transparent]"
                      onChange={() => {
                        console.log("e");
                      }}
                    />
                    <label
                      htmlFor={`custom-radio2`}
                    >
                      <p className="ml-2 md-text"> Get the code by email at</p>
                    </label>
                  </div>
                  <input
                    type="email"
                    placeholder="Enter Email "
                    className="input-cta"
                    disabled={true}
                    value={props.isEmail === true ? props.formData.username : props?.data?.email}
                  />
                </div>}
                <button disabled={btnDisabled}
                  className={`my-[30px] lg:my-[50px] solid-button w-full ${btnDisabled === true ? 'cursor-not-allowed ' : ''}`}
                  onClick={() => {
                    sendOtp();
                  }}
                >
                  {btnDisabled &&
                    <svg aria-hidden="true" role="status" className="inline w-4 h-4 me-3 text-white animate-spin" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="#E5E7EB" />
                      <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentColor" />
                    </svg>
                  }
                  Continue
                </button>
              </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default Verification;
