import Link from 'next/link';
import React from 'react'

const ProfileOverview = () => {
  return (
    <div className='p-[15px] md:p-[40px] border dark:border-opacity-[15%] border-grey-v-1 rounded-10 mt-30'>
        <div className='border-b dark:border-opacity-[15%] border-grey-v-1 md:mb-30 mb-20'>
            <p className="text-[19px] md:text-[23px]  leading-7 font-medium mb-2 md:mb-[10px] dark:text-white md:pb-30 pb-[15px] ">Profile Overview</p>
        </div>
        <div className='grid max-[1024px]:grid-cols-1 max-[1300px]:grid-cols-2 grid-cols-3 gap-30 md:mb-50 mb-3 0'>

            <div className='md:py-30 p-[15px]  md:px-20 bg-[#F4F6FA] dark:bg-black-v-1 rounded-10'>
                <div className='grid grid-cols-2 gap-20 pb-[15px] md:pb-[22px] mb-[15px] md:mb-[22px] border-b dark:border-opacity-[15%] border-grey-v-3 '>
                    <p className='info-14-18 !text-banner-heading dark:!text-white'>30d Trade</p>
                    <p className='info-16-18 md:!text-[16px] !text-[14px]  dark:!text-white !text-body-primary'>0 Times (s)</p>
                </div>

                <div className='grid grid-cols-2 gap-20 pb-[15px] md:pb-[22px] mb-[15px] md:mb-[22px] border-b dark:border-opacity-[15%] border-grey-v-3 '>
                    <p className='info-14-18 !text-banner-heading dark:!text-white'>30d Completion rate</p>
                    <p className='info-16-18 md:!text-[16px] !text-[14px]  dark:!text-white !text-body-primary'>0%</p>
                </div>
                <div className='grid grid-cols-2 gap-20 pb-[15px] md:pb-[22px] mb-[15px] md:mb-[22px] border-b dark:border-opacity-[15%] border-grey-v-3 '>
                    <p className='info-14-18 !text-banner-heading dark:!text-white'>Avg. Release Time</p>
                    <p className='info-16-18 md:!text-[16px] !text-[14px]  dark:!text-white !text-body-primary'>0 Minute (s)</p>
                </div>
                <div className='grid grid-cols-2 gap-20'>
                    <p className='info-14-18 !text-banner-heading dark:!text-white'>Positive Feedback</p>
                    <p className='info-16-18 md:!text-[16px] !text-[14px]  dark:!text-white !text-body-primary'>0 %</p>
                </div>
            </div>
            
            <div className='md:py-30 p-[15px]  md:px-20 bg-[#F4F6FA] dark:bg-black-v-1 rounded-10'>
                <div className='grid grid-cols-2 gap-20 pb-[15px] md:pb-[22px] mb-[15px] md:mb-[22px] border-b dark:border-opacity-[15%] border-grey-v-3 '>
                    <p className='info-14-18 !text-banner-heading dark:!text-white'>Positive</p>
                    <p className='info-16-18 md:!text-[16px] !text-[14px]  dark:!text-white !text-body-primary'>0</p>
                </div>

                <div className='grid grid-cols-2 gap-20 pb-[15px] md:pb-[22px] mb-[15px] md:mb-[22px] border-b dark:border-opacity-[15%] border-grey-v-3 '>
                    <p className='info-14-18 !text-banner-heading dark:!text-white'>Negetive</p>
                    <p className='info-16-18 md:!text-[16px] !text-[14px]  dark:!text-white !text-body-primary'>0</p>
                </div>
                <div className='grid grid-cols-2 gap-20 pb-[15px] md:pb-[22px] mb-[15px] md:mb-[22px] border-b dark:border-opacity-[15%] border-grey-v-3 '>
                    <p className='info-14-18 !text-banner-heading dark:!text-white'>Registered</p>
                    <p className='info-16-18 md:!text-[16px] !text-[14px]  dark:!text-white !text-body-primary'>40 Days ago</p>
                </div>
                <div className='grid grid-cols-2 gap-20'>
                    <p className='info-14-18 !text-banner-heading dark:!text-white'>First Trade</p>
                    <p className='info-16-18 md:!text-[16px] !text-[14px]  dark:!text-white !text-body-primary'>0 Day (s)</p>
                </div>
            </div>
            
            <div className='md:py-30 p-[15px]  md:px-20 bg-[#F4F6FA] dark:bg-black-v-1 rounded-10'>
                <div className='grid grid-cols-2 gap-20 pb-[15px] md:pb-[22px] mb-[15px] md:mb-[22px] border-b dark:border-opacity-[15%] border-grey-v-3 '>
                    <p className='info-14-18 !text-banner-heading dark:!text-white'>All Trade</p>
                    <p className='info-16-18 md:!text-[16px] !text-[14px]  dark:!text-white !text-body-primary'>0 Times (s)  <br />  ( Buy 0 - Sell 0 )</p>
                </div>

                <div className='grid grid-cols-2 gap-20 pb-[15px] md:pb-[22px] mb-[15px] md:mb-[22px] border-b dark:border-opacity-[15%] border-grey-v-3 '>
                    <p className='info-14-18 !text-banner-heading dark:!text-white'>30 Day Trade </p>
                    <p className='info-16-18 md:!text-[16px] !text-[14px]  dark:!text-white !text-body-primary'>0 Times (s)</p>
                </div>
                <div className='grid grid-cols-2 gap-20 pb-[15px] md:pb-[22px] mb-[15px] md:mb-[22px] border-b dark:border-opacity-[15%] border-grey-v-3 '>
                    <p className='info-14-18 !text-banner-heading dark:!text-white'>Approx. 30d volume</p>
                    <p className='info-16-18 md:!text-[16px] !text-[14px]  dark:!text-white !text-body-primary'>0 Times (s)</p>
                </div>
                <div className='grid grid-cols-2 gap-20'>
                    <p className='info-14-18 !text-banner-heading dark:!text-white'>Approx. total volume</p>
                    <p className='info-16-18 md:!text-[16px] !text-[14px]  dark:!text-white !text-body-primary'>0 Times (s)</p>
                </div>
            </div>
            
        </div>
        <Link prefetch={false} className='solid-button !max-w-full sm:!max-w-[220px] block text-center !w-full' href="#">Become Merchant</Link>
    </div>
  )
}

export default ProfileOverview;