import React from 'react';
import moment from "moment";
import { currencyFormatter } from '@/components/snippets/market/buySellCard';
import { truncateNumber } from '@/libs/subdomain';

interface setState {
    show?: number;
    setShow?: any;
    fullHeight?: boolean;
    showPrice?: boolean;
    widthFull?: boolean;
    positionRecord?: any;
    currentToken?: any;
    slug?: any;
}
const MarketTrades = (props: setState) => {


    return (
        <div className={`bg-[#fafafa] dark:bg-[#1a1b1f] min-[990px]:border-l dark:border-[#25262a] border-[#e5e7eb] py-[14px] px-[16px]  ${props.widthFull ? "max-w-full " : "max-w-[300px]"}  w-full`}>
            <h3 className='top-label dark:!text-white !text-[#000] max-[991px]:hidden'>Recent Trades</h3>
            <div className={`overflow-y-auto orderTable max-h-[320px] md:max-h-[675px]`}>
                {/* head */}
                <div className='grid grid-cols-3 gap-[10px] sticky top-0 bg-light bg-[#fafafa] dark:bg-[#1a1b1f]'>
                    <p className='top-label text-start py-[5px]'>Price (USDT)</p>
                    <p className='top-label text-center py-[5px]'>Qty (USDT)</p>
                    <p className='top-label text-end  py-[5px]'>Time</p>
                </div>

                {props?.positionRecord && props?.positionRecord.length > 0 && props?.positionRecord.map((item: any, index:number) => {
                    return <>
                        <div key={index} className={`grid grid-cols-3 gap-[10px] ${item?.direction === 'long' ? 'bg-[#25e39e0a]' : 'bg-[#fc47471c]'} rounded mb-[4px]`}>
                            <p className={`top-label text-start ${item?.direction === 'long' ? '!text-buy' : '!text-sell'}`}>{currencyFormatter(item?.entry_price?.toFixed(6))}</p>
                            <p className='top-label text-center !text-black dark:!text-white'>{truncateNumber(item?.margin,6)}</p>
                            <p className='top-label text-end !text-black dark:!text-white'>{moment(item?.createdAt).format("YYYY-MM-DD")}</p>
                        </div>
                    </>
                })}

                {props?.positionRecord?.length === 0 &&
                    <div className={` py-[50px] flex flex-col items-center justify-center text-[#000000]`}>
                        <p className="sm-text"> No Record Found </p>
                    </div>
                }

            </div>
        </div>
    )
}

export default MarketTrades;