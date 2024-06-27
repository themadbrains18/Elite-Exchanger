import { currencyFormatter } from '@/components/snippets/market/buySellCard';
import moment from 'moment';
import Image from 'next/image';
import React, { useState } from 'react';

interface propsData {
    positions?: any;
    currentToken?: any;
}

const PositionsHistoryTable = (props: propsData) => {

    return (
        <>
            <div className="overflow-x-auto h-[234px]">
                <table width="100%" className="min-w-[1200px] w-full">
                    <thead>
                        <tr className="border-b border-t border-grey-v-3 dark:border-opacity-[15%]">

                            <th className="py-[10px]">
                                <div className="flex ">
                                    <p className="text-start top-label dark:text-gamma">Symbol</p>
                                    <Image src="/assets/history/uparrow.svg" width={15} height={15} alt="uparrow" />
                                </div>
                            </th>
                            <th className="py-[10px]">
                                <div className="flex">
                                    <p className="  top-label dark:text-gamma">Filled/Total</p>
                                    <Image src="/assets/history/uparrow.svg" width={15} height={15} alt="uparrow" />
                                </div>
                            </th>
                            <th className=" py-[10px]">
                                <div className="flex">
                                    <p className="text-start  top-label dark:text-gamma">Filled Price</p>
                                    <Image src="/assets/history/uparrow.svg" width={15} height={15} alt="uparrow" />
                                </div>
                            </th>
                            <th className=" py-[10px]">
                                <div className="flex">
                                    <p className="text-start  top-label dark:text-gamma">Trade Type</p>
                                    <Image src="/assets/history/uparrow.svg" width={15} height={15} alt="uparrow" />
                                </div>
                            </th>
                            <th className=" py-[10px]">
                                <div className="flex">
                                    <p className="text-start  top-label dark:text-gamma">Order Type</p>
                                    <Image src="/assets/history/uparrow.svg" width={15} height={15} alt="uparrow" />
                                </div>
                            </th>
                            <th className=" py-[10px]">
                                <div className="flex">
                                    <p className="text-start  top-label dark:text-gamma">Status </p>
                                    <Image src="/assets/history/uparrow.svg" width={15} height={15} alt="uparrow" />
                                </div>
                            </th>
                            <th className=" py-[10px]">
                                <div className="flex">
                                    <p className="  top-label dark:text-gamma">Order No.</p>
                                    <Image src="/assets/history/uparrow.svg" width={15} height={15} alt="uparrow" />
                                </div>
                            </th>
                            <th className=" py-[10px]">
                                <div className="flex">
                                    <p className="  top-label dark:text-gamma">Order Time</p>
                                    <Image src="/assets/history/uparrow.svg" width={15} height={15} alt="uparrow" />
                                </div>
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            props?.positions && props?.positions.length > 0 && props?.positions.map((item: any, index: number) => {
                                return (
                                    <tr key={index}>
                                        <td className='border-b border-t border-grey-v-3 dark:border-opacity-[15%]'>
                                            <div className={`pl-[5px] pt-[5px] border-l-[5px] border-[${item?.direction === 'Open Long'?'#03A66D':'#ff0000'}] flex gap-[8px] items-center`}>
                                                <div>
                                                    <p className="info-14 !text-[12px] dark:text-white">{item?.symbol}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className='border-b border-t border-grey-v-3 dark:border-opacity-[15%]'>
                                            <p className={`top-label !font-[600]`}>{item?.qty}/{item?.qty}</p>
                                        </td>
                                        <td className='border-b border-t border-grey-v-3 dark:border-opacity-[15%]'>
                                            <p className="top-label !font-[600] dark:!text-white !text-black">{currencyFormatter(item?.market_price?.toFixed(2))}/{item?.market_type}</p>
                                        </td>
                                        <td className='border-b border-t border-grey-v-3 dark:border-opacity-[15%]'>
                                            <p className={`top-label !font-[600] ${item?.direction === 'Open Long'?'!text-buy':'!text-sell'}`}>{item?.direction}</p>
                                        </td>
                                        <td className='border-b border-t border-grey-v-3 dark:border-opacity-[15%]'>
                                            <p className="top-label !font-[600] dark:!text-white !text-black">{item?.market_type?.charAt(0).toUpperCase() + item?.market_type?.slice(1)}</p>
                                        </td>
                                        <td className='border-b border-t border-grey-v-3 dark:border-opacity-[15%]'>
                                            <p className="top-label !font-[600] dark:!text-white !text-black">{item?.status === 0?'Unfilled':'Filled'}</p>
                                        </td>
                                        <td className='border-b border-t border-grey-v-3 dark:border-opacity-[15%]'>
                                            <p className="top-label !font-[600] dark:!text-white !text-black">{item?.position_id.split('-')[0]}</p>
                                        </td>
                                        <td className='border-b border-t border-grey-v-3 dark:border-opacity-[15%]'>
                                            <p className="top-label !font-[600] dark:!text-white !text-black">{moment(item?.createdAt).format("YYYY-MM-DD HH:mm:ss")}</p>
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

export default PositionsHistoryTable;