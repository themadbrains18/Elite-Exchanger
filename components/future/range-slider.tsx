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

/**
 * RangeSlider Component
 * 
 * A customizable range slider with a draggable thumb and visual feedback on value changes. It allows users to 
 * select a value within a given range, with visual updates on the slider's progress. The component is designed 
 * to show a range (0-100) with optional leverage and step values. The slider's value is displayed as a multiplier 
 * (e.g., `10X` for leverage).
 * 
 * It accepts the following props:
 * 
 * - `inputId`: The ID of the `<input>` element for the slider (used for accessibility and label association).
 * - `thumbId`: The ID of the thumb element (used for visual positioning of the thumb).
 * - `lineId`: The ID of the line element (used to represent the filled portion of the slider).
 * - `onChangeSizeInPercentage`: A callback function to be invoked whenever the slider value changes, passing the 
 *   value in percentage.
 * - `rangetype`: An optional string that can be appended to the displayed value (e.g., 'X' for leverage).
 * - `step`: The step interval for the slider, indicating how much the value should increment per step (default is 1).
 * - `levrage`: The initial leverage value for the slider (default is 0).
 * - `levrageValue`: The initial leverage value passed as a prop (if available).
 * - `min`: The minimum value for the slider (default is 0).
 * 
 * @param {string} props.inputId - The ID for the slider's input element.
 * @param {string} props.thumbId - The ID for the slider thumb element.
 * @param {string} props.lineId - The ID for the slider line element.
 * @param {Function} props.onChangeSizeInPercentage - Callback for value changes.
 * @param {string} [props.rangetype] - Optional unit or type for the range (e.g., "X" for leverage).
 * @param {number} [props.step=1] - The increment value of the slider.
 * @param {number} [props.levrage=0] - The initial leverage value (if any).
 * @param {number} [props.levrageValue=0] - The initial value for leverage passed in props.
 * @param {number} [props.min=0] - The minimum value for the slider.
 */
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
  const sliderRef = useRef<HTMLInputElement | null>(null); // Ref for the slider input element
  const thumbRef = useRef<HTMLDivElement | null>(null);  // Ref for the slider thumb element
  const lineRef = useRef<HTMLDivElement | null>(null);   // Ref for the slider line element
  const isDragging = useRef<boolean>(false); // Ref to track if the thumb is being dragged


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

  /**
 * Handles the click (or touch) event on the slider track.
 * Calculates the clicked position as a percentage of the total slider width
 * and updates the slider value accordingly.
 *
 * @param {any} event - The mouse or touch event triggered by the user click/touch.
 * This is used to get the position of the click/touch on the slider.
 */
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

  /**
 * Handles the movement of the slider while the user is dragging the thumb.
 * It only processes the movement if the dragging state is true.
 *
 * @param {any} event - The mouse or touch event triggered during the dragging action.
 * This event contains the current position of the mouse or touch on the screen.
 */
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
