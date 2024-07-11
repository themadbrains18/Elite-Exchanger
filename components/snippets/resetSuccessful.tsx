import React, { useContext, useEffect, useReducer, useRef } from "react";
import Context from "../contexts/context";
import Link from "next/link";
import Image from "next/image";
import { signOut } from "next-auth/react";
import { useRouter } from "next/router";
import clickOutSidePopupClose from "./clickOutSidePopupClose";

interface propsData {
  setSuccessModal: Function;
}
const ResetSuccessful = (props:propsData) => {
  const { mode } = useContext(Context);
  const route = useRouter();

  const closePopup = () => {
    props.setSuccessModal(false);
    route.push("/login");
  };
  const wrapperRef = useRef(null);
  clickOutSidePopupClose({ wrapperRef, closePopup });

  return (
    <>
      <div
        className={`bg-black  z-[9] duration-300 fixed top-0 left-0 h-full w-full opacity-80 visible
          }`}
      ></div>
      <div ref={wrapperRef} className="max-w-[calc(100%-30px)] md:max-w-[510px] w-full p-5 md:p-40 z-10 fixed rounded-10 bg-white dark:bg-omega top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%]">
        <div className="flex items-center justify-center ">
          <Image src='/assets/profile/successful.gif' width={100} height={100} alt="success" />
        </div>
        <p className="pb-30 info-14-18 text-center">Password Reset Succeeded</p>

        <button
          className="solid-button w-full hover:bg-primary-800"
          onClick={async () => {
            await signOut({ redirect: false }).then(() => {
              route.push("/login"); // Redirect to the dashboard page after signing out
            });


          }}
        >
          Return to Login
        </button>

      </div>
    </>
  );
};

export default ResetSuccessful;
