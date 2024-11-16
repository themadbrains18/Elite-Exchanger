import IconsComponent from '@/components/snippets/icons';
import React, { useEffect, useRef, useState } from 'react';
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AES from 'crypto-js/aes';
import { signOut, useSession } from 'next-auth/react';
import TradingPasswordAds from '../postadv/tradingPasswordAds';
import Successfull from '@/components/snippets/successfull';
import CancelOrder from '@/components/snippets/cancelOrder';
import { useRouter } from 'next/router';
import { useWebSocket } from '@/libs/WebSocketContext';
import { truncateNumber } from '@/libs/subdomain';

/**
 * Interface representing the properties passed to the Remarks component.
 *
 * This interface is used to define the structure of the props required by the
 * Remarks component, which handles the remarks related to a user's order.
 *
 * @interface RemarksPropsData
 */
interface RemarksPropsData {
    /**
     * The payment method selected by the user.
     * This can contain details about the payment method used in the transaction.
     * 
     * @type {any}
     */
    paymentMethod: any;

    /**
     * The unique identifier for the order.
     * This is optional and can be used to reference a specific order.
     * 
     * @type {any}
     */
    orderid?: any;

    /**
     * The user order data, which might include details like the status, amount, or date.
     * This is optional and can be passed to display order-related details.
     * 
     * @type {any}
     */
    userOrder?: any;

    /**
     * A function used to get the user's orders.
     * This is optional and can be invoked to retrieve the most up-to-date order data.
     * 
     * @type {any}
     */
    getUserOrders?: any;
}

