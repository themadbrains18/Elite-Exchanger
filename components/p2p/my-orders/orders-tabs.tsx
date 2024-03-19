import React, { useState } from 'react'
import OrdersTableDesktop from './orders-table-desktop';
import OrdersTableMobile from './orders-table-mobile';

interface propsData {
    orderList?: any;
    setOrderId?: any;
}

const OrdersTabs = (props: propsData) => {
    const [active, setActive] = useState(1);

    // all type data
    const AllTypedata = props.orderList;

    // pending orders
    const pendingOrder = props.orderList.filter((item: any) => {
        return item.status === 'isProcess'
    })
    // compeleted orders
    const CompletedOrder = props.orderList.filter((item: any) => {
        return item.status === 'isReleased'
    })
    // canceled orders
    //  'isCompleted', 'isCanceled', 'isReleased'
    const CanceledOrder = props.orderList.filter((item: any) => {
        return item.status === 'isCanceled'
    })

    return (
        <>
            <div className="flex gap-5 md:gap-30 w-full lg:w-auto  mt-30 md:mt-40">
                <button
                    className={`pb-20 md:pb-30 nav-text-sm md:nav-text-lg border-b-2 border-[transparent] whitespace-nowrap ${active === 1 && "border-primary !text-primary"}`}
                    onClick={() => {
                        setActive(1);
                    }}
                >
                    All
                </button>
                <button
                    className={`pb-20 md:pb-30 nav-text-sm md:nav-text-lg border-b-2 border-[transparent] whitespace-nowrap ${active === 2 && "border-primary !text-primary"}`}
                    onClick={() => {
                        setActive(2);
                    }}
                >
                    In Process
                </button>
                <button
                    className={`pb-20 md:pb-30 nav-text-sm md:nav-text-lg border-b-2 border-[transparent] whitespace-nowrap ${active === 3 && "border-primary !text-primary"}`}
                    onClick={() => {
                        setActive(3);
                    }}
                >
                    Completed
                </button>
                <button
                    className={`pb-20 md:pb-30 nav-text-sm md:nav-text-lg border-b-2 border-[transparent] whitespace-nowrap ${active === 4 && "border-primary !text-primary"}`}
                    onClick={() => {
                        setActive(4);
                    }}
                >
                    Canceled
                </button>
            </div>

            {/* Table Data */}
            {
                active === 1 &&
                <div>
                    <div className='md:block hidden'>
                        <OrdersTableDesktop data={AllTypedata} setOrderId={props.setOrderId} />
                    </div>
                    <div className='md:hidden'>
                        <OrdersTableMobile data={AllTypedata} setOrderId={props.setOrderId} />
                    </div>
                </div>
            }
            {
                active === 2 &&
                <div>
                    <div className='md:block hidden'>
                        <OrdersTableDesktop data={pendingOrder} setOrderId={props.setOrderId} />
                    </div>
                    <div className='md:hidden'>
                        <OrdersTableMobile data={pendingOrder} setOrderId={props.setOrderId} />
                    </div>
                </div>
            }
            {
                active === 3 &&
                <div>
                    <div className='md:block hidden'>
                        <OrdersTableDesktop data={CompletedOrder} setOrderId={props.setOrderId} />
                    </div>
                    <div className='md:hidden'>
                        <OrdersTableMobile data={CompletedOrder} setOrderId={props.setOrderId} />
                    </div>
                </div>
            }
            {
                active === 4 &&
                <div>
                    <div className='md:block hidden'>
                        <OrdersTableDesktop data={CanceledOrder} setOrderId={props.setOrderId} />
                    </div>
                    <div className='md:hidden'>
                        <OrdersTableMobile data={CanceledOrder} setOrderId={props.setOrderId} />
                    </div>
                </div>
            }
        </>
    )
}

export default OrdersTabs