import React, { useContext, useEffect } from "react";
import Context from "../contexts/context";

interface activeSection {
    setActive:Function,
    setShow: Function;
  }

const TradingPassword = (props:activeSection) => {
  const { mode } = useContext(Context);

  useEffect(() => {
    const inputElements = document.querySelectorAll(".input_wrapper input") ;
    const inputElements2 = document.querySelectorAll(".input_wrapper2 input");
    // console.log(inputElements.length);

    inputElements.forEach((ele, index) => {
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
        }
      });
    });
    inputElements2.forEach((ele, index) => {
      ele.addEventListener("keydown", (e: any) => {
        if (e.keyCode === 8 && e.target.value === "") {
          (inputElements2[Math.max(0, index - 1)] as HTMLElement).focus();
        }
      });
      ele.addEventListener("input", (e: any) => {
        const [first, ...rest] = e.target.value;
        e.target.value = first ?? "";
        const lastInputBox = index === inputElements2.length - 1;
        const didInsertContent = first !== undefined;
        if (didInsertContent && !lastInputBox) {
          // continue to input the rest of the string
          (inputElements2[index + 1] as HTMLElement).focus();
          (inputElements2[index + 1] as HTMLInputElement).value = rest.join("");
          inputElements2[index + 1].dispatchEvent(new Event("input"));
        } else {
        }
      });
    });
  }, []);

  return (
    <div className="max-w-[calc(100%-30px)] md:max-w-[510px] w-full p-5 md:p-40 z-10 fixed rounded-10 bg-white dark:bg-omega top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%]">
      <div className="flex items-center justify-between ">
        <p className="sec-title">Set Trading Passsword</p>
        <svg
          onClick={() => {
            props?.setShow(false);
            props.setActive(0)
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
      <p className="pt-40 info-14-18">To secure your account please complete the following process</p>

      <form>
        <div className="py-30 md:py-40">
          <div className="flex flex-col mb-[15px] md:mb-30 gap-20">
            <label className="sm-text">Enter Trading Password</label>
            <div className="flex gap-10 justify-center items-center input_wrapper">
              <input type="number" autoComplete="off" className="block px-2 font-noto md:px-5 w-[60px] dark:bg-black bg-primary-100  text-center  rounded min-h-[62px] text-black dark:text-white outline-none focus:!border-primary" name="code1" />
              <input type="number" autoComplete="off" className="block px-2 font-noto md:px-5 w-[60px] dark:bg-black bg-primary-100  text-center  rounded min-h-[62px] text-black dark:text-white outline-none focus:!border-primary" name="code2" />
              <input type="number" autoComplete="off" className="block px-2 font-noto md:px-5 w-[60px] dark:bg-black bg-primary-100  text-center  rounded min-h-[62px] text-black dark:text-white outline-none focus:!border-primary" name="code3" />
              <input type="number" autoComplete="off" className="block px-2 font-noto md:px-5 w-[60px] dark:bg-black bg-primary-100  text-center  rounded min-h-[62px] text-black dark:text-white outline-none focus:!border-primary" name="code4" />
              <input type="number" autoComplete="off" className="block px-2 font-noto md:px-5 w-[60px] dark:bg-black bg-primary-100  text-center  rounded min-h-[62px] text-black dark:text-white outline-none focus:!border-primary" name="code5" />
              <input type="number" autoComplete="off" className="block px-2 font-noto md:px-5 w-[60px] dark:bg-black bg-primary-100  text-center  rounded min-h-[62px] text-black dark:text-white outline-none focus:!border-primary" name="code6" onChange={(e)=>{console.log(e)}}/>
            </div>
          </div>
          <div className="flex flex-col mb-[15px] md:mb-30 gap-20">
            <label className="sm-text">Enter SMS Verification Code</label>
            <div className="flex gap-10 justify-center items-center input_wrapper2">
              <input type="number" autoComplete="off" className="block px-2 font-noto md:px-5  w-40 md:w-[60px] dark:bg-black bg-primary-100  text-center  rounded min-h-[40px] md:min-h-[62px] text-black dark:text-white outline-none focus:!border-primary" name="code1" />
              <input type="number" autoComplete="off" className="block px-2 font-noto md:px-5 w-40 md:w-[60px] dark:bg-black bg-primary-100  text-center  rounded min-h-[40px] md:min-h-[62px] text-black dark:text-white outline-none focus:!border-primary" name="code2" />
              <input type="number" autoComplete="off" className="block px-2 font-noto md:px-5 w-40 md:w-[60px] dark:bg-black bg-primary-100  text-center  rounded min-h-[40px] md:min-h-[62px] text-black dark:text-white outline-none focus:!border-primary" name="code3" />
              <input type="number" autoComplete="off" className="block px-2 font-noto md:px-5 w-40 md:w-[60px] dark:bg-black bg-primary-100  text-center  rounded min-h-[40px] md:min-h-[62px] text-black dark:text-white outline-none focus:!border-primary" name="code4" />
              <input type="number" autoComplete="off" className="block px-2 font-noto md:px-5 w-40 md:w-[60px] dark:bg-black bg-primary-100  text-center  rounded min-h-[40px] md:min-h-[62px] text-black dark:text-white outline-none focus:!border-primary" name="code5" />
              <input type="number" autoComplete="off" className="block px-2 font-noto md:px-5 w-40 md:w-[60px] dark:bg-black bg-primary-100  text-center  rounded min-h-[40px] md:min-h-[62px] text-black dark:text-white outline-none focus:!border-primary" name="code6" />
            </div>
            <p className="info-10-14 text-end">Send SMS</p>
          </div>

          
          
        </div>
        <button className="solid-button w-full" onClick={()=>{props?.setActive(3)}}>Submit</button>
      </form>
    </div>
  );
};

export default TradingPassword;
