import React, { useEffect } from 'react';

interface UniqueIds {
  inputId: string;
  thumbId: string;
  lineId: string;
  onChangeSizeInPercentage: (value: number) => void;
  rangetype?: string;
  step?: number;
  levrage?: number;
  levrageValue?: number;
}

const RangeSlider: React.FC<UniqueIds> = ({
  inputId,
  thumbId,
  lineId,
  onChangeSizeInPercentage,
  rangetype = '',
  step = 1,
  levrage = 0,
  levrageValue = 0
}) => {

  useEffect(() => {
    const sliderInput = document.getElementById(inputId) as HTMLInputElement;
    if (sliderInput) {
      sliderInput.value = inputId === "rangeInput" ? levrageValue.toString() : levrage.toString();
      showSliderValue();
      sliderInput.addEventListener('input', showSliderValue);
    }
    return () => {
      if (sliderInput) {
        sliderInput.removeEventListener('input', showSliderValue);
      }
    };
  }, [levrageValue, levrage, inputId]);

  const showSliderValue = () => {
    
    const sliderInput = document.getElementById(inputId) as HTMLInputElement;
    const sliderThumb = document.getElementById(thumbId) as HTMLDivElement;
    const sliderLine = document.getElementById(lineId) as HTMLDivElement;

    if (sliderInput && sliderThumb && sliderLine) {
      const value = Number(sliderInput.value);
      const max = Number(sliderInput.max);

      sliderThumb.innerHTML = `${value}X`;
      const bulletPosition = value / max;
      const space = sliderInput.offsetWidth - sliderThumb.offsetWidth;

      sliderThumb.style.left = `${bulletPosition * space}px`;
      sliderLine.style.width = `${(value / max) * 100}%`;

      const inputPercent = document.querySelector('.inputPercent') as HTMLInputElement;
      if (inputPercent) {
        inputPercent.value = `${Math.trunc((value / max) * 100)}X`;
      }

      
      onChangeSizeInPercentage(value);

 
    }
  };

  const handleBulletClick = (value: number) => {
    const sliderInput = document.getElementById(inputId) as HTMLInputElement;
    if (sliderInput) {
      sliderInput.value = value.toString();
      showSliderValue();
    }
  };

  return (
    <>
      <div className="w-full bg-primary h-[4px] flex items-center justify-between mt-[20px]">
        {[0, 25, 50, 75, 100].map((value) => (
          <div
            key={value}
            className="w-[10px] h-[10px] rounded-full bg-primary cursor-pointer relative z-[2]"
            onClick={() => handleBulletClick(value)}
          ></div>
        ))}
      </div>
      <div className="range-slider mt-[-12px] cursor-pointer">
        <div id={thumbId} className="range-slider_thumb"></div>
        <div className="range-slider_line">
          <div id={lineId} className="range-slider_line-fill"></div>
        </div>
        <input
          id={inputId}
          className="range-slider_input"
          type="range"
          min="0"
          max="100"
          step={step}
          defaultValue={inputId === "rangeInput" ? levrageValue : levrage}
          onChange={showSliderValue}
        />
      </div>
      <div className="flex items-center justify-between mt-[7px] relative z-[4]">
        {[0, 25, 50, 75, 100].map((value) => (
          <p key={value} className="text-[12px] dark:text-white text-black ml-[8px]">
            {value}{rangetype}
          </p>
        ))}
      </div>
    </>
  );
};

export default RangeSlider;
