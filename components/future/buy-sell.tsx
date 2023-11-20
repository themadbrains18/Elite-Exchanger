import React, { useEffect, useState } from 'react'
import IconsComponent from '../snippets/icons';
import FiliterSelectMenu from '../snippets/filter-select-menu';

const BuySell = () => {
    
    useEffect(()=>{
        
        const slider_input = document.getElementById('slider_input') as HTMLInputElement,
        slider_thumb = document.getElementById('slider_thumb') as HTMLElement,
        slider_line = document.getElementById('slider_line') as HTMLElement;
  
        function showSliderValue() {
            slider_thumb.innerHTML = slider_input.value;
            const bulletPosition = slider_input.value / slider_input.max,
                space = slider_input.offsetWidth - slider_thumb.offsetWidth;
        
            slider_thumb.style.left = (bulletPosition * space) + 'px';
            slider_line.style.width = (slider_input.value / (slider_input.max / 100)) + '%';
        }
        
        showSliderValue();
        window.addEventListener("resize", showSliderValue);
        slider_input.addEventListener('input', showSliderValue, false);
  
  
    },[])
    // main tabs
    const [show,setShow] = useState(1);

    const list = ['USDT','BTC'];

    
    // nested tabs
    const [showNes,setShowNes] = useState(1);
  return (
    <div className='p-[16px] dark:bg-[#1f2127] bg-[#fff] max-w-[300px] w-full border-l border-b dark:border-[#25262a] border-[#e5e7eb]'>
        <div className='flex items-center justify-between px-[12px] py-[7px] dark:bg-[#373d4e] bg-[#e5ecf0] rounded-[4px] cursor-pointer'>
            <div className='flex items-center gap-10'>
                <p className='top-label dark:!text-white !text-[#000]'>Isolated</p>
                <p className='bg-[#13c2c21f] px-[5px] text-[#13c2c2] text-[12px]'>5X</p>
            </div>
            <IconsComponent type='rightArrowWithoutBg' />
        </div>
        {/* main tabs */}
        <div className='flex items-center dark:bg-[#373d4e] bg-[#e5ecf0] rounded-[2px] mt-10'>
            <button className={`w-full p-[5px] rounded-[4px] border ${show === 1 ? 'text-buy border-buy':'text-[#a3a8b7] border-[#f0f8ff00]'}`} onClick={()=>{setShow(1)}}>Buy</button>
            <button className={`w-full p-[5px] rounded-[4px] border ${show === 2 ? 'text-sell border-sell ':'text-[#a3a8b7] border-[#f0f8ff00]'}`} onClick={()=>{setShow(2)}}>Sell</button>
        </div>
        {/* nested tabs */}
        <div className='flex items-center justify-between  mt-10'>
            <div className='flex items-center gap-[10px]'>
                <button className={`admin-body-text ${showNes === 1 ? '!text-black dark:!text-white':'!text-[#a3a8b7]'}`} onClick={()=>{setShowNes(1)}}>Limit</button>
                <button className={`admin-body-text ${showNes === 2 ? '!text-black dark:!text-white':'!text-[#a3a8b7]'}`} onClick={()=>{setShowNes(2)}}>Market</button>
                <button className={`admin-body-text ${showNes === 3 ? '!text-black dark:!text-white':'!text-[#a3a8b7]'}`} onClick={()=>{setShowNes(3)}}>Trigger</button>
            </div>
            <IconsComponent type='swap-calender' />
        </div>

        {/* available */}
        <div className='flex items-center gap-[8px] mt-10'>
            <p className='admin-body-text !text-[12px] !text-[#a3a8b7]'>Available:</p>
            <p className='admin-body-text !text-[12px] !text-white'> USDT</p>
            <IconsComponent type='swap-calender-with-circle' />
        </div>

        {/* price input */}
        <div className='mt-10 rounded-5 py-[6px] px-[10px] flex border items-center justify-between gap-[15px] dark:border-[#25262a] border-[#e5e7eb] relative dark:bg-[#373d4e] bg-[#e5ecf0]'>
            <div>
                <p className='top-label'>Price </p>
                <input type="number" placeholder="$0" step="any" value="37268.5" name="token_amount" className="bg-[transparent] max-w-full w-full outline-none md-text px-[5px] md-text "></input>
            </div>
            <div>
                <p className='admin-body-text !text-[12px] dark:!text-white'> USDT</p>
            </div>
        </div>
        
        {/* Size input */}
        <div className='mt-10 rounded-5 py-[6px] px-[10px] flex border items-center justify-between gap-[15px] dark:border-[#25262a] border-[#e5e7eb] relative dark:bg-[#373d4e] bg-[#e5ecf0]'>
            <div>
                <p className='top-label'>Size  </p>
                <input type="number" placeholder="Min Qty is 37.3USDT" step="any" name="token_amount" className="bg-[transparent] max-w-full w-full outline-none md-text px-[5px] md-text " />
            </div>
            <div>
                <p className='admin-body-text !text-[12px] dark:!text-white'> USDT</p>
            </div>
        </div>

        {/* range slider */}
        <div className="range-slider">
            <div id="slider_thumb" className="range-slider_thumb"></div>
            <div className="range-slider_line">
                <div id="slider_line" className="range-slider_line-fill"></div>
            </div>
            <input id="slider_input" className="range-slider_input" type="range" value="20" min="0" max="100" />
        </div>

    </div>
  )
}

export default BuySell;