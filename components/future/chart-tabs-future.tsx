import React, { useState } from 'react'
import PositionsTable from './tabs-table/positions-table';
import OpenOrderTable from './tabs-table/open-order-table';

const ChartTabsFuture = () => {
    const [show, setShow] = useState(1);

    return (
        <div className='bg-[#fafafa] dark:bg-[#1a1b1f] border-t border-b dark:border-[#25262a] border-[#e5e7eb] py-[14px] px-[16px] max-w-full w-full'>
            {/* tabs */}
            <div className='overflow-x-auto hide-scroller'>
                <div className='flex items-center gap-[20px] mb-[10px] w-max'>
                    <button className={`admin-body-text relative after:dark:bg-white after:bg-black after:absolute after:bottom-[-3px]  after:left-[50%] after:w-[50px] after:translate-x-[-50%] after:h-[2px] ${show === 1 ? 'after:block !text-black dark:!text-white' : 'after:hidden !text-[#a3a8b7]'}`} onClick={() => { setShow(1) }}>Current Position <span>(0)</span></button>
                    <button className={`admin-body-text relative after:dark:bg-white after:bg-black after:absolute after:bottom-[-3px]  after:left-[50%] after:w-[50px] after:translate-x-[-50%] after:h-[2px] ${show === 2 ? 'after:block !text-black dark:!text-white' : 'after:hidden !text-[#a3a8b7]'}`} onClick={() => { setShow(2) }}>Open Orders <span>(0)</span></button>
                    {/* <button className={`admin-body-text relative after:dark:bg-white after:bg-black after:absolute after:bottom-[-3px]  after:left-[50%] after:w-[50px] after:translate-x-[-50%] after:h-[2px] ${show === 3 ? '!text-black after:block  dark:!text-white' : '!text-[#a3a8b7] after:hidden'}`} onClick={() => { setShow(3) }}>Order History</button>
                    <button className={`admin-body-text relative after:dark:bg-white after:bg-black after:absolute after:bottom-[-3px]  after:left-[50%] after:w-[50px] after:translate-x-[-50%] after:h-[2px] ${show === 4 ? '!text-black after:block  dark:!text-white' : '!text-[#a3a8b7] after:hidden'}`} onClick={() => { setShow(4) }}>Position History</button>
                    <button className={`admin-body-text relative after:dark:bg-white after:bg-black after:absolute after:bottom-[-3px]  after:left-[50%] after:w-[50px] after:translate-x-[-50%] after:h-[2px] ${show === 5 ? '!text-black after:block  dark:!text-white' : '!text-[#a3a8b7] after:hidden'}`} onClick={() => { setShow(5) }}>Trade History</button>
                    <button className={`admin-body-text relative after:dark:bg-white after:bg-black after:absolute after:bottom-[-3px]  after:left-[50%] after:w-[50px] after:translate-x-[-50%] after:h-[2px] ${show === 6 ? '!text-black after:block  dark:!text-white' : '!text-[#a3a8b7] after:hidden'}`} onClick={() => { setShow(6) }}>Transaction History</button> */}
                </div>
            </div>

            {/* content */}
            {
                show == 1 && 
                <PositionsTable />
            }
            {
                show == 2 && 
                <OpenOrderTable />
            }

        </div>
    )
}

export default ChartTabsFuture;