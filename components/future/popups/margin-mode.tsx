import Context from '@/components/contexts/context';
import React, { useContext, useState } from 'react'
import RangeSlider from '../range-slider';
interface fullWidth {
    inputId?: string;
    thumbId?: string;
    lineId?: string;
    radioId?: string;
    popupMode?: number;
    setPopupMode?: any;
    setOverlay?: any;
    overlay?: boolean;
    setMarginModeAndLeverage?: any;
}
const MarginMode = (props: fullWidth) => {
    const { mode } = useContext(Context);
    const [cross, setCross] = useState(2);
    const [marginType, setMarginType] = useState('Isolated');
    const [leverageValue, setLeverageValue] = useState(10);

    function increment() {
        let inputPercent: any = document?.querySelector(".inputPercent");
        let InputValue = inputPercent?.value;
        if (inputPercent) {
            Number(InputValue)
            console.log(typeof (InputValue))
            console.log(InputValue++);

        }
    }

    const onChangeSizeInPercentage = (value: any) => {
        setLeverageValue(value);
    }

    return (
        <div className={`max-w-[calc(100%-30px)] duration-300 md:max-w-[720px] w-full p-5 md:p-[32px] z-10 fixed rounded-10 bg-white dark:bg-[#292d38] ${props.popupMode == 1 ? 'top-[50%] opacity-1 visible' : 'top-[52%] opacity-0 invisible'}  left-[50%] translate-x-[-50%] translate-y-[-50%]`}>
            <div className="flex items-center justify-between mb-[20px]">
                <p className="sec-title !text-[20px]">Margin Mode </p>
                <svg
                    onClick={() => { props.setOverlay(false); props.setPopupMode(0) }}
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
            <div className='flex items-center mt-10 gap-[15px]'>
                <button className={`w-full relative py-[12px] px-[5px] rounded-[4px] dark:bg-[#373d4e] bg-[#e5ecf0] rounded-[2px] border ${cross === 1 ? 'text-[#13c2c2] border-[#13c2c2]' : 'text-[#a3a8b7] border-[#f0f8ff00]'}`} onClick={() => { setCross(1); setMarginType('Cross') }}>
                    <span> Cross</span>
                    {
                        cross === 1 &&
                        <svg
                            width={18}
                            height={18}
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                            className="absolute top-0 right-0"
                        >
                            <path d="M0 0h14a4 4 0 0 1 4 4v14L9.5 9.5 0 0Z" fill="#13C2C2" />
                            <path fill="#fff" d="m9 5.95.707-.707 2.829 2.828-.707.707z" />
                            <path fill="#fff" d="m11.121 8.071 4.243-4.243.707.708-4.243 4.242z" />
                        </svg>
                    }


                </button>
                <button className={`w-full relative py-[12px] px-[5px] rounded-[4px] dark:bg-[#373d4e] bg-[#e5ecf0] rounded-[2px] border ${cross === 2 ? 'text-[#13c2c2] border-[#13c2c2]' : 'text-[#a3a8b7] border-[#f0f8ff00]'}`} onClick={() => { setCross(2); setMarginType('Isolated') }}>
                    <span> Isolated </span>
                    {
                        cross === 2 &&
                        <svg
                            width={18}
                            height={18}
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                            className="absolute top-0 right-0"
                        >
                            <path d="M0 0h14a4 4 0 0 1 4 4v14L9.5 9.5 0 0Z" fill="#13C2C2" />
                            <path fill="#fff" d="m9 5.95.707-.707 2.829 2.828-.707.707z" />
                            <path fill="#fff" d="m11.121 8.071 4.243-4.243.707.708-4.243 4.242z" />
                        </svg>
                    }
                </button>
            </div>
            <p className='top-label mt-[10px] mb-[20px]'>Switching the margin mode will only apply it to the selected contract.</p>
            <p className="sec-title !text-[20px] mb-[10px]">Adjust Leverage</p>
            <div className='flex bg-[#e5ecf0] dark:bg-[#3c4355] items-center justify-between relative z-[4]'>
                <p className='text-[25px] dark:text-white text-black cursor-pointer w-[50px] h-[40px] text-center'> - </p>
                <div>
                    <input type="text" className='bg-[#e5ecf0] dark:bg-[#3c4355] outline-none text-center inputPercent dark:text-[#fff] text-[#000]' readOnly value={leverageValue.toString()+'x'} />
                </div>
                {/* <p className='text-[18px] font-[600] text-center dark:text-[#fff] text-[#000] inputPercent'>20</p> */}
                <p className='text-[25px] dark:text-white text-black cursor-pointer w-[50px] h-[40px] text-center' onClick={() => { increment() }}> + </p>
            </div>

            <RangeSlider inputId={props.inputId} thumbId={props.thumbId} lineId={props.lineId} onChangeSizeInPercentage={onChangeSizeInPercentage} rangetype={'X'} step={1}/>

            <p className='top-label mt-[10px]'>Maximum position at current leverage: 3500000 USDT</p>
            <p className='top-label mb-[25px]'>Selecting higher leverage such as [10x] increases your liquidation risk. Always manage your risk levels.</p>

            <div className='flex items-center gap-[15px] mt-[15px]'>
                <button className='border dark:text-white text-[#1A1B1F] dark:border-[#616161] border-[#e5e7eb] text-[14px] rounded-[4px] py-[15px] px-[10px] w-full max-w-full' onClick={() => { props.setOverlay(false); props.setPopupMode(0) }}>Cancel</button>
                <button className='border bg-[#13c2c2] text-white dark:border-[#616161] border-[#e5e7eb] text-[14px] rounded-[4px] py-[15px] px-[10px] w-full max-w-full' onClick={() => {
                    props.setMarginModeAndLeverage(marginType, leverageValue);
                }}>Confirm</button>
            </div>

        </div>
    )
}

export default MarginMode;