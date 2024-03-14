import React, { useContext, useRef, useState } from 'react'
import RangeSlider from '../range-slider';
import SelectDropdown from '../snippet/select-dropdown';
import Context from '@/components/contexts/context';
import { useSession } from 'next-auth/react';
import clickOutSidePopupClose from '@/components/snippets/clickOutSidePopupClose';

interface showPopup {
    modelPopup?: number;
    setConfirmModelPopup?: any;
    setConfirmModelOverlay?: any;
    modelOverlay?: boolean;
    confirmOrder?: any;
    confirmOrderData?: any;
}

const TradeConfirmPopupModal = (props: showPopup) => {

    let { mode } = useContext(Context);

    const closePopup = () => {
        props.setConfirmModelOverlay(false);
                        props.setConfirmModelPopup(0);
      }
      const wrapperRef = useRef(null);
      clickOutSidePopupClose({ wrapperRef, closePopup });

    return (
        <div ref={wrapperRef} className={`max-w-[calc(100%-30px)] duration-300 md:max-w-[520px] w-full p-5 md:p-[32px] z-10 fixed rounded-10 bg-white dark:bg-[#292d38] ${props.modelPopup == 1 ? 'top-[50%] opacity-1 visible' : 'top-[52%] opacity-0 invisible'}  left-[50%] translate-x-[-50%] translate-y-[-50%]`}>
            <div className="flex items-center justify-between mb-[20px]">
                <p className="sec-title !text-[20px]">Market Buy {props?.confirmOrderData?.symbol} </p>
                <svg
                    onClick={() => {
                        props.setConfirmModelOverlay(false);
                        props.setConfirmModelPopup(0);

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
            <div>
                <div className='flex justify-between items-center mb-[10px]'>
                    <p className='dark:text-white text-black'>Order Price</p>
                    <p className='dark:text-white text-black'>{props?.confirmOrderData?.type === 'limit' ? props?.confirmOrderData?.price_usdt : props?.confirmOrderData?.market_price}</p>
                </div>
                <div className='flex justify-between items-center mb-[10px]'>
                    <p className='dark:text-white text-black'>Qty</p>
                    <p className='dark:text-white text-black'>{props?.confirmOrderData?.qty} BTC</p>
                </div>
                <div className='flex justify-between items-center mb-[10px]'>
                    <p className='dark:text-white text-black'>Order Cost</p>
                    <p className='dark:text-white text-black'>{props?.confirmOrderData?.margin} USDT</p>
                </div>
                <div className='flex justify-between items-center mb-[10px]'>
                    <p className='dark:text-white text-black'>Order Value</p>
                    <p className='dark:text-white text-black'>{props?.confirmOrderData?.type === 'limit' ? parseFloat(props?.confirmOrderData?.amount)?.toFixed(5) : props?.confirmOrderData?.size?.toFixed(5)} USDT</p>
                </div>
                <div className='flex justify-between items-center mb-[10px]'>
                    <p className='dark:text-white text-black'>Estimated Liq. Price</p>
                    <p className='dark:text-white text-black'>{props?.confirmOrderData?.liq_price?.toFixed(5)} USDT</p>
                </div>
                <div className='flex justify-between items-center mb-[10px]'>
                    <p className='dark:text-white text-black'>Leverage</p>
                    <p className='dark:text-white text-black'>{props?.confirmOrderData?.leverage_type} {props?.confirmOrderData?.leverage}x</p>
                </div>
                <div className='flex justify-between items-center mb-[10px]'>
                    <p className='dark:text-white text-black'>Time in Force</p>
                    <p className='dark:text-white text-black'>Immediate-Or-Cancel</p>
                </div>
                <div className='flex justify-between items-center mb-[10px] gap-[20px]'>
                    <div className='mt-[5px] w-full'>
                        <button className={` solid-button w-full !bg-[#03A66D] !rounded-[8px] py-[10px] px-[15px] !text-[14px]`} onClick={props.confirmOrder} >Confirm</button>
                    </div>
                    <div className='mt-[5px] w-full'>
                        <button className={` solid-button w-full !bg-[#808080] !rounded-[8px] py-[10px] px-[15px] !text-[14px]`} onClick={() => {
                            props.setConfirmModelOverlay(false);
                            props.setConfirmModelPopup(0);
                        }}>Cancel</button>
                    </div>
                </div>
            </div>

        </div>
    )
}

export default TradeConfirmPopupModal;