import React, { useEffect, useRef, useState } from 'react'
import BuyTableFuture from './buy-table';
import SelltableFuture from './sell-table';
import { currencyFormatter } from '@/components/snippets/market/buySellCard';
import { truncateNumber } from '@/libs/subdomain';
interface setHeight {
    show?: number;
    setShow?: any;
    widthFull?: boolean;
    currentToken?: any;
    positionRecord?: any;
}
const OrderBookFuture = (props: setHeight) => {
    const [highlow, setHighlow] = useState<boolean>(true);

    const [prevPrice, setPrevPrice] = useState<any>();

    useEffect(() => {

setPrevPrice(props?.positionRecord[0])

    }, [props?.positionRecord]);




    return (
        <div className={`w-full bg-[#fafafa] dark:bg-[#1a1b1f] min-[990px]:border-l max-[991px]:border-t dark:border-[#25262a] border-[#e5e7eb] ${props.widthFull ? "max-w-full" : "max-w-[350px]"}  `}>
            {/* order book head */}
            <div className='flex items-center gap-4'>



                <div className='flex items-center justify-between gap-[10px] p-[10px]'>
                    <button className={`p-[5px] border border-[#ffffff26] rounded  ${props.show === 1 ? "dark:bg-[#373d4e] bg-[#e5ecf0]" : "bg-transparent"}`} onClick={() => { props.setShow(1) }}>
                        <svg
                            width={16}
                            height={16}
                            viewBox="0 0 16 16"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                fillRule="evenodd"
                                clipRule="evenodd"
                                d="M2 4.25C2 3.97386 2.22386 3.75 2.5 3.75H13.5C13.7761 3.75 14 3.97386 14 4.25C14 4.52614 13.7761 4.75 13.5 4.75H2.5C2.22386 4.75 2 4.52614 2 4.25Z"
                                fill="#06C96B"
                            />
                            <path
                                fillRule="evenodd"
                                clipRule="evenodd"
                                d="M5 6.75C5 6.47386 5.22386 6.25 5.5 6.25H13.5C13.7761 6.25 14 6.47386 14 6.75C14 7.02614 13.7761 7.25 13.5 7.25H5.5C5.22386 7.25 5 7.02614 5 6.75Z"
                                fill="#06C96B"
                            />
                            <path
                                fillRule="evenodd"
                                clipRule="evenodd"
                                d="M2 9.25C2 8.97386 2.22386 8.75 2.5 8.75H13.5C13.7761 8.75 14 8.97386 14 9.25C14 9.52614 13.7761 9.75 13.5 9.75H2.5C2.22386 9.75 2 9.52614 2 9.25Z"
                                fill="#FC4747"
                            />
                            <path
                                fillRule="evenodd"
                                clipRule="evenodd"
                                d="M5 11.75C5 11.4739 5.22386 11.25 5.5 11.25H13.5C13.7761 11.25 14 11.4739 14 11.75C14 12.0261 13.7761 12.25 13.5 12.25H5.5C5.22386 12.25 5 12.0261 5 11.75Z"
                                fill="#FC4747"
                            />
                        </svg>
                    </button>
                    <button className={`p-[5px] border border-[#ffffff26] rounded  ${props.show === 2 ? "dark:bg-[#373d4e] bg-[#e5ecf0]" : "bg-transparent"}`} onClick={() => { props.setShow(2) }}>
                        <svg
                            width={16}
                            height={16}
                            viewBox="0 0 16 16"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                fillRule="evenodd"
                                clipRule="evenodd"
                                d="M2 4.25C2 3.97386 2.22386 3.75 2.5 3.75H13.5C13.7761 3.75 14 3.97386 14 4.25C14 4.52614 13.7761 4.75 13.5 4.75H2.5C2.22386 4.75 2 4.52614 2 4.25Z"
                                fill="#06C96B"
                            />
                            <path
                                fillRule="evenodd"
                                clipRule="evenodd"
                                d="M5 6.75C5 6.47386 5.22386 6.25 5.5 6.25H13.5C13.7761 6.25 14 6.47386 14 6.75C14 7.02614 13.7761 7.25 13.5 7.25H5.5C5.22386 7.25 5 7.02614 5 6.75Z"
                                fill="#06C96B"
                            />
                            <path
                                fillRule="evenodd"
                                clipRule="evenodd"
                                d="M2 9.25C2 8.97386 2.22386 8.75 2.5 8.75H13.5C13.7761 8.75 14 8.97386 14 9.25C14 9.52614 13.7761 9.75 13.5 9.75H2.5C2.22386 9.75 2 9.52614 2 9.25Z"
                                fill="#06C96B"
                            />
                            <path
                                fillRule="evenodd"
                                clipRule="evenodd"
                                d="M5 11.75C5 11.4739 5.22386 11.25 5.5 11.25H13.5C13.7761 11.25 14 11.4739 14 11.75C14 12.0261 13.7761 12.25 13.5 12.25H5.5C5.22386 12.25 5 12.0261 5 11.75Z"
                                fill="#06C96B"
                            />
                        </svg>
                    </button>
                    <button className={`p-[5px] border border-[#ffffff26] rounded  ${props.show === 3 ? "dark:bg-[#373d4e] bg-[#e5ecf0]" : "bg-transparent"}`} onClick={() => { props.setShow(3) }}>
                        <svg
                            width={16}
                            height={16}
                            viewBox="0 0 16 16"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                fillRule="evenodd"
                                clipRule="evenodd"
                                d="M2 4.25C2 3.97386 2.22386 3.75 2.5 3.75H13.5C13.7761 3.75 14 3.97386 14 4.25C14 4.52614 13.7761 4.75 13.5 4.75H2.5C2.22386 4.75 2 4.52614 2 4.25Z"
                                fill="#FC4747"
                            />
                            <path
                                fillRule="evenodd"
                                clipRule="evenodd"
                                d="M5 6.75C5 6.47386 5.22386 6.25 5.5 6.25H13.5C13.7761 6.25 14 6.47386 14 6.75C14 7.02614 13.7761 7.25 13.5 7.25H5.5C5.22386 7.25 5 7.02614 5 6.75Z"
                                fill="#FC4747"
                            />
                            <path
                                fillRule="evenodd"
                                clipRule="evenodd"
                                d="M2 9.25C2 8.97386 2.22386 8.75 2.5 8.75H13.5C13.7761 8.75 14 8.97386 14 9.25C14 9.52614 13.7761 9.75 13.5 9.75H2.5C2.22386 9.75 2 9.52614 2 9.25Z"
                                fill="#FC4747"
                            />
                            <path
                                fillRule="evenodd"
                                clipRule="evenodd"
                                d="M5 11.75C5 11.4739 5.22386 11.25 5.5 11.25H13.5C13.7761 11.25 14 11.4739 14 11.75C14 12.0261 13.7761 12.25 13.5 12.25H5.5C5.22386 12.25 5 12.0261 5 11.75Z"
                                fill="#FC4747"
                            />
                        </svg>
                    </button>
                </div>

            </div>
            {
                props.show === 2 &&
                <BuyTableFuture fullHeight={true} showPrice={true} currentToken={props.currentToken} positionRecord={props?.positionRecord}  />
            }
            {
                props.show === 1 &&
                <>
                    <BuyTableFuture currentToken={props.currentToken} positionRecord={props?.positionRecord} />
                    <div className='bg-card-bg py-[6px] px-[20px] flex items-center justify-between dark:bg-omega bg-white my-[10px]'>
                        <div className='flex items-center gap-1'>
                            <svg
                                enableBackground="new 0 0 32 32"
                                version="1.1"
                                viewBox="0 0 32 32"
                                xmlSpace="preserve"
                                xmlns="http://www.w3.org/2000/svg"
                                className={`w-3 ${prevPrice?.direction==="long" ? 'rotate-180' : ''}`}
                                xmlnsXlink="http://www.w3.org/1999/xlink"
                            >
                                <path
                                    clipRule="evenodd"
                                    d="M26.704,20.393  c-0.394-0.39-1.034-0.391-1.428,0l-8.275,8.193V1c0-0.552-0.452-1-1.01-1s-1.01,0.448-1.01,1v27.586l-8.275-8.192  c-0.394-0.391-1.034-0.391-1.428,0c-0.394,0.391-0.394,1.024,0,1.414l9.999,9.899c0.39,0.386,1.039,0.386,1.429,0l9.999-9.899  C27.099,21.417,27.099,20.784,26.704,20.393C26.31,20.003,27.099,20.784,26.704,20.393z"
                                    className={`${prevPrice?.direction==="long" ? 'fill-buy' : 'fill-sell'}`}
                                    fillRule="evenodd"
                                />
                                <g />
                                <g />
                                <g />
                                <g />
                                <g />
                                <g />
                            </svg>

                            <p className={`info-18 ${prevPrice?.direction==="long" ? 'text-buy' : 'text-sell'}`}>{currencyFormatter(truncateNumber(prevPrice ? prevPrice?.entry_price:0, 6))}</p>
                        </div>
                        <p className='info-16 !text-black dark:!text-white !text-[14px] underline'>{props?.currentToken?.token !== null ? currencyFormatter(truncateNumber(props?.currentToken?.token?.price, 6)) : currencyFormatter(truncateNumber(props?.currentToken?.global_token?.price, 6))}</p>
                    </div>
                    <SelltableFuture currentToken={props.currentToken} positionRecord={props?.positionRecord} />
                </>
            }
            {
                props.show === 3 &&
                <SelltableFuture show={props.show} fullHeight={true} showPrice={true} currentToken={props.currentToken} positionRecord={props?.positionRecord} />
            }
        </div>
    )
}

export default OrderBookFuture;