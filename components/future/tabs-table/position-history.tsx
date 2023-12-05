import IconsComponent from '@/components/snippets/icons';
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
                                    <p className="  top-label dark:text-gamma">Size</p>
                                    <Image src="/assets/history/uparrow.svg" width={15} height={15} alt="uparrow" />
                                </div>
                            </th>
                            <th className=" py-[10px]">
                                <div className="flex">
                                    <p className="text-start  top-label dark:text-gamma">Entry Price</p>
                                    <Image src="/assets/history/uparrow.svg" width={15} height={15} alt="uparrow" />
                                </div>
                            </th>
                            <th className=" py-[10px]">
                                <div className="flex">
                                    <p className="text-start  top-label dark:text-gamma">Market Price</p>
                                    <Image src="/assets/history/uparrow.svg" width={15} height={15} alt="uparrow" />
                                </div>
                            </th>
                            <th className=" py-[10px]">
                                <div className="flex">
                                    <p className="text-start  top-label dark:text-gamma">Liq.Price</p>
                                    <Image src="/assets/history/uparrow.svg" width={15} height={15} alt="uparrow" />
                                </div>
                            </th>
                            <th className=" py-[10px]">
                                <div className="flex">
                                    <p className="text-start  top-label dark:text-gamma">Margin Ratio </p>
                                    <Image src="/assets/history/uparrow.svg" width={15} height={15} alt="uparrow" />
                                </div>
                            </th>
                            <th className=" py-[10px]">
                                <div className="flex">
                                    <p className="  top-label dark:text-gamma">Margin</p>
                                    <Image src="/assets/history/uparrow.svg" width={15} height={15} alt="uparrow" />
                                </div>
                            </th>
                            <th className=" py-[10px]">
                                <div className="flex">
                                    <p className="  top-label dark:text-gamma">PNL(ROE %)</p>
                                    <Image src="/assets/history/uparrow.svg" width={15} height={15} alt="uparrow" />
                                </div>
                            </th>
                            <th className=" py-[10px]">
                                <div className="flex">
                                    <p className="  top-label dark:!text-[#cccc56] !font-[600]">Positions</p>
                                    {/* <Image src="/assets/history/uparrow.svg" width={15} height={15} alt="uparrow" /> */}
                                </div>
                            </th>
                            <th className=" py-[10px]">
                                <div className="flex">
                                    <p className="  top-label dark:text-gamma">TP/SL for Positions</p>
                                    <Image src="/assets/history/uparrow.svg" width={15} height={15} alt="uparrow" />
                                </div>
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            props?.positions && props?.positions.length > 0 && props?.positions.map((item: any, index: number) => {

                                let tpsl = '--';
                                {
                                    item?.futureOpenOrders !== null && item?.futureOpenOrders.map((oo: any) => {
                                        if (tpsl === '--' && oo?.type === 'take profit market') {
                                            tpsl = oo?.trigger;
                                        }
                                        else if (oo?.type === 'stop market') {
                                            tpsl = tpsl + '/' + oo?.trigger;
                                        }
                                    })
                                }
                                return (
                                    <tr key={index}>
                                        <td className='border-b border-t border-grey-v-3 dark:border-opacity-[15%]'>
                                            <div className='pl-[5px] pt-[5px] border-l-[5px] border-[#03A66D] flex gap-[8px] items-center'>
                                                <div>
                                                    <p className="info-14 !text-[12px] dark:text-white">{item.symbol}</p>
                                                    <p className="top-label">Perpetual</p>
                                                </div>
                                                <p className="bg-[#13c2c21f] px-[5px] text-[#13c2c2] text-[12px]">{item.leverage}x</p>
                                            </div>
                                        </td>
                                        <td className='border-b border-t border-grey-v-3 dark:border-opacity-[15%]'>
                                            <p className={`top-label !font-[600] ${item.isDeleted === true ? '!text-sell' : '!text-buy'}`}>{item?.size}</p>
                                        </td>
                                        <td className='border-b border-t border-grey-v-3 dark:border-opacity-[15%]'>
                                            <p className="top-label !font-[600] dark:!text-white !text-black">{item?.entry_price}</p>
                                        </td>
                                        <td className='border-b border-t border-grey-v-3 dark:border-opacity-[15%]'>
                                            <p className="top-label !font-[600] dark:!text-white !text-black">{item?.token !== null ? item?.token?.price : item?.global_token?.price}</p>
                                        </td>
                                        <td className='border-b border-t border-grey-v-3 dark:border-opacity-[15%]'>
                                            <p className="top-label !font-[600] dark:!text-white !text-black">{item?.liq_price}</p>
                                        </td>
                                        <td className='border-b border-t border-grey-v-3 dark:border-opacity-[15%]'>
                                            <p className="top-label !font-[600] dark:!text-white !text-black">{item?.margin}</p>
                                        </td>
                                        <td className='border-b border-t border-grey-v-3 dark:border-opacity-[15%]'>
                                            <p className="top-label !font-[600] dark:!text-white !text-black">{item?.margin}</p>
                                            <p className="top-label !font-[600] dark:!text-white !text-black">{item?.leverage_type}</p>
                                        </td>
                                        <td className='border-b border-t border-grey-v-3 dark:border-opacity-[15%]'>
                                            <div className='flex items-center gap-[5px]'>
                                                <div>
                                                    <p className={`top-label !font-[600] ${item?.pnl > 0 ? '!text-buy' : '!text-sell'}`}>{item?.pnl}</p>
                                                    <p className={`top-label !font-[600] ${item?.pnl > 0 ? '!text-buy' : '!text-sell'}`}>{item.order_type === 'value' ? 'USDT' : 'BTC'}</p>
                                                </div>
                                                <IconsComponent type='sendIcon' />
                                            </div>
                                        </td>
                                        <td className='border-b border-t border-grey-v-3 dark:border-opacity-[15%]'>
                                            <div className='flex items-center'>
                                                <p className={`top-label !font-[600] ${item.isDeleted === true ? '!text-sell' : '!text-buy'}`}>{item.isDeleted === true ? 'Closed' : 'Open'}</p>

                                                {/* <div className='flex items-center gap-[20px]'>
                                                    <p className='top-label dark:!text-[#cccc56] !font-[600] pl-[20px] border-l border-grey-v-3 dark:border-opacity-[15%]'>Limit</p>
                                                    <div className='flex items-center gap-[5px]'>
                                                        <p className='top-label !font-[600] p-[4px] dark:bg-[#373d4e] bg-[#e5ecf0] rounded-[4px] cursor-pointer'>{item.ClosePositions1}</p>
                                                        <p className='top-label !font-[600] p-[4px] dark:bg-[#373d4e] bg-[#e5ecf0] rounded-[4px] cursor-pointer'>{item.ClosePositions2}</p>
                                                    </div>
                                                    </div> */}
                                            </div>
                                        </td>
                                        <td className='border-b border-t border-grey-v-3 dark:border-opacity-[15%]'>
                                            <div className='flex items-center gap-[5px]'>
                                                <div>
                                                    <p className="top-label !font-[600] ">{tpsl}</p>
                                                </div>

                                            </div>
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