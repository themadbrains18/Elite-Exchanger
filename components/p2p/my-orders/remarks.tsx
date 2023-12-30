import IconsComponent from '@/components/snippets/icons';
import React, { useEffect, useRef, useState } from 'react';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AES from 'crypto-js/aes';
import { signOut, useSession } from 'next-auth/react';

interface propsData {
    paymentMethod: any;
    orderid?: any;
    userOrder?: any;
    getUserOrders?: any;
}

const Remarks = (props: propsData) => {

    const [timeLeft, setTimer] = useState('');

    const { status, data: session } = useSession();

    const Ref: any = useRef(null);

    console.log(props.userOrder,'=========user order==========');
    

    useEffect(() => {

        const websocket = new WebSocket('ws://localhost:3001/');

        websocket.onopen = () => {
            console.log('connected');
        }

        orderTimeCalculation();

    }, [props?.orderid]);

    const orderTimeCalculation = async () => {
        let deadline = new Date(props.userOrder?.createdAt);
        deadline.setMinutes(deadline.getMinutes() + 15);
        deadline.setSeconds(deadline.getSeconds() + 5);
        let currentTime = new Date();
        if (currentTime < deadline && props.userOrder?.status === 'isProcess') {
            if (Ref.current) clearInterval(Ref.current);
            const timer = setInterval(() => {
                calculateTimeLeft(deadline);
            }, 1000);
            Ref.current = timer;
        }
        else if (currentTime > deadline && props.userOrder?.status === 'isProcess') {
            await orderCancel();
        }
    }


    /**
     * calculate time left for order to payment pay by buyer
     * @param e 
     */
    const calculateTimeLeft = (e: any) => {
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
            if (props.userOrder?.status === 'isProcess') {
                orderCancel();
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

        if (props.paymentMethod === '') {
            toast.error('Please select one payment method');
            return;
        }

        let obj = {
            "order_id": props.orderid,
            "p_method": props.paymentMethod
        }

        if (status === 'authenticated') {
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
                props.getUserOrders();
                const websocket = new WebSocket('ws://localhost:3001/');
                let orderData = {
                    ws_type: 'order',
                    orderid: props.orderid
                }
                websocket.onopen = () => {
                    websocket.send(JSON.stringify(orderData));
                }
                if (Ref.current) clearInterval(Ref.current);
                toast.success('Thanks for payment. Receiver release assets in short time.');
            }
            else {
                toast.error(res.data.data);
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
    const orderCancel = async () => {


        let obj = {
            "order_id": props.orderid,
            "user_id": props.userOrder?.buy_user_id
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
                const websocket = new WebSocket('ws://localhost:3001/');
                let orderData = {
                    ws_type: 'order',
                    orderid: props.orderid
                }
                websocket.onopen = () => {
                    websocket.send(JSON.stringify(orderData));
                }
                // toast.success(res.data.message);
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
            "order_id": props.orderid,
            "user_id": session?.user?.user_id,
            "fundcode": '123456'
        }

        if (status === 'authenticated') {
            const ciphertext = AES.encrypt(JSON.stringify(obj), `${process.env.NEXT_PUBLIC_SECRET_PASSPHRASE}`).toString();
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
                const websocket = new WebSocket('ws://localhost:3001/');
                let orderData = {
                    ws_type: 'order',
                    orderid: props.orderid
                }
                websocket.onopen = () => {
                    websocket.send(JSON.stringify(orderData));
                }
                toast.success(res?.data?.data?.message);
                if (Ref.current) clearInterval(Ref.current);
            }
            else {
                toast.error(res?.data?.data);
                return;
            }
        }
        else {
            toast.error('Unauthenticated User');
            signOut();
        }
    }

    return (
        <>
            <ToastContainer />
            <div className='p-[15px] md:p-[40px] md:pb-20 border dark:border-opacity-[15%] border-grey-v-1 rounded-10 mt-30'>
                {
                    props.userOrder?.status !== 'isCanceled' &&
                    <>
                        <div className='border-b dark:border-opacity-[15%] border-grey-v-1 md:pb-30 pb-[15px] md:mb-30 mb-[15px]'>
                            <p className="text-[19px] md:text-[23px]  leading-7 font-medium   dark:!text-white  !text-h-primary">Remarks</p>
                        </div>
                        <p className='sm-heading !text-banner-text mb-[15px] md:mb-[24px] dark:!text-grey-v-1'>You Can Pay Me On ( Paytm / Phone pe / Google pay )</p>
                        <p className='nav-text-sm md:mb-30 mb-20'>
                            But I must explain to you how all this mistaken
                            idea of denouncing pleasure and praising pain was
                            born and I will give you a complete account of the
                            system, and expound the actual teachings of the great
                            explorer of the truth, the master-builder of human happiness.
                            No one rejects, dislikes, or avoids pleasure itself, because
                            it is pleasure, but because those who do not know how to pursue
                            pleasure rationally encounter consequences that are extremely painful.
                        </p>
                    </>
                }
                {
                    props.userOrder?.status === 'isProcess' &&
                    <p className='dark:!text-[#96969A] !text-banner-text mb-20 sec-text'>Please Complete Your Payment within <span className='dark:text-white text-black'>{timeLeft}</span> you need to pay<span className='dark:text-white text-black'> {props?.userOrder?.spend_amount} INR.</span></p>
                }
                {
                    props.userOrder?.status === 'isCompleted' &&
                    <p className='dark:!text-[#96969A] !text-banner-text mb-20 sec-text'>The Payment is done. Please wait for the seller to release the crypto</p>
                }
                {
                    props.userOrder?.status === 'isReleased' &&
                    <p className='dark:!text-[#96969A] !text-banner-text mb-20 sec-text'>The seller has release the crypto please not to check.</p>
                }
                {
                    props.userOrder?.status === 'isCanceled' &&
                    <>
                        <div className='inline-flex items-center gap-[7px] px-10 py-[8px] bg-[#FAFAFA] md:mb-30 mb-[15px] dark:bg-orange rounded-[4px]'>
                            <div className='min-w-[24px]'>
                                <IconsComponent type='infoIconRed' hover={false} active={false} />
                            </div>
                            <p className='text-[#DC2626] text-[14px] md:text-[18px]'>Unavailable to Check The Order Has Been Canceled</p>
                        </div>
                        <p className='dark:!text-[#96969A] !text-banner-text mb-20 sec-text'>The Order Was Canceled.</p>
                    </>
                }

                {
                    props.userOrder?.status !== 'isCanceled' &&
                    <p className='nav-text-sm'>
                        <span className='text-black dark:text-white'>Notice: </span>
                        Please Do Not leave sensitive character while transferring funds
                        paying means you agree to our terms and conditions
                    </p>

                }
                <div className='flex items-center sm:gap-30 gap-[15px] md:mt-50 mt-30 md:flex-row flex-col'>

                    {
                        (props.userOrder?.status === 'isProcess' || props.userOrder?.status === 'isCompleted') && props.userOrder?.buy_user_id === session?.user?.user_id &&
                        <button className={`solid-button2 max-w-full sm:max-w-[220px] w-full `} onClick={() => { orderCancel() }}>
                            Cancel Order
                        </button>
                    }

                    {
                        props.userOrder?.status === 'isCanceled' &&
                        < button className={`solid-button2 max-w-full sm:max-w-[220px] w-full cursor-auto`}>
                            Order Cancelled
                        </button>
                    }

                    {
                        props.userOrder?.status === 'isProcess' && props.userOrder?.buy_user_id === session?.user?.user_id &&
                        <button className='solid-button max-w-full sm:max-w-[220px] w-full' onClick={() => { updatePaymentMethod() }}>Mark as Paid</button>
                    }
                    {
                        props.userOrder?.status === 'isCompleted' && props.userOrder?.buy_user_id === session?.user?.user_id &&
                        <button className='solid-button max-w-full sm:max-w-[220px] w-full'>I Have Paid</button>
                    }
                    {
                        props.userOrder?.status === 'isProcess' && props.userOrder?.sell_user_id === session?.user?.user_id &&
                        <button className='solid-button max-w-full sm:max-w-[220px] w-full' >Payment under process</button>
                    }
                    {
                        props.userOrder?.status === 'isCompleted' && props.userOrder?.sell_user_id === session?.user?.user_id &&
                        <button className='solid-button max-w-full sm:max-w-[220px] w-full' onClick={() => { orderReleased() }}>Release Crypto</button>
                    }
                    {
                        props.userOrder?.status === 'isReleased' &&
                        <button className='solid-button max-w-full sm:max-w-[220px] w-full cursor-auto'>Order Completed</button>
                    }

                </div>
            </div >
        </>

    )
}

export default Remarks;