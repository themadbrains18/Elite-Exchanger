import React, { useContext, useEffect, useRef } from "react";
import Context from "../contexts/context";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import clickOutSidePopupClose from "./clickOutSidePopupClose";

interface activeSection {
    setActive: Function;
    setShow: Function;
    message?: string;
    title?: string;
    show?: boolean;
    actionPerform?: any;
    type?:string
}

const BuyAuthenticationModelPopup = (props: activeSection) => {
    const { mode } = useContext(Context);
    const { status, data: session } = useSession();
    const route = useRouter();

    const closePopup = () => {
        props.setShow(false);
        props.setActive(false);
    }
    const wrapperRef = useRef(null);
    clickOutSidePopupClose({ wrapperRef, closePopup });

    return (
        <>
            <div className={`bg-black  z-[9] duration-300 fixed top-0 left-0 h-full w-full opacity-80 visible`} onClick={() => { props.setShow(false) }}></div>
            <div ref={wrapperRef} className="max-w-[calc(100%-30px)] md:max-w-[400px] w-full p-5 md:p-40 z-10 fixed rounded-10 bg-white dark:bg-omega top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] ">
                <div className="flex items-center justify-between ">
                    <p className="md-text">Advertiser terms</p>
                    <svg
                        onClick={() => {
                            props.setShow(false);
                            props.setActive(false);
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
                  
                    <div className=" mt-20">
                        <div className="sec-text dark:!text-g-secondary text-center">
                            {props?.type==="kyc" ? 'Please complete your KYC (Know Your Customer) verification. KYC verification is gain access to advanced features.' : 'User must be holding more than 0.01 BTC'}
                        </div>
                        
                    </div>
                    <div className="flex justify-between mt-20 gap-[20px]">
                            <button className="solid-button2 w-full max-w-[50%]"  onClick={() => {
                            props.setShow(false);
                            props.setActive(false);
                        }}>Cancel</button>
                            {props?.type === 'kyc' ? <button className="solid-button w-full !px-[10px] !py-[4px] max-w-[50%] whitespace-nowrap" onClick={() => route.push('/profile/kyc')}>
                                Verify
                            </button> : <button onClick={() => route.push('/wallet')} className="solid-button w-full max-w-[50%] !px-[10px] !py-[4px] whitespace-nowrap">
                                Go to Wallet
                            </button>}

                        </div>

                </div>

            </div>
        </>

    );
};

export default BuyAuthenticationModelPopup;
