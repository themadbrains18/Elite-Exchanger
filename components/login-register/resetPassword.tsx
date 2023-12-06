import React, { useContext, useState } from "react";
import Context from "../contexts/context";
import Image from "next/image";
import HeaderLogo from "../svg-snippets/headerLogo";
import Verification from "./verification";
import SecurityCode from "./securityCode";
import { useRouter } from "next/router";
import ReEnterpass from "./re-enterpass";

const ResetPassword = () => {
  const { mode } = useContext(Context);
  const [step, setStep] = useState(0);
  const router=useRouter();

  return (
    <>
        {
            step===0 &&
            <section className="bg-primary-300 lg:dark:bg-black-v-1 h-screen xl:h-full  lg:bg-bg-primary ">

              <div className="flex gap-5 bg-[url('/assets/register/ellipsebg.svg')] bg-[length:75%]  bg-no-repeat lg:bg-none">
                <div className="max-w-[848px]  w-full lg:block hidden">
                  <Image src="/assets/register/forget.png" width={848} height={631} alt="signup" className="object-cover h-screen xl:h-full block" />
                </div>
                <div className="max-w-[902px] w-full ">
                  <div className="py-[30px] lg:py-[40px]  max-w-[710px] w-full my-0 mx-auto pr-5 flex justify-end items-center cursor-pointer" onClick={()=>{router.push("/")}}>
                    <HeaderLogo />
                  </div>
                  <div className="lg:hidden block">
                    <Image src="/assets/register/forgetbg.svg" alt="forget" width={398} height={198} className="mx-auto" />
                  </div>
                  <div className="mt-0 lg:mt-[200px] lg:p-0 p-5  max-w-[calc(100%-30px)] mx-auto  lg:bg-[transparent] lg:dark:bg-[transparent] bg-white lg:rounded-none rounded-10 dark:bg-d-bg-primary md:max-w-[562px] w-full">
                    <h1 className="lg-heading mb-5">Password Recovery</h1>
                    <p className="mb-5  lg:mb-[70px] md-text">Enter your email to recover your password</p>
                    {/**Form Start  */}
                    <form>

                    <div className="flex flex-col gap-[15px] lg:gap-10">
                      <input type="email" placeholder="Enter Email " className="input-cta" />
                    </div>
                    <button className="my-[30px] lg:my-[50px] solid-button w-full hover:bg-primary-600" onClick={()=>{
                        setStep(1)
                    }}>Reset Password</button>
                    </form>
                    {/**Form End  */}
                  </div>
                </div>
              </div>
            </section>
        }
        {
            step===1 &&
            <Verification step={step} setStep={setStep} api='forget'/>
        }
        {
            step===2 &&
            <SecurityCode />
        }
        <ReEnterpass />
    </>
  );
};

export default ResetPassword;
