import IconsComponent from '@/components/snippets/icons';
import Image from 'next/image';
import React, { Fragment } from 'react'
interface dataTypes {
    data: any;
}
const MobileTable = (props: dataTypes) => {
    return (
        <>
            <div>
                {
                    props.data.map((item:any, ind:any) => {
                        return (
                            <Fragment key={ind}>

                                {/* assets:"6",
                                currency:"USDT",
                                type:"BUY",
                                exchangeRate:"80.54 INR ",
                                remaining:"15.25641 USDT",
                                createTime:"20 Mar, 2022 ( 22:40 )",
                                PaymentMethod: ['phonepay.png','paytm.png','gpay.png'] */}

                                <div className='grid grid-cols-2 py-[15px] border-b-[0.5px]  dark:border-[#efefef26] border-grey-v-2'>
                                    <div className=''>
                                        <p className='sm-text !text-body-secondary dark:!text-beta !text-[12px] mb-[5px]'>Assets</p>
                                        <p className='info-14-18 !text-nav-primary dark:!text-white'>{item.quantity}&nbsp;{item?.token?.symbol}</p>
                                    </div>
                                    <div className='text-end'>
                                        <p className='sm-text !text-body-secondary dark:!text-beta !text-[12px] mb-[5px]'>Type</p>
                                        <p className={`info-14-18  !text-buy `}>BUY</p>
                                    </div>
                                    <div className='mt-[15px]'>
                                        <p className='sm-text !text-body-secondary dark:!text-beta !text-[12px] mb-[5px]'>Remaining</p>
                                        <p className='info-14-18 !text-nav-primary dark:!text-white'>{item.quantity} {item?.token?.symbol}</p>
                                    </div>
                                    {/* <div  className='text-end mt-[15px]'>
                                <p className='sm-text !text-body-secondary dark:!text-beta !text-[12px] mb-[5px]'>Payment</p>
                                <div className='flex items-center gap-10 justify-end'>
                                    {
                                        item.PaymentMethod.map((elem,ind)=>{
                                            return(
                                                <Fragment key={ind}>
                                                    <Image src={`/assets/payment-methods/${elem}`} alt='error' width={16} height={16} />
                                                </Fragment>
                                            )
                                        })
                                    }
                                </div>
                            </div> */}
                                    <div className='mt-[15px] text-end'>
                                        <p className='sm-text !text-body-secondary dark:!text-beta !text-[12px] mb-[5px]'>Create Time </p>
                                        <p className='info-14-18 !text-nav-primary dark:!text-white'>{item.createdAt}</p>
                                    </div>
                                    <div className=' mt-[15px]'>
                                        <p className='sm-text !text-body-secondary dark:!text-beta !text-[12px] mb-[5px]'>Actions</p>
                                        <div className='flex items-center gap-10 '>
                                            <button>
                                                <IconsComponent type='editIcon' hover={false} active={false} />
                                            </button>
                                            <button>
                                                <IconsComponent type='deleteIcon' hover={false} active={false} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </Fragment>
                        )
                    })
                }

            </div>
        </>
    )
}

export default MobileTable;