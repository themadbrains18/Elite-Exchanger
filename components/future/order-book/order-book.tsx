import React from 'react'
import BuyTableFuture from './buy-table';
import SelltableFuture from './sell-table';
import { currencyFormatter } from '@/components/snippets/market/buySellCard';
interface setHeight {
    show?: number;
    setShow?: any;
    widthFull?: boolean;
    currentToken?: any;
    positionRecord?:any;
}
const OrderBookFuture = (props: setHeight) => {
    // const [show,setShow] = useState(1);

    return (
        <div className={`w-full bg-[#fafafa] dark:bg-[#1a1b1f] min-[990px]:border-l max-[991px]:border-t border-b dark:border-[#25262a] border-[#e5e7eb] ${props.widthFull ? "max-w-full" : "max-w-[300px]"}  `}>
            {/* order book head */}
            <div className='flex items-center justify-between gap-[10px] bg-[#fafafa] dark:bg-[#1a1b1f] border-b dark:border-[#25262a] border-[#e5e7eb] py-[10px]  px-[16px]  w-full'>
                <h3 className='top-label dark:!text-white !text-[#000] max-[991px]:hidden'>Order Book</h3>
                <div className='flex items-center justify-between gap-[10px] '>
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
                <BuyTableFuture fullHeight={true} showPrice={true} currentToken={props.currentToken} positionRecord={props?.positionRecord}/>
            }
            {
                props.show === 1 &&
                <>
                    <BuyTableFuture currentToken={props.currentToken} positionRecord={props?.positionRecord}/>
                    <div className='bg-card-bg py-[6px] px-[20px] flex items-center justify-between dark:bg-omega bg-white my-[10px]'>
                        <p className='info-18 !text-black dark:!text-white'>{props?.currentToken?.token !== null ? currencyFormatter((props?.currentToken?.token?.price)?.toFixed(5)) : currencyFormatter((props?.currentToken?.global_token?.price)?.toFixed(5))}</p>
                        <p className='info-16 !text-black dark:!text-white !text-[14px] underline'>{props?.currentToken?.token !== null ? currencyFormatter((props?.currentToken?.token?.price)?.toFixed(5)) : currencyFormatter((props?.currentToken?.global_token?.price)?.toFixed(5))}</p>
                    </div>
                    <SelltableFuture currentToken={props.currentToken} positionRecord={props?.positionRecord}/>
                </>
            }
            {
                props.show === 3 &&
                <SelltableFuture show={props.show} fullHeight={true} showPrice={true} currentToken={props.currentToken} positionRecord={props?.positionRecord}/>
            }
        </div>
    )
}

export default OrderBookFuture;