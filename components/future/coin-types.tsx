import React, { useState } from 'react'

const CoinTypes = () => {
    const [show, setShow] = useState(1);

  return (
    <div className='p-[16px] dark:bg-[#1f2127] bg-[#fff] max-w-[380px] w-full border-l border-b dark:border-[#25262a] border-[#e5e7eb]'>
        <div className='mb-[15px]'>
            <input type="search" placeholder='search...' className='max-w-full w-full  dark:bg-[#373d4e] bg-[#e5ecf0] rounded-[4px] py-[6px] outline-none dark:text-white text-black text-[12px] px-[10px]' />
        </div>
        <div className='flex items-center gap-[20px] mb-[20px]'>
            <button className={`admin-body-text relative after:dark:bg-white after:bg-black after:absolute after:bottom-[-3px]  after:left-0 after:w-full after:h-[2px] ${show === 1 ? 'after:block !text-black dark:!text-white' : 'after:hidden !text-[#a3a8b7]'}`} onClick={() => { setShow(1) }}>Favorites</button>
            <button className={`admin-body-text relative after:dark:bg-white after:bg-black after:absolute after:bottom-[-3px]  after:left-0 after:w-full after:h-[2px] ${show === 2 ? 'after:block !text-black dark:!text-white' : 'after:hidden !text-[#a3a8b7]'}`} onClick={() => { setShow(2) }}>USDⓈ-M</button>
            <button className={`admin-body-text relative after:dark:bg-white after:bg-black after:absolute after:bottom-[-3px]  after:left-0 after:w-full after:h-[2px] ${show === 3 ? '!text-black after:block  dark:!text-white' : '!text-[#a3a8b7] after:hidden'}`} onClick={() => { setShow(3) }}>COIN-M</button>
        </div>
        <div>
            {/* head */}
            <div className='grid grid-cols-4 gap-[10px] sticky top-0 '>
                <p className='top-label text-start py-[5px]'>Symbol</p>
                <p className='top-label text-center py-[5px]'>Latest Price</p>
                <p className='top-label text-end  py-[5px]'>24h%</p>
                <p className='top-label text-end  py-[5px]'>24h Vol</p>
            </div>
        </div>
    </div>
  )
}

export default CoinTypes;