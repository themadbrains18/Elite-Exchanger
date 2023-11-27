import React, { useContext, useState } from 'react'
import SelectDropdown from '../snippet/select-dropdown';
import Context from '@/components/contexts/context';
import RangeSlider from '../range-slider';
interface showPopup {
  popupMode?: number;
  setPopupMode?: any;
  setOverlay?: any;
  overlay?: boolean;
}

const SwapModal = (props: showPopup) => {
  const list = ['BTCUSDT_SWAP', 'ETHUSDT SWAP', 'BCHUSDT_SWAP', 'ETCUSDT_SWAP', 'LTCUSDT SWAP', 'FETUSDT SWAP', 'BNBUSDT_SWAP'];
  let { mode } = useContext(Context);
  const [show, setShow] = useState(1);
  const [long, setLong] = useState(1);

  return (
    <div className={`max-w-[calc(100%-30px)] duration-300 md:max-w-[720px] w-full p-5 md:p-[32px] z-10 fixed rounded-10 bg-white dark:bg-[#292d38] ${props.popupMode == 2 ? 'top-[50%] opacity-1 visible' : 'top-[52%] opacity-0 invisible'}  left-[50%] translate-x-[-50%] translate-y-[-50%]`}>
      <div className="flex items-center justify-between mb-[20px]">
        {/* <p className="sec-title !text-[20px]">Margin Mode </p> */}
        <SelectDropdown list={list} defaultValue="USDT" whiteColor={true} />
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
      {/* modal tabs */}
      <div className='flex items-center gap-[25px]'>
        <button className={`admin-body-text relative after:dark:bg-white after:bg-black after:absolute after:bottom-[-3px]  after:left-[50%] after:w-full after:translate-x-[-50%] after:h-[2px] ${show === 1 ? 'after:block !text-black dark:!text-white' : 'after:hidden !text-[#a3a8b7]'}`} onClick={() => { setShow(1) }}>PNL</button>
        <button className={`admin-body-text relative after:dark:bg-white after:bg-black after:absolute after:bottom-[-3px]  after:left-[50%] after:w-full after:translate-x-[-50%] after:h-[2px] ${show === 2 ? 'after:block !text-black dark:!text-white' : 'after:hidden !text-[#a3a8b7]'}`} onClick={() => { setShow(2) }}>Liquidation Price</button>
      </div>
      <div className='flex mt-[25px] gap-[20px]'>
        <div className='max-[991px]:max-w-full max-w-[50%] w-full'>
          <div className='flex items-center dark:bg-[#373d4e] bg-[#e5ecf0] rounded-[2px] relative z-[4]'>
            <button className={`w-full p-[5px] rounded-[4px] border ${long === 1 ? 'text-buy border-buy' : 'text-[#a3a8b7] border-[#f0f8ff00]'}`} onClick={() => { setLong(1) }}>Long</button>
            <button className={`w-full p-[5px] rounded-[4px] border ${long === 2 ? 'text-sell border-sell ' : 'text-[#a3a8b7] border-[#f0f8ff00]'}`} onClick={() => { setLong(2) }}>Short</button>
          </div>
          <RangeSlider inputId={'slider_input4'} thumbId={'slider_thumb4'} lineId={'slider_line4'} rangetype={'X'} />
          <div className='flex items-center dark:bg-[#373d4e] bg-[#e5ecf0] mt-[15px] relative z-[4] p-[10px] rounded-[5px] '>
            <p className='top-label min-w-max'>Open Price</p>
            <input type="number" autoFocus={true} className='max-w-[214px] text-end px-[10px] w-full outline-none dark:text-white text-black dark:bg-[#373d4e] bg-[#e5ecf0]' />
            <p className='top-label min-w-max'>USDT</p>
          </div>
          <div className='flex items-center dark:bg-[#373d4e] bg-[#e5ecf0] mt-[15px] relative z-[4] p-[10px] rounded-[5px] '>
            <p className='top-label min-w-max'>Close Price</p>
            <input type="number" autoFocus={true} className='max-w-[214px] text-end px-[10px] w-full outline-none dark:text-white text-black dark:bg-[#373d4e] bg-[#e5ecf0]' />
            <p className='top-label min-w-max'>USDT</p>
          </div>
          <div className='flex items-center dark:bg-[#373d4e] bg-[#e5ecf0] mt-[15px] relative z-[4] p-[10px] rounded-[5px] justify-between'>
            <p className='top-label min-w-max'>Amount</p>
            <input type="number" autoFocus={true} className='max-w-[214px] text-end px-[10px] w-full outline-none dark:text-white text-black dark:bg-[#373d4e] bg-[#e5ecf0]' />
            <p className='top-label min-w-max'>XRP</p>
          </div>
          <button className="border bg-[#13c2c2] text-white dark:border-[#616161] border-[#e5e7eb] text-[14px] rounded-[4px] py-[10.5px] px-[10px] w-full max-w-full mt-[15px]">Calculate</button>
        </div>
        <div className='max-[991px]:max-w-full max-w-[50%] w-full dark:bg-[#30333e] bg-[#fafafa] p-[20px]'>
          <p className='admin-body-text !text-[16px]'>Result</p>
          <p className='admin-body-text !text-[16px]'>PNL</p>
          <p className='admin-body-text !text-[16px]'>ROE</p>
        </div>
      </div>
    </div>
  )
}

export default SwapModal;