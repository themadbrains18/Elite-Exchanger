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
  const list = ['BTCUSDT', 'ETHUSDT', 'BCHUSDT', 'ETCUSDT', 'LTCUSDT', 'FETUSDT', 'BNBUSDT'];
  const list2 = ['Isolated']
  let { mode } = useContext(Context);
  const [show, setShow] = useState(1);
  const [long, setLong] = useState(1);
  const [selectVal, setSelectVal] = useState('');

  return (
    <div className={`max-w-[calc(100%-30px)] duration-300 md:max-w-[720px] w-full p-5 md:p-[32px] z-10 fixed rounded-10 bg-white dark:bg-[#292d38] ${props.popupMode == 2 ? 'top-[50%] opacity-1 visible' : 'top-[52%] opacity-0 invisible'}  left-[50%] translate-x-[-50%] translate-y-[-50%]`}>
      <div className="flex items-center justify-between mb-[20px]">
        {/* <p className="sec-title !text-[20px]">Margin Mode </p> */}
        <SelectDropdown list={list} defaultValue="USDT" whiteColor={true} setSelectVal={setSelectVal} />
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

      {/* modal tabs */}
      <div className='flex items-center gap-[25px]'>
        <button className={`admin-body-text relative after:dark:bg-white after:bg-black after:absolute after:bottom-[-3px]  after:left-[50%] after:w-full after:translate-x-[-50%] after:h-[2px] ${show === 1 ? 'after:block !text-black dark:!text-white' : 'after:hidden !text-[#a3a8b7]'}`} onClick={() => { setShow(1) }}>PNL</button>
        <button className={`admin-body-text relative after:dark:bg-white after:bg-black after:absolute after:bottom-[-3px]  after:left-[50%] after:w-full after:translate-x-[-50%] after:h-[2px] ${show === 2 ? 'after:block !text-black dark:!text-white' : 'after:hidden !text-[#a3a8b7]'}`} onClick={() => { setShow(2) }}>Liquidation Price</button>
      </div>
      <div className='flex mt-[25px] gap-[20px] flex-col md:flex-row'>
        <div className='max-[991px]:max-w-full max-w-[50%] w-full'>
          {
            show === 2 &&
            <SelectDropdown list={list2} defaultValue="Isolated" whiteColor={true} />
          }
          <div className='flex items-center dark:bg-[#373d4e]  bg-[#e5ecf0] rounded-[2px] relative z-[4]'>
            <button className={`w-full p-[5px] rounded-[4px] border ${long === 1 ? 'text-buy border-buy' : 'text-[#a3a8b7] border-[#f0f8ff00]'}`} onClick={() => { setLong(1) }}>Long</button>
            <button className={`w-full p-[5px] rounded-[4px] border ${long === 2 ? 'text-sell border-sell ' : 'text-[#a3a8b7] border-[#f0f8ff00]'}`} onClick={() => { setLong(2) }}>Short</button>
          </div>
          {/* <RangeSlider inputId={'slider_input4'} thumbId={'slider_thumb4'} lineId={'slider_line4'} rangetype={'X'} /> */}
          <div className='flex items-center dark:bg-[#373d4e] bg-[#e5ecf0] mt-[15px] relative z-[4] p-[10px] rounded-[5px] '>
            <p className='top-label min-w-max'>Open Price</p>
            <input type="number" onWheel={(e) => (e.target as HTMLElement).blur()} autoFocus={true} className='max-w-[214px] text-end px-[10px] w-full outline-none dark:text-white text-black dark:bg-[#373d4e] bg-[#e5ecf0]' />
            <p className='top-label min-w-max'>USDT</p>
          </div>
          <div className='flex items-center dark:bg-[#373d4e] bg-[#e5ecf0] mt-[15px] relative z-[4] p-[10px] rounded-[5px] '>
            <p className='top-label min-w-max'>Close Price</p>
            <input type="number" onWheel={(e) => (e.target as HTMLElement).blur()} autoFocus={true} className='max-w-[214px] text-end px-[10px] w-full outline-none dark:text-white text-black dark:bg-[#373d4e] bg-[#e5ecf0]' />
            <p className='top-label min-w-max'>USDT</p>
          </div>
          <div className='flex items-center dark:bg-[#373d4e] bg-[#e5ecf0] mt-[15px] relative z-[4] p-[10px] rounded-[5px] justify-between'>
            <p className='top-label min-w-max'>Amount</p>
            <input type="number" onWheel={(e) => (e.target as HTMLElement).blur()} autoFocus={true} className='max-w-[214px] text-end px-[10px] w-full outline-none dark:text-white text-black dark:bg-[#373d4e] bg-[#e5ecf0]' />
            <p className='top-label min-w-max'>{selectVal ? selectVal : 'USDT'}</p>
          </div>
          <button className="py-[10.5px] px-[10px] w-full max-w-full mt-[15px] solid-button rounded-[5px]">Calculate</button>
        </div>
        <div className='max-[991px]:max-w-full max-w-[50%] w-full  dark:bg-[#30333e] bg-[#fafafa] p-[20px] relative'>
          <div className=' mb-[10px] flex items-center gap-[5px]'>
            <p className='admin-body-text !text-[16px]'>Result</p>
            <div className='flex items-center gap-[5px] group relative'>
              <svg
                className='w-[18px] dark:fill-white cursor-help'
                width="100%"
                height="100%"
                viewBox="0 0 24 24"
                version="1.1"
                xmlns="http://www.w3.org/2000/svg"
                xmlnsXlink="http://www.w3.org/1999/xlink"
                xmlSpace="preserve"
                style={{
                  fillRule: "evenodd",
                  clipRule: "evenodd",
                  strokeLinejoin: "round",
                  strokeMiterlimit: 2
                }}
              >
                <g id="Icon">
                  <g>
                    <path d="M12,1.25c-5.933,0 -10.75,4.817 -10.75,10.75c0,5.933 4.817,10.75 10.75,10.75c5.933,0 10.75,-4.817 10.75,-10.75c0,-5.933 -4.817,-10.75 -10.75,-10.75Zm-0,8.75c-0.398,0 -0.779,0.158 -1.061,0.439c-0.281,0.282 -0.439,0.663 -0.439,1.061c0,1.888 0,4.612 0,6.5c-0,0.398 0.158,0.779 0.439,1.061c0.282,0.281 0.663,0.439 1.061,0.439c0.398,-0 0.779,-0.158 1.061,-0.439c0.281,-0.282 0.439,-0.663 0.439,-1.061c0,-1.888 0,-4.612 0,-6.5c0,-0.398 -0.158,-0.779 -0.439,-1.061c-0.282,-0.281 -0.663,-0.439 -1.061,-0.439Zm0,-5.75c0.966,0 1.75,0.784 1.75,1.75c0,0.966 -0.784,1.75 -1.75,1.75c-0.966,0 -1.75,-0.784 -1.75,-1.75c0,-0.966 0.784,-1.75 1.75,-1.75Z" />
                  </g>
                </g>
              </svg>
              <div className="absolute bottom-0 min-w-[200px] md:min-w-[280px] md:left-[-131px] left-[-91px] flex-col items-center hidden mb-5 group-hover:flex">
                <div className="relative rounded-md z-10 p-4 text-xs leading-none text-white whitespace-no-wrap bg-black shadow-lg">
                  <p className="admin-body-text !text-[12px] relative !text-white">The indicative numbers are for reference only. The realized numbers may be slightly different due to trading fees and funding fees.</p>
                </div>
                <div className="w-3 h-3 -mt-2 rotate-45 bg-black" />
              </div>
            </div>

          </div>
          {
            show == 1 &&
            <>
              <p className='admin-body-text !text-[16px] mb-[10px] !text-[#ADB1B8]'>Initial Margin</p>
              <p className='admin-body-text !text-[16px] mb-[10px] !text-[#ADB1B8]'>PNL</p>
              <p className='admin-body-text !text-[16px] !text-[#ADB1B8]'>ROE</p>
            </>
          }
          {
            show == 2 &&
            <>
              <p className='admin-body-text !text-[16px] !text-[#ADB1B8]'>Liquidation Price</p>
              <p className='top-label !text-[10px] leading-[17px] absolute bottom-[16px] left-[20px] pr-[10px] md:block hidden'> Your open positions will be taken into consideration when calculating the liquidation price. Unrealized PNL and maintenance margin of your open position will affect the calculation of liquidation price.</p>
            </>
          }

        </div>
      </div>
    </div>
  )
}

export default SwapModal;