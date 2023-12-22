import React, { useContext, useEffect } from "react";
import Context from "../contexts/context";

interface propsData {
  setIsShow: Function;
}
const PositionModal = (props: propsData) => {
  const { mode } = useContext(Context);
  useEffect(() => {
    let radioCta = document.querySelector("#custom-radio1") as HTMLInputElement | null;
     
    if (radioCta instanceof HTMLElement) {
      radioCta.click();
    }

  }, []);
  return (
    <>
      <div
        className={`bg-black  z-[9] duration-300 fixed top-0 left-0 h-full w-full opacity-80 visible`}
      ></div>
      <div className="prefrence max-w-[calc(100%-30px)] md:max-w-[510px] w-full p-5 md:p-40 z-10 fixed rounded-10 bg-white dark:bg-omega top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] ">
        <div className="flex items-center justify-between ">
          <p className={`sec-title text-[18px]`}>Position Mode</p>
          <svg
            onClick={() => {
              props?.setIsShow(false);
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
              <div className="flex justify-between items-center w-full mb-[5px]">
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
                    htmlFor={`custom-radio1`}
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
                   One Way Mode
                    </p>
                  </label>
                </div>
              </div>
                  <p className="info-12 pl-[25px]">Under one-way mode, you can hold either a long or a short position of a contract.  </p>

                </div>
            </div>
            <div className="flex justify-between mt-20">
                <div>
              <div className="flex justify-between items-center w-full mb-[5px]">
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
                      Hedge Mode
                    </p>
                  </label>
                </div>
              </div>
                  <p className="info-12 pl-[25px]">Under hedge mode, you can hold both long and short positions simultaneously of a contract.  </p>

                </div>
            </div>
           
        
       
          <div className=" mt-20">
           
              <p className="info-12 mb-[10px]">
              It is not allowed to switch between one-way mode and hedge mode while holding position(s) or active order(s). The setting applies to the current Derivatives pair only.  
              </p>
              <p className="info-12">
              This switch will take effect on both the website and the app at the same time. Please upgrade the app to the latest version.    
              </p>
              <div className="flex mt-[30px] gap-5">
              <input id={`custom-radio-12`} type="checkbox" value="" name="colored-radio" className="hidden w-5 h-5 max-w-full   bg-red-400 border-[transparent] focus:ring-primary dark:focus:ring-primary dark:ring-offset-primary  dark:bg-[transparent] dark:border-[transparent]" />
                <label htmlFor={`custom-radio-12`} className="
                    custom-radio relative  px-[17px]  flex gap-2 items-center pl-[18px]
                    cursor-pointer
                    after:dark:bg-omega
                    after:bg-white
                    after:left-[0px]
                    after:w-[20px] 
                    after:h-[20px]
                    after:border after:border-beta
                    after:absolute

                    before:dark:bg-[transparent]
                    before:bg-white
                    before:left-[5px]
        
                    before:w-[10px] 
                    before:h-[10px]
                    before:absolute
                    before:z-[1]
                    
                    ">
                    <p className="ml-2 info-12">Apply to all USDT pairs</p>
                </label>
                  
                  </div>
          </div>
          <div className="flex items-center gap-10 mt-[30px]">
            <button
              className="solid-button w-full px-[20px] py-[15px]"
              onClick={(e) => {
                props?.setIsShow(false);
                // props.actionPerform();
              }}
            >
              Confirm
            </button>
            <button
              className="outline-button w-full"
              onClick={() => {
                props?.setIsShow(false);
                // props.setShow(0);
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default PositionModal;
