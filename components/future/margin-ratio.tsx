import { truncateNumber } from '@/libs/subdomain';
import Link from 'next/link';
import React from 'react'
import { currencyFormatter } from '../snippets/market/buySellCard';
interface fullWidth{
    fullWidth?:boolean;
    heightAuto?:boolean;
    popupMode?: number;
    setPopupMode?: any;
    setOverlay?: any;
    balance?: any;
}
const MarginRatio = (props:fullWidth) => {
  return (
    <div className={`bg-[#fff] overflow-y-auto dark:bg-[#1a1b1f] py-[14px] px-[16px] ${props.fullWidth ? 'max-w-full':'max-w-[350px]'} w-full`}>
        <p className='top-label dark:!text-white !text-[#000]'>Margin</p>
        <div className='flex gap-5 items-center justify-between mt-[10px] mb-[15px]'>
            <p className="top-label">Margin Ratio </p>
            <p className="top-label !text-[#000] dark:!text-[#fff]">0<span>%</span></p>
        </div>
        <p className='top-label dark:!text-white !text-[#000]'>Assets</p>

        <div className='flex gap-5 items-center justify-between mt-[4px]'>
            <p className="top-label">Wallet Balance</p>
            <p className="top-label !text-[#000] dark:!text-[#fff]">{currencyFormatter(truncateNumber(props?.balance,6 ))||'0.00'} <span> USDT</span></p>
        </div>
        {/* <div className='flex gap-5 items-center justify-between mt-[4px]'>
            <p className="top-label">Unrealized PNL</p>
            <p className="top-label !text-[#000] dark:!text-[#fff]">--<span> USDT</span></p>
        </div>
        <div className='flex gap-5 items-center justify-between mt-[4px]'>
            <p className="top-label">Available Margin</p>
            <p className="top-label !text-[#000] dark:!text-[#fff]">0.00 <span> USDT</span></p>
        </div>
        <div className='flex gap-5 items-center justify-between mt-[4px]'>
            <p className="top-label">Bonus</p>
            <p className="top-label !text-[#000] dark:!text-[#fff]">0.00 <span> USDT</span></p>
        </div>
        <div className='flex gap-5 items-center justify-between mt-[4px]'>
            <p className="top-label">Total Equity</p>
            <p className="top-label !text-[#000] dark:!text-[#fff]">0.00 <span> USDT</span></p>
        </div> */}
        <div className='flex items-center gap-[15px] mt-[15px]'>
            <Link href="/p2p/express" className='border dark:text-white text-[#1A1B1F] dark:border-[#25262a] border-[#e5e7eb] text-center text-[12px] rounded-[4px] py-[5px] px-[10px] w-full max-w-full' target='_blank'>Buy Crypto</Link>
            <button className='border dark:text-white text-[#1A1B1F] dark:border-[#25262a] border-[#e5e7eb] text-[12px] rounded-[4px] py-[5px] px-[10px] w-full max-w-full' onClick={()=>{props.setOverlay(true); props.setPopupMode(3)}}>Transfer</button>
        </div>
    </div>
  )
}

export default MarginRatio;