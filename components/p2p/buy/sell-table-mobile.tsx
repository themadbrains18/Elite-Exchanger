import Image from 'next/image';
import Link from 'next/link';
import React, { Fragment, useContext, useState } from 'react';

/**
 * Props for the SellTableDesktop component.
 * 
 * This interface defines the expected properties for the `SellTableDesktop` component, 
 * including a function to control the visibility of a modal or some other UI element.
 * 
 * @interface SellTableDesktopProps
 * 
 * @property {Function} setShow1 - A function to control the visibility state. 
 * This function is typically used to show or hide a modal or pop-up within the component.
 * 
 * @example
 * // Example usage of the SellTableDesktopProps interface:
 * const SellTableDesktopComponent = (props: SellTableDesktopProps) => {
 *   // Logic to show or hide something based on props.setShow1
 * };
 */
interface activeSection {
    setShow1: any;
  }

const SellTableMobile = (props:activeSection) => {

    let data = [
        {
            name: "Jerry Smith",
            image: "user1.png",
            orders: "94.14% 144 Orders",
            pricePerCoin: "₹ 82.00INR/USDT",
            limit: "5,000 ~ 9,000 ",
            Available: '9.000342',
            PaymentMethod: ['phonepay.png','paytm.png','gpay.png'],
            sell: "Sell"
        },
        {
            name: "Jerry Smith",
            image: "user1.png",
            orders: "94.14% 144 Orders",
            pricePerCoin: "₹ 82.00INR/USDT",
            limit: "5,000 ~ 9,000 ",
            Available: '9.000342',
            PaymentMethod: ['phonepay.png','paytm.png','gpay.png'],
            sell: "Sell"
        },
        {
            name: "Jerry Smith",
            image: "user1.png",
            orders: "94.14% 144 Orders",
            pricePerCoin: "₹ 82.00INR/USDT",
            limit: "5,000 ~ 9,000 ",
            Available: '9.000342',
            PaymentMethod: ['phonepay.png','paytm.png','gpay.png'],
            sell: "Sell"
        },
        {
            name: "Jerry Smith",
            image: "user1.png",
            orders: "94.14% 144 Orders",
            pricePerCoin: "₹ 82.00INR/USDT",
            limit: "5,000 ~ 9,000 ",
            Available: '9.000342',
            PaymentMethod: ['phonepay.png','paytm.png','gpay.png'],
            sell: "Sell"
        },
        {
            name: "Jerry Smith",
            image: "user1.png",
            orders: "94.14% 144 Orders",
            pricePerCoin: "₹ 82.00INR/USDT",
            limit: "5,000 ~ 9,000 ",
            Available: '9.000342',
            PaymentMethod: ['phonepay.png','paytm.png','gpay.png'],
            sell: "Sell"
        },
        {
            name: "Jerry Smith",
            image: "user1.png",
            orders: "94.14% 144 Orders",
            pricePerCoin: "₹ 82.00INR/USDT",
            limit: "5,000 ~ 9,000 ",
            Available: '9.000342',
            PaymentMethod: ['phonepay.png','paytm.png','gpay.png'],
            sell: "Sell"
        },
        {
            name: "Jerry Smith",
            image: "user1.png",
            orders: "94.14% 144 Orders",
            pricePerCoin: "₹ 82.00INR/USDT",
            limit: "5,000 ~ 9,000 ",
            Available: '9.000342',
            PaymentMethod: ['phonepay.png','paytm.png','gpay.png'],
            sell: "Sell"
        },
        {
            name: "Jerry Smith",
            image: "user1.png",
            orders: "94.14% 144 Orders",
            pricePerCoin: "₹ 82.00INR/USDT",
            limit: "5,000 ~ 9,000 ",
            Available: '9.000342',
            PaymentMethod: ['phonepay.png','paytm.png','gpay.png'],
            sell: "Sell"
        },
        {
            name: "Jerry Smith",
            image: "user1.png",
            orders: "94.14% 144 Orders",
            pricePerCoin: "₹ 82.00INR/USDT",
            limit: "5,000 ~ 9,000 ",
            Available: '9.000342',
            PaymentMethod: ['phonepay.png','paytm.png','gpay.png'],
            sell: "Sell"
        },
    ];


    return (
        <>
            {
                data.map((elem, ind) => {
                    return (
                        <>
                            {/* row */}
                            <div className='grid grid-cols-2 py-[15px] border-b-[0.5px]  dark:border-[#efefef26] border-grey-v-2'>
                                <div>
                                    <div className="flex gap-2 md:py-[15px] items-center px-0 md:px-[5px] ">
                                        <Image src={`/assets/orders/${elem.image}`} width={30} height={30} alt="coins" />
                                        <div>
                                            <p className="info-14-18 !text-[14px] text-black dark:text-white">{elem.name}</p>
                                            <p className="sm-text !text-[10px] dark:text-beta">{elem.orders}</p>
                                        </div>
                                    </div>
                                </div>
                                <div className=' flex items-center justify-end'>
                                    <Link prefetch={false} href="/p2p/postad" className="info-14-18 text-cancel px-[20px] py-[9px] rounded-[4px] bg-orange" >{elem.sell}</Link>
                                </div>
                                <div className='mt-[12px]'>
                                    <p className='sm-text !text-body-secondary dark:!text-beta !text-[10px]'>Price:</p>
                                    <p className='sm-text !text-[14px] dark:!text-white !text-h-primary mt-[5px]'>₹ 82.00 <span className='sm-text !text-[10px] dark:!text-[#9295A6] !text-banner-text'>INR/USDT</span></p>
                                </div>
                                <div className='mt-[12px]'>
                                    <p className='sm-text !text-body-secondary dark:!text-beta !text-[10px]'>Limit:</p>
                                    <p className='sm-text !text-[14px] dark:!text-white !text-h-primary mt-[5px]'>{elem.limit}<span className='sm-text !text-[14px] !text-h-primary dark:!text-beta'>INR</span></p>
                                </div>
                                <div className='mt-[12px]'>
                                    <p className='sm-text !text-body-secondary dark:!text-beta !text-[10px]'>Available:</p>
                                    <p className='sm-text !text-[14px] dark:!text-white !text-h-primary mt-[5px]'>{elem.Available}</p>
                                </div>
                                <div className='mt-[12px]'>
                                    <p className='sm-text !text-body-secondary dark:!text-beta !text-[10px]'>Available:</p>
                                    <div className='flex items-center gap-10 mt-[5px]'>
                                        {
                                        elem?.PaymentMethod?.map((elem,ind)=>{
                                            return(
                                                <Fragment key={ind}>
                                                <Image src={`/assets/payment-methods/${elem}`} alt='error' width={16} height={16} />
                                            </Fragment>
                                            )
                                        })
                                        }
                                    </div>
                                </div>
                            </div>
                        </>
                    )
                })
            }
        </>
    )
}

export default SellTableMobile;