import { currencyFormatter } from '@/components/snippets/market/buySellCard';
import { truncateNumber } from '@/libs/subdomain';
import { useWebSocket } from '@/libs/WebSocketContext';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import React, { useEffect, useRef, useState } from 'react'


const OrderInfo = () => {
    const { status, data: session } = useSession();
    const [orderDetail, setOrderDetail] = useState<any>({});
    const router = useRouter();
    const { query } = router;
    const wbsocket = useWebSocket();
    const socketListenerRef = useRef<(event: MessageEvent) => void>();

    /**
     * React `useEffect` hook to handle order data retrieval and WebSocket message events.
     *
     * This hook performs the following:
     * - Fetches order details based on the query parameter when the component mounts or the `query` changes.
     * - Sets up a WebSocket listener to handle incoming messages, updating order details when an "order" event is received.
     * - Ensures proper cleanup by removing the WebSocket event listener when the component unmounts or `wbsocket` changes.
     *
     * @dependencies {Array} [query, wbsocket] - Re-runs the effect when `query` or `wbsocket` changes.
     */
    useEffect(() => {
        if (query) {
            getOrderByOrderId(query?.buy, 'onload');
        }

        /**
         * Handles incoming WebSocket messages and triggers actions based on the message type.
         *
         * This function parses the WebSocket event data, identifies the message type, 
         * and performs actions like fetching updated order details for "order" events.
         *
         * @function handleSocketMessage
         * @param {any} event - The WebSocket event object containing the message data.
         * @returns {void}
         */
        const handleSocketMessage = (event: any) => {
            const data = JSON.parse(event.data).data;
            let eventDataType = JSON.parse(event.data).type;

            // If the message type is "order," fetch updated order details
            if (eventDataType === "order") {
                getOrderByOrderId(query && query?.buy, 'socket');
            }
        };

        // wbsocket.addEventListener('message', handleSocketMessage);
        if (wbsocket && wbsocket.readyState === WebSocket.OPEN) {
            if (socketListenerRef.current) {
                wbsocket.removeEventListener('message', socketListenerRef.current);
            }
            socketListenerRef.current = handleSocketMessage;
            wbsocket.addEventListener('message', handleSocketMessage);
        }

        return () => {
            if (wbsocket) {
                wbsocket.removeEventListener('message', handleSocketMessage);
            }
        };
    }, [query, wbsocket]);

    /**
     * Fetches order details by order ID and updates the state with the retrieved data.
     *
     * This function sends a GET request to fetch the order details based on the provided `orderid`.
     * Once the data is retrieved, it updates the `orderDetail` state.
     *
     * @async
     * @function getOrderByOrderId
     * @param {any} orderid - The ID of the order to fetch.
     * @param {string} type - The type of fetch operation (e.g., 'onload', 'socket') for context or debugging purposes.
     * @returns {Promise<void>} - Resolves once the order data is fetched and state is updated.
     */
    const getOrderByOrderId = async (orderid: any, type: string) => {
        let userOrder: any = await fetch(`${process.env.NEXT_PUBLIC_BASEURL}/p2p/order?orderid=${orderid}`, {
            method: "GET",
            headers: {
                "Authorization": session?.user?.access_token
            },
        }).then(response => response.json());
        setOrderDetail(userOrder?.data);
    }

    return (
        <div className='p-[15px] md:p-[40px] border dark:border-opacity-[15%] border-grey-v-1 rounded-10 '>
            <div className='border-b dark:border-opacity-[15%] border-grey-v-1 md:mb-30 mb-20 md:pb-30 pb-[15px] '>
                <p className="text-[19px] md:text-[23px]  leading-7 font-medium mb-2 md:mb-[15px] dark:!text-white  !text-h-primary">Profile Overview</p>
                <p className='sec-text !text-banner-text'>Order Detail- #{orderDetail?.id}</p>
            </div>
            <div className='max-w-[783px] w-full'>
                <div className='grid grid-cols-2 gap-20  mb-[42px]'>
                    <p className='info-14-18 !text-banner-heading !text-[#232530] dark:!text-white'>{orderDetail?.buy_user_id !== session?.user?.user_id ? "Sell" : "Buy"} Order</p>
                    <p className='info-16-18 md:!text-[16px] !text-[14px]  dark:!text-white !text-[#232530]'>{truncateNumber(orderDetail?.quantity, 6)} {orderDetail?.receive_currency}</p>
                </div>
                <div className='grid grid-cols-2 gap-20  mb-[42px]'>
                    <p className='info-14-18 !text-banner-heading  !text-[#232530] dark:!text-white'>Order Value</p>
                    <p className='info-16-18 md:!text-[16px] !text-[14px]  dark:!text-white !text-[#232530]  '>{currencyFormatter(truncateNumber(orderDetail?.spend_amount, 6))} INR</p>
                </div>
                <div className='grid grid-cols-2 gap-20  mb-[42px]'>
                    <p className='info-14-18 !text-banner-heading dark:!text-white capitalize'>{orderDetail?.buy_user_id !== session?.user?.user_id && orderDetail?.user_post?.price_type} Price</p>
                    <p className='info-16-18 md:!text-[16px] !text-[14px]  dark:!text-white !text-body-primary'>{currencyFormatter(truncateNumber(orderDetail?.price, 6))} INR/{orderDetail?.receive_currency}</p>
                </div>
                <div className='grid grid-cols-2 gap-20  mb-[42px]'>
                    <p className='info-14-18 !text-banner-heading dark:!text-white'>Qty.</p>
                    <p className='info-16-18 md:!text-[16px] !text-[14px]  dark:!text-white !text-body-primary'>{truncateNumber(orderDetail?.receive_amount, 6)} {orderDetail?.receive_currency}</p>
                </div>
                <div className='grid grid-cols-2 gap-20'>
                    <p className='info-14-18 !text-banner-heading dark:!text-white'>Provider</p>
                    <p className='info-16-18 md:!text-[16px] !text-[14px]  dark:!text-white !text-body-primary'>{orderDetail?.user_post?.user?.profile?.fName !== undefined ? orderDetail?.user_post?.user?.profile?.dName : orderDetail?.user_post?.user?.user_kyc?.fname}</p>
                </div>
            </div>

        </div>
    )
}

export default OrderInfo;