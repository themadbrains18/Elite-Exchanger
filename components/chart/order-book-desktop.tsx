import Image from 'next/image';
import Context from "../contexts/context";
import React, { useContext, useState } from 'react'
import { currencyFormatter } from '../snippets/market/buySellCard';
import { truncateNumber } from '@/libs/subdomain';

interface propsData {
    slug?: any;
    token?: any;
    allTradeHistory?: any;
    sellTrade?: any;
    BuyTrade?: any;
    hlocData?: any;
    width?: Number;
}

const OrderBook = (props: propsData) => {
    const [active1, setActive1] = useState(1);
    const [show, setShow] = useState(1);
    const { mode } = useContext(Context);

    // let isLastItem;



    return (
        <div className='mt-30 px-30 py-40 rounded-10  bg-white dark:bg-d-bg-primary'>
            {/* ta cta */}
            <div className="flex border-b border-[#e9eaf026] gap-30 mb-40">
                <button className={` sec-text text-center text-gamma border-b-2 border-[transparent] pb-[15px] max-w-[50%] w-full ${active1 === 1 && "!text-primary border-primary"}`} onClick={() => setActive1(1)}>
                    Order Book  
                </button>
                <button className={` sec-text text-center text-gamma border-b-2 border-[transparent] pb-[15px] max-w-[50%] w-full ${active1 === 2 && "!text-primary border-primary"}`} onClick={() => setActive1(2)}>
                    Recent Trades
                </button>
            </div>

            {active1 === 1 &&
                <>
                    {/* tab content */}
                    <div className='p-10 bg-grey dark:bg-black-v-1 rounded-[5px] flex items-center gap-10'>
                        <button className={`solid-button py-[10px] hover:!bg-primary ${show === 1 ? "dark:bg-primary  dark:!text-white" : "dark:bg-d-bg-primary bg-grey !text-gamma"}  hover:!text-white rounded-[5px]`} onClick={() => { setShow(1) }}>All</button>
                        <button className={`solid-button py-[10px] hover:!bg-red-dark ${show === 2 ? "bg-sell dark:!text-white" : " dark:bg-d-bg-primary bg-grey !text-gamma"} hover:!text-white rounded-[5px]`} onClick={() => { setShow(2) }}>Asks</button>
                        <button className={`solid-button py-[10px] hover:!bg-dark-green ${show === 3 ? "bg-buy  dark:!text-white" : " dark:bg-d-bg-primary bg-grey !text-gamma"} hover:!text-white rounded-[5px]`} onClick={() => { setShow(3) }}>Bids</button>
                    </div>
                    {
                        show === 1 &&
                        <>
                            {/* This is for desktop buy/asks */}
                            <div className='min-h-[320px] max-h-[320px] overflow-y-auto  mt-30'>
                                {/* table head */}
                                <div className='grid grid-cols-3 gap-10 min-w-[372]'>
                                    <div className="flex">
                                        <p className='info-12'>Price USDT</p>
                                        <Image src="/assets/history/uparrow.svg" width={15} height={15} alt="uparrow" />
                                    </div>
                                    <div className="flex justify-center">
                                        <p className='info-12 text-center'>Qty {props.slug}</p>
                                        <Image src="/assets/history/uparrow.svg" width={15} height={15} alt="uparrow" />
                                    </div>
                                    <div className="flex justify-end">
                                        <p className='info-12 text-end'>Total USDT</p>
                                        <Image src="/assets/history/uparrow.svg" width={15} height={15} alt="uparrow" />
                                    </div>
                                </div>
                                {/* table content */}
                                <div className='mt-10'>
                                    {props.BuyTrade && props.BuyTrade.length > 0 && props.BuyTrade.map((item: any, index: number) => {
                                        if (item.order_type === 'buy') {
                                            return(
                                                <div key={index + 'buy'} className='grid grid-cols-3 gap-10 min-w-[372] relative mb-[5px]'>
                                                    <p className='info-12 !text-[14px] z-[2] !text-buy whitespace-nowrap'>$ {currencyFormatter(truncateNumber(item?.limit_usdt, 8))}</p>
                                                    <p className='info-12 !text-[14px] z-[2]  text-center'>{currencyFormatter(truncateNumber(item?.token_amount, 8))}</p>
                                                    <p className='info-12  text-end z-[2] !text-[14px] px-[2px]'>$ {currencyFormatter(truncateNumber(item?.volume_usdt, 8))}</p>
                                                    <div className='absolute top-0 z-[1] right-0 w-[70%] h-full bg-green tmb-bg-overlay duration-300' style={{ width: `${props?.width}%` }}></div>
                                                </div>
                                            )
                                        }
                                    })}

                                    {props.BuyTrade && props.BuyTrade.length === 0 &&
                                        <div className={` py-[50px] flex flex-col items-center justify-center ${mode === "dark" ? 'text-[#ffffff]' : 'text-[#000000]'}`}>
                                            <Image
                                                src="/assets/refer/empty.svg"
                                                alt="emplty table"
                                                width={107}
                                                height={104}
                                            />
                                            <p > No Record Found </p>
                                        </div>
                                    }

                                </div>
                            </div>

                            <div>
                                <button type='button' className={`solid-button w-full my-20 ${Number(props?.hlocData?.changeRate) > 0 ? 'bg-buy ' : 'bg-sell '} `}>
                                    $ {currencyFormatter(props.BuyTrade?.[props.BuyTrade.length - 1]?.limit_usdt?.toFixed(5))}
                                </button>
                            </div>


                            {/* This is for desktop sell/bids */}
                            <div className='min-h-[320px] max-h-[320px] overflow-y-auto '>
                                {/* table head */}
                                <div className='grid grid-cols-3 gap-10 min-w-[372]'>
                                    <div className="flex ">
                                        <p className='info-12'>Price USDT</p>
                                        <Image src="/assets/history/uparrow.svg" width={15} height={15} alt="uparrow" />
                                    </div>
                                    <div className="flex justify-center">
                                        <p className='info-12 text-center'>Qty {props.slug}</p>
                                        <Image src="/assets/history/uparrow.svg" width={15} height={15} alt="uparrow" />
                                    </div>
                                    <div className="flex justify-end">
                                        <p className='info-12 text-end'>Total USDT</p>
                                        <Image src="/assets/history/uparrow.svg" width={15} height={15} alt="uparrow" />
                                    </div>
                                </div>
                                {/* table content */}
                                <div className='mt-10'>
                                    {props.sellTrade && props.sellTrade.length > 0 && props.sellTrade.map((item: any, index: number) => {
                                        if (item.order_type === 'sell') {
                                            return <div key={index + 'sell'} className='grid grid-cols-3 gap-10 min-w-[372] relative mb-[5px]'>
                                                <p className='info-12 !text-[14px] z-[2] !text-sell whitespace-nowrap'>$ {currencyFormatter(truncateNumber(item?.limit_usdt, 8))}</p>
                                                <p className='info-12 !text-[14px] z-[2] text-center'>{currencyFormatter(truncateNumber(item?.token_amount, 8))}</p>
                                                <p className='info-12 text-end z-[2] !text-[14px] px-[2px]'>$ {currencyFormatter(truncateNumber(item?.volume_usdt, 8))}</p>
                                                <div className='absolute top-0 z-[1] right-0 w-[70%] h-full bg-red-light duration-300 tmb-bg-overlay' style={{
                                                    width: `${props?.width}%`,
                                                }}></div>
                                            </div>
                                        }
                                    })}
                                    {props.sellTrade && props.sellTrade.length === 0 &&
                                        <div className={` py-[50px] flex flex-col items-center justify-center ${mode === "dark" ? 'text-[#ffffff]' : 'text-[#000000]'}`}>
                                            <Image
                                                src="/assets/refer/empty.svg"
                                                alt="emplty table"
                                                width={107}
                                                height={104}
                                            />
                                            <p > No Record Found </p>
                                        </div>
                                    }
                                </div>
                            </div>
                        </>
                    }
                    {
                        show === 2 &&
                        <>
                            {/* This is for desktop sell/bids */}
                            <div className='min-h-[320px] max-h-[320px] overflow-y-auto  mt-30'>
                                {/* table head */}
                                <div className='grid grid-cols-3 gap-10 min-w-[372]'>
                                    <div className="flex ">
                                        <p className='info-12'>Price USDT</p>
                                        <Image src="/assets/history/uparrow.svg" width={15} height={15} alt="uparrow" />
                                    </div>
                                    <div className="flex justify-center">
                                        <p className='info-12 text-center'>Qty {props?.slug}</p>
                                        <Image src="/assets/history/uparrow.svg" width={15} height={15} alt="uparrow" />
                                    </div>
                                    <div className="flex justify-end">
                                        <p className='info-12 text-end'>Total USDT</p>
                                        <Image src="/assets/history/uparrow.svg" width={15} height={15} alt="uparrow" />
                                    </div>
                                </div>
                                {/* table content */}
                                <div className='mt-10'>
                                    {props.sellTrade && props.sellTrade.length > 0 && props.sellTrade.map((item: any, index: number) => {
                                        if (item.order_type === 'sell') {
                                            return <div key={index + 'sell2'} className='grid grid-cols-3 gap-10 min-w-[372] relative mb-[5px]'>
                                                <p className='info-12 !text-[14px] z-[2] !text-sell whitespace-nowrap'>$ {currencyFormatter(truncateNumber(item?.limit_usdt, 8))}</p>
                                                <p className='info-12 !text-[14px] z-[2] text-center'>{currencyFormatter(truncateNumber(item?.token_amount, 8))}</p>
                                                <p className='info-12 text-end z-[2] !text-[14px] px-[2px]'>$ {currencyFormatter(truncateNumber(item?.volume_usdt, 8))}</p>
                                                <div className='absolute top-0 z-[1] right-0 w-[70%] h-full bg-red-light duration-300 tmb-bg-overlay' style={{
                                                    width: `${props?.width}%`,
                                                }}></div>
                                            </div>
                                        }
                                    })}

                                    {props.sellTrade && props.sellTrade.length === 0 &&
                                        <div className={` py-[50px] flex flex-col items-center justify-center ${mode === "dark" ? 'text-[#ffffff]' : 'text-[#000000]'}`}>
                                            <Image
                                                src="/assets/refer/empty.svg"
                                                alt="emplty table"
                                                width={107}
                                                height={104}
                                            />
                                            <p > No Record Found </p>
                                        </div>
                                    }
                                </div>
                            </div>
                            <button type='button' className={`solid-button w-full my-20 ${Number(props?.hlocData?.changeRate) > 0 ? 'bg-buy ' : 'bg-sell '} `}>
                                $ {currencyFormatter(props.sellTrade?.[props.sellTrade.length - 1]?.limit_usdt?.toFixed(5))}
                            </button>

                        </>

                    }
                    {
                        show === 3 &&
                        <>
                            {/* This is for desktop buy/asks */}
                            <div className='min-h-[320px] max-h-[320px] overflow-y-auto  mt-30'>
                                {/* table head */}
                                <div className='grid grid-cols-3 gap-10 min-w-[372]'>
                                    <div className="flex ">
                                        <p className='info-12'>Price USDT</p>
                                        <Image src="/assets/history/uparrow.svg" width={15} height={15} alt="uparrow" />
                                    </div>
                                    <div className="flex justify-center">
                                        <p className='info-12 text-center'>Qty {props?.slug}</p>
                                        <Image src="/assets/history/uparrow.svg" width={15} height={15} alt="uparrow" />
                                    </div>
                                    <div className="flex justify-end">
                                        <p className='info-12 text-end'>Total USDT</p>
                                        <Image src="/assets/history/uparrow.svg" width={15} height={15} alt="uparrow" />
                                    </div>
                                </div>
                                {/* table content */}
                                <div className='mt-10'>
                                    {props.BuyTrade && props.BuyTrade.length > 0 && props.BuyTrade.map((item: any, index: number) => {
                                        if (item.order_type === 'buy') {
                                            return <div key={index + 'buy2'} className='grid grid-cols-3 gap-10 min-w-[372] relative mb-[5px]'>
                                                <p className='info-12 !text-[14px] z-[2] !text-buy whitespace-nowrap'>$ {currencyFormatter(truncateNumber(item?.limit_usdt, 8))}</p>
                                                <p className='info-12 !text-[14px] z-[2] text-center'>{currencyFormatter(truncateNumber(item?.token_amount, 8))}</p>
                                                <p className='info-12 text-end z-[2] !text-[14px] px-[2px]'>$ {currencyFormatter(truncateNumber(item?.volume_usdt, 8))}</p>
                                                <div className='absolute top-0 z-[1] right-0 w-[70%] h-full bg-green tmb-bg-overlay duration-300' style={{
                                                    width: `${props?.width}%`,
                                                }}></div>
                                            </div>
                                        }
                                    })}


                                    {props.BuyTrade && props.BuyTrade.length === 0 &&
                                        <div className={` py-[50px] flex flex-col items-center justify-center ${mode === "dark" ? 'text-[#ffffff]' : 'text-[#000000]'}`}>
                                            <Image
                                                src="/assets/refer/empty.svg"
                                                alt="emplty table"
                                                width={107}
                                                height={104}
                                            />
                                            <p > No Record Found </p>
                                        </div>
                                    }
                                </div>
                            </div>
                            <button type='button' className={`solid-button w-full my-20 bg-buy `}>
                                $ {currencyFormatter(props.BuyTrade?.[props.BuyTrade.length - 1]?.limit_usdt?.toFixed(5))}
                            </button>
                        </>
                    }
                </>
            }

            {active1 === 2 &&
                <>
                    {/* This is for desktop sell/bids */}
                    <div className='min-h-[320px] max-h-[320px] overflow-y-auto  mt-30'>
                        {/* table head */}
                        <div className='grid grid-cols-3 gap-10 min-w-[372]'>
                            <div className="flex ">
                                <p className='info-12'>Price USDT</p>
                                <Image src="/assets/history/uparrow.svg" width={15} height={15} alt="uparrow" />
                            </div>
                            <div className="flex justify-center">
                                <p className='info-12 text-center'>Qty {props.slug}</p>
                                <Image src="/assets/history/uparrow.svg" width={15} height={15} alt="uparrow" />
                            </div>
                            <div className="flex justify-end">
                                <p className='info-12 text-end'>Total USDT</p>
                                <Image src="/assets/history/uparrow.svg" width={15} height={15} alt="uparrow" />
                            </div>
                        </div>
                        {/* table content */}
                        <div className='mt-10'>

                            {props.allTradeHistory && props.allTradeHistory.length > 0 && props.allTradeHistory.map((item: any, index: number) => {
                                if (item.order_type === 'buy') {
                                    return <div key={index + 'buy22'} className='grid grid-cols-3 gap-10 min-w-[372] relative mb-[5px]'>
                                        <p className='info-12 !text-[14px] z-[2] !text-buy whitespace-nowrap'>$ {currencyFormatter(truncateNumber(item?.limit_usdt, 8))}</p>
                                        <p className='info-12 !text-[14px] z-[2] text-center'>{currencyFormatter(truncateNumber(item?.token_amount, 8))}</p>
                                        <p className='info-12 text-end z-[2] !text-[14px] px-[2px]'>$ {currencyFormatter(truncateNumber(item?.volume_usdt, 8))}</p>
                                        <div className='absolute top-0 z-[1] right-0 w-[70%] h-full bg-green duration-300 tmb-bg-overlay' style={{
                                            width: `${props?.width}%`,
                                        }}></div>
                                    </div>
                                }
                                else {
                                    return <div className='grid grid-cols-3 gap-10 min-w-[372] relative mb-[5px]'>
                                        <p className='info-12 !text-[14px] z-[2] !text-sell whitespace-nowrap'>$ {currencyFormatter(truncateNumber(item?.limit_usdt, 8))}</p>
                                        <p className='info-12 !text-[14px] z-[2] text-center'>{currencyFormatter(truncateNumber(item?.token_amount, 8))}</p>
                                        <p className='info-12 text-end z-[2] !text-[14px] px-[2px]'>$ {currencyFormatter(truncateNumber(item?.volume_usdt, 8))}</p>
                                        <div className='absolute top-0 z-[1] right-0 w-[70%] h-full bg-red-light tmb-bg-overlay duration-300' style={{
                                            width: `${props?.width}%`,
                                        }}></div>
                                    </div>
                                }
                            })}

                            {props.allTradeHistory && props.allTradeHistory.length === 0 &&
                                <div className={`py-[50px] flex flex-col items-center justify-center ${mode === "dark" ? 'text-[#ffffff]' : 'text-[#000000]'}`}>
                                    <Image
                                        src="/assets/refer/empty.svg"
                                        alt="emplty table"
                                        width={107}
                                        height={104}
                                    />
                                    <p > No Record Found </p>
                                </div>
                            }
                        </div>
                    </div>
                </>
            }
        </div>
    )
}

export default OrderBook;