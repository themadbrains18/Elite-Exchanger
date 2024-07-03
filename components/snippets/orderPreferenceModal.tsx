import React, { useContext, useEffect, useRef, useState } from "react";
import Context from "../contexts/context";
import clickOutSidePopupClose from "./clickOutSidePopupClose";

interface propsData {
  setPreference: Function;
  currentToken: any;
  setPreferenceSymbol: Function;
  prefernceSymbol: string;
  setOrderType:Function;
  setSizeValue:Function
}
const OrderPreferenceModal = (props: propsData) => {
  const { mode } = useContext(Context);
  const [value, setValue] = useState(props?.prefernceSymbol)

  useEffect(() => {
    let radioCta = document.querySelector("#custom-radio1") as HTMLInputElement | null;
    let radioCta2 = document.querySelector("#custom-radio2") as HTMLInputElement | null;

    if (value === "Qty") {
      radioCta?.click();
    }
    else {
      radioCta2?.click()
    }

  }, [value]);

  const closePopup = () => {
    props?.setPreference(false);
  }
  const wrapperRef = useRef(null);
  clickOutSidePopupClose({ wrapperRef, closePopup });

  return (
    <>
      <div
        className={`bg-black  z-[9] duration-300 fixed top-0 left-0 h-full w-full opacity-80 visible`}
      ></div>
      <div ref={wrapperRef} className="prefrence max-w-[calc(100%-30px)] md:max-w-[510px] w-full p-5 md:p-40 z-10 fixed rounded-10 bg-white dark:bg-omega top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] ">
        <div className="flex items-center justify-between ">
          <p className={`sec-title text-[18px]`}>Order Placement Preferences</p>
          <svg
            onClick={() => {
              props?.setPreference(false);
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
        <div className="mt-40">
          <div className="flex justify-between mt-20">
            <div className="w-full">
              <div
                className="flex justify-between items-center w-full mb-[5px]"
                onClick={() => {
                  setValue("Qty")
                }}
              >
                <div
                  className={`flex gap-5 items-center  w-full cursor-pointer bg-[transparent]`}
                >
                  <input
                    id={`custom-radio1`}
                    type="radio"
                    value=""
                    name="colored-radio"
                    className="hidden w-4 h-4 max-w-full   bg-red-400 border-[transparent] focus:ring-primary dark:focus:ring-primary dark:ring-offset-primary  dark:bg-[transparent] dark:border-[transparent]"
                  />
                  <label
                    htmlFor={`custom-radio`}
                    className="
                custom-radio relative  px-[17px]  flex gap-3 items-center pl-[25px]
                cursor-pointer
                after:dark:bg-omega
                after:bg-white
                after:left-[0px]
                after:w-[16px] 
                after:h-[16px]
                after:rounded-[50%] 
                after:border after:border-beta
                after:absolute

                before:dark:bg-[transparent]
                before:bg-white
                before:left-[4px]
    
                before:w-[8px] 
                before:h-[8px]
                before:rounded-[50%] 
                before:absolute
                before:z-[1]
                
                "
                  >
                    <p className="md-text dark:!text-g-secondary">
                      {" "}
                      Order by Qty
                    </p>
                  </label>
                </div>
                <p className="md-text dark:!text-g-secondary">
                  {props?.currentToken?.coin_symbol}
                </p>
              </div>
              <p className="info-12 pl-[25px]">
                Please enter your order qty denominated in {props?.currentToken?.coin_symbol} terms.
              </p>
            </div>
          </div>
          <div className="flex justify-between mt-20">
            <div>
              <div className="flex justify-between items-center w-full mb-[5px]" onClick={() => { setValue("Value") }}>
                <div
                  className={`flex gap-5 items-center  w-full cursor-pointer bg-[transparent]`}
                >
                  <input
                    id={`custom-radio2`}
                    type="radio"
                    value=""
                    name="colored-radio"
                    className="hidden w-4 h-4 max-w-full   bg-red-400 border-[transparent] focus:ring-primary dark:focus:ring-primary dark:ring-offset-primary  dark:bg-[transparent] dark:border-[transparent]"
                  />
                  <label
                    htmlFor={`custom-radio2`}
                    className="
                custom-radio relative  px-[17px]  flex gap-3 items-center pl-[25px]
                cursor-pointer
                after:dark:bg-omega
                after:bg-white
                after:left-[0px]
                after:w-[16px] 
                after:h-[16px]
                after:rounded-[50%] 
                after:border after:border-beta
                after:absolute

                before:dark:bg-[transparent]
                before:bg-white
                before:left-[4px]
    
                before:w-[8px] 
                before:h-[8px]
                before:rounded-[50%] 
                before:absolute
                before:z-[1]
                
                "
                  >
                    <p className="md-text dark:!text-g-secondary">
                      {" "}
                      Order by Value
                    </p>
                  </label>
                </div>
                <p className="md-text dark:!text-g-secondary">
                  {props?.currentToken?.usdt_symbol}
                </p>
              </div>
              <p className="info-12 pl-[25px]">
                Please enter your order cost that's inclusive of the initial
                margin, fees to open, and fees to close. Modifying the leverage
                will not change your order cost.
              </p>
            </div>
          </div>

         {value==="Value" && <div className=" mt-20">
            <div className="info-10-14 mb-2">
             Note
            </div>

            <p className="info-12 text-black dark:text-white">
              Your order quantity will be calculated based on the value of your
              filled order. Please note that in the event of extreme market
              fluctuations, your order placement may fail.
            </p>
          </div>}
          <div className="flex items-center gap-10 mt-[20px]">
            <button
              className="solid-button w-full px-[20px] py-[15px]"
              onClick={() => {
                props?.setPreferenceSymbol(value)
                props?.setPreference(false);
                props?.setOrderType(value.toLowerCase());
                props.setSizeValue(0);
                // props.actionPerform();
              }}
            >
              Confirm
            </button>
            {/* <button
              className="outline-button w-full"
              onClick={() => {
                props?.setPreference(false);
                // props.setShow(0);
              }}
            >
              Cancel
            </button> */}
          </div>
        </div>
      </div>
    </>
  );
};

export default OrderPreferenceModal;
