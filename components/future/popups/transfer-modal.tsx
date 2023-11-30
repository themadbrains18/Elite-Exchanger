import Context from '@/components/contexts/context';
import IconsComponent from '@/components/snippets/icons';
import React, { useContext, useState } from 'react'
import SelectDropdown from '../snippet/select-dropdown';

interface showPopup {
    popupMode?: number;
    setPopupMode?: any;
    setOverlay?: any;
    overlay?: boolean;
}
const TransferModal = (props:showPopup) => {

    let { mode } = useContext(Context);
    const list = ['USDT','BTC','ETH'];

    const [Spot,setSpot] = useState('Spot');
    const [future,setFuture] = useState('Futures');

    function setValues(){
        if(Spot == 'Spot'){
            setFuture('Spot');
            setSpot('Futures');
        }else{
            setFuture('Futures');
            setSpot('Spot');
        }
        
    }

  return (
    <div className={`max-w-[calc(100%-30px)] duration-300 md:max-w-[550px] w-full p-5 md:p-[32px] z-10 fixed rounded-10 bg-white dark:bg-[#292d38] ${props.popupMode == 3 ? 'top-[50%] opacity-1 visible' : 'top-[52%] opacity-0 invisible'} left-[50%] translate-x-[-50%] translate-y-[-50%]`}>
        <div className="flex items-center justify-between mb-[20px]">
            <p className="sec-title !text-[20px]">Transfer</p> 
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
        <div className='flex border-b dark:border-[#373d4e] border-[#e5e7eb] w-full'>
            <div className='w-full max-w-[calc(100%-100px)]'>
                <div className='flex items-center gap-[20px] border dark:border-[#373d4e] border-[#e5e7eb] w-full py-[12px]'>
                    <p className="top-label min-w-[80px] text-center">From</p>
                    <p className="top-label dark:!text-white !text-black">{Spot}</p>
                </div>
                <div className='flex items-center gap-[20px] border dark:border-[#373d4e] border-[#e5e7eb] w-full py-[12px]'>
                    <p className="top-label min-w-[80px] text-center">To</p>
                    <p className="top-label dark:!text-white !text-black">{future}</p>
                </div>
            </div>
            <div onClick={()=>{setValues()}} className='dark:bg-[#373d4e] bg-[#e5ecf0] w-full flex h-[96px] w-full max-w-[100px] border dark:border-[#373d4e] border-[#e5e7eb] cursor-pointer '>
                <div className='rotate-[90deg]'>
                    <IconsComponent type='transferIcon' />
                </div>
            </div>
        </div>
        <div className='flex items-center justify-between px-[12px] py-[12px] dark:bg-[#373d4e] bg-[#e5ecf0] rounded-[4px] cursor-pointer mt-[25px] relative'>
            <SelectDropdown list={list} defaultValue="USDT" fullWidth={true} whiteColor={true} />   
        </div>
        <div className='flex items-center bg-[#e5ecf0] dark:bg-[#373d4e] p-[11px] mt-[25px] rounded-[5px] dark:text-white text-black justify-between'>
           <input type='number' className='outline-none  bg-[#e5ecf0] dark:bg-[#373d4e]' placeholder='Minumun transfer limit 0.01 USDT' />
           <p className='top-label dark:!text-primary cursor-pointer'>All</p>
        </div>
        <p className='top-label !text-[16px] mt-[15px]'>Available 0 USDT</p>
        <button className='border bg-[#13c2c2] text-white dark:border-[#616161] border-[#e5e7eb] text-[14px] rounded-[4px] py-[10.5px] px-[10px] w-full max-w-full mt-[15px]'>Transfer</button>
    </div>
  )
}

export default TransferModal;