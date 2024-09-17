import React, { useEffect, useState } from 'react'
import PositionsTable from './tabs-table/positions-table';
import OpenOrderTable from './tabs-table/open-order-table';
import PositionsHistoryTable from './tabs-table/position-history';
import ProfitLossTable from './tabs-table/profit-loss-table';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';

interface propsData {
    positions?: any;
    openOrders?: any;
    currentToken?: any;
    positionHistoryData?: any;
    openOrderHistoryData?: any;
}

const ChartTabsFuture = (props: propsData) => {
    const [show, setShow] = useState(1);
    const [positionItems, setPositionItems] = useState([]);
    const [orders, setOrders] = useState([]);
    const [ordersTpSl, setTpSlOrders] = useState([]);
    const { status, data: session } = useSession();


    const router = useRouter();
    const { slug } = router.query;

    // Get all Profit Loss Orders
    const getProfitLossOrder = async () => {
        try {
            if (session) {
                let orderData = await fetch(`${process.env.NEXT_PUBLIC_BASEURL}/future/profitlossorder`, {
                    method: "GET",
                    headers: {
                        "Authorization": session?.user?.access_token
                    },
                }).then(response => response.json());

                setOrders(orderData?.data);
            }
        } catch (error) {
            console.log(error);
            
        }
    }

    
    useEffect(() => {
        getProfitLossOrder();
        let Filteritems = props?.positions?.filter((item: any) => {
            if (item?.symbol == slug) {
                return item;
            }
        })
        setPositionItems(Filteritems);
        let FilterTPSL = orders?.filter((item: any) => {
            if (item?.contract == slug) {
                return item;
            }
        })
        setTpSlOrders(FilterTPSL);
    }, [slug,props?.positions,orders])

    return (
        <div className='bg-[#fafafa] dark:bg-[#1a1b1f]  border-t border-b dark:border-[#25262a] border-[#e5e7eb] py-[14px] px-[16px] max-w-full w-full'>
            {/* tabs */}
            <div className='overflow-x-auto hide-scroller border-b border-grey-v-3 dark:border-opacity-[15%]'>
                <div className='flex items-center gap-[20px] mb-[10px] w-max'>
                    <button className={`admin-body-text relative after:dark:bg-white after:bg-black after:absolute after:bottom-[-10px]  after:left-[50%] after:w-full after:translate-x-[-50%] after:h-[2px] ${show === 1 ? 'after:block !text-black dark:!text-white' : 'after:hidden !text-[#a3a8b7]'}`} onClick={() => { setShow(1) }}>Current Position <span>({session && positionItems?.length || 0})</span></button>
                    <button className={`admin-body-text relative after:dark:bg-white after:bg-black after:absolute after:bottom-[-10px]  after:left-[50%] after:w-full after:translate-x-[-50%] after:h-[2px] ${show === 2 ? 'after:block !text-black dark:!text-white' : 'after:hidden !text-[#a3a8b7]'}`} onClick={() => { setShow(2) }}>Open Orders <span>({session && props?.openOrders.length || 0})</span></button>
                    <button className={`admin-body-text relative after:dark:bg-white after:bg-black after:absolute after:bottom-[-10px]  after:left-[50%] after:w-full after:translate-x-[-50%] after:h-[2px] ${show === 5 ? '!text-black after:block  dark:!text-white' : '!text-[#a3a8b7] after:hidden'}`} onClick={() => { setShow(5) }}>TP/SL ({session && ordersTpSl?.length || 0})</button>
                    <button className={`admin-body-text relative after:dark:bg-white after:bg-black after:absolute after:bottom-[-10px]  after:left-[50%] after:w-full after:translate-x-[-50%] after:h-[2px] ${show === 3 ? '!text-black after:block  dark:!text-white' : '!text-[#a3a8b7] after:hidden'}`} onClick={() => { setShow(3) }}>Position History</button>
                    <button className={`admin-body-text relative after:dark:bg-white after:bg-black after:absolute after:bottom-[-10px]  after:left-[50%] after:w-full after:translate-x-[-50%] after:h-[2px] ${show === 4 ? '!text-black after:block  dark:!text-white' : '!text-[#a3a8b7] after:hidden'}`} onClick={() => { setShow(4) }}>Order History</button>
                </div>
            </div>

            {/* content */}
            {
                show == 1 &&
                <PositionsTable positions={props?.positions} currentToken={props.currentToken} />
            }
            {
                show == 2 &&
                <OpenOrderTable openOrders={props?.openOrders} />
            }
            {
                show === 3 &&
                <PositionsHistoryTable positions={props.positionHistoryData} />
            }
            {
                show === 4 &&
                <PositionsHistoryTable positions={props.positionHistoryData} />
            }
            {
                show === 5 &&
                <ProfitLossTable orders={orders} getProfitLossOrder={getProfitLossOrder} show={show} />
            }

        </div>
    )
}

export default ChartTabsFuture;