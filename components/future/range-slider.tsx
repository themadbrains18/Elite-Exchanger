import React, { useEffect, useRef } from 'react';
interface UniqueIds {
  inputId: string;
  thumbId: string;
  lineId: string;
  onChangeSizeInPercentage: (value: number) => void;
  rangetype?: string;
  step?: number;
  levrage?: number;
  levrageValue?: number;
  min?: number;
}

const RangeSlider: React.FC<UniqueIds> = ({
  inputId,
  thumbId,
  lineId,
  onChangeSizeInPercentage,
  rangetype = '',
  step = 1,
  levrage = 0,
  levrageValue = 0,
  min = 0
}) => {
  const sliderRef = useRef<HTMLInputElement | null>(null);
  const thumbRef = useRef<HTMLDivElement | null>(null);
  const lineRef = useRef<HTMLDivElement | null>(null);
  const isDragging = useRef<boolean>(false);

  useEffect(() => {
    const sliderInput = sliderRef.current;
    if (sliderInput) {
      sliderInput.value = levrageValue ? levrageValue.toString() : levrage.toString();
      updateSlider();
    }
  }, [levrageValue, levrage]);

  const updateSlider = () => {
    const sliderInput = sliderRef.current as HTMLInputElement;
    const sliderThumb = thumbRef.current as HTMLDivElement;
    const sliderLine = lineRef.current as HTMLDivElement;

    if (sliderInput && sliderThumb && sliderLine) {
      const value = Number(sliderInput.value);
      const max = Number(sliderInput.max);
      const min = Number(sliderInput.min);

      sliderThumb.innerHTML = `${value}X`;
      const bulletPosition = (value - min) / (max - min);
      const space = sliderInput.offsetWidth - sliderThumb.offsetWidth;

      sliderThumb.style.left = `${bulletPosition * space}px`;
      sliderLine.style.width = `${(value / max) * 100}%`;

      onChangeSizeInPercentage(value);
    }
  };

  const handleSliderClick = (event: any) => {
    const sliderRect = sliderRef.current?.getBoundingClientRect();
    if (sliderRect) {
      const xPos = 'clientX' in event ? event.clientX : event.touches[0].clientX;
      const percentage = Math.max(Math.min((xPos - sliderRect.left) / sliderRect.width, 1), 0);
      const newValue = Math.round(percentage * (Number(sliderRef.current?.max) - min) + min);

      if (sliderRef.current) {
        sliderRef.current.value = newValue.toString();
        updateSlider();
      }
    }
  };

  const handleMove = (event: any) => {
    if (isDragging.current) {
      handleSliderClick(event);
    }
  };

  const handleUp = () => {
    isDragging.current = false;
    document.removeEventListener('mousemove', handleMove);
    document.removeEventListener('touchmove', handleMove);
    document.removeEventListener('mouseup', handleUp);
    document.removeEventListener('touchend', handleUp);
  };

  const handleDown = (event: React.MouseEvent | React.TouchEvent) => {
    isDragging.current = true;
    handleSliderClick(event);
    document.addEventListener('mousemove', handleMove);
    document.addEventListener('touchmove', handleMove);
    document.addEventListener('mouseup', handleUp);
    document.addEventListener('touchend', handleUp);
  };

  return (
    <>
      <div className="w-full bg-primary h-[4px] flex items-center justify-between mt-[20px]">
        {[0, 25, 50, 75, 100].map((value) => (
          <div
            key={value}
            className="w-[10px] h-[10px] rounded-full bg-primary cursor-pointer relative z-[2]"
            onClick={() => handleSliderClick(value)}
          ></div>
        ))}
      </div>
      <div
        className="range-slider mt-[-12px] cursor-pointer"
        onMouseDown={handleDown}
        onTouchStart={handleDown} // Added for mobile
      >
        <div id={thumbId} ref={thumbRef} className="range-slider_thumb"></div>
        <div className="range-slider_line">
          <div id={lineId} ref={lineRef} className="range-slider_line-fill"></div>
        </div>
        <label htmlFor={inputId}></label>
        <input
          id={inputId}
          ref={sliderRef}
          className="range-slider_input"
          type="range"
          min={min}
          max="100"
          step={step}
          defaultValue={levrageValue?.toString()}
          readOnly
        />
      </div>
      <div className="flex items-center justify-between mt-[7px] relative z-[4]">
        {[0, 25, 50, 75, 100].map((value) => (
          <p key={value} className="text-[12px] dark:text-white text-black">
            {value}{rangetype}
          </p>
        ))}
      </div>
    </>
  );
};

export default RangeSlider;
