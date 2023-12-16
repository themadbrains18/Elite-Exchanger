import React, { useContext, useEffect } from "react";
import Context from "../contexts/context";
import Image from "next/image";
import HeaderLogo from "../svg-snippets/headerLogo";
import { useRouter } from "next/router";
import { toast } from "react-toastify";

import AES from "crypto-js/aes";
import { enc } from "crypto-js";

interface propsData {
  step: number;
  setStep: Function;
  isEmail?: boolean;
  formData?: any;
  api: string;
}

const Verification = (props: propsData) => {
  const { mode } = useContext(Context);
  const router = useRouter();

  const sendOtp = async () => {
    try {
      props.formData.step = 2;

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
          toast.success(userExist.data);
          props.setStep(2);
        } else {
          toast.error(userExist.data);
        }
      } else {
        if (userExist.data.status === 200) {
          toast.success(userExist.data.data);
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
    <section className="bg-primary-300 lg:dark:bg-black-v-1 h-full  lg:bg-bg-primary ">
      <div className="flex gap-5 bg-[url('/assets/register/ellipsebg.svg')] bg-[length:75%]  bg-no-repeat lg:bg-none">
        <div className="max-w-[1018px]  w-full lg:block hidden">
          <Image
            src="/assets/register/register.png"
            width={1018}
            height={1100}
            alt="signup"
            className="object-cover h-full block"
          />
        </div>
        <div className="max-w-[902px] w-full ">
          <div
            className="py-[30px] lg:py-[40px]  max-w-[710px] w-full my-0 mx-auto pr-5 flex justify-end items-center cursor-pointer"
            onClick={() => {
              router.push("/");
            }}
          >
            <HeaderLogo />
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

          <div className="mt-0 lg:mt-[140px] lg:p-0 p-5  max-w-[calc(100%-30px)] md:mx-0 mx-auto md:mb-0 mb-[10px]  lg:bg-[transparent] lg:dark:bg-[transparent] bg-white lg:rounded-none rounded-10 dark:bg-d-bg-primary md:max-w-[562px] w-full">
            <h1 className="lg-heading mb-5">Let’s Confirm it’s really you</h1>
            <p className="mb-5 text-center  lg:mb-[70px] md-text">
              Lorem Ipsum is simply dummy text of the printing and typesetting
              industry. Lorem Ipsum has been the industry.
            </p>
            <div className="flex flex-col gap-[15px] lg:gap-5 mb-[30px]">
              {/* <div className="flex items-center mr-4">
                <input id="custom-radio" type="radio" value="" name="colored-radio" className="w-5 h-5  bg-red-400 border-[transparent] focus:ring-primary dark:focus:ring-primary dark:ring-offset-primary  dark:bg-[transparent] dark:border-[transparent]" />
                <label htmlFor="custom-radio" className="ml-2 md-text">
                Get the code by text message
                </label>
              </div> */}
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
                  className="
              custom-radio relative  px-[17px]  flex gap-2 items-center pl-[18px]
              cursor-pointer
              after:dark:bg-omega
              after:bg-white
              after:left-[0px]
              after:w-[20px] 
              after:h-[20px]
              after:rounded-[50%] 
              after:border after:border-beta
              after:absolute

              before:dark:bg-[transparent]
              before:bg-white
              before:left-[5px]
  
              before:w-[10px] 
              before:h-[10px]
              before:rounded-[50%] 
              before:absolute
              before:z-[1]
              
              "
                >
                  <p className="ml-2 md-text"> Get the code by text message</p>
                </label>
              </div>
              <input
                type="number"
                placeholder="Enter Phone Number "
                className="input-cta"
                disabled={true}
                value={props.isEmail === false ? props.formData.username : ""}
              />
            </div>
            <div className="flex flex-col gap-[15px] lg:gap-5">
              {/* <div className="flex items-center mr-4">
                <input id="custom-radio2" type="radio" value="" name="colored-radio" className="w-5 h-5 text-primary-500  bg-red-400 border-[transparent] focus:ring-primary dark:focus:ring-primary dark:ring-offset-primary  dark:bg-[transparent] dark:border-[transparent]" />
                <label htmlFor="custom-radio2" className="ml-2 md-text">
                Get the code by email at
                </label>
              </div> */}
              <div
                className={`flex gap-5 items-center  w-full cursor-pointer bg-[transparent]`}
              >
                <input
                  id={`custom-radio2`}
                  type="radio"
                  value=""
                  disabled={props.isEmail === false ? true : false}
                  checked={props.isEmail === true ? true : false}
                  name="colored-radio"
                  className="hidden w-5 h-5 max-w-full   bg-red-400 border-[transparent] focus:ring-primary dark:focus:ring-primary dark:ring-offset-primary  dark:bg-[transparent] dark:border-[transparent]"
                />
                <label
                  htmlFor={`custom-radio2`}
                  className="
              custom-radio relative  px-[17px]  flex gap-2 items-center pl-[18px]
              cursor-pointer
              after:dark:bg-omega
              after:bg-white
              after:left-[0px]
              after:w-[20px] 
              after:h-[20px]
              after:rounded-[50%] 
              after:border after:border-beta
              after:absolute

              before:dark:bg-[transparent]
              before:bg-white
              before:left-[5px]
  
              before:w-[10px] 
              before:h-[10px]
              before:rounded-[50%] 
              before:absolute
              before:z-[1]
              
              "
                >
                  <p className="ml-2 md-text"> Get the code by email at</p>
                </label>
              </div>
              <input
                type="email"
                placeholder="Enter Email "
                className="input-cta"
                disabled={true}
                value={props.isEmail === true ? props.formData.username : ""}
              />
            </div>
            <button
              className="my-[30px] lg:my-[50px] solid-button w-full hover:bg-primary-600"
              onClick={() => {
                sendOtp();
              }}
            >
              Continue
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Verification;
