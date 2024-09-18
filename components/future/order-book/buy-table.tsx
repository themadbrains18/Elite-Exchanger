import { currencyFormatter } from '@/components/snippets/market/buySellCard';
import { truncateNumber } from '@/libs/subdomain';
import React, { Fragment, useEffect, useState } from 'react'
interface setState {
    show?: number;
    fullHeight?: boolean;
    showPrice?: boolean;
    currentToken?: any;
    positionRecord?: any;
}
const BuyTableFuture = (props: setState) => {
    let data = props?.positionRecord?.filter((item:any)=>{
        return item?.direction === 'long'
    });


    useEffect(() => {
        const generateRandomWidth = (): number => {
          return Math.floor(Math.random() * (100 - 30 + 1)) + 30;
        };
    
        const applyRandomWidths = () => {
          let tmbbgoverlays = document.querySelectorAll<HTMLElement>('.tmb-bg-overlay');
          tmbbgoverlays.forEach((element) => {
            const randomWidth = generateRandomWidth();
            (element as HTMLElement).style.width = `${randomWidth}%`;
          });
        };
        applyRandomWidths();
        const intervalId = setInterval(() => {
          applyRandomWidths(); 
        }, 1000);
    
        return () => clearInterval(intervalId);
      }, []);

    return (
        <>
            {/* {
                props.showPrice &&
                <div className='bg-card-bg py-[6px] px-[20px] flex items-center justify-between dark:bg-omega bg-white my-[10px]'>
                    <p className='info-18 !text-black dark:!text-white'>{props?.currentToken?.token !== null ? currencyFormatter((props?.currentToken?.token?.price)?.toFixed(5)) : currencyFormatter((props?.currentToken?.global_token?.price)?.toFixed(5))}</p>
                    <p className='info-16 !text-black dark:!text-white !text-[14px] underline'>{props?.currentToken?.token !== null ? currencyFormatter((props?.currentToken?.token?.price)?.toFixed(5)) : currencyFormatter((props?.currentToken?.global_token?.price)?.toFixed(5))}</p>
                </div>
            } */}
            <div className={`p-[16px] pt-[0] overflow-y-auto orderTable ${props.fullHeight ? 'max-h-[274px] lg:max-h-[620px]' : 'max-h-[137px] lg:max-h-[310px]'}`}>
                {/* head */}
                <div className='grid grid-cols-3 gap-[10px] sticky top-0 bg-light bg-[#fafafa] dark:bg-[#1a1b1f]'>
                    <p className='top-label text-start py-[5px]'>Price (USDT)</p>
                    <p className='top-label text-center py-[5px]'>Qty ({props?.currentToken?.coin_symbol})</p>
                    <p className='top-label text-end  py-[5px]'>Total (USDT)</p>
                </div>

                {data && data?.length > 0 && data.map((item: any, index:number) => {
                    return <Fragment key={Date.now()+index}>
                        <div className='grid grid-cols-3 gap-[10px]  rounded mb-[4px] relative'>
                            <p className={`top-label text-start ${item?.direction === 'long' ? '!text-buy' : '!text-sell'}`}>{currencyFormatter(item?.entry_price?.toFixed(6))}</p>
                            <p className='top-label text-center !text-black dark:!text-white'>{currencyFormatter(item?.qty?.toFixed(6))}</p>
                            <p className='top-label text-end !text-black dark:!text-white'>{truncateNumber(item?.margin,6)}</p>
                            <div className='absolute top-0  right-0 w-full h-full bg-[#25e39e0a] tmb-bg-overlay duration-300'></div>
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

export default BuyTableFuture;