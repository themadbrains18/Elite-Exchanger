import React, { useContext, useEffect } from "react";
import Context from "../contexts/context";
import Link from "next/link";
import Image from "next/image";
import { signOut } from "next-auth/react";



const ResetSuccessful = () => {
  const { mode } = useContext(Context);
  return (
    <>
      <div
        className={`bg-black  z-[9] duration-300 fixed top-0 left-0 h-full w-full opacity-80 visible
          }`}
      ></div>
    <div className="max-w-[calc(100%-30px)] md:max-w-[510px] w-full p-5 md:p-40 z-10 fixed rounded-10 bg-white dark:bg-omega top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%]">
      <div className="flex items-center justify-center ">
        <Image src='/assets/profile/success-icon.svg' width={40} height={40} alt="success"/>
      </div>
      <p className="py-40 info-14-18 text-center">Password Reset Succeeded</p>
    
        <button
          className="solid-button w-full hover:bg-primary-800"
        onClick={()=>{
          signOut()
        }}
        >
         Return to Login
        </button>
     
    </div>
    </>
  );
};

export default ResetSuccessful;