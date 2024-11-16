import React, { useEffect, useState } from 'react'
import PositionsTable from './tabs-table/positions-table';
import OpenOrderTable from './tabs-table/open-order-table';
import PositionsHistoryTable from './tabs-table/position-history';
import ProfitLossTable from './tabs-table/profit-loss-table';
import { signOut, useSession } from 'next-auth/react';
import { useRouter } from 'next/router';

/**
 * ChartTabsFuture component displays various trading-related data in tabbed sections.
 * It allows users to view their current positions, open orders, position history,
 * and profit/loss orders, with a dynamic UI that changes based on user interaction.
 * 
 * The component:
 * - Retrieves profit/loss order data from an API when the component mounts.
 * - Filters and displays position items, open orders, and TP/SL orders based on the selected symbol (`slug`).
 * - Provides a tabbed interface to switch between different views:
 *   - **Current Position**: Shows the current positions data.
 *   - **Open Orders**: Displays open orders data.
 *   - **TP/SL Orders**: Displays take-profit/stop-loss orders.
 *   - **Position History**: Displays historical position data.
 *   - **Order History**: Displays historical orders data.
 *
 * @param {Object} props - The props passed to the component.
 * @param {any} [props.positions] - The positions data.
 * @param {any} [props.openOrders] - The open orders data.
 * @param {any} [props.currentToken] - The current token for authentication.
 * @param {any} [props.positionHistoryData] - The position history data.
 * @param {any} [props.openOrderHistoryData] - The open order history data.
 */
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
    const [openOrders, setOpenOrders] = useState([]);
    const [ordersTpSl, setTpSlOrders] = useState([]);
    const { status, data: session } = useSession();
    const router = useRouter();
    const { slug } = router.query;

    /**
     * Fetches the profit and loss orders data from the API and updates the state with the retrieved data.
     * 
     * This function:
     * - Checks if the session is active and a valid access token is available.
     * - Makes a GET request to the `/future/profitlossorder` endpoint with the access token in the headers.
     * - If the request is successful, it sets the `orders` state with the fetched data.
     * - If any error occurs during the request, it logs the error to the console.
     * 
     * @returns {Promise<void>} - Returns a promise that resolves when the API request is completed.
     */
    const getProfitLossOrder = async () => {
        try {
            if (session && session?.user?.access_token) {
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
        getProfitLossOrder()
    }, [])

    /**
     * Effect hook that filters and sets various state values based on the current slug and prop values.
     * 
     * This `useEffect` hook runs whenever the following dependencies change: `slug`, `props?.positions`, `orders`, `props?.openOrders`.
     * 
     * The hook performs the following actions:
     * - Checks if the user is authorized by verifying that `props?.positions?.message` is not "Unauthorized User".
     * - Filters `props?.positions` to get only the items that match the `slug` and updates `positionItems` state.
     * - Filters `orders` to get only the items where the `contract` matches the `slug` and updates `tpSlOrders` state.
     * - Filters `props?.openOrders` to get only the items where the `symbol` matches the `slug` and updates `openOrders` state.
     * - If the user is unauthorized, the `signOut` function is called to log the user out.
     * 
     * @returns {void} - No return value, as this hook only updates state and handles side-effects.
     */
    useEffect(() => {

        if (props?.positions?.message !== "Unuthorized User") {
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

            let openOrderItems = props?.openOrders?.filter((item: any) => {
                if (item?.symbol == slug) {
                    return item;
                }
            })
            setOpenOrders(openOrderItems);

        }
        else {
            signOut();
        }

    }, [slug, props?.positions, orders, props?.openOrders])

    return (
        <div className='bg-[#fafafa] dark:bg-[#1a1b1f]  border-t border-b dark:border-[#25262a] border-[#e5e7eb] py-[14px] px-[16px] max-w-full w-full'>
            {/* tabs */}
            <div className='overflow-x-auto hide-scroller border-b border-grey-v-3 dark:border-opacity-[15%]'>
                <div className='flex items-center gap-[20px] mb-[10px] w-max'>
                    <button className={`admin-body-text relative after:dark:bg-white after:bg-black after:absolute after:bottom-[-10px]  after:left-[50%] after:w-full after:translate-x-[-50%] after:h-[2px] ${show === 1 ? 'after:block !text-black dark:!text-white' : 'after:hidden !text-[#a3a8b7]'}`} onClick={() => { setShow(1) }}>Current Position <span>({session && positionItems?.length || 0})</span></button>
                    <button className={`admin-body-text relative after:dark:bg-white after:bg-black after:absolute after:bottom-[-10px]  after:left-[50%] after:w-full after:translate-x-[-50%] after:h-[2px] ${show === 2 ? 'after:block !text-black dark:!text-white' : 'after:hidden !text-[#a3a8b7]'}`} onClick={() => { setShow(2) }}>Open Orders <span>({session && openOrders.length || 0})</span></button>
                    <button className={`admin-body-text relative after:dark:bg-white after:bg-black after:absolute after:bottom-[-10px]  after:left-[50%] after:w-full after:translate-x-[-50%] after:h-[2px] ${show === 5 ? '!text-black after:block  dark:!text-white' : '!text-[#a3a8b7] after:hidden'}`} onClick={() => { setShow(5) }}>TP/SL ({session && ordersTpSl?.length || 0})</button>
                    <button className={`admin-body-text relative after:dark:bg-white after:bg-black after:absolute after:bottom-[-10px]  after:left-[50%] after:w-full after:translate-x-[-50%] after:h-[2px] ${show === 3 ? '!text-black after:block  dark:!text-white' : '!text-[#a3a8b7] after:hidden'}`} onClick={() => { setShow(3) }}>Position History</button>
                    <button className={`admin-body-text relative after:dark:bg-white after:bg-black after:absolute after:bottom-[-10px]  after:left-[50%] after:w-full after:translate-x-[-50%] after:h-[2px] ${show === 4 ? '!text-black after:block  dark:!text-white' : '!text-[#a3a8b7] after:hidden'}`} onClick={() => { setShow(4) }}>Order History</button>
                </div>
            </div>

            {/* tab content */}
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