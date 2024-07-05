import Image from 'next/image';
import React, { useState } from 'react'
interface propsData {
    list?: string[];
    showNes?: number;
    defaultValue?: string;
    whiteColor?: boolean;
    onCoinDropDownChange?: any;
    fullWidth?: boolean;
    filterAsset?: any;
    Spot?:string;
    setCoinDefaultValue?:Function;
    setSelectVal?:Function
}
const SelectDropdown = (props: propsData) => {
    const [showDrop, setShowDrop] = useState(false);
    function changeInputVal(e: any) {
        let itemText = e.currentTarget.innerHTML;
        let parent = e.currentTarget.closest(".dropdown-parent1");
        let input = parent?.querySelector(".inputText");
        // input.innerHTML = itemText;
        if(props?.setCoinDefaultValue !==undefined){
            props.setCoinDefaultValue(itemText)
        }
        else{
            input.innerHTML = itemText;
        }
        if (props.filterAsset !== undefined) {
            props?.filterAsset(itemText,props?.Spot);
        }
        if(props.onCoinDropDownChange !==undefined){
            props.onCoinDropDownChange(itemText);
        }
        
    }
    return (
        <div className={`relative dropdown-parent1 ${props.fullWidth && 'max-w-full w-full'}`}>
            <div className={`flex items-center ${props.fullWidth && 'max-w-full w-full justify-between'}`} onClick={() => { setShowDrop(!showDrop) }}>
                <p className={`inputText top-label cursor-pointer ${props.whiteColor && 'dark:!text-[#fff] !text-[#000]'} ${props.showNes === 3 && 'dark:!text-[#fff] !text-[#000]'}`}>{props.defaultValue}</p>

                <Image src="/assets/history/uparrow.svg" className={`rotate-[180deg] cursor-pointer ${props.whiteColor && 'dark:brightness-[2] brightness-[0.8]'} ${props.showNes === 3 && 'dark:brightness-[2] brightness-[0.8]'}`} width={15} height={15} alt="uparrow" />
            </div>
            <div className={`z-[5] rounded-[4px] bg-[#fff] dark:bg-[#282c37] min-w-max ${props.fullWidth && '!max-w-full !w-full'} py-[10px] dark:shadow-none shadow-md absolute duration-300 z-[8] ${showDrop ? 'top-[100%] opacity-[1] visible' : 'top-[calc(100%+10px)] opacity-0 invisible'}`}>
                <ul>
                    {
                        props.list?.map((item, index) => {
                            return (
                                <li onClick={(e) => { changeInputVal(e); setShowDrop(false);  props.setSelectVal && props.setSelectVal(item) }} key={index} className='top-label py-[5px] px-[10px] cursor-pointer hover:dark:bg-[#373d4e] hover:bg-[#6a7c8114] hover:dark:text-[#fff] hover:text-[#000]'>{item}</li>
                            )
                        })
                    }
                </ul>
            </div>
        </div>
    )
}

export default SelectDropdown;