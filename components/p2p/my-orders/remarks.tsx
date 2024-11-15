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


interface propsData {
    paymentMethod: any;
    orderid?: any;
    userOrder?: any;
    getUserOrders?: any;
}

const Remarks = (props: propsData) => {


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

    useEffect(() => {
        if (query) {
            getOrderByOrderId(query?.buy, 'onload');
        }
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

    const getOrderByOrderId = async (orderid: any, type: string) => {
        let userOrder: any = await fetch(`${process.env.NEXT_PUBLIC_BASEURL}/p2p/order?orderid=${orderid}`, {
            method: "GET",
            headers: {
                "Authorization": session?.user?.access_token
            },
        }).then(response => response.json());
        setOrderDetail(userOrder?.data);
    }

    useEffect(() => {
        if (orderDetail?.status === 'isProcess') {
            orderTimeCalculation();

        }
    }, [query?.buy, orderDetail, wbsocket]);

    const orderTimeCalculation = async () => {
        let deadline = new Date(orderDetail?.createdAt);
        deadline.setMinutes(deadline.getMinutes() + 15);
        deadline.setSeconds(deadline.getSeconds() + 5);
        let currentTime = new Date();

        if (currentTime < deadline && orderDetail?.status === 'isProcess') {
            if (Ref.current) clearInterval(Ref.current);
            // console.log("in cancel 2");

            const timer = setInterval(() => {
                calculateTimeLeft(deadline);
            }, 1000);
            Ref.current = timer;
        }

        else if (currentTime > deadline && orderDetail?.status === 'isProcess') {
            // console.log("order cancel 1");

            // return;
            await orderCancel('auto');
        }
    }

    /**
     * calculate time left for order to payment pay by buyer
     * @param e 
     */
    const calculateTimeLeft = (e: any) => {
        // console.log(orderDetail?.status,"========= time update");
        let { total, minutes, seconds }
            = getTimeRemaining(e);

        if (total >= 0) {
            setTimer(
                (minutes > 9 ? minutes : '0' + minutes) + ':'
                + (seconds > 9 ? seconds : '0' + seconds)
            )
        }
        else {
            if (Ref.current) clearInterval(Ref.current);
            // console.log(orderDetail, "=orderDetail");

            if (orderDetail?.status === 'isProcess') {
                // return;
                orderCancel('auto');
            }

        }
    }

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
     * Update user payment after payment relaese by buyer
     * @returns 
     */
    const updatePaymentMethod = async () => {
        // console.log(orderDetail?.id,"=orderDetail?.id");

        if (props.paymentMethod === '') {
            toast.error('Please select one payment method');
            return;
        }

        let obj = {
            "order_id": orderDetail?.id,
            "p_method": props.paymentMethod,
            "user_id": session?.user?.user_id
        }

        if (status === 'authenticated') {
            if (Ref.current) clearInterval(Ref.current);
            const ciphertext = AES.encrypt(JSON.stringify(obj), `${process.env.NEXT_PUBLIC_SECRET_PASSPHRASE}`).toString();
            let record = encodeURIComponent(ciphertext.toString());

            let responseData = await fetch(`${process.env.NEXT_PUBLIC_BASEURL}/p2p/order`, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                    "Authorization": session?.user?.access_token
                },
                body: JSON.stringify(record)
            })


            let res = await responseData.json();
            if (res.data.status === 200) {
                // console.log("==here");

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
            toast.error('Unauthenticated User');
            signOut();
        }

    }

    /**
     * Order canceled by buyer or order canceled auto after time complete without paid payment
     * @returns 
     */
    const orderCancel = async (type: string) => {

        // console.log(orderDetail?.id,"=orderDetail?.id");
        
        let obj = {
            "order_id": orderDetail?.id,
            "user_id": orderDetail?.buy_user_id,
            "cancelType": type
        }

        if (status === 'authenticated') {
            const ciphertext = AES.encrypt(JSON.stringify(obj), `${process.env.NEXT_PUBLIC_SECRET_PASSPHRASE}`).toString();
            let record = encodeURIComponent(ciphertext.toString());

            let responseData = await fetch(`${process.env.NEXT_PUBLIC_BASEURL}/p2p/order`, {
                method: "PUT",
                headers: {
                    'Content-Type': 'application/json',
                    "Authorization": session?.user?.access_token
                },
                body: JSON.stringify(record)
            })

            let res = await responseData.json();

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
     * Order relaesed by seller
     * @returns 
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


    const finalSubmitAds = async (pass: string) => {
        try {

            finalFormData.fundcode = pass;


            if (status === 'authenticated') {
                const ciphertext = AES.encrypt(JSON.stringify(finalFormData), `${process.env.NEXT_PUBLIC_SECRET_PASSPHRASE}`).toString();
                let record = encodeURIComponent(ciphertext.toString());

                let responseData = await fetch(`${process.env.NEXT_PUBLIC_BASEURL}/p2p/updatemethod`, {
                    method: "POST",
                    headers: {
                        'Content-Type': 'application/json',
                        "Authorization": session?.user?.access_token
                    },
                    body: JSON.stringify(record)
                })

                let res = await responseData.json();

                if (res?.data?.status === 200) {
                    props.getUserOrders();
                    setShow(false);
                    setActive(false);
                    setActive1(true);
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
                <TradingPasswordAds setActive={setActive} setShow={setShow} show={show} finalSubmitAds={finalSubmitAds} session={session}/>
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