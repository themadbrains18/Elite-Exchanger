import React from 'react'
interface setState {
    show?: number;
    fullHeight?:boolean;
    showPrice?:boolean;
}
const SelltableFuture = (props:setState) => {
  return (
    <>
        <div className={`p-[16px] pt-[0] overflow-y-auto orderTable ${props.fullHeight ? 'max-h-[290px]':'max-h-[170px]'} `}>
            {/* head */}
            <div className='grid grid-cols-3 gap-[10px] sticky top-0 bg-light bg-[#fafafa] dark:bg-[#1a1b1f]'>
                <p className='top-label text-start py-[5px]'>Price (INR)</p>
                <p className='top-label text-center py-[5px]'>Qty (BTC)</p>
                <p className='top-label text-end py-[5px]'> Total (INR)</p>
            </div>

            {/* content */}
            <div className='grid grid-cols-3 gap-[10px] bg-[#fc47471c] rounded mb-[4px]'>
                <p className='top-label text-start !text-[#FC4747]'>28,654,25.52</p>
                <p className='top-label text-center !text-black dark:!text-white'>0.005654</p>
                <p className='top-label text-end !text-black dark:!text-white'>7,882,51.67</p>
            </div>
            <div className='grid grid-cols-3 gap-[10px] bg-[#fc47471c] rounded mb-[4px]'>
                <p className='top-label text-start !text-[#FC4747]'>28,654,25.52</p>
                <p className='top-label text-center !text-black dark:!text-white'>0.005654</p>
                <p className='top-label text-end !text-black dark:!text-white'>7,882,51.67</p>
            </div>
            <div className='grid grid-cols-3 gap-[10px] bg-[#fc47471c] rounded mb-[4px]'>
                <p className='top-label text-start !text-[#FC4747]'>28,654,25.52</p>
                <p className='top-label text-center !text-black dark:!text-white'>0.005654</p>
                <p className='top-label text-end !text-black dark:!text-white'>7,882,51.67</p>
            </div>
            <div className='grid grid-cols-3 gap-[10px] bg-[#fc47471c] rounded mb-[4px]'>
                <p className='top-label text-start !text-[#FC4747]'>28,654,25.52</p>
                <p className='top-label text-center !text-black dark:!text-white'>0.005654</p>
                <p className='top-label text-end !text-black dark:!text-white'>7,882,51.67</p>
            </div>
            <div className='grid grid-cols-3 gap-[10px] bg-[#fc47471c] rounded mb-[4px]'>
                <p className='top-label text-start !text-[#FC4747]'>28,654,25.52</p>
                <p className='top-label text-center !text-black dark:!text-white'>0.005654</p>
                <p className='top-label text-end !text-black dark:!text-white'>7,882,51.67</p>
            </div>
            <div className='grid grid-cols-3 gap-[10px] bg-[#fc47471c] rounded mb-[4px]'>
                <p className='top-label text-start !text-[#FC4747]'>28,654,25.52</p>
                <p className='top-label text-center !text-black dark:!text-white'>0.005654</p>
                <p className='top-label text-end !text-black dark:!text-white'>7,882,51.67</p>
            </div>
            <div className='grid grid-cols-3 gap-[10px] bg-[#fc47471c] rounded mb-[4px]'>
                <p className='top-label text-start !text-[#FC4747]'>28,654,25.52</p>
                <p className='top-label text-center !text-black dark:!text-white'>0.005654</p>
                <p className='top-label text-end !text-black dark:!text-white'>7,882,51.67</p>
            </div>
            <div className='grid grid-cols-3 gap-[10px] bg-[#fc47471c] rounded mb-[4px]'>
                <p className='top-label text-start !text-[#FC4747]'>28,654,25.52</p>
                <p className='top-label text-center !text-black dark:!text-white'>0.005654</p>
                <p className='top-label text-end !text-black dark:!text-white'>7,882,51.67</p>
            </div>
            <div className='grid grid-cols-3 gap-[10px] bg-[#fc47471c] rounded mb-[4px]'>
                <p className='top-label text-start !text-[#FC4747]'>28,654,25.52</p>
                <p className='top-label text-center !text-black dark:!text-white'>0.005654</p>
                <p className='top-label text-end !text-black dark:!text-white'>7,882,51.67</p>
            </div>
            <div className='grid grid-cols-3 gap-[10px] bg-[#fc47471c] rounded mb-[4px]'>
                <p className='top-label text-start !text-[#FC4747]'>28,654,25.52</p>
                <p className='top-label text-center !text-black dark:!text-white'>0.005654</p>
                <p className='top-label text-end !text-black dark:!text-white'>7,882,51.67</p>
            </div>
            <div className='grid grid-cols-3 gap-[10px] bg-[#fc47471c] rounded mb-[4px]'>
                <p className='top-label text-start !text-[#FC4747]'>28,654,25.52</p>
                <p className='top-label text-center !text-black dark:!text-white'>0.005654</p>
                <p className='top-label text-end !text-black dark:!text-white'>7,882,51.67</p>
            </div>
            <div className='grid grid-cols-3 gap-[10px] bg-[#fc47471c] rounded mb-[4px]'>
                <p className='top-label text-start !text-[#FC4747]'>28,654,25.52</p>
                <p className='top-label text-center !text-black dark:!text-white'>0.005654</p>
                <p className='top-label text-end !text-black dark:!text-white'>7,882,51.67</p>
            </div>
            <div className='grid grid-cols-3 gap-[10px] bg-[#fc47471c] rounded mb-[4px]'>
                <p className='top-label text-start !text-[#FC4747]'>28,654,25.52</p>
                <p className='top-label text-center !text-black dark:!text-white'>0.005654</p>
                <p className='top-label text-end !text-black dark:!text-white'>7,882,51.67</p>
            </div>
            <div className='grid grid-cols-3 gap-[10px] bg-[#fc47471c] rounded mb-[4px]'>
                <p className='top-label text-start !text-[#FC4747]'>28,654,25.52</p>
                <p className='top-label text-center !text-black dark:!text-white'>0.005654</p>
                <p className='top-label text-end !text-black dark:!text-white'>7,882,51.67</p>
            </div>
            <div className='grid grid-cols-3 gap-[10px] bg-[#fc47471c] rounded mb-[4px]'>
                <p className='top-label text-start !text-[#FC4747]'>28,654,25.52</p>
                <p className='top-label text-center !text-black dark:!text-white'>0.005654</p>
                <p className='top-label text-end !text-black dark:!text-white'>7,882,51.67</p>
            </div>
            <div className='grid grid-cols-3 gap-[10px] bg-[#fc47471c] rounded mb-[4px]'>
                <p className='top-label text-start !text-[#FC4747]'>28,654,25.52</p>
                <p className='top-label text-center !text-black dark:!text-white'>0.005654</p>
                <p className='top-label text-end !text-black dark:!text-white'>7,882,51.67</p>
            </div>
            <div className='grid grid-cols-3 gap-[10px] bg-[#fc47471c] rounded mb-[4px]'>
                <p className='top-label text-start !text-[#FC4747]'>28,654,25.52</p>
                <p className='top-label text-center !text-black dark:!text-white'>0.005654</p>
                <p className='top-label text-end !text-black dark:!text-white'>7,882,51.67</p>
            </div>
            <div className='grid grid-cols-3 gap-[10px] bg-[#fc47471c] rounded mb-[4px]'>
                <p className='top-label text-start !text-[#FC4747]'>28,654,25.52</p>
                <p className='top-label text-center !text-black dark:!text-white'>0.005654</p>
                <p className='top-label text-end !text-black dark:!text-white'>7,882,51.67</p>
            </div>
            <div className='grid grid-cols-3 gap-[10px] bg-[#fc47471c] rounded mb-[4px]'>
                <p className='top-label text-start !text-[#FC4747]'>28,654,25.52</p>
                <p className='top-label text-center !text-black dark:!text-white'>0.005654</p>
                <p className='top-label text-end !text-black dark:!text-white'>7,882,51.67</p>
            </div>
            <div className='grid grid-cols-3 gap-[10px] bg-[#fc47471c] rounded mb-[4px]'>
                <p className='top-label text-start !text-[#FC4747]'>28,654,25.52</p>
                <p className='top-label text-center !text-black dark:!text-white'>0.005654</p>
                <p className='top-label text-end !text-black dark:!text-white'>7,882,51.67</p>
            </div>
            <div className='grid grid-cols-3 gap-[10px] bg-[#fc47471c] rounded mb-[4px]'>
                <p className='top-label text-start !text-[#FC4747]'>28,654,25.52</p>
                <p className='top-label text-center !text-black dark:!text-white'>0.005654</p>
                <p className='top-label text-end !text-black dark:!text-white'>7,882,51.67</p>
            </div>
            <div className='grid grid-cols-3 gap-[10px] bg-[#fc47471c] rounded mb-[4px]'>
                <p className='top-label text-start !text-[#FC4747]'>28,654,25.52</p>
                <p className='top-label text-center !text-black dark:!text-white'>0.005654</p>
                <p className='top-label text-end !text-black dark:!text-white'>7,882,51.67</p>
            </div>
            <div className='grid grid-cols-3 gap-[10px] bg-[#fc47471c] rounded mb-[4px]'>
                <p className='top-label text-start !text-[#FC4747]'>28,654,25.52</p>
                <p className='top-label text-center !text-black dark:!text-white'>0.005654</p>
                <p className='top-label text-end !text-black dark:!text-white'>7,882,51.67</p>
            </div>
            <div className='grid grid-cols-3 gap-[10px] bg-[#fc47471c] rounded mb-[4px]'>
                <p className='top-label text-start !text-[#FC4747]'>28,654,25.52</p>
                <p className='top-label text-center !text-black dark:!text-white'>0.005654</p>
                <p className='top-label text-end !text-black dark:!text-white'>7,882,51.67</p>
            </div>
            <div className='grid grid-cols-3 gap-[10px] bg-[#fc47471c] rounded mb-[4px]'>
                <p className='top-label text-start !text-[#FC4747]'>28,654,25.52</p>
                <p className='top-label text-center !text-black dark:!text-white'>0.005654</p>
                <p className='top-label text-end !text-black dark:!text-white'>7,882,51.67</p>
            </div>
            <div className='grid grid-cols-3 gap-[10px] bg-[#fc47471c] rounded mb-[4px]'>
                <p className='top-label text-start !text-[#FC4747]'>28,654,25.52</p>
                <p className='top-label text-center !text-black dark:!text-white'>0.005654</p>
                <p className='top-label text-end !text-black dark:!text-white'>7,882,51.67</p>
            </div>
            <div className='grid grid-cols-3 gap-[10px] bg-[#fc47471c] rounded mb-[4px]'>
                <p className='top-label text-start !text-[#FC4747]'>28,654,25.52</p>
                <p className='top-label text-center !text-black dark:!text-white'>0.005654</p>
                <p className='top-label text-end !text-black dark:!text-white'>7,882,51.67</p>
            </div>
            <div className='grid grid-cols-3 gap-[10px] bg-[#fc47471c] rounded mb-[4px]'>
                <p className='top-label text-start !text-[#FC4747]'>28,654,25.52</p>
                <p className='top-label text-center !text-black dark:!text-white'>0.005654</p>
                <p className='top-label text-end !text-black dark:!text-white'>7,882,51.67</p>
            </div>
            <div className='grid grid-cols-3 gap-[10px] bg-[#fc47471c] rounded mb-[4px]'>
                <p className='top-label text-start !text-[#FC4747]'>28,654,25.52</p>
                <p className='top-label text-center !text-black dark:!text-white'>0.005654</p>
                <p className='top-label text-end !text-black dark:!text-white'>7,882,51.67</p>
            </div>
            <div className='grid grid-cols-3 gap-[10px] bg-[#fc47471c] rounded mb-[4px]'>
                <p className='top-label text-start !text-[#FC4747]'>28,654,25.52</p>
                <p className='top-label text-center !text-black dark:!text-white'>0.005654</p>
                <p className='top-label text-end !text-black dark:!text-white'>7,882,51.67</p>
            </div>
        </div>
        {
            props.showPrice &&
            <div className='bg-card-bg py-[6px] px-[20px] flex items-center justify-between dark:bg-omega bg-white my-[10px]'>
                <p className='info-18 !text-black dark:!text-white'>28,654,25.52</p>
                <p className='info-16 !text-black dark:!text-white !text-[14px] underline'>28,654,25.52</p>
            </div>
        }
    </>
  )
}

export default SelltableFuture;