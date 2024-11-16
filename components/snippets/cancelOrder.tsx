import React, { useContext, useEffect, useRef, useState } from "react";
import Context from "../contexts/context";
import clickOutSidePopupClose from "../snippets/clickOutSidePopupClose";

/**
 * Interface representing the props for the CancelOrder component.
 *
 * @interface CancelOrderProps
 * @property {Function} setEnable - A function to enable or disable the cancel order feature.
 * @property {Function} setShow - A function to show or hide the cancel order component.
 * @property {Function} actionPerform - A function to perform the cancel order action.
 */
interface CancelOrderProps {
    setEnable: Function;
    setShow: Function;
    actionPerform: Function;
}

const CancelOrder = (props: CancelOrderProps) => {
    const { mode } = useContext(Context);

    /**
     * Closes the popup/modal by setting the visibility state to false and deactivating the current step or process.
     * This function is typically used to hide the popup/modal and reset any associated states when the user decides to close it.
     *
     * @function closePopup
     * @returns {void}
     */
    const closePopup = () => {
        props.setShow(false), props.setEnable(false);
    }
    const wrapperRef = useRef(null);
    clickOutSidePopupClose({ wrapperRef, closePopup });

    return (
        <>
            <div
                className={`bg-black  z-[9] duration-300 fixed top-0 left-0 h-full w-full opacity-50 visible`}
            ></div>
            <div ref={wrapperRef} className="max-w-[calc(100%-30px)] md:max-w-[510px] w-full p-5 md:p-20 z-10 fixed rounded-10 bg-white dark:bg-omega top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%]">
                <div className="flex items-center justify-between ">
                    <p className="sec-title">Confirm Order cancellation</p>
                    <svg
                        onClick={() => {
                            props.setShow(false), props.setEnable(false);
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
                <div className=" bg-[#EF4444] bg-opacity-[30%] rounded-5 p-3 mt-5 mb-6 mx-2 ">
                    <div className="flex gap-2 items-center">
                        <div className="max-w-[24px] w-full">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                fill="none"
                                className="css-94sbqg"
                            >
                                <path
                                    fillRule="evenodd"
                                    clipRule="evenodd"
                                    d="M12 21a9 9 0 100-18 9 9 0 000 18zm-1.25-5.5V18h2.5v-2.5h-2.5zm0-9.5v7h2.5V6h-2.5z"
                                    fill="#EF4444"
                                />
                            </svg>


                        </div>
                        <p className="text-[14px] dark:text-white">
                            Reminder
                        </p>

                    </div>
                    <ol className="list-decimal list-inside mt-[10px]">
                        <li className="sm-text mb-2 font-semibold ">
                            No refunds after order cancellation To avoid financial loss, do not cancel the order after payment
                        </li>
                        <li className="sm-text font-semibold ">
                            Tips: You will not be able to use "Buy" function if you have cancelled order 3 times in one day
                        </li>
                    </ol>
                </div>
                <div className="flex gap-3 justify-between">

                    <button
                        className="solid-button2 w-full"
                        onClick={() => {
                            props.setEnable(false);
                            // setActive(true)
                        }}
                    >
                        Back
                    </button>
                    <button
                        className="solid-button w-full"
                        onClick={() => {
                            props?.actionPerform('mannual')
                            props.setEnable(false);
                            // setActive(true)
                        }}
                    >
                        Confirm
                    </button>
                </div>
            </div>

        </>
    );
};

export default CancelOrder;
