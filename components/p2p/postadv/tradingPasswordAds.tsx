import React, { useContext, useEffect, useRef, useState } from "react";
import Context from "../../contexts/context";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import clickOutSidePopupClose from "@/components/snippets/clickOutSidePopupClose";
import Image from "next/image";

interface activeSection {
    setActive: Function,
    setShow: Function;
    finalSubmitAds: Function;
    show: any;
}

const TradingPasswordAds = (props: activeSection) => {
    const { mode } = useContext(Context);
    const [passCode, setPassCode] = useState("");
    const [message, setMessage] = useState("");
    const [showNew, setShowNew] = useState(false);
    const [disable, setDisabled] = useState(false)

    // useEffect(() => {
    //     const inputElements = document.querySelectorAll(".input_wrapper input");

    //     inputElements.forEach((ele, index) => {
    //         ele.addEventListener("keydown", (e: any) => {
    //             if (e.keyCode === 8 && e.target.value === "") {
    //                 (inputElements[Math.max(0, index - 1)] as HTMLElement).focus();
    //             }
    //         });
    //         ele.addEventListener("input", (e: any) => {
    //             const [first, ...rest] = e.target.value;
    //             e.target.value = first ?? "";
    //             const lastInputBox = index === inputElements.length - 1;
    //             const didInsertContent = first !== undefined;
    //             if (didInsertContent && !lastInputBox) {
    //                 // continue to input the rest of the string
    //                 (inputElements[index + 1] as HTMLElement).focus();
    //                 (inputElements[index + 1] as HTMLInputElement).value = rest.join("");
    //                 inputElements[index + 1].dispatchEvent(new Event("input"));
    //             } else {
    //                 setPassCode((inputElements[0] as HTMLInputElement).value +
    //                     "" +
    //                     (inputElements[1] as HTMLInputElement).value +
    //                     "" +
    //                     (inputElements[2] as HTMLInputElement).value +
    //                     "" +
    //                     (inputElements[3] as HTMLInputElement).value +
    //                     "" +
    //                     (inputElements[4] as HTMLInputElement).value +
    //                     "" +
    //                     (inputElements[5] as HTMLInputElement).value)
    //             }
    //         });
    //     });

    // }, []);

    const closePopup = () => {
        props?.setShow(false);
        props.setActive(0)
    }
    const wrapperRef: any = useRef(null);
    clickOutSidePopupClose({ wrapperRef, closePopup });

    return (
        <>
            <ToastContainer />
            <div
                className={`bg-black  z-[9] duration-300 fixed top-0 left-0 h-full w-full ${props.show ? "opacity-80 visible" : "opacity-0 invisible"
                    }`}
            ></div>
            <div ref={wrapperRef} className="max-w-[calc(100%-30px)] md:max-w-[510px] w-full p-5 md:p-40 z-10 fixed rounded-10 bg-white dark:bg-omega top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%]">
                <div className="flex items-center justify-between ">
                    <p className="sec-title">Enter Trading Passsword</p>
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

                <div className="py-30 md:py-40 ">
                    <div className="flex flex-col mb-[15px] md:mb-10 gap-20">
                        <label className="sm-text">Enter Trading Password</label>
                        {/* <div className="flex gap-10 justify-center items-center input_wrapper">
                            <input type="text" autoComplete="off" className="block px-2 font-noto md:px-5 w-40 md:w-[60px] dark:bg-black bg-primary-100  text-center  rounded min-h-[40px] md:min-h-[62px] text-black dark:text-white outline-none focus:!border-primary" name="code1" />
                            <input type="text" autoComplete="off" className="block px-2 font-noto md:px-5 w-40 md:w-[60px] dark:bg-black bg-primary-100  text-center  rounded min-h-[40px] md:min-h-[62px] text-black dark:text-white outline-none focus:!border-primary" name="code2" />
                            <input type="text" autoComplete="off" className="block px-2 font-noto md:px-5 w-40 md:w-[60px] dark:bg-black bg-primary-100  text-center  rounded min-h-[40px] md:min-h-[62px] text-black dark:text-white outline-none focus:!border-primary" name="code3" />
                            <input type="text" autoComplete="off" className="block px-2 font-noto md:px-5 w-40 md:w-[60px] dark:bg-black bg-primary-100  text-center  rounded min-h-[40px] md:min-h-[62px] text-black dark:text-white outline-none focus:!border-primary" name="code4" />
                            <input type="text" autoComplete="off" className="block px-2 font-noto md:px-5 w-40 md:w-[60px] dark:bg-black bg-primary-100  text-center  rounded min-h-[40px] md:min-h-[62px] text-black dark:text-white outline-none focus:!border-primary" name="code5" />
                            <input type="text" autoComplete="off" className="block px-2 font-noto md:px-5 w-40 md:w-[60px] dark:bg-black bg-primary-100  text-center  rounded min-h-[40px] md:min-h-[62px] text-black dark:text-white outline-none focus:!border-primary" name="code6" onChange={(e) => { 
                                
                             }} />
                        </div> */}

                        <div className='relative'>
                            <input
                                type={`${showNew === true ? "text" : "password"}`}
                                name='new_password'
                                maxLength={32}
                                placeholder="Enter new password"
                                className="sm-text input-cta2 w-full"
                                onChange={(e)=>{setPassCode(e.target.value)}}
                            />
                            <Image
                                src={`/assets/register/${showNew === true ? "show.svg" : "hide.svg"}`}
                                alt="eyeicon"
                                width={24}
                                height={24}
                                onClick={() => {
                                    setShowNew(!showNew);
                                }}
                                className="cursor-pointer absolute top-[50%] right-[20px] translate-y-[-50%]"
                            />
                        </div>
                    </div>
                    <p style={{ color: "#ff0000d1" }}>
                        {message}
                    </p>
                </div>

                <button disabled={disable} className={`solid-button w-full ${disable&& 'cursor-not-allowed'}`} onClick={(e) => {
                    try {
                        e.preventDefault();
                        if (passCode !== "") {
                            setDisabled(true)
                            props.finalSubmitAds(passCode);
                            setTimeout(()=>{
                                setDisabled(false)
                            },3000)
                        }
                        else {
                            setMessage("Please enter your trading password");
                        }
                    } catch (error) {

                    }


                }}>
                     {disable &&
            <svg aria-hidden="true" role="status" className="inline w-4 h-4 me-3 text-white animate-spin" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="#E5E7EB" />
              <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentColor" />
            </svg>
          }
                    Submit</button>
            </div>
        </>

    );
};

export default TradingPasswordAds;
