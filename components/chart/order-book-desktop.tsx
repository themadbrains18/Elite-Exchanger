import Image from 'next/image';
import Context from "../contexts/context";
import React, { useContext, useEffect, useState } from 'react'

interface propsData {
    slug?: any;
    token?: any;
    allTradeHistory?:any;
    sellTrade?:any;
    BuyTrade?:any;
}

const OrderBook = (props: propsData) => {
    const [active1, setActive1] = useState(1);
    const [show, setShow] = useState(1);
    const { mode } = useContext(Context);

    // const [sellTrade, setSellTrade] = useState([]);
    // const [BuyTrade, setBuyTrade] = useState([]);
    // const [allTradeHistory, setAllTradeHistory] = useState([]);

    // useEffect(() => {
    //     // getAllMarketOrderByToken();
    // }, [props.slug,props.token]);

    // const filterBuySellRecords = (data:any) => {
    //     if (data && data.length > 0) {
    //         let sellRecord = data.filter((item: any) => {
    //             return item.order_type === 'sell'
    //         })

    //         let buyRecord = data.filter((item: any) => {
    //             return item.order_type === 'buy'
    //         })
    //         setSellTrade(sellRecord);
    //         setBuyTrade(buyRecord);
    //     }
    //     else{
    //         setSellTrade([]);
    //         setBuyTrade([]);
    //     }
    // }

    // const getAllMarketOrderByToken = async () => {
        
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
        <div className='mt-30 px-30 py-40 rounded-10  bg-white dark:bg-d-bg-primary'>
            {/* ta cta */}
            <div className="flex border-b border-[#e9eaf026] gap-30 mb-40">
                <button className={` sec-text text-center text-gamma border-b-2 border-[transparent] pb-[15px] max-w-[50%] w-full ${active1 === 1 && "!text-primary border-primary"}`} onClick={() => setActive1(1)}>
                    Order Book
                </button>
                <button className={` sec-text text-center text-gamma border-b-2 border-[transparent] pb-[15px] max-w-[50%] w-full ${active1 === 2 && "!text-primary border-primary"}`} onClick={() => setActive1(2)}>
                    Trade History
                </button>
            </div>

            {active1 === 1 &&
                <>
                    {/* tab content */}
                    <div className='p-10 bg-grey dark:bg-black-v-1 rounded-[5px] flex items-center gap-10'>
                        <button className={`solid-button py-[10px] ${show === 1 ? "dark:bg-primary  dark:!text-white" : "dark:bg-d-bg-primary bg-grey !text-gamma"}  rounded-[5px]`} onClick={() => { setShow(1) }}>All</button>
                        <button className={`solid-button py-[10px] ${show === 2 ? "dark:bg-primary  dark:!text-white" : " dark:bg-d-bg-primary bg-grey !text-gamma"}  rounded-[5px]`} onClick={() => { setShow(2) }}>Asks</button>
                        <button className={`solid-button py-[10px] ${show === 3 ? "dark:bg-primary  dark:!text-white" : " dark:bg-d-bg-primary bg-grey !text-gamma"} rounded-[5px]`} onClick={() => { setShow(3) }}>Bids</button>
                    </div>
                    {
                        show === 1 &&
                        <>
                            {/* This is for desktop buy/asks */}
                            <div className='max-h-[320px] overflow-y-auto  mt-30'>
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
                                    {props.allTradeHistory && props.allTradeHistory.length > 0 && props.allTradeHistory.map((item: any) => {
                                        if (item.order_type === 'buy') {
                                            return <div className='grid grid-cols-3 gap-10 min-w-[372] relative py-[6px] mb-[5px]'>
                                                <p className='info-12 !text-[14px] z-[2] !text-buy'>$ {item?.limit_usdt}</p>
                                                <p className='info-12 !text-[14px] z-[2] text-center'>{item?.token_amount}</p>
                                                <p className='info-12 text-end z-[2] !text-[14px]'>$ {item?.volume_usdt}</p>
                                                <div className='absolute top-0 z-[1] right-0 w-[70%] h-full bg-green'></div>
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

                            <div>
                                <button type='button' className='solid-button w-full bg-buy my-20'>$ {props?.token?.price.toFixed(4)}</button>
                            </div>

                            {/* This is for desktop sell/bids */}
                            <div className='max-h-[320px] overflow-y-auto '>
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
                                    {props.allTradeHistory && props.allTradeHistory.length > 0 && props.allTradeHistory.map((item: any) => {
                                        if (item.order_type === 'sell') {
                                            return <div className='grid grid-cols-3 gap-10 min-w-[372] relative py-[6px] mb-[5px]'>
                                                <p className='info-12 !text-[14px] z-[2] !text-sell'>$ {item?.limit_usdt}</p>
                                                <p className='info-12 !text-[14px] z-[2] text-center'>{item?.token_amount}</p>
                                                <p className='info-12 text-end z-[2] !text-[14px]'>$ {item?.volume_usdt}</p>
                                                <div className='absolute top-0 z-[1] right-0 w-[70%] h-full bg-red-light'></div>
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
                            <div className='max-h-[320px] overflow-y-auto  mt-30'>
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
                                    {props.allTradeHistory && props.allTradeHistory.length > 0 && props.allTradeHistory.map((item: any) => {
                                        if (item.order_type === 'sell') {
                                            return <div className='grid grid-cols-3 gap-10 min-w-[372] relative py-[6px] mb-[5px]'>
                                                <p className='info-12 !text-[14px] z-[2] !text-sell'>$ {item?.limit_usdt}</p>
                                                <p className='info-12 !text-[14px] z-[2] text-center'>{item?.token_amount}</p>
                                                <p className='info-12 text-end z-[2] !text-[14px]'>$ {item?.volume_usdt}</p>
                                                <div className='absolute top-0 z-[1] right-0 w-[70%] h-full bg-red-light'></div>
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
                        show === 3 &&
                        <>
                            {/* This is for desktop buy/asks */}
                            <div className='max-h-[320px] overflow-y-auto  mt-30'>
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
                                    {props.allTradeHistory && props.allTradeHistory.length > 0 && props.allTradeHistory.map((item: any) => {
                                        if (item.order_type === 'buy') {
                                            return <div className='grid grid-cols-3 gap-10 min-w-[372] relative py-[6px] mb-[5px]'>
                                                <p className='info-12 !text-[14px] z-[2] !text-buy'>$ {item?.limit_usdt}</p>
                                                <p className='info-12 !text-[14px] z-[2] text-center'>{item?.token_amount}</p>
                                                <p className='info-12 text-end z-[2] !text-[14px]'>$ {item?.volume_usdt}</p>
                                                <div className='absolute top-0 z-[1] right-0 w-[70%] h-full bg-green'></div>
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
                        </>
                    }
                </>
            }
            {active1 === 2 &&
                <>
                    {/* This is for desktop sell/bids */}
                    <div className='max-h-[320px] overflow-y-auto  mt-30'>
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

                            {props.allTradeHistory && props.allTradeHistory.length > 0 && props.allTradeHistory.map((item: any) => {
                                if (item.order_type === 'buy') {
                                    return <div className='grid grid-cols-3 gap-10 min-w-[372] relative py-[6px] mb-[5px]'>
                                        <p className='info-12 !text-[14px] z-[2] !text-buy'>$ {item?.limit_usdt}</p>
                                        <p className='info-12 !text-[14px] z-[2] text-center'>{item?.token_amount}</p>
                                        <p className='info-12 text-end z-[2] !text-[14px]'>$ {item?.volume_usdt}</p>
                                        <div className='absolute top-0 z-[1] right-0 w-[70%] h-full bg-green'></div>
                                    </div>
                                }
                                else {
                                    return <div className='grid grid-cols-3 gap-10 min-w-[372] relative py-[6px] mb-[5px]'>
                                        <p className='info-12 !text-[14px] z-[2] !text-sell'>$ {item?.limit_usdt}</p>
                                        <p className='info-12 !text-[14px] z-[2] text-center'>{item?.token_amount}</p>
                                        <p className='info-12 text-end z-[2] !text-[14px]'>$ {item?.volume_usdt}</p>
                                        <div className='absolute top-0 z-[1] right-0 w-[70%] h-full bg-red-light'></div>
                                    </div>
                                }
                            })}

                            {props.allTradeHistory && props.allTradeHistory.length === 0 &&
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
        </div>
    )
}

export default OrderBook;