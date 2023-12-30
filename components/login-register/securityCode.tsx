import React, { useContext, useEffect, useState } from "react";
import Image from "next/image";
import HeaderLogo from "../svg-snippets/headerLogo";
import { useRouter } from "next/router";
import { signIn } from "next-auth/react"
import { toast } from 'react-toastify';
import AES from 'crypto-js/aes';

interface propsData {
  formData?: any,
  api?: string
}

const SecurityCode = (props: propsData) => {

  const router = useRouter()
  const [fillOtp, setOtp] = useState('');
  const [otpMessage, setOtpMessage] = useState('');

  useEffect(() => {

    const inputElements = document.querySelectorAll(".input_wrapper input") ;
  
    inputElements?.forEach((ele, index) => {
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
          setOtp((inputElements[0]as HTMLInputElement).value + '' + (inputElements[1]as HTMLInputElement).value + '' + (inputElements[2]as HTMLInputElement).value + '' + (inputElements[3]as HTMLInputElement).value + '' + (inputElements[4]as HTMLInputElement).value + '' + (inputElements[5]as HTMLInputElement).value);
        }
      });
    });
  
  }, [])

  const matchUserOtp = async () => {
    try {
      props.formData.step = 3;
      props.formData.otp = fillOtp;

      if(fillOtp === ''){
        setOtpMessage('Please enter One-Time password to authenticate.');
        return;
      }
      setOtpMessage('');
      const ciphertext = AES.encrypt(JSON.stringify(props.formData), `${process.env.NEXT_PUBLIC_SECRET_PASSPHRASE}`);
      let record =  encodeURIComponent(ciphertext.toString());

      let response = await fetch(`/api/user/${props.api}`, {
        method: "POST",
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(record)
      }).then(response => response.json());

      // console.log(response?.data);
      if (response.data.status === 200) {
        
        if (props.api === 'login') {
          signIn("credentials", response?.data?.data.user);
        }
        else if (props.api === 'register') {
          toast.success('Otp Matched');
          router.push('/login');
        }
        else if (props.api === 'forget') {
          toast.success(response?.data?.message);
          router.push('/login');
        }
      }
      else {
        toast.error(response.data.data);
      }

    } catch (error) {
      console.log(error);
    }
  }

  return (
    <section className="bg-primary-300 lg:dark:bg-black-v-1 h-screen xl:h-full  lg:bg-bg-primary ">
      <div className="flex gap-5 bg-[url('/assets/register/ellipsebg.svg')] bg-[length:75%]  bg-no-repeat lg:bg-none">
        <div className="max-w-[1018px]  w-full lg:block hidden">
          <Image src="/assets/register/register.png" width={1018} height={1100} alt="signup" className="object-cover h-full block" />
        </div>
        <div className="max-w-[902px] w-full ">
          <div className="py-[30px] lg:py-[40px]  max-w-[710px] w-full my-0 mx-auto pr-5 flex justify-end items-center cursor-pointer" onClick={() => { router.push("/") }}>
            <HeaderLogo />
          </div>
          <div className="lg:hidden block">
            <Image src="/assets/register/loginmobile.svg" alt="forget" width={398} height={198} className="mx-auto" />
          </div>
          <div className="mt-0 lg:mt-[180px] lg:p-0 p-5  max-w-[calc(100%-30px)] md:mx-0 mx-auto  lg:bg-[transparent] lg:dark:bg-[transparent] bg-white lg:rounded-none rounded-10 dark:bg-d-bg-primary md:max-w-[562px] w-full">
            <h1 className="lg-heading text-center mb-5">Enter your security code</h1>
            <p className="mb-5 text-center  lg:mb-[70px] md-text">We texted your code to {props.formData.username}</p>
            <div className="flex gap-[10px] md:gap-[30px] justify-center items-center input_wrapper">
              <input type="text" autoComplete="off" className="block px-2 font-noto md:px-4 w-[40px] md:w-[46px] dark:bg-black bg-primary-100 border text-center border-black dark:border-white rounded min-h-[40px] md:min-h-[46px] text-black dark:text-white outline-none focus:!border-primary" name="code1" />
              <input type="text" autoComplete="off" className="block px-2 font-noto md:px-4 w-[40px] md:w-[46px] dark:bg-black bg-primary-100 border text-center border-black dark:border-white rounded min-h-[40px] md:min-h-[46px] text-black dark:text-white outline-none focus:!border-primary" name="code2" />
              <input type="text" autoComplete="off" className="block px-2 font-noto md:px-4 w-[40px] md:w-[46px] dark:bg-black bg-primary-100 border text-center border-black dark:border-white rounded min-h-[40px] md:min-h-[46px] text-black dark:text-white outline-none focus:!border-primary" name="code3" />
              <input type="text" autoComplete="off" className="block px-2 font-noto md:px-4 w-[40px] md:w-[46px] dark:bg-black bg-primary-100 border text-center border-black dark:border-white rounded min-h-[40px] md:min-h-[46px] text-black dark:text-white outline-none focus:!border-primary" name="code4" />
              <input type="text" autoComplete="off" className="block px-2 font-noto md:px-4 w-[40px] md:w-[46px] dark:bg-black bg-primary-100 border text-center border-black dark:border-white rounded min-h-[40px] md:min-h-[46px] text-black dark:text-white outline-none focus:!border-primary" name="code5" />
              <input type="text" autoComplete="off" className="block px-2 font-noto md:px-4 w-[40px] md:w-[46px] dark:bg-black bg-primary-100 border text-center border-black dark:border-white rounded min-h-[40px] md:min-h-[46px] text-black dark:text-white outline-none focus:!border-primary" name="code6" />
            </div>
            <p className="mb-5 text-center lg:mt-[20px] md-text" style={{ color: 'red' }}>{otpMessage}</p>
            <button className="my-[30px] lg:my-[50px] solid-button w-full hover:bg-primary-600" onClick={() => {
              matchUserOtp()
            }}>Continue</button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SecurityCode;
