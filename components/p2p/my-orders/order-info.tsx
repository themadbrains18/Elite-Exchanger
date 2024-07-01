import { truncateNumber } from '@/libs/subdomain';
import { useSession } from 'next-auth/react';
import React from 'react'

interface propsData {
    userOrder?: any;
}

const OrderInfo = (props: propsData) => {
    const { status, data: session } = useSession();

    
    return (
        <div className='p-[15px] md:p-[40px] border dark:border-opacity-[15%] border-grey-v-1 rounded-10 '>
            <div className='border-b dark:border-opacity-[15%] border-grey-v-1 md:mb-30 mb-20 md:pb-30 pb-[15px] '>
                <p className="text-[19px] md:text-[23px]  leading-7 font-medium mb-2 md:mb-[15px] dark:!text-white  !text-h-primary">Profile Overview</p>
                <p className='sec-text !text-banner-text'>Order Detail- #{props?.userOrder?.id}</p>
            </div>
            <div className='max-w-[783px] w-full'>
                <div className='grid grid-cols-2 gap-20  mb-[42px]'>
                    <p className='info-14-18 !text-banner-heading !text-[#232530] dark:!text-white'>{props?.userOrder?.buy_user_id !== session?.user?.user_id ?"Sell" :"Buy"} Order</p>
                    <p className='info-16-18 md:!text-[16px] !text-[14px]  dark:!text-white !text-[#232530]'>{truncateNumber(props?.userOrder?.quantity,6)} {props?.userOrder?.receive_currency}</p>
                </div>
                <div className='grid grid-cols-2 gap-20  mb-[42px]'>
                    <p className='info-14-18 !text-banner-heading  !text-[#232530] dark:!text-white'>Order Value</p>
                    <p className='info-16-18 md:!text-[16px] !text-[14px]  dark:!text-white !text-[#232530]'>{props.userOrder?.spend_amount} INR</p>
                </div>
                <div className='grid grid-cols-2 gap-20  mb-[42px]'>
                    <p className='info-14-18 !text-banner-heading dark:!text-white'>Price</p>
                    <p className='info-16-18 md:!text-[16px] !text-[14px]  dark:!text-white !text-body-primary'>{props.userOrder?.price} INR/{props?.userOrder?.receive_currency}</p>
                </div>
                <div className='grid grid-cols-2 gap-20  mb-[42px]'>
                    <p className='info-14-18 !text-banner-heading dark:!text-white'>Qty.</p>
                    <p className='info-16-18 md:!text-[16px] !text-[14px]  dark:!text-white !text-body-primary'>{props.userOrder?.receive_amount?.toFixed(4)} {props?.userOrder?.receive_currency}</p>
                </div>
                <div className='grid grid-cols-2 gap-20'>
                    <p className='info-14-18 !text-banner-heading dark:!text-white'>Provider</p>
                    <p className='info-16-18 md:!text-[16px] !text-[14px]  dark:!text-white !text-body-primary'>{props?.userOrder?.user_post?.user?.profile?.fName !==undefined ? props?.userOrder?.user_post?.user?.profile?.dName : props?.userOrder?.user_post?.user?.user_kyc?.fname}</p>
                </div>
            </div>

        </div>
    )
}

export default OrderInfo;