const Remarks = (props: RemarksPropsData) => {
    const [timeLeft, setTimer] = useState('');
    const { status, data: session } = useSession();
    const [active, setActive] = useState(false);
    const [active1, setActive1] = useState(false);
    const [show, setShow] = useState(false);
    const [confirmation, setConfirmation] = useState(false)
    const Ref: any = useRef(null);

    const [finalFormData, setFinalFormData] = useState({
        "order_id": "",
        "user_id": "",
        "fundcode": ''
    });
    const [orderDetail, setOrderDetail] = useState<any>({});
    const router = useRouter();
    const { query } = router;
    const wbsocket = useWebSocket();
    const socketListenerRef = useRef<(event: MessageEvent) => void>();

    /**
     * Fetches order details based on the `buy` property in the query when the component loads or when the WebSocket sends an order update.
     * 
     * The function listens for WebSocket messages and updates the order details if the message type is 'order'.
     * It also handles cleanup to remove the WebSocket message listener when the component unmounts or dependencies change.
     * 
     * @param {Object} event - The WebSocket message event.
     * @param {string} event.data - The data payload in the WebSocket message.
     * 
     * @returns {void}
     */
    useEffect(() => {
        if (query) {
            getOrderByOrderId(query?.buy, 'onload');
        }

        /**
         * Handles incoming WebSocket messages.
         * If the message type is "order", fetches the order details based on the current `buy` query.
         * 
         * @param {any} event - The WebSocket message event.
         */
        const handleSocketMessage = (event: any) => {
            const data = JSON.parse(event.data).data;
            let eventDataType = JSON.parse(event.data).type;
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
     * Fetches the order details based on the provided `orderid`.
     * 
     * This function sends a GET request to the server to retrieve order details and updates the state with the fetched order data.
     * 
     * @param {any} orderid - The ID of the order to retrieve.
     * @param {string} type - The type of operation being performed (e.g., 'onload', 'socket').
     * 
     * @returns {Promise<void>} - This function doesn't return any value. It updates the order details state.
     */
    const getOrderByOrderId = async (orderid: any, type: string) => {
        // Fetch order details from the API using the provided orderid
        let userOrder: any = await fetch(`${process.env.NEXT_PUBLIC_BASEURL}/p2p/order?orderid=${orderid}`, {
            method: "GET",
            headers: {
                "Authorization": session?.user?.access_token
            },
        }).then(response => response.json());
        setOrderDetail(userOrder?.data);
    }

    /**
     * This effect runs whenever the `query?.buy`, `orderDetail`, or `wbsocket` change.
     * It checks if the order status is 'isProcess' and calls the `orderTimeCalculation` function 
     * to perform any necessary time-related calculations for the order.
     * 
     * @returns {void}
     */
    useEffect(() => {
        if (orderDetail?.status === 'isProcess') {
            // Call the function to calculate order time when the order is in 'isProcess' status
            orderTimeCalculation();
        }
    }, [query?.buy, orderDetail, wbsocket]);

    /**
     * Calculates the time left for the order based on the order creation time and sets up a countdown timer.
     * If the current time exceeds the deadline, the order is automatically canceled.
     * 
     * The function checks the `orderDetail`'s creation time, adds a 15-minute and 5-second deadline, and compares it with the current time.
     * If the time is still within the deadline, a countdown timer is started. If the time has passed, the order is canceled automatically.
     * 
     * @returns {Promise<void>} Returns a promise that resolves when the order is either being processed or canceled.
     */
    const orderTimeCalculation = async () => {
        // Set deadline to 15 minutes and 5 seconds after the order creation time
        let deadline = new Date(orderDetail?.createdAt);
        deadline.setMinutes(deadline.getMinutes() + 15);
        deadline.setSeconds(deadline.getSeconds() + 5);
        let currentTime = new Date();
        // Check if current time is before the deadline
        if (currentTime < deadline && orderDetail?.status === 'isProcess') {
            if (Ref.current) clearInterval(Ref.current);

            const timer = setInterval(() => {
                calculateTimeLeft(deadline);
            }, 1000);
            Ref.current = timer;
        }
        // If current time has passed the deadline, cancel the order
        else if (currentTime > deadline && orderDetail?.status === 'isProcess') {
            await orderCancel('auto');
        }
    }

    /**
     * Calculates the time remaining and updates the timer display.
     * If the countdown reaches zero, the order is automatically canceled.
     * 
     * This function uses the `getTimeRemaining` utility to calculate the time left until the deadline.
     * If there is still time left, it updates the timer display. Once the time runs out, it clears the interval
     * and triggers an automatic order cancellation if the order status is still 'isProcess'.
     * 
     * @param {any} e - The deadline date object used to calculate the time remaining.
     * @returns {void} This function does not return anything. It updates the state and performs side effects.
     */
    const calculateTimeLeft = (e: any) => {
        // Get the remaining time (total, minutes, and seconds)
        let { total, minutes, seconds } = getTimeRemaining(e);

        // If there's still time left, update the timer display
        if (total >= 0) {
            setTimer(
                (minutes > 9 ? minutes : '0' + minutes) + ':'
                + (seconds > 9 ? seconds : '0' + seconds)
            )
        }
        // If time has run out, cancel the order
        else {
            if (Ref.current) clearInterval(Ref.current);
            if (orderDetail?.status === 'isProcess') {
                orderCancel('auto');
            }
        }
    }

    /**
     * Calculates the remaining time between the current time and the given deadline.
     * 
     * This function computes the total time left (in milliseconds), as well as the 
     * minutes and seconds remaining from the deadline. It can be used to show a countdown 
     * by calculating the time difference from the current time to the given deadline.
     * 
     * @param {any} e - The deadline (as a date string or Date object) that we want to calculate the time difference from.
     * @returns {Object} An object containing:
     *   - `total`: The total time remaining in milliseconds.
     *   - `minutes`: The remaining minutes as an integer.
     *   - `seconds`: The remaining seconds as an integer.
     */
    const getTimeRemaining = (e: any) => {
        let current: any = new Date();
        const total = Date.parse(e) - Date.parse(current);
        const seconds = Math.floor((total / 1000) % 60);
        const minutes = Math.floor((total / 1000 / 60) % 60);
        return {
            total, minutes, seconds
        };
    }

    /**
     * Updates the payment method for an order and sends the payment details to the server.
     * 
     * This function checks if a payment method is selected, encrypts the payment data, 
     * and sends it to the server using an API request. If the user is authenticated, 
     * it processes the order and sends the updated order details through a WebSocket.
     * If the request is successful, a success message is displayed, otherwise, 
     * an error message is shown.
     * 
     * @returns {Promise<void>} Returns a promise that resolves when the payment method is updated.
     *   - Displays a success message if the payment is successfully processed.
     *   - Shows an error message if the payment fails or the user is unauthenticated.
     */
    const updatePaymentMethod = async () => {
        // Check if the payment method is selected
        if (props.paymentMethod === '') {
            toast.error('Please select one payment method');
            return;
        }

        // Prepare the payment data object
        let obj = {
            "order_id": orderDetail?.id,
            "p_method": props.paymentMethod,
            "user_id": session?.user?.user_id
        }

        // Check if the user is authenticated
        if (status === 'authenticated') {
            if (Ref.current) clearInterval(Ref.current);
            // Encrypt the payment data
            const ciphertext = AES.encrypt(JSON.stringify(obj), `${process.env.NEXT_PUBLIC_SECRET_PASSPHRASE}`).toString();
            let record = encodeURIComponent(ciphertext.toString());

            // Send the payment data to the server
            let responseData = await fetch(`${process.env.NEXT_PUBLIC_BASEURL}/p2p/order`, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                    "Authorization": session?.user?.access_token
                },
                body: JSON.stringify(record)
            })

            // Parse the server response
            let res = await responseData.json();
            // Handle the response based on status
            if (res.data.status === 200) {
                // Update the user's orders and send WebSocket message
                props.getUserOrders();
                if (wbsocket) {
                    let orderData = {
                        ws_type: 'order',
                        orderid: orderDetail?.id,
                        user_id: session?.user?.user_id
                    }
                    wbsocket.send(JSON.stringify(orderData));
                }
                if (Ref.current) clearInterval(Ref.current);
                toast.success('Thanks for payment. Receiver release assets in short time.');
            }
            else {
                toast.error(res.data.data, { autoClose: 2000 });
                return;
            }
        }
        else {
            // Handle unauthenticated user
            toast.error('Unauthenticated User');
            signOut();
        }
    }

    /**
     * Cancels an order based on the provided cancel type.
     * 
     * This function constructs a request to cancel an order, encrypts the order details, 
     * and sends a `PUT` request to the server to process the cancellation. If the user is 
     * authenticated, the function performs the cancellation and updates the order status 
     * by sending a WebSocket message. If successful, it fetches updated user orders. 
     * In case of failure, an error message is shown to the user. If the user is not authenticated, 
     * they are signed out.
     * 
     * @param {string} type - The type of cancellation ('auto' or 'manual').
     * @returns {Promise<void>} Returns a promise that resolves once the cancellation process is completed.
     *   - Sends a WebSocket message to notify the cancellation if successful.
     *   - Displays a success or error message based on the response from the server.
     *   - Signs out the user if they are unauthenticated.
     */
    const orderCancel = async (type: string) => {
        // Prepare the cancellation data object
        let obj = {
            "order_id": orderDetail?.id,
            "user_id": orderDetail?.buy_user_id,
            "cancelType": type
        }

        // Check if the user is authenticated
        if (status === 'authenticated') {
            const ciphertext = AES.encrypt(JSON.stringify(obj), `${process.env.NEXT_PUBLIC_SECRET_PASSPHRASE}`).toString();
            let record = encodeURIComponent(ciphertext.toString());

            // Send the cancellation request to the server
            let responseData = await fetch(`${process.env.NEXT_PUBLIC_BASEURL}/p2p/order`, {
                method: "PUT",
                headers: {
                    'Content-Type': 'application/json',
                    "Authorization": session?.user?.access_token
                },
                body: JSON.stringify(record)
            })

            let res = await responseData.json();

            // Handle the response based on the result
            if (res.data.result) {
                if (wbsocket) {
                    let orderData = {
                        ws_type: 'order',
                        orderid: orderDetail?.id,
                        user_id: session?.user?.user_id
                    }
                    wbsocket.send(JSON.stringify(orderData));
                }
                props.getUserOrders();
                return;
            }
            else {
                toast.error(res.data.data);
                return;
            }
        }
        else if (status === 'unauthenticated') {
            toast.error('Unauthenticated User');
            signOut();
        }
    }

    /**
     * Prepares the order release data and triggers the display of a modal form.
     * 
     * This function sets up the order details for the release action. It prepares an object 
     * containing the order ID, user ID, and an empty fund code. Then, it updates the state 
     * by setting the `finalFormData` with this object, displays a modal (`setShow(true)`), 
     * and activates the modal (`setActive(true)`), likely for user confirmation or further actions.
     * 
     * @returns {void} This function does not return a value. It updates the component state 
     *   and triggers UI changes (showing a modal) to handle order release actions.
     */
    const orderReleased = async () => {
        let obj = {
            "order_id": orderDetail?.id,
            "user_id": session?.user?.user_id,
            "fundcode": ''
        }
        setFinalFormData(obj);
        setShow(true);
        setActive(true);
    }

    /**
     * Submits the final data for the ads update process, including the provided password as part of the request.
     * 
     * This function encrypts the form data, sends a POST request to the backend API with the encrypted 
     * data, and handles the response accordingly. Upon a successful submission, it updates the UI state 
     * (closes the modal, triggers a new state for further actions) and sends a WebSocket message with 
     * the order details. In case of failure or unauthenticated user, it displays appropriate error messages.
     * 
     * @param {string} pass - The password provided for the fund code, which is included in the form data.
     * 
     * @returns {void} This function does not return a value but performs state updates and triggers 
     *   backend requests as well as WebSocket communication.
     */
    const finalSubmitAds = async (pass: string) => {
        try {
            // Add the provided password to the form data
            finalFormData.fundcode = pass;
            // Check if the user is authenticated before proceeding
            if (status === 'authenticated') {
                // Encrypt the final form data
                const ciphertext = AES.encrypt(JSON.stringify(finalFormData), `${process.env.NEXT_PUBLIC_SECRET_PASSPHRASE}`).toString();
                let record = encodeURIComponent(ciphertext.toString());
                // Send the encrypted data to the backend API
                let responseData = await fetch(`${process.env.NEXT_PUBLIC_BASEURL}/p2p/updatemethod`, {
                    method: "POST",
                    headers: {
                        'Content-Type': 'application/json',
                        "Authorization": session?.user?.access_token
                    },
                    body: JSON.stringify(record)
                })

                let res = await responseData.json();
                // Handle success
                if (res?.data?.status === 200) {
                    props.getUserOrders();
                    setShow(false);
                    setActive(false);
                    setActive1(true);
                    // Send WebSocket message with order data
                    if (wbsocket) {
                        let orderData = {
                            ws_type: 'order',
                            orderid: orderDetail?.id
                        }
                        wbsocket.send(JSON.stringify(orderData));
                    }
                    if (Ref.current) clearInterval(Ref.current);
                }
                else {
                    toast.error(res?.data?.data, { autoClose: 2000 });
                    return;
                }
            }
            else {
                // Handle unauthenticated user
                toast.error('Unauthenticated User');
                signOut();
            }

        } catch (error) {

        }
    }

    return (
        <>
            <div className='p-[15px] md:p-[40px] md:pb-20 border dark:border-opacity-[15%] border-grey-v-1 rounded-10 mt-30'>
                {
                    orderDetail?.status !== 'isCanceled' &&
                    <>
                        <div className='border-b dark:border-opacity-[15%] border-grey-v-1 md:pb-30 pb-[15px] md:mb-30 mb-[15px]'>
                            <p className="text-[19px] md:text-[23px]  leading-7 font-medium   dark:!text-white  !text-h-primary">Remarks</p>
                        </div>


                        {orderDetail?.sell_user_id === session?.user?.user_id ?
                            <p className='sm-heading !text-banner-text mb-[15px] md:mb-[24px] dark:!text-grey-v-1'>You can pay me on my registered payment methods</p>
                            : <p className='sm-heading !text-banner-text mb-[15px] md:mb-[24px] dark:!text-grey-v-1'>You can pay me on above listed payment methods</p>}
                    </>
                }
                {

                    <p className='nav-text-sm mb-[15px] md:mb-[24px]'>{orderDetail?.user_post?.remarks ? orderDetail?.user_post?.remarks : `The exchange offers a seamless trading experience with intuitive navigation and quick transaction times. Highly recommend for both beginners and experienced traders!`}</p>
                }
                {
                    orderDetail?.status === 'isProcess' && query && query?.buy === orderDetail?.id &&
                    (orderDetail?.buy_user_id === session?.user?.user_id ?
                        <p className='dark:!text-[#96969A] !text-banner-text mb-20 sec-text'>Please complete your payment within <span className='dark:text-white text-black'>{timeLeft}</span> minutes you need to pay<span className='dark:text-white text-black'> {truncateNumber(orderDetail?.spend_amount, 6)} INR.</span></p>
                        :
                        <p className='dark:!text-[#96969A] !text-banner-text mb-20 sec-text'> Payment complete within <span className='dark:text-white text-black'>{timeLeft} </span> minutes</p>
                    )
                }
                {
                    orderDetail?.status === 'isCompleted' && query && query?.buy === orderDetail?.id &&

                    (orderDetail?.buy_user_id === session?.user?.user_id ?
                        <p className='dark:!text-[#96969A] !text-banner-text mb-20 sec-text'>The payment is done. Please wait for the seller to release the crypto</p>
                        :
                        <p className='dark:!text-[#96969A] !text-banner-text mb-20 sec-text'>The payment is done. Please release the crypto</p>
                    )
                }
                {
                    orderDetail?.status === 'isReleased' && query && query?.buy === orderDetail?.id &&
                    (orderDetail?.sell_user_id === session?.user?.user_id ?
                        <><p className='dark:!text-[#96969A] !text-banner-text mb-20 sec-text'>Order completed! You have released your coins. Your P2P order #{orderDetail?.id} has been successfully completed</p></>
                        : <p className='dark:!text-[#96969A] !text-banner-text mb-20 sec-text'>Order completed! Your P2P order #{orderDetail?.id} has been successfully completed. The assets have been transferred to your wallet.</p>)
                }
                {
                    orderDetail?.status === 'isCanceled' && query && query?.buy === orderDetail?.id &&
                    <>
                        <div className='inline-flex items-center gap-[7px] px-10 py-[8px] bg-[#FAFAFA] md:mb-30 mb-[15px] dark:bg-orange rounded-[4px]'>
                            <div className='min-w-[24px]'>
                                <IconsComponent type='infoIconRed' hover={false} active={false} />
                            </div>
                            <p className='text-[#DC2626] text-[14px] md:text-[18px]'>Unavailable to check the order has been canceled</p>
                        </div>
                        <p className='dark:!text-[#96969A] !text-banner-text mb-20 sec-text'>The order was canceled.</p>
                    </>
                }
                {
                    orderDetail?.status !== 'isCanceled' && query && query?.buy === orderDetail?.id &&
                    <p className='nav-text-sm'>
                        <span className='text-black dark:text-white'>Notice: </span>
                        Please don't leave sensitive information when transferring funds. By making a payment, you agree to our terms and conditions.
                    </p>

                }
                <div className='flex items-center sm:gap-30 gap-[15px] md:mt-50 mt-30 md:flex-row flex-col'>

                    {
                        (orderDetail?.status === 'isProcess' || orderDetail?.status === 'isCompleted') && orderDetail?.buy_user_id === session?.user?.user_id && query?.buy === orderDetail?.id &&
                        <button className={` w-full max-w-full md:max-w-[200px] rounded-10 info-16-18  bg-grey-v-2 !text-primary hover:!text-white hover:bg-primary-800 p-[15px] md:py-[19px] md:px-[18px]`} onClick={() => { setShow(true); setConfirmation(true) }}>
                            Cancel Order
                        </button>
                    }

                    {
                        orderDetail?.status === 'isCanceled' && query && query?.buy === orderDetail?.id &&
                        <button onClick={() => { router.push('/p2p/buy') }} className={`w-full max-w-[350px] rounded-10 info-16-18  bg-grey-v-2 !text-primary hover:!text-white hover:bg-primary-800 py-[19px] px-[18px]`}>
                            Go back and place another order
                        </button>
                    }

                    {
                        orderDetail?.status === 'isProcess' && query && query?.buy === orderDetail?.id && orderDetail?.buy_user_id === session?.user?.user_id &&
                        <button className='solid-button max-w-full sm:max-w-[220px] w-full' onClick={() => { updatePaymentMethod() }}>Mark as Paid</button>
                    }
                    {
                        orderDetail?.status === 'isCompleted' && query && query?.buy === orderDetail?.id && orderDetail?.buy_user_id === session?.user?.user_id &&
                        <button disabled className='solid-button max-w-full sm:max-w-[220px] w-full cursor-not-allowed'>I Have Paid</button>
                    }
                    {
                        orderDetail?.status === 'isProcess' && query && query?.buy === orderDetail?.id && orderDetail?.sell_user_id === session?.user?.user_id &&
                        <button className='solid-button max-w-fit  w-full' >Payment under process</button>
                    }
                    {
                        orderDetail?.status === 'isCompleted' && query && query?.buy === orderDetail?.id && orderDetail?.sell_user_id === session?.user?.user_id &&
                        <button className='solid-button max-w-full sm:max-w-[220px] w-full' onClick={() => { orderReleased() }}>Release Crypto</button>
                    }
                    {/* {
                        orderDetail?.status === 'isReleased' && orderDetail?.sell_user_id === session?.user?.user_id &&
                        <button disabled={true} className='solid-button max-w-full sm:max-w-[220px] w-full cursor-not-allowed'>Order Completed</button>
                    } */}

                </div>
            </div >

            {active &&
                <TradingPasswordAds setActive={setActive} setShow={setShow} show={show} finalSubmitAds={finalSubmitAds} />
            }
            {
                active1 &&
                <Successfull setShow={setShow} setActive1={setActive1} type="release" />
            }
            {
                confirmation &&
                <CancelOrder setShow={setShow} actionPerform={orderCancel} setEnable={setConfirmation} />
            }

        </>

    )
}

export default Remarks;