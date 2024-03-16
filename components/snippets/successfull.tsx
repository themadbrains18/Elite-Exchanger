import React, { useContext, useEffect, useRef } from "react";
import Context from "../contexts/context";
import clickOutSidePopupClose from "./clickOutSidePopupClose";

interface activeSection {
  setActive: Function;
  setShow: Function;
  type: string;
}

const Successfull = (props: activeSection) => {
  const { mode } = useContext(Context);

  const closePopup = () => {
    props.setShow(false), props.setActive(0);
  };
  const wrapperRef = useRef(null);
  clickOutSidePopupClose({ wrapperRef, closePopup });
  return (
    <div
      ref={wrapperRef}
      className="max-w-[calc(100%-30px)] md:max-w-[510px] w-full p-5 md:p-40 z-10 fixed rounded-10 bg-white dark:bg-omega top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%]"
    >
      <div className="flex items-center justify-between ">
        <p className="sec-title">
          {props?.type === "success"
            ? "Payment Method Setting"
            : "Risk Warning"}
            {
              props?.type==="release"&&
              "Assets Release"
            }
        </p>
        <svg
          onClick={() => {
            props.setShow(false), props.setActive(0);
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
      <p className="py-40 info-14-18">
        {props?.type === "success"
          ? "New payment method has been added successfully."
          : "Before releasing the crypto, please confirm that you have received the payment and have checked if the amount and payers name match those of the order if payment information is inconsistent or there arise a dispute , please immediatly contact the customer support and do not release the crypto."}
      </p>

      {props?.type === "release" && (
        <p className="py-40 info-14-18"> Assets Released successfully.</p>
      )}
      {props?.type === "success" || props?.type === "release" ? (
        <button
          className="solid-button w-full"
          onClick={() => {
            props?.setActive(0);
            props.setShow(false);
          }}
        >
          OK
        </button>
      ) : (
        <div>
          <button
            className="solid-button w-full"
            onClick={() => {
              props?.setActive(0);
              props.setShow(false);
            }}
          >
            Cancel
          </button>
          <button
            className="solid-button w-full"
            onClick={() => {
              props?.setActive(0);
              props.setShow(false);
            }}
          >
            Confirm
          </button>
        </div>
      )}
    </div>
  );
};

export default Successfull;
