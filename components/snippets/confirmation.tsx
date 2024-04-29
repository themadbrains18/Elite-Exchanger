import React, { useContext, useEffect, useRef, useState } from "react";
import Context from "../contexts/context";
import clickOutSidePopupClose from "./clickOutSidePopupClose";
import { signOut, useSession } from "next-auth/react";
import { toast } from "react-toastify";

interface activeSection {
    setActive: Function;
    setShow: Function;
    message?: string;
    title?: string;
    show?: boolean;
    actionPerform?: any;
}

const ConfirmationModel = (props: activeSection) => {
    const { mode } = useContext(Context);
    const [btnDisabled, setBtnDisabled] = useState(false)

    const { status, data: session } = useSession()

    const text: any = props.message;
    const newText = text.split('\n');


    const sendOtp = async () => {
        try {

            setBtnDisabled(true)

            if (status === 'authenticated') {
                props.actionPerform();
                setTimeout(() => {
                    setBtnDisabled(false)

                }, 3000)
            }
            else {
                toast.error('Your session is expired. Its auto redirect to login page');
                setTimeout(() => {
                    signOut();
                }, 4000);

            }
        } catch (error) {
            console.log(error);
        }
    }

    const closePopup = () => {
        props?.setShow(false);
        props.setActive(0);
    }
    const wrapperRef = useRef(null);
    clickOutSidePopupClose({ wrapperRef, closePopup });

    return (
        <>
            <div className={`bg-black  z-[9] duration-300 fixed top-0 left-0 h-full w-full ${props.show ? "opacity-30 visible" : "opacity-0 invisible"}`} onClick={() => { props.setShow(false) }}></div>
            <div ref={wrapperRef} className="max-w-[calc(100%-30px)] md:max-w-[510px] w-full p-5 md:p-40 z-10 fixed rounded-10 bg-white dark:bg-omega top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] ">
                <div className="flex items-center justify-between gap-[10px]">
                    <p className="sec-title">{props?.title}</p>
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
                {/* <p className={`py-20 info-14-18`}></p> */}
                {newText.map((item: any) => {
                    return <p className={`py-1 info-14-18 mt-[10px]`}>{item}</p>
                })}
                <p className={`py-20 info-14-18`}></p>
                <div className="flex items-center gap-10">
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
                        disabled={btnDisabled}
                        className={`solid-button w-full ${btnDisabled && "cursor-not-allowed"}`}
                        onClick={() => {
                            sendOtp()

                        }}
                    >
                        {btnDisabled &&
                            <svg aria-hidden="true" role="status" className="inline w-4 h-4 me-3 text-white animate-spin" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="#E5E7EB" />
                                <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentColor" />
                            </svg>
                        }
                        Confirm
                    </button>
                </div>
            </div>
        </>

    );
};

export default ConfirmationModel;
