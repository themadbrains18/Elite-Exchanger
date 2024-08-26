import Image from 'next/image';
import React from 'react';
import 'react-toastify/dist/ReactToastify.css';
import { currencyFormatter } from '@/components/snippets/market/buySellCard';

interface propsData {
    openOrders?: any;
}

const OpenOrderHistoryTable = (props: propsData) => {

    return (
        <>
            <div className="overflow-x-auto h-[234px]">
                <table width="100%" className="min-w-[1200px] w-full">
                    <thead>
                        <tr className="border-b border-t border-grey-v-3 dark:border-opacity-[15%]">
                            <th className="py-[10px]">
                                <div className="flex ">
                                    <p className="text-start top-label dark:text-gamma">Time</p>
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
                                    <p className="text-start top-label dark:text-gamma">Type</p>
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
                                    <p className="text-start top-label dark:text-gamma">Price</p>
                                    <Image src="/assets/history/uparrow.svg" width={15} height={15} alt="uparrow" />
                                </div>
                            </th>
                            <th className="py-[10px]">
                                <div className="flex ">
                                    <p className="text-start top-label dark:text-gamma">Amount</p>
                                    <Image src="/assets/history/uparrow.svg" width={15} height={15} alt="uparrow" />
                                </div>
                            </th>
                            {/* <th className="py-[10px]">
                                <div className="flex ">
                                    <p className="text-start top-label dark:text-gamma">Filled</p>
                                    <Image src="/assets/history/uparrow.svg" width={15} height={15} alt="uparrow" />
                                </div>
                            </th> */}
                            <th className="py-[10px]">
                                <div className="flex ">
                                    <p className="text-start top-label dark:text-gamma">Reduce Only</p>
                                    <Image src="/assets/history/uparrow.svg" width={15} height={15} alt="uparrow" />
                                </div>
                            </th>
                            <th className="py-[10px]">
                                <div className="flex ">
                                    <p className="text-start top-label dark:text-gamma">Post Only</p>
                                    <Image src="/assets/history/uparrow.svg" width={15} height={15} alt="uparrow" />
                                </div>
                            </th>
                            <th className="py-[10px]">
                                <div className="flex ">
                                    <p className="text-start top-label dark:text-gamma">Trigger Conditions</p>
                                    <Image src="/assets/history/uparrow.svg" width={15} height={15} alt="uparrow" />
                                </div>
                            </th>
                            <th className="py-[10px]">
                                <div className="flex ">
                                    <p className="text-start top-label dark:text-gamma">TP/SL</p>
                                    <Image src="/assets/history/uparrow.svg" width={15} height={15} alt="uparrow" />
                                </div>
                            </th>
                            <th className="py-[10px]">
                                <div className="flex ">
                                    <p className="text-start top-label dark:text-gamma">Status</p>
                                    <Image src="/assets/history/uparrow.svg" width={15} height={15} alt="uparrow" />
                                </div>
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            props?.openOrders && props?.openOrders.length > 0 && props?.openOrders?.map((item: any, index: number) => {
                                return (
                                    <tr key={index}>
                                        <td className='border-b border-t border-grey-v-3 dark:border-opacity-[15%]'>
                                            <p className="top-label !font-[600] dark:!text-white !text-black">{item?.time}</p>
                                        </td>
                                        <td className='border-b border-t border-grey-v-3 dark:border-opacity-[15%]'>
                                            <div>
                                                <p className="info-14 !text-[12px] dark:text-white">{item?.symbol}</p>
                                                <p className="top-label">Perpetual</p>
                                            </div>
                                        </td>
                                        <td className='border-b border-t border-grey-v-3 dark:border-opacity-[15%]'>
                                            <p className="top-label !font-[600] dark:!text-white !text-black">{item?.type}</p>
                                        </td>
                                        <td className='border-b border-t border-grey-v-3 dark:border-opacity-[15%]'>
                                            <p className="top-label !font-[600] dark:!text-white !text-black">{item?.side}</p>
                                        </td>
                                        <td className='border-b border-t border-grey-v-3 dark:border-opacity-[15%]'>
                                            <p className="top-label !font-[600] dark:!text-white !text-black">{currencyFormatter(item?.price_usdt)}</p>
                                        </td>
                                        <td className='border-b border-t border-grey-v-3 dark:border-opacity-[15%]'>
                                            <p className="top-label !font-[600] dark:!text-white !text-black">{currencyFormatter(item?.amount)}</p>
                                        </td>
                                        {/* <td className='border-b border-t border-grey-v-3 dark:border-opacity-[15%]'>
                                            <p className="top-label !font-[600] dark:!text-white !text-black">0.0</p>
                                        </td> */}
                                        <td className='border-b border-t border-grey-v-3 dark:border-opacity-[15%]'>
                                            <p className="top-label !font-[600] dark:!text-white !text-black">{item?.reduce_only}</p>
                                        </td>
                                        <td className='border-b border-t border-grey-v-3 dark:border-opacity-[15%]'>
                                            <p className="top-label !font-[600] dark:!text-white !text-black">{item?.post_only}</p>
                                        </td>
                                        <td className='border-b border-t border-grey-v-3 dark:border-opacity-[15%]'>
                                            <p className="top-label !font-[600] dark:!text-white !text-black">{item.trigger}</p>
                                        </td>
                                        <td className='border-b border-t border-grey-v-3 dark:border-opacity-[15%]'>
                                            <p className="top-label !font-[600] dark:!text-white !text-black">--</p>
                                        </td>
                                        <td className='border-b border-t border-grey-v-3 dark:border-opacity-[15%]'>
                                        <p className={`top-label !font-[600] ${item.isDeleted === true ? '!text-sell' : '!text-buy'}`}>{item.isDeleted === true ? 'Closed' : 'Open'}</p>
                                        </td>
                                    </tr>
                                )
                            })
                        }
                    </tbody>
                </table>
            </div>
            
        </>
    )
}

export default OpenOrderHistoryTable;