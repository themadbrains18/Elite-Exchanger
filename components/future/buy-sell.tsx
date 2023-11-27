import React, { useEffect, useState } from 'react'
import IconsComponent from '../snippets/icons';
import FiliterSelectMenu from '../snippets/filter-select-menu';
import RangeSlider from './range-slider';
import Image from 'next/image';
import SelectDropdown from './snippet/select-dropdown';
interface fullWidth{
    fullWidth?:boolean;
    heightAuto?:boolean;
    inputId?:string;
    thumbId?:string;
    lineId?:string;
    radioId?:string;
    marginMode?:number;
    setMarginMode?:any;
    setOverlay?:any;
    overlay?:boolean;
}
const BuySell = (props:fullWidth) => {


    // main tabs
    const [show, setShow] = useState(1);

    const list = ['USDT', 'BTC'];
    const timeInForceList = ['GTC', 'FOK', 'IOC'];
    // const triggerPriceList = ['Mark', 'Last'];
    // const PriceList = ['Limit', 'Market'];
    // const TriggerList = ['Trigger', 'Maker Only', 'Trailing Stop'];


    // nested tabs
    const [showNes, setShowNes] = useState(1);
    return (
        <div className={`p-[16px] dark:bg-[#1f2127] bg-[#fff] ${props.fullWidth ? 'max-w-full h-auto':'max-w-[300px] h-[677px]'} w-full border-l border-b dark:border-[#25262a] border-[#e5e7eb]`}>
            <div className='flex items-center justify-between px-[12px] py-[7px] dark:bg-[#373d4e] bg-[#e5ecf0] rounded-[4px] cursor-pointer' onClick={()=>{ props.setOverlay(true); props.setMarginMode(1)}}>
                <div className='flex items-center gap-10'>
                    <p className='top-label dark:!text-white !text-[#000]'>Isolated</p>
                    <p className='bg-[#13c2c21f] px-[5px] text-[#13c2c2] text-[12px]'>5X</p>
                </div>
                <IconsComponent type='rightArrowWithoutBg' />
            </div>
            {/* main tabs */}
            <div className='flex items-center dark:bg-[#373d4e] bg-[#e5ecf0] rounded-[2px] mt-10'>
                <button className={`w-full p-[5px] rounded-[4px] border ${show === 1 ? 'text-buy border-buy' : 'text-[#a3a8b7] border-[#f0f8ff00]'}`} onClick={() => { setShow(1) }}>Buy</button>
                <button className={`w-full p-[5px] rounded-[4px] border ${show === 2 ? 'text-sell border-sell ' : 'text-[#a3a8b7] border-[#f0f8ff00]'}`} onClick={() => { setShow(2) }}>Sell</button>
            </div>
            {/* nested tabs */}
            <div className='flex items-center justify-between  mt-10'>
                <div className='flex items-center gap-[10px]'>
                    <button className={`admin-body-text ${showNes === 1 ? '!text-black dark:!text-white' : '!text-[#a3a8b7]'}`} onClick={() => { setShowNes(1) }}>Limit</button>
                    <button className={`admin-body-text ${showNes === 2 ? '!text-black dark:!text-white' : '!text-[#a3a8b7]'}`} onClick={() => { setShowNes(2) }}>Market</button>
                    <button className={`admin-body-text ${showNes === 3 ? '!text-black dark:!text-white' : '!text-[#a3a8b7]'}`} onClick={() => { setShowNes(3) }}>Stop Limit</button>
                    {/* <div className='relative' onClick={() => { setShowNes(3) }}>
                        <SelectDropdown list={TriggerList} showNes={showNes} defaultValue="Trigger" />
                    </div> */}
                </div>
                <div className='cursor-pointer' onClick={()=>{ props.setOverlay(true); props.setMarginMode(2)}}>
                    <IconsComponent type='swap-calender' />
                </div>
            </div>

            {/* available */}
            <div className='flex items-center gap-[8px] mt-10'>
                <p className='admin-body-text !text-[12px] !text-[#a3a8b7]'>Available:</p>
                <p className='admin-body-text !text-[12px] !text-white'> USDT</p>
                <IconsComponent type='swap-calender-with-circle' />
            </div>

            {/* trigger price input */}
            {/* <div className='mt-10 rounded-5 py-[6px] px-[10px] flex border items-center justify-between gap-[15px] dark:border-[#25262a] border-[#e5e7eb] relative dark:bg-[#373d4e] bg-[#e5ecf0]'>
                <div>
                    <p className='top-label'>Trigger Price</p>
                    <input type="number" placeholder="Enter the Trigger Price" step="any" value="37268.5" name="token_amount" className="bg-[transparent] max-w-full w-full outline-none md-text px-[5px] md-text "></input>
                </div>
                <div>
                    <SelectDropdown list={triggerPriceList} whiteColor={true} showNes={showNes} defaultValue="Mark" />
                    <p className='admin-body-text !text-[12px] dark:!text-white'> USDT</p>
                </div>
            </div> */}

            {/* Activation Price input */}
            {/* <div className='mt-10 rounded-5 py-[6px] px-[10px] flex border items-center justify-between gap-[15px] dark:border-[#25262a] border-[#e5e7eb] relative dark:bg-[#373d4e] bg-[#e5ecf0]'>
                <div>
                    <p className='top-label'>Activation Price </p>
                    <input type="number" placeholder="Enter the Trigger Price" step="any" value="37268.5" name="token_amount" className="bg-[transparent] max-w-full w-full outline-none md-text px-[5px] md-text "></input>
                </div>
                <div>
                    <SelectDropdown list={triggerPriceList} whiteColor={true} showNes={showNes} defaultValue="Mark" />
                    <p className='admin-body-text !text-[12px] dark:!text-white'> USDT</p>
                </div>
            </div> */}

            {/* trailing Stop input */}
            {/* <div className='mt-10 flex gap-[2px]'>
                <div className='rounded-5 py-[6px] px-[10px] flex border items-center justify-between gap-[15px] dark:border-[#25262a] border-[#e5e7eb] relative dark:bg-[#373d4e] bg-[#e5ecf0]'>
                    <div>
                        <p className='top-label'>Callback Rate</p>
                        <input type="number" placeholder="" step="any"  name="token_amount" autoFocus={true} className="bg-[transparent] max-w-full w-full outline-none md-text px-[5px] md-text "></input>
                    </div>
                    <div>
                        <p className='admin-body-text !text-[12px] dark:!text-white'>%</p>
                    </div>
                </div>
                <div className='max-w-[50px] w-full justify-center cursor-pointer rounded-5 py-[6px] px-[10px] flex border items-center dark:border-[#25262a] border-[#e5e7eb] relative dark:bg-[#373d4e] bg-[#e5ecf0]'>
                    <p className='top-label dark:!text-white !text-black'>1%</p>
                </div>
                <div className='max-w-[50px] w-full justify-center cursor-pointer rounded-5 py-[6px] px-[10px] flex border items-center dark:border-[#25262a] border-[#e5e7eb] relative dark:bg-[#373d4e] bg-[#e5ecf0]'>
                    <p className='top-label dark:!text-white !text-black'>2%</p>
                </div>
            </div> */}

            {/* price input */}
            {
                showNes === 1 &&
                <>
                    <div className='mt-10 rounded-5 py-[6px] px-[10px] flex border items-center justify-between gap-[15px] dark:border-[#25262a] border-[#e5e7eb] relative dark:bg-[#373d4e] bg-[#e5ecf0]'>
                        <div>
                            <p className='top-label'>Price </p>
                            <input type="number" placeholder="$0" step="any" value="37268.5" name="token_amount" className="bg-[transparent] max-w-full w-full outline-none md-text px-[5px] md-text "></input>
                        </div>
                        <div>
                            <p className='admin-body-text !text-[12px] dark:!text-white'> USDT</p>
                        </div>
                    </div>
                </>
            }
            {/* Size input */}
            <div className='mt-10 z-[5] rounded-5 py-[6px] px-[10px] flex border items-center justify-between gap-[15px] dark:border-[#25262a] border-[#e5e7eb] relative dark:bg-[#373d4e] bg-[#e5ecf0]'>
                <div>
                    <p className='top-label'>Size  </p>
                    <input type="number" placeholder="Min Qty is 37.3USDT" step="any" name="token_amount" className="bg-[transparent] max-w-full w-full outline-none md-text px-[5px] md-text " />
                </div>
                <div>
                    {/* <p className='admin-body-text !text-[12px] dark:!text-white'> USDT</p> */}
                    <SelectDropdown list={list} showNes={showNes} defaultValue="USDT" whiteColor={true} />
                </div>
            </div>

            {/* range slider */}
            <RangeSlider inputId={props.inputId} thumbId={props.thumbId} lineId={props.lineId} rangetype={'%'} />

            {/* TP/SL */}
            <div className='flex items-center justify-between mt-[20px]'>

                <div className={`flex gap-5 items-center  w-full cursor-pointer bg-[transparent]`} onClick={()=>{ props.setOverlay(true); props.setMarginMode(3)}}>
                    <input id={`custom-radio${props.radioId}`} type="checkbox" value="" name="colored-radio" className="hidden w-5 h-5 max-w-full   bg-red-400 border-[transparent] focus:ring-primary dark:focus:ring-primary dark:ring-offset-primary  dark:bg-[transparent] dark:border-[transparent]" />
                    <label htmlFor={`custom-radio${props.radioId}`} className="
                        custom-radio relative  px-[17px]  flex gap-2 items-center pl-[18px]
                        cursor-pointer
                        after:dark:bg-omega
                        after:bg-white
                        after:left-[0px]
                        after:w-[20px] 
                        after:h-[20px]
                        after:border after:border-beta
                        after:absolute

                        before:dark:bg-[transparent]
                        before:bg-white
                        before:left-[5px]
            
                        before:w-[10px] 
                        before:h-[10px]
                        before:absolute
                        before:z-[1]
                        
                        ">
                        <p className="ml-2 md-text !text-[14px]">TP/SL</p>
                    </label>
                </div>
                {
                    showNes === 1 &&
                    <div className='flex items-center gap-[5px] w-full justify-end'>
                        <p className='top-label'>Time in Force:</p>
                        {/* <p className='top-label dark:!text-white'>FOK</p> */}
                        <SelectDropdown list={timeInForceList} showNes={showNes} defaultValue="KOC" whiteColor={true} />
                    </div>
                }
            </div>

            {/* open long */}
            <div className='mt-[20px]'>
                <div className='flex gap-5 items-center justify-between'>
                    <p className="top-label">Buy</p>
                    <p className="top-label !text-[#000] dark:!text-[#fff]">0.00 USDT</p>
                </div>
                {
                    show === 1 &&
                    <div className='mt-[5px]'>
                        <button className=' solid-button w-full !bg-[#03A66D] !rounded-[8px] py-[10px] px-[15px] !text-[14px]'>Open Long</button>
                    </div>
                }
                {
                    show === 2 &&
                    <div className='mt-[5px]'>
                        <button className=' solid-button w-full !bg-sell !rounded-[8px] py-[10px] px-[15px] !text-[14px]'>Open Short</button>
                    </div>
                }
                <div className='flex gap-5 items-center justify-between mt-[5px]'>
                    <p className="top-label">Margin</p>
                    <p className="top-label !text-[#000] dark:!text-[#fff]">0.00</p>
                </div>
                <div className='flex gap-5 items-center justify-between mt-[5px]'>
                    <p className="top-label">Max</p>
                    <p className="top-label !text-[#000] dark:!text-[#fff]">0.00 USDT</p>
                </div>
            </div>
            <div className='flex items-center justify-between px-[12px] py-[7px] dark:bg-[#373d4e] bg-[#e5ecf0] rounded-[4px] cursor-pointer mt-[10px]'>
                <div className='flex items-center gap-10'>
                    <p className='top-label dark:!text-white !text-[#000]'>Fee Rate</p>
                </div>
                <IconsComponent type='rightArrowWithoutBg' />
            </div>

        </div>
    )
}

export default BuySell;