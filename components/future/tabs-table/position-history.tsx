import { currencyFormatter } from '@/components/snippets/market/buySellCard';
import { formatDate, truncateNumber } from '@/libs/subdomain';;
import Image from 'next/image';
import { useRouter } from 'next/router';
import React from 'react';

/**
 * PositionsHistoryTable component displays a table of trading position history
 * with details such as symbol, filled/total quantity, price, trade type, order type,
 * order status, order number, and order time.
 * 
 * @param {Object} props - The component's props.
 * @param {Array} props.positions - List of position objects to be displayed in the table.
 * @param {Object} props.currentToken - Current token data, if needed for future use (currently not used).
 * 
 * @returns {JSX.Element} A table showing the positions history with dynamic data.
 */
interface propsData {
    positions?: any;
    currentToken?: any;
}

const PositionsHistoryTable = (props: propsData) => {
    const router = useRouter();
    const { slug } = router.query;

    return (
        <>
            <div className="overflow-x-auto h-[234px] ">
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
                            props?.positions && props?.positions.length > 0 && props?.positions?.filter((item: any) => item?.symbol === slug)?.map((item: any, index: number) => {
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
                                            <p className={`top-label !font-[600]`}>{truncateNumber(item?.qty,3)}/{truncateNumber(item?.qty,3)}</p>
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
                                            <p className="top-label !font-[600] dark:!text-white !text-black">{formatDate(item?.createdAt,"yyyy-MM-dd HH:mm:ss")}</p>
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