import Image from "next/image";
import React, { useContext, useEffect, useRef, useState } from "react";
import clickOutSidePopupClose from "./clickOutSidePopupClose";
import Context from "../contexts/context";

interface changeProps {
  setEnable: Function;
  setShow?: any;
}

const CodeNotRecieved = (props: changeProps) => {
  const { mode } = useContext(Context);
  const [active, setActive] = useState(1);

  const closePopup = () => {
    props?.setShow &&   props?.setShow(true);
    props.setEnable(false);
    
  };
  const wrapperRef = useRef(null);
  clickOutSidePopupClose({ wrapperRef, closePopup });

  return (
    <>
      <div
        className={`bg-black  z-[20] duration-300 fixed top-0 left-0 h-full w-full opacity-50 visible
          }`}
      ></div>
      <div
            ref={wrapperRef}
        className="p-6 fixed max-h-[calc(100%-30px)] overscroll-none	 top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%]  rounded-[10px] bg-white dark:bg-omega  z-[99] max-w-[calc(100%-36px)] md:max-w-[520px] w-full overflow-auto"
      >
        <div className="flex items-center justify-between mb-[16px]">
          <p className="sec-title dark:text-off-white">
            Didn't receive the code?
          </p>
          <svg
            onClick={() => {
              // props?.setShow &&   props?.setShow(true);
              props.setEnable(false);
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
        <div className="flex items-center gap-[40px] mb-6">
          <p
            className={`info-10-14 pb-4 border-b-[2px] cursor-pointer border-[transparent] ${active === 1 && " border-b-primary font-bold"
              }`}
            onClick={() => {
              setActive(1);
            }}
          >
            Email
          </p>
          <p
            className={`info-10-14 pb-4 border-b-[2px] cursor-pointer border-[transparent] ${active === 2 && " border-b-primary font-bold"
              }`}
            onClick={() => {
              setActive(2);
            }}
          >
            Mobile
          </p>
        </div>
        <p className="text-[14px] text-d-body-primary mb-2">
          If you have not received the code after several attempts, please try
          the following
        </p>
        <ol className="px-[6px] list-decimal list-inside my-4">
          <li className="text-[14px] leading-[22px] text-d-body-primary">
            {" "}
            Check it once again your {active === 1
              ? "email"
              : "mobile number"}{" "}
            is valid.
          </li>
          <li className="text-[14px] text-d-body-primary">
            Check if the code is in the Spam/trash bin
          </li>
          <li className="text-[14px] text-d-body-primary">
            Give it a few minutes. There might have been a delay.
          </li>
          <li className="text-[14px] leading-[22px] text-d-body-primary">
            {" "}
            Try a different {active === 1
              ? "email"
              : "mobile number"}{" "}.
          </li>
        </ol>
        <p className="text-[14px] text-d-body-primary">
          If you haven’t received your code timely, please contact us at{" "}
          <a
            href="mailto:support@launchyourexchange.com"
            className="text-primary underline"
          >
            support@launchyourexchange.com
          </a>
          .
        </p>
        <div className="flex items-center gap-10 mt-6">
          <button
            className="solid-button w-full"
            onClick={() => {
              props?.setShow &&    props?.setShow(true);
              props.setEnable(false);
              
            }}
          >
            OK
          </button>
        </div>
      </div>
    </>
  );
};

export default CodeNotRecieved;
