
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import 'react-toastify/dist/ReactToastify.css';
import { useWebSocket } from '@/libs/WebSocketContext';
import { truncateNumber } from '@/libs/subdomain';
import { AES } from 'crypto-js';
import { toast } from 'react-toastify';
import ConfirmationClouserModel from '@/components/snippets/confirm-clouser';
import moment from 'moment';
import { useRouter } from 'next/router';

interface propsData {
    show: number;
    getProfitLossOrder?:Function;
    orders:any
}
const ProfitLossTable: React.FC<propsData> = ({ show , getProfitLossOrder , orders }) => {

    const { status, data: session } = useSession();
    const [active, setActive] = useState(false);
    const [showm, setShow] = useState(false);
    const [positionId, setPositionId] = useState('');
    const wbsocket = useWebSocket();

    useEffect(() => {
        getProfitLossOrder && getProfitLossOrder();
    }, [show]);

    
    function formatDate(date: any) {
        const options: {} = { year: 'numeric', month: 'short', day: '2-digit' };
        return new Date(date).toLocaleDateString('en-US', options)
    }

    const closePosition = async (position_id: string) => {
        setPositionId(position_id);
        setActive(true);
        setShow(true);
    }

    const actionPerform = async () => {
        try {
            if (session) {
                let obj = { "id": positionId };
                const ciphertext = AES.encrypt(JSON.stringify(obj), `${process.env.NEXT_PUBLIC_SECRET_PASSPHRASE}`);
                let record = encodeURIComponent(ciphertext.toString());

                let closeReponse = await fetch(`${process.env.NEXT_PUBLIC_BASEURL}/future/closeprofitloss`, {
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
                    setActive(false);
                    setShow(false);
                    getProfitLossOrder && getProfitLossOrder();
                }
            }
        } catch (error) {

        }
    }

    const router = useRouter();
    const { slug } = router.query;
    return (
        <>
            <div className="overflow-x-auto h-[234px]">
                <table width="100%" className="min-w-[1200px] w-full">
                    <thead>
                        <tr className="border-b border-t border-grey-v-3 dark:border-opacity-[15%]">
                            <th className="py-[10px]">
                                <div className="flex ">
                                    <p className="text-start top-label dark:text-gamma">Contract</p>
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
                                    <p className="text-start top-label dark:text-gamma">Trigger Price</p>
                                    <Image src="/assets/history/uparrow.svg" width={15} height={15} alt="uparrow" />
                                </div>
                            </th>
                            <th className="py-[10px]">
                                <div className="flex ">
                                    <p className="text-start top-label dark:text-gamma">Order Price</p>
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
                                    <p className="text-start top-label dark:text-gamma">Date/Time</p>
                                    <Image src="/assets/history/uparrow.svg" width={15} height={15} alt="uparrow" />
                                </div>
                            </th>
                            <th className="py-[10px]">
                                <div className="flex ">
                                    <p className="text-start top-label dark:text-gamma">Action</p>
                                    <Image src="/assets/history/uparrow.svg" width={15} height={15} alt="uparrow" />
                                </div>
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            session && orders && orders.length > 0 && orders?.filter((item: any) => item?.contract === slug).map((item: any, index: number) => {
                                return (
                                    <tr key={index}>
                                        <td className='border-b border-t border-grey-v-3 dark:border-opacity-[15%]'>
                                            <div className={`pl-[5px] pt-[5px] border-l-[5px] ${item?.trade_type === 'Close Long' ? 'border-[#03A66D]' : 'border-[#f74646]'} flex gap-[8px] items-center`}>
                                                <div>
                                                    <p className="info-14 !text-[12px] dark:text-white">{item.contract}</p>
                                                    <p className={`top-label ${item?.futureposition?.direction === 'long' ? '!text-buy' : '!text-sell'}`}>{item?.futureposition?.leverage_type} {item?.futureposition?.leverage}x</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className='border-b border-t border-grey-v-3 dark:border-opacity-[15%]'>
                                            <p className={`top-label !font-[600]`}>{item?.qty}</p>
                                        </td>
                                        <td className='border-b border-t border-grey-v-3 dark:border-opacity-[15%]'>
                                            <p className="top-label !font-[600] dark:!text-white !text-black">TP {truncateNumber(item?.trigger_profit, 2)}(Last)</p>
                                            <p className="top-label !font-[600] dark:!text-white !text-black">SL {truncateNumber(item?.trigger_loss, 2)}(Last)</p>
                                        </td>
                                        <td className='border-b border-t border-grey-v-3 dark:border-opacity-[15%]'>
                                            <p className="top-label !font-[600] dark:!text-white !text-black">Market</p>
                                        </td>
                                        <td className='border-b border-t border-grey-v-3 dark:border-opacity-[15%]'>
                                            <p className="top-label !font-[600] dark:!text-white !text-black">{item?.trade_type}</p>
                                        </td>
                                        <td className='border-b border-t border-grey-v-3 dark:border-opacity-[15%]'>
                                            <p className="top-label !font-[600] dark:!text-white !text-black">{moment(item?.createdAt).format("YYYY-MM-DD HH:mm:ss")}</p>
                                        </td>
                                        <td className='border-b border-t border-grey-v-3 dark:border-opacity-[15%] cursor-pointer' onClick={() => closePosition(item?.position_id)}>
                                            <div className='flex items-center'>
                                                <p className='top-label dark:!text-[#cccc56] !font-[600] pr-[20px]'>Close</p>
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
                <ConfirmationClouserModel setActive={setActive} setShow={setShow} title='Confirm Profit Loss Closure' message='Are you sure to want to close this take profit and stop loss.' actionPerform={actionPerform} show={showm} />
            }
        </>
    )
}

export default ProfitLossTable;