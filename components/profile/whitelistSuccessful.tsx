import React, { useContext, useEffect, useReducer } from "react";
import Context from "../contexts/context";
import Link from "next/link";
import Image from "next/image";
import { signOut } from "next-auth/react";
import { useRouter } from "next/router";

interface activeSection {
    setEnable: Function;
    setActive: Function;
    setShow: Function;
    whitelist:boolean

  }
const WhitelistSuccessful = (props: activeSection) => {
  const { mode } = useContext(Context);
  const route = useRouter();

  return (
    <>
      {/* <div
        className={`bg-black  z-[9] duration-300 fixed top-0 left-0 h-full w-full opacity-80 visible
          }`}
      ></div> */}
      <div className="max-w-[calc(100%-30px)] md:max-w-[510px] w-full p-5 md:p-40 z-10 fixed rounded-10 bg-white dark:bg-omega top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%]">
        <div className="flex items-center justify-center ">
          <Image src='/assets/profile/successful.gif' width={60} height={60} alt="success" />
        </div>
        <p className="py-20 info-14-18 text-center">WhiteList {props?.whitelist===true?"Enabled":"Disabled"}</p>
        <p className="pb-20 info-14 text-center">You have successfuly {props?.whitelist===true?"enabled":"disabled"} whitelist</p>

        <button
          className="solid-button w-full hover:bg-primary-800"
          onClick={() => {
            props.setActive(false);
                props.setShow(false);
                 props.setEnable(0);
          }}
        >
          OK
        </button>

      </div>
    </>
  );
};

export default WhitelistSuccessful;
