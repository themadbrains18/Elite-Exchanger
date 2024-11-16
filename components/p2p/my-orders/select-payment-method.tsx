import IconsComponent from '@/components/snippets/icons';
import { truncateNumber } from '@/libs/subdomain';
import { useWebSocket } from '@/libs/WebSocketContext';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import { useRouter } from 'next/router';
import React, { Fragment, useEffect, useRef, useState } from 'react'

/**
 * Interface for the PaymentMethod component's props, which handle the user's order and payment method.
 * 
 * @interface PaymentMethodProps
 * 
 * @property {any} [userOrder] - An optional property representing the user's order details. This can include
 *   information such as the order ID, status, amount, or any other relevant order details.
 * 
 * @property {any} [setPaymentMethod] - An optional callback function that is used to set the payment method
 *   for the user. This function will likely be triggered when the user selects a payment method.
 */
interface PaymentMethodProps {
    userOrder?: any;
    setPaymentMethod?: any;
}

const SlectPaymentMethod = (props: PaymentMethodProps) => {

    const { status, data: session } = useSession();
    const [sellerUser, setSellerUser] = useState<any>({});

    /**
     * Toggles the visibility of a sibling element and adjusts its height.
     * This function detects if the browser is Safari and applies a specific height adjustment 
     * for Safari users.
     * 
     * @function showOpt
     * 
     * @param {any} e - The event object triggered when the user interacts with an element.
     *   It is used to locate the parent element and its next sibling to modify visibility and height.
     * 
     * @description 
     * - The function first checks if the browser is Safari using the user-agent string.
     * - If Safari is detected, it adjusts the height of the next sibling element to a fixed value (350px or 0).
     * - If the parent element contains the class `show`, it will expand the next sibling element's height.
     * - If the `show` class is removed, the height is reset.
     */
    const showOpt = (e: any) => {
        let parent = e?.currentTarget?.closest(".parent");
        let nextSiblibg = parent?.nextElementSibling;
        let nextSiblibgHeight = nextSiblibg?.scrollHeight;

        // Detect if the browser is Safari
        const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);

        if (isSafari) {
            // Set height to 50% less if on Safari
            let scaner = document.querySelector("#scaner");
            if (scaner) {
                nextSiblibgHeight = nextSiblibgHeight ? 350 : 0;
            }
        }

        parent?.classList?.toggle("show");

        if (parent?.classList?.contains("show")) {
            nextSiblibg?.setAttribute("style", `height:${nextSiblibgHeight}px;`);
        } else {
            nextSiblibg?.removeAttribute("style");
        }
    }

    const [payment_method, setPaymentMethod] = useState([]);

    const [orderDetail, setOrderDetail] = useState<any>({});
    const router = useRouter();
    const { query } = router;
    const wbsocket = useWebSocket();
    const socketListenerRef = useRef<(event: MessageEvent) => void>();

    /**
     * Effect hook that fetches order data when the component is mounted or when `query` or `wbsocket` changes.
     * It listens for incoming WebSocket messages related to the order and triggers an update when new messages are received.
     * 
     * @effect
     * 
     * This effect does the following:
     * - When the component is mounted or the `query` changes, it fetches the order details based on the `buy` ID from `query` by calling `getOrderByOrderId`.
     * - It sets up a WebSocket message listener (`handleSocketMessage`) to listen for incoming messages related to order events.
     * - If a new WebSocket message of type "order" is received, it triggers a re-fetch of the order data via `getOrderByOrderId`.
     * - The effect cleans up by removing the WebSocket listener when the component unmounts or when `wbsocket` or `query` changes.
     * 
     * @param {object} query - The query object that contains the `buy` ID used to fetch the order details.
     * @param {WebSocket} wbsocket - The WebSocket connection used to receive messages related to the order.
     */
    useEffect(() => {
        // Fetch order details if query is available
        if (query) {
            getOrderByOrderId(query?.buy, 'onload');
        }
        /**
         * Handles incoming WebSocket messages.
         * 
         * This function processes WebSocket events, checks if the message type is "order",
         * and triggers a re-fetch of the order details by calling `getOrderByOrderId`.
         * 
         * @param {MessageEvent} event - The WebSocket message event containing the data.
         * @returns {void}
         * 
         * @example
         * // Example usage:
         * handleSocketMessage(event);
         */
        const handleSocketMessage = (event: any) => {
            const data = JSON.parse(event.data).data;
            let eventDataType = JSON.parse(event.data).type;
            if (eventDataType === "order") {
                getOrderByOrderId(query && query?.buy, 'socket');
            }
        };

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
     * Fetches order details by order ID and updates the corresponding state values.
     * 
     * This function retrieves order information from the backend using the provided order ID.
     * It updates the `orderDetail`, `sellerUser`, and `paymentMethod` states based on the fetched data.
     * 
     * @param {any} orderid - The ID of the order to fetch details for.
     * @param {string} type - The type of the operation that triggered the data fetch (e.g., "onload" or "socket").
     * @returns {void}
     * 
     * @example
     * // Example usage:
     * getOrderByOrderId('12345', 'onload');
     */
    const getOrderByOrderId = async (orderid: any, type: string) => {
        let userOrder: any = await fetch(`${process.env.NEXT_PUBLIC_BASEURL}/p2p/order?orderid=${orderid}`, {
            method: "GET",
            headers: {
                "Authorization": session?.user?.access_token
            },
        }).then(response => response.json());
        setOrderDetail(userOrder?.data);
        setSellerUser(userOrder?.data?.user_post?.user);
        let payment_method: any = [];
        let orderPost = userOrder?.data?.user_post;
        if (orderPost !== null && orderPost != undefined) {
            for (const upid of orderPost?.p_method) {
                orderPost?.user?.user_payment_methods.filter((item: any) => {
                    if (item?.id === upid?.upm_id) {
                        payment_method.push(item);
                    }
                })
            }
        }
        setPaymentMethod(payment_method);
    }

    return (
        <div className='p-[15px] md:p-[40px] md:pb-20 border dark:border-opacity-[15%] border-grey-v-1 rounded-10 mt-30'>
            <div className='border-b dark:border-opacity-[15%] border-grey-v-1 md:pb-30 pb-[15px] '>
                <p className="text-[19px] md:text-[23px]  leading-7 font-medium   dark:!text-white  !text-h-primary">Please Select Payment Method</p>
            </div>

            {/* payment methods */}
            {
                payment_method && payment_method?.length > 0 && payment_method?.map((elem: any, ind: any) => {
                    return (
                        <div key={ind}>
                            <div className='parent flex items-center gap-10 justify-between py-20 '>
                                <div className="flex items-center mr-4 ">
                                    {orderDetail?.p_method !== '' &&
                                        <input id={`radio-${elem?.id}`} type="radio" checked={(orderDetail?.p_method !== '' && orderDetail?.p_method === elem?.id) ? true : false} disabled={(orderDetail?.p_method !== '' && orderDetail?.p_method !== elem?.id) ? true : false} value="" onChange={() => props?.setPaymentMethod(elem?.id)} name="colored-radio-dd" className="w-5 h-5 hidden bg-red-400 border-[transparent] focus:ring-primary dark:focus:ring-primary dark:ring-offset-primary  dark:bg-[transparent] dark:border-[transparent]" />
                                    }
                                    {orderDetail?.p_method === '' &&
                                        <input id={`radio-${elem?.id}`} type="radio" value="" onChange={() => props.setPaymentMethod(elem?.id)} name="colored-radio-dd" className="w-5 h-5 hidden bg-red-400 border-[transparent] focus:ring-primary dark:focus:ring-primary dark:ring-offset-primary  dark:bg-[transparent] dark:border-[transparent]" />
                                    }
                                    <label htmlFor={`radio-${elem?.id}`} className="
                                        md-text  px-[18px] relative custom-radio  cursor-pointer

                                        pl-[30px] 
                                        after:dark:bg-omega
                                        after:bg-white
                                        after:left-[0px]
                                        after:w-[20px] 
                                        after:h-[20px]
                                        after:rounded-[50%] 
                                        after:border after:border-beta
                                        after:absolute

                                        before:dark:bg-[transparent]
                                        before:bg-white
                                        before:left-[5px]
                                        before:top-[calc(50%-5px)]
                                        before:w-[10px] 
                                        before:h-[10px]
                                        before:rounded-[50%] 
                                        before:absolute
                                        before:z-[1]    
                                        flex items-center gap-10
                                        ">
                                        <span className='text-banner-text  dark:text-white'>{elem?.master_payment_method?.payment_method}</span>
                                        <Fragment key={ind}>
                                            <Image src={`${elem?.master_payment_method?.icon}`} alt='error' width={28} height={28} />
                                        </Fragment>

                                    </label>
                                    {/* <p className='info-14-18 !text-banner-heading dark:!text-white md:block hidden'>( BankName@{elem.master_payment_method?.payment_method} )</p> */}
                                </div>
                                <div className='cursor-pointer' onClick={(e) => { showOpt(e) }}>
                                    <IconsComponent type='downArrow' hover={false} active={false} />
                                </div>
                            </div>
                            {/* payment method Detail */}
                            <div className='h-0 overflow-hidden duration-300'>
                                <div className='flex flex-wrap items-center gap-30 justify-between mt-[12px]'>
                                    <div className='max-w-[50%] w-full'>
                                        <div className='grid md:grid-cols-2 grid-cols-1 gap-10 md:mb-[24px] mb-[12px]'>
                                            <p className='info-14-18 !text-beta dark:!text-grey-v-2 md:block hidden'>Phone no :</p>
                                            <div className='flex items-center gap-10'>
                                                <div className='min-w-[25px]'>
                                                    <IconsComponent type='phoneIcon' hover={false} active={false} />
                                                </div>
                                                <p className='md-text !text-banner-text dark:!text-gamma  whitespace-nowrap '>+91 {elem?.pmObject?.phonenumber}</p>
                                            </div>
                                        </div>
                                        <div className='grid md:grid-cols-2 grid-cols-1 gap-10 '>
                                            <p className='info-14-18 !text-beta dark:!text-grey-v-2 md:block hidden'>Gmail :</p>
                                            <div className='flex items-center gap-10'>
                                                <div className='min-w-[25px]'>
                                                    <IconsComponent type='mailIcon' hover={false} active={false} />
                                                </div>
                                                <p className='md-text !text-banner-text dark:!text-gamma  whitespace-nowrap '>{sellerUser?.email}</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className='text-center'>
                                        {elem?.pmObject?.qr_code !== undefined && elem?.pmObject?.qr_code !== "notValid" &&
                                            <>
                                                <Image src={elem?.pmObject?.qr_code} alt='error' width={145} height={145} id='scaner' className='md:max-w-[145px] w-full max-w-[70px] md:mb-20 mx-auto rounded-[5px] bg-white p-10' />
                                                <p className='sm-text md:block hidden !text-[12px] dark:!text-[#96969A]'>My QR Code:<span className='dark:text-grey-v-1 text-black'>&nbsp;{truncateNumber(orderDetail?.spend_amount, 6)} INR</span></p>
                                            </>
                                        }

                                    </div>
                                </div>
                            </div>
                        </div>

                    )
                })
            }
        </div>
    )
}

export default SlectPaymentMethod;