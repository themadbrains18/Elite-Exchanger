import React from 'react'
interface setState {
    show?: number;
    setShow?:any;
    fullHeight?:boolean;
    showPrice?:boolean;
    widthFull?:boolean
}
const MarketTrades = (props:setState) => {
  return (
    <div className={`bg-[#fafafa] dark:bg-[#1a1b1f] min-[990px]:border-l dark:border-[#25262a] border-[#e5e7eb] py-[14px] px-[16px] ${props.widthFull ? "max-w-full":"max-w-[300px]"}  w-full`}>
        <h3 className='top-label dark:!text-white !text-[#000] max-[991px]:hidden'>Market Trades</h3>
        <div className={`overflow-y-auto orderTable max-h-[172px] min-[1500px]:max-h-[170px]`}>
            {/* head */}
            <div className='grid grid-cols-3 gap-[10px] sticky top-0 bg-light bg-[#fafafa] dark:bg-[#1a1b1f]'>
                <p className='top-label text-start py-[5px]'>Price (USDT)</p>
                <p className='top-label text-center py-[5px]'>Qty (USDT)</p>
                <p className='top-label text-end  py-[5px]'>Time</p>
            </div>

            {/* content */}
            <div className='grid grid-cols-3 gap-[10px] bg-[#25e39e0a] rounded mb-[4px]'>
                <p className='top-label text-start !text-buy'>37,189.8</p>
                <p className='top-label text-center !text-black dark:!text-white'>111.57</p>
                <p className='top-label text-end !text-black dark:!text-white'>18:09:49</p>
            </div>
            <div className='grid grid-cols-3 gap-[10px] bg-[#25e39e0a] rounded mb-[4px]'>
                <p className='top-label text-start !text-buy'>37,189.8</p>
                <p className='top-label text-center !text-black dark:!text-white'>111.57</p>
                <p className='top-label text-end !text-black dark:!text-white'>18:09:49</p>
            </div>
            <div className='grid grid-cols-3 gap-[10px] bg-[#25e39e0a] rounded mb-[4px]'>
                <p className='top-label text-start !text-buy'>37,189.8</p>
                <p className='top-label text-center !text-black dark:!text-white'>111.57</p>
                <p className='top-label text-end !text-black dark:!text-white'>18:09:49</p>
            </div>
            <div className='grid grid-cols-3 gap-[10px] bg-[#fc47471c] rounded mb-[4px]'>
                <p className='top-label text-start !text-sell'>37,189.8</p>
                <p className='top-label text-center !text-black dark:!text-white'>111.57</p>
                <p className='top-label text-end !text-black dark:!text-white'>18:09:49</p>
            </div>
            <div className='grid grid-cols-3 gap-[10px] bg-[#fc47471c] rounded mb-[4px]'>
                <p className='top-label text-start !text-sell'>37,189.8</p>
                <p className='top-label text-center !text-black dark:!text-white'>111.57</p>
                <p className='top-label text-end !text-black dark:!text-white'>18:09:49</p>
            </div>
            <div className='grid grid-cols-3 gap-[10px] bg-[#25e39e0a] rounded mb-[4px]'>
                <p className='top-label text-start !text-buy'>37,189.8</p>
                <p className='top-label text-center !text-black dark:!text-white'>111.57</p>
                <p className='top-label text-end !text-black dark:!text-white'>18:09:49</p>
            </div>
            <div className='grid grid-cols-3 gap-[10px] bg-[#fc47471c] rounded mb-[4px]'>
                <p className='top-label text-start !text-sell'>37,189.8</p>
                <p className='top-label text-center !text-black dark:!text-white'>111.57</p>
                <p className='top-label text-end !text-black dark:!text-white'>18:09:49</p>
            </div>
            <div className='grid grid-cols-3 gap-[10px] bg-[#fc47471c] rounded mb-[4px]'>
                <p className='top-label text-start !text-sell'>37,189.8</p>
                <p className='top-label text-center !text-black dark:!text-white'>111.57</p>
                <p className='top-label text-end !text-black dark:!text-white'>18:09:49</p>
            </div>
        </div>
    </div>
  )
}

export default MarketTrades;