import { currencyFormatter } from '@/components/snippets/market/buySellCard';
import { truncateNumber } from '@/libs/subdomain';

import React, { Fragment } from 'react'

/**
 * SelltableFuture Component
 * 
 * Displays a table for the "short" position records, including the entry price,
 * quantity, and total margin for each position. The table is styled dynamically
 * based on props for full height and token-related information.
 * 
 * @param {Object} props - The component props
 * @param {number} [props.show] - Optional prop to control visibility or height
 * @param {boolean} [props.fullHeight] - Optional prop to toggle between full or
 * condensed height of the table
 * @param {boolean} [props.showPrice] - Optional flag to show or hide price column
 * @param {any} [props.currentToken] - Current token data, including coin_symbol
 * @param {any} [props.positionRecord] - The position records to display in the table
 * 
 * @returns {JSX.Element} The rendered component
 */
interface setState {
    show?: number;
    fullHeight?: boolean;
    showPrice?: boolean;
    currentToken?: any;
    positionRecord?: any;
}

const SelltableFuture = (props: setState) => {

    let data = props?.positionRecord?.filter((item:any)=>{
        return item?.direction === 'short'
    });

    return (
        <>
            <div className={`p-[16px] pt-[0] overflow-y-auto orderTable ${props.fullHeight ? 'max-h-[274px] lg:max-h-[620px]' : 'max-h-[137px] lg:max-h-[310px]'} `}>
                {/* head */}
                <div className='grid grid-cols-3 gap-[10px] sticky top-0 bg-light bg-[#fafafa] dark:bg-[#1a1b1f]'>
                    <p className='top-label text-start py-[5px]'>Price (USDT)</p>
                    <p className='top-label text-center py-[5px]'>Qty ({props?.currentToken?.coin_symbol})</p>
                    <p className='top-label text-end py-[5px]'> Total (USDT)</p>
                </div>

                {data && data?.length > 0 && data.map((item: any, index:number) => {
                    return <Fragment key={Date.now()+index}>
                        <div className='grid grid-cols-3 gap-[10px]  rounded mb-[4px] relative'>
                            <p className={`top-label text-start ${item?.direction === 'long' ? '!text-buy' : '!text-sell'}`}>{currencyFormatter(item?.entry_price?.toFixed(6))}</p>
                            <p className='top-label text-center !text-black dark:!text-white'>{currencyFormatter(item?.qty?.toFixed(6))}</p>
                            <p className='top-label text-end !text-black dark:!text-white'>{truncateNumber(item?.margin,6)}</p>
                            <div className='absolute top-0  right-0 w-full h-full bg-[#fc47471c] tmb-bg-overlay duration-300'></div>
                        </div>
                    </Fragment>
                })}

                {data?.length === 0 &&
                    <div className={` py-[50px] flex flex-col items-center justify-center text-[#000000]`}>
                        
                        <p className="sm-text"> No Record Found </p>
                    </div>
                }

            </div>
            
        </>
    )
}

export default SelltableFuture;