import Context from '@/components/contexts/context';
import React, { useContext } from 'react'
interface showPopup {
    popupMode?: number;
    setPopupMode?: any;
    setOverlay?: any;
    overlay?: boolean;
  }
const TradingFeeMadal = (props:showPopup) => {
    let { mode } = useContext(Context);

  return (
    <div className={`max-w-[calc(100%-30px)] duration-300 md:max-w-[400px] w-full p-5 md:p-[32px] z-10 fixed rounded-10 bg-white dark:bg-[#292d38] ${props.popupMode == 4 ? 'top-[50%] opacity-1 visible' : 'top-[52%] opacity-0 invisible'} left-[50%] translate-x-[-50%] translate-y-[-50%]`}>
        <div className='flex items-center justify-between mb-[20px]'>
            <p className='sec-title !text-[20px]'>Trading Fee - Futures</p>
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
        <div className='flex gap-[40px]'>
            <div>
                <p className='top-label'>Maker</p>
                <p className='top-label !text-[18px]  dark:!text-white'>0.02%</p>
            </div>
            <div>
                <p className='top-label'>Taker</p>
                <p className='top-label !text-[18px] dark:!text-white'>0.06%</p>
            </div>
        </div>
    </div>
  )
}

export default TradingFeeMadal;