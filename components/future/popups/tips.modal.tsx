import Context from '@/components/contexts/context';
import React, { useContext } from 'react'
interface showPopup{
    marginMode?:number;
    setMarginMode?:any;
    setOverlay?:any;
    overlay?:boolean;
}

const TipsModal = (props:showPopup) => {
    let { mode } = useContext(Context);
    function checkTPSL(){

    }
  return (
    <>
        <div className={`max-w-[calc(100%-30px)] duration-300 md:max-w-[720px] w-full p-5 md:p-[32px] z-10 fixed rounded-10 bg-white dark:bg-[#292d38] ${props.marginMode == 3 ? 'top-[50%] opacity-1 visible':'top-[52%] opacity-0 invisible'}  left-[50%] translate-x-[-50%] translate-y-[-50%]`}>
            <div className="flex items-center justify-between mb-[20px]">
                <p className="sec-title !text-[20px]">Tips</p>
                <svg
                    onClick={()=>{props.setOverlay(false); props.setMarginMode(0)}}
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
            <p className='top-label !text-[16px] dark:!text-[16px] dark:!text-white'>Your Stop limit/Trigger Order may not be triggered due to sharp market fluctuations, price or position limits, non-tradable contracts, or system errors. A Stop limit/Trigger order becomes a Market/Limit Order after it is triggered. While pending execution, unfilled Market/Limit Order will be shown in the list of Open Orders.</p>
            <div className={`flex gap-5 items-center mt-[15px] w-full cursor-pointer bg-[transparent]`} onClick={()=>{ props.setOverlay(true); props.setMarginMode(3)}}>
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
                    <p className="ml-2 md-text !text-[14px]">TP/SL</p>
                </label>
            </div>
            <div className='flex items-center gap-[15px] mt-[15px]'>
                <button className='border dark:text-white text-[#1A1B1F] dark:border-[#616161] border-[#e5e7eb] text-[14px] rounded-[4px] py-[15px] px-[10px] w-full max-w-full' onClick={()=>{props.setOverlay(false); props.setMarginMode(0)}}>Cancel</button>
                <button className='border bg-[#13c2c2] text-white dark:border-[#616161] border-[#e5e7eb] text-[14px] rounded-[4px] py-[15px] px-[10px] w-full max-w-full'>Confirm</button>
            </div>
        </div>
    </>
  )
}

export default TipsModal;