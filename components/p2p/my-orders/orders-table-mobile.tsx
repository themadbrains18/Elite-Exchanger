import Image from 'next/image';
import React, { Fragment } from 'react'
interface dataTypes{
    data:any;
}
const OrdersTableMobile = (props:dataTypes) => {

  return (
    <>
        
        <div>
            {
                    props.data.map((item,ind)=>{
                    return(
                        <Fragment key={ind}>
                            <div className='grid grid-cols-2 py-[15px] border-b-[0.5px]  dark:border-[#efefef26] border-grey-v-2'>
                                <div className=''>
                                    <p className='sm-text !text-body-secondary dark:!text-beta !text-[12px]'>Order Id</p>
                                    <p className='info-14-18 !text-nav-primary dark:!text-white'><span className={`${item.type === "sell"? "text-cancel":"text-buy"}`}>{item.type}</span>&nbsp;{item.orderId}</p>
                                </div>
                                <div className='text-end'>
                                    <p className='sm-text !text-body-secondary dark:!text-beta !text-[12px]'>Status</p>
                                    <p className={`info-14-18  ${(item.status === "isCompleted" || item.status === "isReleased")   && "!text-buy"}  ${item.status === "isProcess" && "!text-body-primary"} ${item.status === "isCanceled" && "!text-cancel"}`}>{item.status==="isProcess"?"In Process":item.status==="isReleased"?"Released":item.status==="isCompleted"?"Completed":"Canceled"}</p>
                                </div>
                                <div className='mt-[15px]'>
                                    <p className='sm-text !text-body-secondary dark:!text-beta !text-[12px]'>Amount</p>
                                    <p className='info-14-18 !text-nav-primary dark:!text-white'>{item.amount}</p>
                                </div>
                                <div  className='text-end mt-[15px]'>
                                    <p className='sm-text !text-body-secondary dark:!text-beta !text-[12px]'>Price</p>
                                    <p className='info-14-18 !text-nav-primary dark:!text-white'>{item.price}</p>
                                </div>
                                <div className='mt-[15px]'>
                                    <p className='sm-text !text-body-secondary dark:!text-beta !text-[12px]'>Qty</p>
                                    <p className='info-14-18 !text-nav-primary dark:!text-white'>{item.qty}</p>
                                </div>
                                <div  className='text-end mt-[15px]'>
                                    <p className='sm-text !text-body-secondary dark:!text-beta !text-[12px]'>Date / Time </p>
                                    <p className='info-14-18 !text-nav-primary dark:!text-white'>{item.time}</p>
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

export default OrdersTableMobile;