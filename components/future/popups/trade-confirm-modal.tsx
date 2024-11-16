import React, { useContext, useEffect, useRef, useState } from 'react'
import Context from '@/components/contexts/context';
import clickOutSidePopupClose from '@/components/snippets/clickOutSidePopupClose';
import { currencyFormatter } from '@/components/snippets/market/buySellCard';
import { truncateNumber } from '@/libs/subdomain';

interface TradeConfirmPopupModalProps {
    /** Determines if the modal popup should be displayed */
    modelPopup?: number;
    /** Function to control the display state of the confirmation modal */
    setConfirmModelPopup?: any;
    /** Function to toggle overlay visibility */
    setConfirmModelOverlay?: any;
    /** Overlay visibility state */
    modelOverlay?: boolean;
    /** Function to trigger the order confirmation process */
    confirmOrder?: any;
    /** Data for the confirmed order */
    confirmOrderData?: any;
    /** Indicates if the final order is submitted */
    finalOrderSubmit?:boolean;
    /** Symbol representing the order asset */
    symbol?:string;
    /** Leverage amount */
    leverage?:any
}

/**
 * TradeConfirmPopupModal Component
 *
 * This component displays a popup modal to confirm a trade order with various details.
 *
 * @component
 * @param {TradeConfirmPopupModalProps} props - The props for the component.
 * @returns {JSX.Element} The rendered TradeConfirmPopupModal component.
 */
const TradeConfirmPopupModal = (props: TradeConfirmPopupModalProps) => {

    let { mode } = useContext(Context);
    const [disable, setDisable] = useState(false)


    const closePopup = () => {
        props.setConfirmModelOverlay(false);
        props.setConfirmModelPopup(0);

        setDisable(false);


    }
    const wrapperRef = useRef(null);
    clickOutSidePopupClose({ wrapperRef, closePopup });

    useEffect(()=>{

        if(props.finalOrderSubmit === false){
            setTimeout(()=>{
                setDisable(false);
            },3500)
        }
    },[props.finalOrderSubmit])

    

    return (
        <div ref={wrapperRef} className={`max-w-[calc(100%-30px)] duration-300 md:max-w-[520px] w-full p-5 md:p-[32px] z-10 fixed rounded-10 bg-white dark:bg-[#292d38] ${props.modelPopup == 1 ? 'top-[50%] opacity-1 visible' : 'top-[52%] opacity-0 invisible'}  left-[50%] translate-x-[-50%] translate-y-[-50%]`}>
            <div className="flex items-center justify-between mb-[20px]">
                {/* <p className="sec-title !text-[20px]">Market Buy {props?.confirmOrderData?.symbol} </p> */}
                <p className="sec-title !text-[20px]">Order confirmation</p>
                <svg
                    onClick={() => {
                        props.setConfirmModelOverlay(false);
                        props.setConfirmModelPopup(0);
                        setDisable(false);

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
                    <p className='dark:text-[#6a6d7d] text-black'>{props?.confirmOrderData?.type === 'limit' ? currencyFormatter(props?.confirmOrderData?.price_usdt) : currencyFormatter(props?.confirmOrderData?.market_price)}</p>
                </div>
                <div className='flex justify-between items-center mb-[10px]'>
                    <p className='dark:text-white text-black'>Qty</p>
                    <p className='dark:text-[#6a6d7d] text-black'>{truncateNumber(props?.confirmOrderData?.qty,4)} {props?.symbol}</p>
                </div>
                <div className='flex justify-between items-center mb-[10px]'>
                    <p className='dark:text-white text-black'>Order Cost</p>
                    <p className='dark:text-[#6a6d7d] text-black'>{currencyFormatter(truncateNumber(props?.confirmOrderData?.margin,6))} USDT</p>
                </div>
                <div className='flex justify-between items-center mb-[10px]'>
                    <p className='dark:text-white text-black'>Order Value</p>
                    <p className='dark:text-[#6a6d7d] text-black'>{props?.confirmOrderData?.type === 'limit' ? currencyFormatter(parseFloat(props?.confirmOrderData?.amount)) : currencyFormatter(props?.confirmOrderData?.size)} USDT</p>
                </div>
                <div className='flex justify-between items-center mb-[10px]'>
                    <p className='dark:text-white text-black'>Estimated Liq. Price</p>
                    <p className='dark:text-[#6a6d7d] text-black'>{currencyFormatter(props?.confirmOrderData?.liq_price)} USDT</p>
                </div>
                <div className='flex justify-between items-center mb-[10px]'>
                    <p className='dark:text-white text-black'>Leverage</p>
                    {/* <p className='dark:text-white text-black'>{props?.confirmOrderData?.leverage_type} {props?.confirmOrderData?.leverage}x</p> */}
                    <p className='dark:text-[#6a6d7d] text-black'>{props?.confirmOrderData?.leverage_type} {props?.leverage}x</p>
                </div>
                {/* <div className='flex justify-between items-center mb-[10px]'>
                    <p className='dark:text-white text-black'>Time in Force</p>
                    <p className='dark:text-[#6a6d7d] text-black'>Immediate-Or-Cancel</p>   
                </div> */}
                <div className='flex justify-between items-center mt-[30px] gap-[20px]'>
                    <div className='mt-[5px] w-full'>
                        <button className={` solid-button2 w-full `} onClick={() => {
                            props.setConfirmModelOverlay(false);
                            props.setConfirmModelPopup(0);
                        }}>Cancel</button>
                    </div>
                    <div className={`mt-[5px] w-full ${disable  && 'cursor-not-allowed'}`}>
                        <button
                            disabled={disable}
                            className={` solid-button w-full !py-[19px]  ${disable ? 'pointer-events-none  opacity-50' : ''}`} onClick={() => {
                                props.confirmOrder();
                                setDisable(true)

                                setTimeout(()=>{
                                    setDisable(false)
                                },3500)

                            }} >Confirm</button>
                    </div>
                </div>
            </div>

        </div>
    )
}

export default TradeConfirmPopupModal;