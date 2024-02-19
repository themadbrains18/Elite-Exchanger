import IconsComponent from '@/components/snippets/icons';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import React, { useEffect, useState } from 'react'
import AES from 'crypto-js/aes';

interface propsData {
    sellerUser?: any;
    order?: any;
}

const ChatBox = (props: propsData) => {
    const [show, setShow] = useState(false)
    const [orderChat, setOrderChat] = useState([]);
    const [message, setMessage] = useState('');

    const { status, data: session } = useSession();

    useEffect(() => {
        getChatByOrderId();

        const websocket = new WebSocket('ws://localhost:3001/');

        websocket.onopen = () => {
            console.log('connected');
        }

        websocket.onmessage = (event) => {
            const data = JSON.parse(event.data).data;
            let eventDataType = JSON.parse(event.data).type;
            if (eventDataType === "chat") {
                if (data[0]?.orderid === props?.order?.id) {
                    setOrderChat(data[0].chat);
                    const el = document.getElementById('chat-feed');
                    if (el) {
                        el.scrollTop = el.scrollHeight;
                    }
                }
            }
        }
    }, [props.order?.id]);

    const getChatByOrderId = async () => {
        try {
            let orderChat = await fetch(`${process.env.NEXT_PUBLIC_BASEURL}/p2p/chat?orderid=${props?.order?.id}`, {
                method: "GET",
                headers: {
                    "Authorization": session?.user?.access_token
                },
            }).then(response => response.json());

            setOrderChat(orderChat?.data[0]?.chat);
            const el = document.getElementById('chat-feed');
            if (el) {
                el.scrollTop = el.scrollHeight;
            }

        } catch (error) {
            console.log(error);

        }
    }

    const sendMessage = async () => {
        try {
            let obj = {
                "post_id": props.order?.post_id,
                "sell_user_id": props.order?.sell_user_id,
                "buy_user_id": props.order?.buy_user_id,
                "from": session?.user?.user_id,
                "to": props?.sellerUser?.id,
                "orderid": props.order?.id,
                "chat": message
            }

            if (message !== '') {
                const ciphertext = AES.encrypt(JSON.stringify(obj), `${process.env.NEXT_PUBLIC_SECRET_PASSPHRASE}`).toString();
                let record = encodeURIComponent(ciphertext.toString());

                let responseData = await fetch(`${process.env.NEXT_PUBLIC_BASEURL}/p2p/chat`, {
                    method: "POST",
                    headers: {
                        'Content-Type': 'application/json',
                        "Authorization": session?.user?.access_token
                    },
                    body: JSON.stringify(record)
                })

                let res = await responseData.json();

                if (res.data.status === 200) {
                    setMessage('');
                    const websocket = new WebSocket('ws://localhost:3001/');
                    let chat = {
                        ws_type: 'chat',
                        orderid: props?.order?.id
                    }

                    let chat_notify = {
                        ws_type: 'user_notify',
                        user_id: props?.sellerUser?.id,
                        type: 'chat',
                        message: {
                            message: `${message}`
                        },
                        url : `/p2p/my-orders?buy=${props?.order?.id}`
                    }

                    websocket.onopen = () => {
                        websocket.send(JSON.stringify(chat));
                        websocket.send(JSON.stringify(chat_notify));
                    }
                }
            }

        } catch (error) {

        }

    }

    const profileImg = props?.sellerUser?.profile && props?.sellerUser?.profile?.image !== null ? props?.sellerUser?.profile?.image : `/assets/orders/user.png`;

    return (
        <>
            <div className={`bg-black  z-[8] duration-300 fixed top-0 left-0 h-full w-full ${show ? "opacity-80 visible" : "opacity-0 invisible"}`}></div>

            <div className={`${show == true ? 'max-[1200px]:opacity-1 max-[1200px]:visible' : 'max-[1200px]:opacity-0 max-[1200px]:invisible'} duration-300 max-w-[25%] w-full  max-[1200px]:z-[8] max-[1200px]:max-w-[345px] max-[1200px]:bottom-[105px] max-[1200px]:left-[50%] max-[1200px]:translate-x-[-50%]  max-[1200px]:fixed rounded-[10px] overflow-hidden dark:bg-black-v-1 bg-[#F9FAFA] border dark:border-opacity-[15%] border-grey-v-1 `}>

                {/* about user */}
                <div className="flex items-center gap-[20px] grow-[1.6] p-[14px] pb-[30px] dark:bg-[url(/assets/order/chat-head-bg-dark.png)]  bg-[url(/assets/order/chat-head-bg.png)] no-reapeat bg-cover bg-bottom">
                    <div className="w-[44px] h-[44px] rounded-full bg-[#e8f6f7] dark:bg-[#8ed0d9] border border-white flex relative">
                        <Image src={profileImg} alt='error' width={44} height={44} className="rounded-full" />
                        <div className='absolute bottom-0 right-[-5px]'>
                            <IconsComponent type='activeStatus' hover={false} active={false} />
                        </div>
                    </div>
                    <div className="">
                        <p className="info-14 !text-start !text-white">{props?.sellerUser?.profile?.fName !== undefined ? props?.sellerUser?.profile?.dName : props?.sellerUser?.user_kyc?.fname}</p>
                        <p className="info-12 !text-start !text-white">Online</p>
                    </div>
                </div>
                {/* chat component */}

                <div id='chat-feed' className="p-[14px] max-h-[300px] h-full overflow-x-auto flex flex-col	gap-[10px] chatContainor  relative scroll-smooth" >
                    <div className='border-t  dark:border-opacity-[15%] border-grey-v-1'></div>
                    <p className='nav-text-sm absolute top-[4px] dark:bg-black-v-1  bg-[#F9FAFA] dark:text-white  z-[2] left-[50%] translate-x-[-50%]'>Today</p>
                    <div>
                        {orderChat && orderChat.map((item: any) => {
                            if (item?.from === session?.user?.user_id) {
                                return <div className="left gap-[4px]">
                                    <div className="mt-[4px] p-[10px] ml-[auto] rounded-lg min-w-[60px] max-w-fit w-full dark:bg-[#232530] bg-primary-600 bottom-right">
                                        <p className="info-12 text-white ">{item?.message}</p>
                                    </div>
                                </div>
                            }
                            else {
                                return <div className="right flex items-start gap-[4px]">
                                    {/* <div>
                                        <Image src="/assets/order/user.png" alt='error' width={20} height={20} />
                                    </div> */}
                                    <div>
                                        <div className="mt-[4px] mr-[auto] p-[10px] rounded-lg min-w-[60px] max-w-fit w-full dark:bg-omega bg-[#F1F2F4] bottom-left">
                                            <p className="info-12 dark:text-white text-[#232530]">{item?.message}</p>
                                        </div>
                                    </div>
                                </div>
                            }
                        })}


                    </div>
                </div>

                {/* send messsage */}
                <div className="border-t border-[#cccccc7d] p-[16px] py-[24px] dark:bg-omega">
                    <div className="flex items-center gap-[15px]">
                        <input type="text" onChange={(e) => setMessage(e.target?.value)} value={message} className="border-0 w-full outline-none info-12 dark:!bg-omega !bg-[#F9FAFA] dark:!text-white !text-black" placeholder="input messsage..." />
                        {/* <div>
                            <input type="file" className="hidden" id="fileUpload" />
                            <label htmlFor="fileUpload" className="cursor-pointer" >
                                <IconsComponent type='fileUpload' hover={false} active={false} />
                            </label>
                        </div>
                        <IconsComponent type='emojiIcon' hover={false} active={false} /> */}
                        <button className="cta" onClick={sendMessage}>
                            <IconsComponent type='sendIcon' hover={false} active={false} />
                        </button>
                    </div>
                </div>
            </div>
            <div className='max-[1200px]:block hidden fixed bottom-[15px] z-[7] translate-y-[-50%] right-[10px] z-[8] rounded-[8px] bg-primary-400 flex w-[50px] h-[50px] p-[10px] cursor-pointer' onClick={() => { setShow(!show) }}>
                {
                    show === true ?

                        <IconsComponent type='Whiteclose' hover={false} active={false} />
                        :
                        <IconsComponent type='chatIcon' hover={false} active={false} />
                }
            </div>
        </>
    )
}

export default ChatBox;