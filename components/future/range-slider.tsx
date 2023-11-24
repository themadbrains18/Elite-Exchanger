import React, { useEffect } from 'react'
interface uniqueIds {
    inputId?:string;
    thumbId?:string;
    lineId?:string;
    rangetype?:string;
}
const RangeSlider = (props:uniqueIds) => {
    useEffect(()=>{
        
        const slider_input = document.getElementById(props.inputId);

        let slider_thumb = document.getElementById(props.thumbId);
        let slider_line = document.getElementById(props.lineId) ;
  
        function showSliderValue() {
            slider_thumb.innerHTML = `${slider_input.value}X`;
            const bulletPosition = slider_input.value / slider_input.max,
                space = slider_input.offsetWidth - slider_thumb.offsetWidth;
        
            slider_thumb.style.left = (bulletPosition * space) + 'px';
            slider_line.style.width = (slider_input.value / (slider_input.max / 100)) + '%';
            let inputPercent = document?.querySelector(".inputPercent");
            if(inputPercent){
                inputPercent.value = (slider_input.value / (slider_input.max / 100)) + 'X';;
            }
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
            <div id={props.thumbId} className="range-slider_thumb"></div>
            <div className="range-slider_line">
                <div id={props.lineId} className="range-slider_line-fill"></div>
            </div>
            <input id={props.inputId} className="range-slider_input" type="range" value="20" min="0" max="100" />
        </div>
        <div className='flex items-center justify-between mt-[7px] relative z-[4]'>
            <p className='text-[12px] dark:text-white text-black'>0{props.rangetype}</p>
            <p className='text-[12px] dark:text-white text-black ml-[8px]'>25{props.rangetype}</p>
            <p className='text-[12px] dark:text-white text-black ml-[8px]'>50{props.rangetype}</p>
            <p className='text-[12px] dark:text-white text-black ml-[8px]'>75{props.rangetype}</p>
            <p className='text-[12px] dark:text-white text-black'>100{props.rangetype}</p>
        </div>

    </>
  )
}

export default RangeSlider;