import React, { useState, useContext, useEffect } from 'react'
import IconsComponent from '../snippets/icons';
import Image from 'next/image';
import Context from "../contexts/context";
import { currencyFormatter } from '../snippets/market/buySellCard';

interface propsData {
    slug?: any;
    token?: any;
    allTradeHistory?:any;
    sellTrade?:any;
    BuyTrade?:any;
    hlocData?:any;
}

const OrderBookMobile = (props: propsData) => {
    const [active1Mobile, setActive1Mobile] = useState(1);

    const { mode } = useContext(Context);

    // const [props.sellTrade, setSellTrade] = useState([]);
    // const [props.BuyTrade, setprops.BuyTrade] = useState([]);
    // const [props.allTradeHistory, setAllTradeHistory] = useState([]);

    // useEffect(() => {
    //     getAllMarketOrderByToken(props.slug);
    // }, [props.slug]);

    // const filterBuySellRecords = (data: any) => {
    //     if (data && data.length > 0) {
    //         let sellRecord = data.filter((item: any) => {
    //             return item.order_type === 'sell'
    //         })

    //         let buyRecord = data.filter((item: any) => {
    //             return item.order_type === 'buy'
    //         })
    //         setSellTrade(sellRecord);
    //         setprops.BuyTrade(buyRecord);
    //     }
    //     else {
    //         setSellTrade([]);
    //         setprops.BuyTrade([]);
    //     }
    // }

    // const getAllMarketOrderByToken = async (symbol: any) => {

    //     let marketHistory = await fetch(`${process.env.NEXT_PUBLIC_BASEURL}/market/token_trade_history?token_id=${props?.token?.id}`, {
    //         method: "GET",
    //         headers: {
    //             'Content-Type': 'application/json',
    //         },
    //     }).then(response => response.json());

    //     setAllTradeHistory(marketHistory?.data);

    //     filterBuySellRecords(marketHistory?.data);
    // }

    return (
        <>
            <div className='p-[20px] rounded-10  bg-white dark:bg-d-bg-primary'>
                {/* ta cta */}
                <div className='flex items-start gap-20 justify-between mb-40 border-b border-[#e9eaf026]'>
                    <div className="flex  gap-30  max-w-[calc(100%-25px)] w-full">
                        <button className={` sec-text text-center text-gamma border-b-2 border-[transparent] pb-[15px] max-w-[50%] w-full ${active1Mobile === 1 && "!text-primary border-primary"}`} onClick={() => setActive1Mobile(1)}>
                            Order Book
                        </button>
                        <button className={`sec-text text-center text-gamma border-b-2 border-[transparent] pb-[15px] max-w-[50%] w-full ${active1Mobile === 2 && "!text-primary border-primary"}`} onClick={() => setActive1Mobile(2)}>
                            Trade History
                        </button>
                    </div>
                    <IconsComponent type='dots' hover={false} active={false} />
                </div>

                <div className='max-h-[320px] overflow-y-auto'>
                    {/* order book buy or sell in flex */}
                    {
                        active1Mobile === 1 &&
                        <div className='flex md:flex-row flex-col gap-20'>
                            <div className='max-w-full md:max-w-[50%] w-full'>
                                {/* table head */}
                                <div className='grid grid-cols-2 gap-10 mb-[15px]'>
                                    <div className="flex ">
                                        <p className='info-12 !text-[10px]'>Price USDT</p>
                                        <Image src="/assets/history/uparrow.svg" width={15} height={15} alt="uparrow" />
                                    </div>
                                    <div className="flex justify-end">
                                        <p className='info-12 text-center !text-[10px]'>Qty {props?.slug}</p>
                                        <Image src="/assets/history/uparrow.svg" width={15} height={15} alt="uparrow" />
                                    </div>
                                </div>

                                {/* table content */}
                                <div>
                                    {props.allTradeHistory && props.allTradeHistory.length > 0 && props.allTradeHistory.map((item: any, index:number) => {
                                        if (item.order_type === 'buy') {
                                            return <div key={index+Date.now()} className='grid grid-cols-2 gap-10 relative py-[4.5px] mb-[10px]'>
                                                <p className='info-12 z-[2] !text-buy'>$ {currencyFormatter(item?.limit_usdt)}</p>
                                                <p className='info-12 text-end z-[2] px-[2px]'>{currencyFormatter(item?.token_amount)}</p>
                                                <div className='absolute top-0 z-[1] right-0 w-[70%] h-full bg-green'></div>
                                            </div>
                                        }
                                    })}

                                    {props.BuyTrade && props.BuyTrade.length === 0 &&
                                        <div className={` flex flex-col items-center justify-center ${mode === "dark" ? 'text-[#ffffff]' : 'text-[#000000]'}`}>
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
                            <div className='max-w-full md:max-w-[50%] w-full'>
                                {/* table head */}
                                <div className='grid grid-cols-2 gap-10 mb-[15px]'>
                                    <div className="flex ">
                                        <p className='info-12 !text-[10px]'>Price USDT</p>
                                        <Image src="/assets/history/uparrow.svg" width={15} height={15} alt="uparrow" />
                                    </div>
                                    <div className="flex justify-end">
                                        <p className='info-12 text-center !text-[10px]'>Qty {props?.slug}</p>
                                        <Image src="/assets/history/uparrow.svg" width={15} height={15} alt="uparrow" />
                                    </div>
                                </div>
                                {/* table content */}
                                <div>
                                    {props.allTradeHistory && props.allTradeHistory.length > 0 && props.allTradeHistory.map((item: any, index:number) => {
                                        if (item.order_type === 'sell') {
                                            return <div key={Date.now()+index} className='grid grid-cols-2 gap-10 relative py-[4.5px] mb-[10px]'>
                                                <p className='info-12 z-[2] !text-sell'>$ {currencyFormatter(item?.limit_usdt)}</p>
                                                <p className='info-12 text-end z-[2] px-[2px]'>{currencyFormatter(item?.token_amount.toFixed(6))}</p>
                                                <div className='absolute top-0 z-[1] right-0 w-[70%] h-full bg-red-light'></div>
                                            </div>
                                        }
                                    })}
                                    {props.sellTrade && props.sellTrade.length === 0 &&
                                        <div className={` flex flex-col items-center justify-center ${mode === "dark" ? 'text-[#ffffff]' : 'text-[#000000]'}`}>
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
                        </div>
                    }
                    {/* order book buy or sell both mixed */}
                    {
                        active1Mobile === 2 &&
                        <>
                            {/* table head */}
                            <div className='grid grid-cols-2 gap-10 mb-[15px]'>
                                <div className="flex ">
                                    <p className='info-12 !text-[10px]'>Price USDT</p>
                                    <Image src="/assets/history/uparrow.svg" width={15} height={15} alt="uparrow" />
                                </div>
                                <div className="flex justify-end">
                                    <p className='info-12 text-center !text-[10px]'>Qty {props?.slug}</p>
                                    <Image src="/assets/history/uparrow.svg" width={15} height={15} alt="uparrow" />
                                </div>
                            </div>
                            {/* table content */}
                            <div>
                                {props.allTradeHistory && props.allTradeHistory.length > 0 && props.allTradeHistory.map((item: any,index:number) => {
                                    if (item.order_type === 'buy') {
                                        return <div key={Date.now()+index} className='grid grid-cols-2 gap-10 relative py-[4.5px] mb-[10px]'>
                                            <p className='info-12 z-[2] !text-buy'>$ {currencyFormatter(item?.limit_usdt)}</p>
                                            <p className='info-12 text-end z-[2] px-[2px]'>{currencyFormatter(item?.token_amount)}</p>
                                            <div className='absolute top-0 z-[1] right-0 w-[70%] h-full bg-green'></div>
                                        </div>
                                    }
                                    else {
                                        return <div key={Date.now()+index+'22'} className='grid grid-cols-2 gap-10 relative py-[4.5px] mb-[10px]'>
                                            <p className='info-12 z-[2] !text-sell'>$ {currencyFormatter(item?.limit_usdt)}</p>
                                            <p className='info-12 text-end z-[2] px-[2px]'>{currencyFormatter(item?.token_amount)}</p>
                                            <div className='absolute top-0 z-[1] right-0 w-[70%] h-full bg-red-light'></div>
                                        </div>
                                    }
                                })}

                                {props.allTradeHistory && props.allTradeHistory.length === 0 &&
                                    <div className={` flex flex-col items-center justify-center ${mode === "dark" ? 'text-[#ffffff]' : 'text-[#000000]'}`}>
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
                        </>
                    }
                </div>

                <div>
                    <button type='button' className='solid-button w-full bg-buy mt-20'>$ {props?.token?.price.toFixed(4)}</button>
                </div>


            </div>
        </>
    )
}

export default OrderBookMobile;