import React from 'react'

const TraficResources = () => {
  return (
    <div className='py-6 px-5  rounded-10 bg-white dark:bg-grey-v-4'>
        <h2 className="text-[20px] font-medium leading-8 tracking-[0.15px] dark:text-white text-[#212121]">Traffice Resources</h2>
        <div className='grid grid-cols-2 mt-[15px] mb-[21px]'>
            <div className='pr-[18px] border-r border-white dark:border-[#ECEFF1]'>
                <p className='info-12 text-end'>Total Users</p>
                <p  className='nav-text-lg !text-[#000] !text-[#fff] text-end'>465530</p>
            </div>
            <div className='pl-[18px]'>
                <p className='info-12'>Total Users</p>
                <p  className='nav-text-lg !text-[#000] !text-[#fff]'>465530</p>
            </div>
        </div>

        <div className='mb-[25px]'>
            <div className='flex items-center justify-between mb-[5px]'>
                <p className='nav-text-sm !text-[#000] dark:!text-[#fff]'>From Direct</p>
                <p className='nav-text-sm !text-[#000] dark:!text-[#fff]'>50%</p>
            </div>
            <div className='bg-[#42a5f538] rounded-[5px] h-[6px] w-full relative'>
                <div className='bg-[#42A5F5] rounded-[5px] h-[6px] w-[50%] absolute top-0 left-0'></div>
            </div>
        </div>
        
        <div className='mb-[25px]'>
            <div className='flex items-center justify-between mb-[5px]'>
                <p className='nav-text-sm !text-[#000] dark:!text-[#fff]'>Affiliate</p>
                <p className='nav-text-sm !text-[#000] dark:!text-[#fff]'>50%</p>
            </div>
            <div className='bg-[#42a5f538] rounded-[5px] h-[6px] w-full relative'>
                <div className='bg-[#42A5F5] rounded-[5px] h-[6px] w-[50%] absolute top-0 left-0'></div>
            </div>
        </div>
        <div className='mb-[25px]'>
            <div className='flex items-center justify-between mb-[5px]'>
                <p className='nav-text-sm !text-[#000] dark:!text-[#fff]'>Referral</p>
                <p className='nav-text-sm !text-[#000] dark:!text-[#fff]'>50%</p>
            </div>
            <div className='bg-[#42a5f538] rounded-[5px] h-[6px] w-full relative'>
                <div className='bg-[#42A5F5] rounded-[5px] h-[6px] w-[50%] absolute top-0 left-0'></div>
            </div>
        </div>
        <div className='mb-[25px]'>
            <div className='flex items-center justify-between mb-[5px]'>
                <p className='nav-text-sm !text-[#000] dark:!text-[#fff]'>Marketing</p>
                <p className='nav-text-sm !text-[#000] dark:!text-[#fff]'>50%</p>
            </div>
            <div className='bg-[#42a5f538] rounded-[5px] h-[6px] w-full relative'>
                <div className='bg-[#42A5F5] rounded-[5px] h-[6px] w-[50%] absolute top-0 left-0'></div>
            </div>
        </div>

    </div>
  )
}

export default TraficResources;