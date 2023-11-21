import React, { useEffect } from 'react'

const RangeSlider = () => {
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
  return (
    <>
        <div className='w-full bg-[#03A66D] h-[4px] flex items-center justify-between mt-[20px]'>
            <div className='w-[10px] h-[10px] rounded-full bg-[#03A66D]'></div>
            <div className='w-[10px] h-[10px] rounded-full bg-[#03A66D]'></div>
            <div className='w-[10px] h-[10px] rounded-full bg-[#03A66D]'></div>
            <div className='w-[10px] h-[10px] rounded-full bg-[#03A66D]'></div>
            <div className='w-[10px] h-[10px] rounded-full bg-[#03A66D]'></div>
        </div>
        <div className="range-slider mt-[-12px] cursor-pointer">
            <div id="slider_thumb" className="range-slider_thumb"></div>
            <div className="range-slider_line">
                <div id="slider_line" className="range-slider_line-fill"></div>
            </div>
            <input id="slider_input" className="range-slider_input" type="range" value="20" min="0" max="100" />
        </div>
        <div className='flex items-center justify-between mt-[7px]'>
            <p className='text-[12px] dark:text-white text-black'>0%</p>
            <p className='text-[12px] dark:text-white text-black ml-[8px]'>25%</p>
            <p className='text-[12px] dark:text-white text-black ml-[8px]'>50%</p>
            <p className='text-[12px] dark:text-white text-black ml-[8px]'>75%</p>
            <p className='text-[12px] dark:text-white text-black'>100%</p>
        </div>

    </>
  )
}

export default RangeSlider;