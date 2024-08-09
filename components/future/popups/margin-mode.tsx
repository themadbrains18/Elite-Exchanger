import React, { useContext, useRef, useState, useEffect } from 'react';
import Context from '@/components/contexts/context';
import RangeSlider from '../range-slider';
import clickOutSidePopupClose from '@/components/snippets/clickOutSidePopupClose';
import Image from 'next/image';

interface FullWidth {
    inputId?: string;
    thumbId?: string;
    lineId?: string;
    radioId?: string;
    popupMode?: number;
    setPopupMode?: any;
    setOverlay?: any;
    overlay?: boolean;
    setMarginModeAndLeverage?: any;
    leverage?: any;
    currentToken?: any;
    opnlong?:string;
}

const MarginMode: React.FC<FullWidth> = (props) => {
    const { mode } = useContext(Context);
    const [cross, setCross] = useState(2);
    const [marginType, setMarginType] = useState('Isolated');
    const [leverageValue, setLeverageValue] = useState(props?.leverage ?? 10);

    

    useEffect(() => {
        setLeverageValue(props?.leverage ?? 10);
    }, [props?.leverage]);

    function increment() {
        setLeverageValue((prev: number) => prev + 1);
    }

    function decrement() {
        setLeverageValue((prev: number) => Math.max(prev - 1, 1)); // Assuming leverage cannot be less than 1
    }

    const onChangeSizeInPercentage = (value: any) => {
        setLeverageValue(parseInt(value));
    }

    const closePopup = () => {
        props.setOverlay(false);
        props.setPopupMode(0);
    }

    const wrapperRef = useRef(null);
    clickOutSidePopupClose({ wrapperRef, closePopup });

    return (
        <div ref={wrapperRef} className={`max-w-[calc(100%-30px)] duration-300 md:max-w-[500px] w-full p-5 md:p-[32px] z-10 fixed rounded-10 bg-white dark:bg-[#292d38] ${props.popupMode == 1 ? 'top-[50%] opacity-1 visible' : 'top-[52%] opacity-0 invisible'} left-[50%] translate-x-[-50%] translate-y-[-50%]`}>
            <div className="flex items-center justify-between mb-[20px]">
                <p className="sec-title !text-[20px]">Select Leverage </p>
                <svg
                    onClick={closePopup}
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
            <p className="sec-title !text-[15px] mb-[10px]">{props?.currentToken?.coin_symbol}-{props?.currentToken?.usdt_symbol} <span className={`${props?.opnlong == "Short" ? 'text-sell':'text-buy'}`}>({props?.opnlong})</span></p>
            <div className='flex bg-[#e5ecf0] dark:bg-[#3c4355] items-center justify-between relative z-[4] rounded-8'>
                <p className='text-[25px] dark:text-white text-black cursor-pointer w-[50px] h-[40px] text-center' onClick={decrement}> - </p>
                <div>
                    <input type="text" className='bg-[#e5ecf0] dark:bg-[#3c4355] outline-none text-center lowercase inputPercent dark:text-[#fff] text-[#000] h-[40px]' readOnly value={Math.trunc(parseInt( leverageValue )).toString() + 'x'} />
                </div>
                <p className='text-[25px] dark:text-white text-black cursor-pointer w-[50px] h-[40px] text-center' onClick={increment}> + </p>
            </div>
            <RangeSlider inputId="rangeInput1" thumbId='rangeThumb1' lineId='rangeLine1' onChangeSizeInPercentage={onChangeSizeInPercentage} rangetype={'X'} step={1} levrage={leverageValue} min={1}/>
            <div className={`flex gap-[5px] ${leverageValue > 10 ? ' bg-[#ff8d0021]' : 'bg-[#e5ecf0] dark:bg-[#3c4355]'}  mb-[25px] p-[8px] mt-[10px] rounded-8 items-center`}>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className={`fill-primary ${leverageValue > 10 ? 'dark:fill-white' : 'fill-primary dark:fill-white'} text-contentWarning shrink-0`} width="16" height="16">
                    <path d="M12 2.25A9.75 9.75 0 1021.75 12 9.76 9.76 0 0012 2.25zm-.75 5.25a.75.75 0 111.5 0v5.25a.75.75 0 11-1.5 0V7.5zm.75 9.75A1.125 1.125 0 1112 15a1.125 1.125 0 010 2.25z"></path>
                </svg>
                <p className={`top-label dark:text-[#fff] text-[#000] whitespace-nowrap ${leverageValue > 10 ? '' : ''}`}>{leverageValue > 10 ? 'Selecting higher leverage increases your risk of liquidation.' : 'It is recommended to use a lower leverage to reduce risk of liquidation.'}</p>
            </div>
            <div className='flex items-center gap-[15px] mt-[15px]'>
                <button className='solid-button w-full max-w-full' onClick={() => {
                    props.setMarginModeAndLeverage(marginType, leverageValue);
                    closePopup();
                }}>Confirm</button>
            </div>
        </div>
    )
}

export default MarginMode;
