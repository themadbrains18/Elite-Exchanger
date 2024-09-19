import IconsComponent from '@/components/snippets/icons';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import React, { useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ConfirmationModel from '@/components/snippets/confirmation';
import moment from 'moment';
import { AES } from 'crypto-js';
import { useWebSocket } from '@/libs/WebSocketContext';
import { currencyFormatter } from '@/components/snippets/market/buySellCard';
import { useRouter } from 'next/router';

interface propsData {
    openOrders?: any;
}

const OpenOrderTable = (props: propsData) => {

    const { status, data: session } = useSession();
    const [active, setActive] = useState(false);
    const [show, setShow] = useState(false);
    const [positionId, setPositionId] = useState('');

    const wbsocket = useWebSocket();

    const closeOpenOrder = async (id: string) => {
        setPositionId(id);
        setActive(true);
        setShow(true);
    }

    const actionPerform = async () => {
        try {
            let obj = { "id": positionId };
            const ciphertext = AES.encrypt(
                JSON.stringify(obj),
                `${process.env.NEXT_PUBLIC_SECRET_PASSPHRASE}`
            );
            let record = encodeURIComponent(ciphertext.toString());
    
            let closeReponse = await fetch(`${process.env.NEXT_PUBLIC_BASEURL}/future/closeopenorder`, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                    "Authorization": session?.user?.access_token
                },
                body: JSON.stringify(record)
            }).then(response => response.json());
    
            if (closeReponse?.data?.status !== 200) {
                toast.error(closeReponse?.data?.message);
            }
            else {
                if (wbsocket) {
                    let position = {
                        ws_type: 'position'
                    }
                    wbsocket.send(JSON.stringify(position));
                }
                toast.success(closeReponse?.data?.message);
                setPositionId('');
                setActive(false);
                setShow(false);
            }
            
        } catch (error) {
            console.log(error,"==error");
            
        }
    }


    const router = useRouter();
    const { slug } = router.query;

    // console.log(props?.openOrders,"======props?.openOrders");
    

    return (
        <>
            <div className="overflow-x-auto h-[234px] ">
                <table width="100%" className="min-w-[1200px] w-full">
                    <thead>
                        {/* sticky top-0 bg-[#fafafa] dark:bg-[#1a1b1f] */}
                        <tr className="border-b border-t border-grey-v-3 dark:border-opacity-[15%] ">
                            <th className="py-[10px]">
                                <div className="flex ">
                                    <p className="text-start top-label dark:text-gamma">Date/Time</p>
                                    <Image src="/assets/history/uparrow.svg" width={15} height={15} alt="uparrow" />
                                </div>
                            </th>
                            <th className="py-[10px]">
                                <div className="flex ">
                                    <p className="text-start top-label dark:text-gamma">Symbol</p>
                                    <Image src="/assets/history/uparrow.svg" width={15} height={15} alt="uparrow" />
                                </div>
                            </th>
                            <th className="py-[10px]">
                                <div className="flex ">
                                    <p className="text-start top-label dark:text-gamma">Qty</p>
                                    <Image src="/assets/history/uparrow.svg" width={15} height={15} alt="uparrow" />
                                </div>
                            </th>
                            <th className="py-[10px]">
                                <div className="flex ">
                                    <p className="text-start top-label dark:text-gamma">Trade Type</p>
                                    <Image src="/assets/history/uparrow.svg" width={15} height={15} alt="uparrow" />
                                </div>
                            </th>
                            <th className="py-[10px]">
                                <div className="flex ">
                                    <p className="text-start top-label dark:text-gamma">Side</p>
                                    <Image src="/assets/history/uparrow.svg" width={15} height={15} alt="uparrow" />
                                </div>
                            </th>
                            <th className="py-[10px]">
                                <div className="flex ">
                                    <p className="text-start top-label dark:text-gamma">Entry Price</p>
                                    <Image src="/assets/history/uparrow.svg" width={15} height={15} alt="uparrow" />
                                </div>
                            </th>
                            <th className="py-[10px]">
                                <div className="flex ">
                                    <p className="text-start top-label dark:text-gamma">Amount</p>
                                    <Image src="/assets/history/uparrow.svg" width={15} height={15} alt="uparrow" />
                                </div>
                            </th>
                            
                            <th className="py-[10px]">
                                <div className="flex ">
                                    <p className="  top-label dark:!text-[#cccc56] !font-[600]">Close All Positions</p>
                                </div>
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            session && props?.openOrders && props?.openOrders.length > 0 && props?.openOrders?.filter((item: any) => item?.symbol === slug)?.map((item: any, index: number) => {
                                return (
                                    <tr key={index}>
                                        <td className='border-b border-t border-grey-v-3 dark:border-opacity-[15%]'>
                                            <p className="top-label !font-[600] dark:!text-white !text-black">{moment(item?.time).format("YYYY-MM-DD HH:mm:ss")}</p>
                                        </td>
                                        <td className='border-b border-t border-grey-v-3 dark:border-opacity-[15%]'>
                                            <div>
                                                <p className="info-14 !text-[12px] dark:text-white">{item?.symbol}</p>
                                                <p className="top-label">Perpetual</p>
                                            </div>
                                        </td>
                                        <td className='border-b border-t border-grey-v-3 dark:border-opacity-[15%]'>
                                            <p className="top-label !font-[600] dark:!text-white !text-black">{item?.qty > 0 ? item?.qty?.toFixed(5) : item?.qty?.toFixed(2)}</p>
                                        </td>
                                        <td className='border-b border-t border-grey-v-3 dark:border-opacity-[15%]'>
                                            <p className="top-label !font-[600] dark:!text-white !text-black">{item?.type}</p>
                                        </td>
                                        <td className='border-b border-t border-grey-v-3 dark:border-opacity-[15%]'>
                                            <p className={`top-label !font-[600]  ${item?.side === 'open long' ? '!text-buy' : '!text-sell'}`}>{item?.side}</p>
                                        </td>
                                        <td className='border-b border-t border-grey-v-3 dark:border-opacity-[15%]'>
                                            <p className="top-label !font-[600] dark:!text-white !text-black">{currencyFormatter(item?.price_usdt)}</p>
                                        </td>
                                        <td className='border-b border-t border-grey-v-3 dark:border-opacity-[15%]'>
                                            <p className="top-label !font-[600] dark:!text-white !text-black">{currencyFormatter(item?.amount)}</p>
                                        </td>
                                        
                                        <td className='border-b border-t border-grey-v-3 dark:border-opacity-[15%]'>
                                            <div className='cursor-pointer' onClick={() => { closeOpenOrder(item?.id) }}>
                                                
                                                <p className="top-label dark:!text-[#cccc56] !font-[600] pr-[20px]">Close Position</p>
                                            </div>
                                        </td>
                                    </tr>
                                )
                            })
                        }
                    </tbody>
                </table>
            </div>
            {active === true &&
                <ConfirmationModel setActive={setActive} setShow={setShow} title='Close Position' message='Please confirm to close this open order.' actionPerform={actionPerform} show={show} />
            }
        </>
    )
}

export default OpenOrderTable;