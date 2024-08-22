import IconsComponent from '@/components/snippets/icons';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import React, { Fragment, useEffect, useRef, useState } from 'react';
import AES from 'crypto-js/aes';
import { toast } from 'react-toastify';
import { useWebSocket } from '@/libs/WebSocketContext';
import { useRouter } from 'next/router';

interface PropsData {
    sellerUser?: any;
    order?: any;
}
interface ChatMessage {
    from: string;
    to: string;
    message: string;
    createdAt: string;
}

interface GroupedMessages {
    [date: string]: ChatMessage[];
}

const ChatBox = (props: PropsData) => {
    const [show, setShow] = useState(false);
    const [orderChat, setOrderChat] = useState<any[]>([]);
    const [message, setMessage] = useState('');
    const [groupedMessages, setGroupedMessages] = useState<GroupedMessages>({});
    const { status, data: session } = useSession();
    const [enableFront, setEnableFront] = useState(false);
    const wbsocket = useWebSocket();
    const [isFileLoad, setIsFileLoad] = useState(false);

    const socketListenerRef = useRef<(event: MessageEvent) => void>();
    const [shownNotifications, setShownNotifications] = useState(new Set());
    const chatFeedRef = useRef<HTMLDivElement>(null);

    const [orderDetail, setOrderDetail] = useState<any>({});
    const [sellerUser, setSellerUser] = useState<any>({});
    const router = useRouter();
    const { query } = router;

    useEffect(() => {
        if (query) {
            getOrderByOrderId(query?.buy, 'onload');
            getChatByOrderId();
        }
        const handleSocketMessage = (event: any) => {
            const data = JSON.parse(event.data).data;
            let eventDataType = JSON.parse(event.data).type;
            if (eventDataType === "order") {
                getOrderByOrderId(query && query?.buy, 'socket');
            }

            if (eventDataType === 'chat' && data[0]?.orderid === query?.buy) {
                if (shownNotifications.has(data[0]?.orderid)) {
                    return;
                }
                setOrderChat(data[0].chat);
                groupMessages(data[0].chat);
                setShownNotifications((prev) => new Set(prev).add(data[0]?.orderid));
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
        setSellerUser(userOrder?.data?.user_post?.user?.id === session?.user?.user_id ? userOrder?.data?.user : userOrder?.data?.user_post?.user)
    }

    useEffect(() => {
        if (chatFeedRef.current) {
          chatFeedRef.current.scrollTop = chatFeedRef.current.scrollHeight;
        }
      }, [orderChat]);

    const getChatByOrderId = async () => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_BASEURL}/p2p/chat?orderid=${query && query?.buy}`, {
                method: 'GET',
                headers: {
                    'Authorization': session?.user?.access_token
                },
            });
            const orderChat = await response.json();
            setOrderChat(orderChat?.data[0]?.chat || []);
            groupMessages(orderChat?.data[0]?.chat || []);


        } catch (error) {
            console.error(error);
        }
    };

    const groupMessages = (messages: ChatMessage[]) => {
        const grouped: GroupedMessages = {};
        const todayDate = new Date().toDateString();

        messages.forEach((message) => {
            const createdAt = new Date(message.createdAt).toDateString();
            let date = createdAt === 'Invalid Date' ? todayDate : createdAt;
            if (date === todayDate) {
                date = 'Today';
            }
            if (!grouped[date]) {
                grouped[date] = [];
            }
            grouped[date].push(message);
        });

        const sortedGrouped = Object.keys(grouped)
            .sort((a, b) => (a === 'Today' ? 1 : b === 'Today' ? -1 : new Date(a).getTime() - new Date(b).getTime()))
            .reduce((acc, key) => {
                acc[key] = grouped[key];
                return acc;
            }, {} as GroupedMessages);

        setGroupedMessages(sortedGrouped);
    };

    const sendMessage = async (msg: string) => {
        try {
            if (msg !== '') {
                const obj = {
                    post_id: orderDetail?.post_id,
                    sell_user_id: orderDetail?.sell_user_id,
                    buy_user_id: orderDetail?.buy_user_id,
                    from: session?.user?.user_id,
                    to: sellerUser?.id,
                    orderid: orderDetail?.id,
                    chat: msg
                };

                const ciphertext = AES.encrypt(JSON.stringify(obj), `${process.env.NEXT_PUBLIC_SECRET_PASSPHRASE}`).toString();
                const record = encodeURIComponent(ciphertext);

                const response = await fetch(`${process.env.NEXT_PUBLIC_BASEURL}/p2p/chat`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': session?.user?.access_token
                    },
                    body: JSON.stringify(record)
                });

                const res = await response.json();

                if (res.data.status === 200) {
                    setMessage('');
                    setIsFileLoad(false);
                    groupMessages(res?.data?.data?.result?.chat);
                    if (wbsocket) {
                        const chat = {
                            ws_type: 'chat',
                            orderid: orderDetail?.id
                        };
                        const chat_notify = {
                            ws_type: 'user_notify',
                            user_id: sellerUser?.id,
                            type: 'chat',
                            message: {
                                message: `${msg}`
                            },
                            url: `/p2p/my-orders?buy=${orderDetail?.id}`
                        };

                        wbsocket.send(JSON.stringify(chat));
                        wbsocket.send(JSON.stringify(chat_notify));
                    }
                }
            }
        } catch (error) {
            console.error(error);
        }
    };

    const handleFileChange = async (e: any) => {
        try {
            const file = e.target.files[0];
            const fileSize = file.size / 1024 / 1024;

            if (fileSize > 2) {
                toast.warning('Upload file upto 2 mb');
                return;
            }

            const formData = new FormData();
            formData.append('file', file);
            formData.append('upload_preset', 'my-uploads');
            setEnableFront(true);

            const data = await fetch(`${process.env.NEXT_PUBLIC_FILEUPLOAD_URL}`, {
                method: 'POST',
                body: formData
            }).then((r) => r.json());

            if (data.error) {
                setEnableFront(false);
                toast.error(data.error.message);
                return;
            }

            if (data.format === 'pdf') {
                setEnableFront(false);
                toast.error('Unsupported PDF file');
                return;
            }
            setIsFileLoad(true);
            setMessage(data.secure_url);
            // sendMessage(data.secure_url);
            setEnableFront(false);
        } catch (error) {
            console.error(error);
        }
    };

    const handleKeyDown = (event: any) => {
        if (event.key === 'Enter') {
            sendMessage(message);
        }
    };
    
    
    const profileImg = sellerUser?.profile?.image ?? `${process.env.NEXT_PUBLIC_AVATAR_PROFILE}`;

    return (
        <>
            <div className={`bg-black z-[8] duration-300 fixed top-0 left-0 h-full w-full  ${show ? 'opacity-80 visible' : 'opacity-0 invisible'}`} onClick={() => setShow(!show)}></div>
            <div className={`${show ? 'max-[1200px]:opacity-1 max-[1200px]:visible' : 'max-[1200px]:opacity-0 max-[1200px]:invisible'} duration-300 max-w-[25%] w-full max-[1200px]:z-[8] max-[1200px]:max-w-[345px] max-[1200px]:bottom-[105px] max-[1200px]:left-[50%] max-[1200px]:translate-x-[-50%] max-[1200px]:fixed rounded-[10px] overflow-hidden dark:bg-black-v-1 bg-[#F9FAFA] border dark:border-opacity-[15%] border-grey-v-1`}>
                <div className="flex items-center gap-[10px] grow-[1.6] p-[14px] pb-[30px] dark:bg-[url(/assets/order/chat-head-bg-dark.png)] bg-[url(/assets/order/chat-head-bg.png)] no-reapeat bg-cover bg-bottom">
                    <div className="w-[36px] h-[36px] rounded-full bg-[#e8f6f7] dark:bg-[#8ed0d9] border border-white flex relative">
                        <Image src={profileImg} alt="error" width={36} height={36} className="rounded-full object-cover object-top w-full h-full block" />
                        <div className="absolute bottom-0 right-[-5px] w-[13px] h-[13px]">
                            <IconsComponent type="activeStatus" hover={false} active={false} />
                        </div>
                    </div>
                    <div>
                        <p className="info-14 !text-start !text-white">{sellerUser?.profile?.fName || sellerUser?.user_kyc?.fname || sellerUser?.profile?.dName}</p>
                        <p className="info-12 !text-start !text-white">Online</p>
                    </div>
                </div>
                <div id="chat-feed" ref={chatFeedRef} className="p-[14px] max-h-[300px] h-full overflow-x-auto flex flex-col gap-[10px] chatContainor  scroll-smooth">

                    {(orderDetail?.user_post && orderDetail?.user_post?.auto_reply !== "" && orderDetail?.user_post?.auto_reply !== null) &&
                        <div className={`gap-[4px] ${session?.user?.user_id == orderDetail?.sell_user_id ? 'right' : 'left'}`} >
                            <div className="mt-[4px] p-[10px] ml-[auto] rounded-lg min-w-[60px] max-w-fit w-full dark:bg-[#232530] bg-primary-600 bottom-right">
                                <p className="info-12 text-white">{orderDetail?.user_post?.auto_reply}</p>
                            </div>
                        </div>
                    }

                    {Object.entries(groupedMessages).map(([date, messages]) => (
                        <React.Fragment key={date}>
                            <div className='relative mb-2'>
                                <div className="border-t-2 dark:border-opacity-[15%] border-grey-v-1"></div>
                                <p className="nav-text-sm  dark:bg-black-v-1 bg-[#F9FAFA] dark:text-white z-[2] left-[50%] px-[6px] -translate-x-1/2 top-[50%] -translate-y-1/2 absolute">{date !== 'Invalid Date' ? date : 'Today'}</p>
                            </div>

                            <div>
                                {messages && messages?.map((item: any,index:number) => (
                                    <Fragment key={index}>
                                        <div key={item.id} className={item.from !== session?.user?.user_id ? 'left gap-[4px] mb-2' : 'right flex items-start gap-[4px] mb-2'}>
                                            <div className="mt-[4px] p-[10px] ml-[auto] rounded-[6px] min-w-[60px] max-w-fit w-full dark:bg-[#232530] bg-primary-600 bottom-right">
                                                {item.message.includes('https://') ? (
                                                    <Image src={item.message} alt="error" width={100} height={100} />
                                                ) : (
                                                    <p className="info-12 text-white">{item.message}</p>
                                                )}
                                            </div>
                                        </div>
                                    </Fragment>
                                ))}
                            </div>
                        </React.Fragment>
                    ))}
                </div>
                <div className="border-t border-[#cccccc7d] p-[16px] py-[24px] dark:bg-omega">
                    <div className="flex items-center gap-[15px] justify-between">
                        {isFileLoad === true ? <Image src={message} alt='' height={50} width={50} /> :
                            <input
                                type="text"
                                onChange={(e) => setMessage(e.target.value)}
                                onKeyDown={handleKeyDown}
                                value={message}
                                className="border-0 w-full outline-none info-12 dark:!bg-omega !bg-[#F9FAFA] dark:!text-white !text-black"
                                placeholder="Input message..."
                            />
                        }
                        <div className='flex gap-2'>
                            <div>
                                <input type="file" className="hidden" id="fileUpload" onChange={handleFileChange} />
                                <label htmlFor="fileUpload" className="cursor-pointer group">
                                    <IconsComponent type="fileUpload" hover={false} active={false} />
                                </label>
                            </div>
                            <button className="cta group" onClick={() => sendMessage(message)}>
                                <IconsComponent type="sendIcon" hover={true} active={message !== ''} />
                            </button>
                        </div>

                    </div>
                </div>
            </div>
            <div
                className="max-[1200px]:block hidden fixed bottom-[15px] z-[9] translate-y-[-50%] right-[10px] rounded-[8px] bg-primary-400 flex w-[50px] h-[50px] p-[10px] cursor-pointer"
                onClick={() => setShow(!show)}
            >
                {show ? <IconsComponent type="Whiteclose" hover={false} active={false} /> : <IconsComponent type="chatIcon" hover={false} active={false} />}
            </div>
        </>
    );
};

export default ChatBox;
