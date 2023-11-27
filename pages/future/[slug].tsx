import ChartBanner from '@/components/chart/chart-banner'
import BuySellCard from '@/components/snippets/buySellCard'
import React, { useEffect, useState } from 'react'
import ChartSec from '@/components/chart/chart-sec';
import OrderBook from '@/components/chart/order-book-desktop';
import ChartTabs from '@/components/chart/chart-tabs';
import OrderBookMobile from '@/components/chart/order-book-mobile';
import ResponsiveFixCta from '@/components/market/responsive-fix-cta';

import { getProviders, signOut } from "next-auth/react"
import { getServerSession } from "next-auth/next"
import { GetServerSidePropsContext, InferGetServerSidePropsType } from 'next'
import { authOptions } from '../api/auth/[...nextauth]';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useRouter } from "next/router";
import TopBar from '/components/future/top-bar';
import BuySell from '/components/future/buy-sell';
import MarginRatio from '/components/future/margin-ratio';
import OrderBookFuture from '/components/future/order-book/order-book';
import MarketTrades from '@/components/future/order-book/market-trade-table';
import CoinTypes from '@/components/future/coin-types';
import ChartTabsFuture from '@/components/future/chart-tabs-future';
import FutureChart from '@/components/future/future-chart';
import MarginMode from '@/components/future/popups/margin-mode';
import BlockBusterCard from '@/components/future/test';
import SwapModal from '@/components/future/popups/swap-modal';
import TipsModal from '@/components/future/popups/tips.modal';

interface Session {
    session: {
        user: any
    },
    provider: any,
    coinList: any,
    assets: any
}

const FutureTrading = (props: Session) => {

    const router = useRouter();
    const [show,setShow] = useState(1);
    const [marginMode,setMarginMode] = useState(0);
    const [overlay,setOverlay] = useState(false);
    const [showMob,setShowMob] = useState(1);
    const [show1,setShow1] = useState(false)
    const [orders, setMarketOrders] = useState([]);
    const [userTradeHistory, setUserTradeHistory] = useState([]);
    const [currentToken, setCurrentToken] = useState([]);
    const [allCoins, setAllCoins] = useState(props.coinList);
    const [allTradeHistory, setAllTradeHistory] = useState([]);

    const [sellTrade, setSellTrade] = useState([]);
    const [BuyTrade, setBuyTrade] = useState([]);

    const { slug } = router.query;

    // let currentToken = props.coinList.filter((item: any) => {
    //     return item.symbol === slug
    // })

    useEffect(() => {
        const websocket = new WebSocket('ws://localhost:3001/');

        websocket.onopen = () => {
            console.log('connected');
        }

        websocket.onmessage = (event) => {
            const data = JSON.parse(event.data).data;
            let eventDataType = JSON.parse(event.data).type;
            if (eventDataType === "price") {
                refreshTokenList()
            }
            if (eventDataType === "market") {
                if (props.session) {
                    getUserOpenOrder(slug);
                    getUserTradeHistory(slug);
                }
                getAllMarketOrderByToken(slug);
            }
        }

    }, [slug])

    const refreshTokenList = async () => {
        let tokenList = await fetch(`${process.env.NEXT_PUBLIC_BASEURL}/token`, {
            method: "GET"
        }).then(response => response.json());

        let ccurrentToken = tokenList?.data.filter((item: any) => {
            return item.symbol === slug
        })
        let future = tokenList?.data.filter((item: any) => {
            return item.futureTradePair !== null
        });
        setAllCoins(future);
        setCurrentToken(ccurrentToken);
    }

    useEffect(() => {
        if (props.session) {
            getUserOpenOrder(slug);
            getUserTradeHistory(slug);
        }
        let ccurrentToken = props.coinList.filter((item: any) => {
            return item.symbol === slug
        })

        setCurrentToken(ccurrentToken);
        getAllMarketOrderByToken(slug);

    }, [slug]);

    const getUserOpenOrder = async (symbol: any) => {

        if (props.session) {
            let currentToken = allCoins.filter((item: any) => {
                return item.symbol === symbol
            })
            let openOrder = await fetch(`${process.env.NEXT_PUBLIC_BASEURL}/market?token_id=${currentToken[0]?.id}&userid=${props.session?.user?.user_id}`, {
                method: "GET",
                headers: {
                    "Authorization": props.session?.user?.access_token
                },
            }).then(response => response.json());

            setMarketOrders(openOrder.data);
        }
    }

    const getUserTradeHistory = async (symbol: any) => {

        if (props.session) {
            let currentToken = allCoins.filter((item: any) => {
                return item.symbol === symbol
            })
            let tradeHistory = await fetch(`${process.env.NEXT_PUBLIC_BASEURL}/market/user_trade_history?token_id=${currentToken[0]?.id}&userid=${props.session?.user?.user_id}`, {
                method: "GET",
                headers: {
                    "Authorization": props.session?.user?.access_token
                },
            }).then(response => response.json());

            setUserTradeHistory(tradeHistory?.data);
        }
    }

    const getAllMarketOrderByToken = async (symbol: any) => {

        let currentToken = allCoins.filter((item: any) => {
            return item.symbol === symbol
        })
        let marketHistory = await fetch(`${process.env.NEXT_PUBLIC_BASEURL}/market/token_trade_history?token_id=${currentToken[0]?.id}`, {
            method: "GET",
            headers: {
                'Content-Type': 'application/json',
            },
        }).then(response => response.json());

        setAllTradeHistory(marketHistory?.data?.orderAll);
        filterBuySellRecords(marketHistory?.data?.orderAll);

    }

    const filterBuySellRecords = (data: any) => {
        if (data && data.length > 0) {
            let sellRecord = data.filter((item: any) => {
                return item.order_type === 'sell'
            })

            let buyRecord = data.filter((item: any) => {
                return item.order_type === 'buy'
            })
            setSellTrade(sellRecord);
            setBuyTrade(buyRecord);
        }
        else {
            setSellTrade([]);
            setBuyTrade([]);
        }
    }


    return (
        <>
            {/* <BlockBusterCard /> */}

            <div className='max-[991px]:hidden flex'>
                <div className='w-full max-w-[calc(100%-300px)]'>
                    <TopBar show={show1} setShow={setShow1} />
                    <div className='flex'>
                        <div className='w-full max-w-full max-w-[calc(100%-300px)]'>
                            <div className='flex relative w-full max-w-full'>
                                <div className={`w-full max-w-[380px] max-[1500px]:absolute duration-300 z-[4] max-[1500px]:top-0 ${show1 ? 'max-[1500px]:left-0':'max-[1500px]:left-[-100%]'}`}>
                                    <CoinTypes />
                                </div>
                                <div className='max-[1499px]:pl-[20px] w-full max-w-full min-[1500px]:max-w-[calc(100%-380px)]'>
                                    <FutureChart id={'tradingview_0d0de'} height={true} />
                                </div>
                            </div>
                        </div>
                        <div className='w-full max-w-[300px]'>
                            <OrderBookFuture setShow={setShow} show={show} />
                            <MarketTrades setShow={setShow} show={show} widthFull={true} />
                        </div>
                    </div>
                    <ChartTabsFuture />
                </div>
                <div>
                    <BuySell inputId={'slider_input1'} thumbId={'slider_thumb1'} lineId={'slider_line1'} radioId={'one'} setMarginMode={setMarginMode} marginMode={marginMode} setOverlay={setOverlay} setOverlay={setOverlay} />
                    <MarginRatio />
                </div>
            </div>
            <div className='max-[991px]:block hidden'>
                <div className='relative'>
                    <TopBar show={show1} setShow={setShow1} />
                    <div className={`w-full max-w-full absolute duration-300 z-[4] top-[76px] ${show1 ? 'left-0':'left-[-100%]'}`}>
                        <CoinTypes />
                    </div>
                </div>
                <div className='overflow-x-auto hide-scroller dark:bg-[#1a1b1f] bg-[#fafafa]'>
                    <div className='flex items-center gap-[20px] w-max p-[16px] '>
                        <button className={`admin-body-text relative after:dark:bg-white after:bg-black after:absolute after:bottom-[-3px]  after:left-[50%] after:w-[30px] after:translate-x-[-50%] after:h-[2px] ${showMob === 1 ? 'after:block !text-black dark:!text-white' : 'after:hidden !text-[#a3a8b7]'}`} onClick={() => { setShowMob(1) }}>Chart</button>
                        <button className={`admin-body-text relative after:dark:bg-white after:bg-black after:absolute after:bottom-[-3px]  after:left-[50%] after:w-[30px] after:translate-x-[-50%] after:h-[2px] ${showMob === 2 ? 'after:block !text-black dark:!text-white' : 'after:hidden !text-[#a3a8b7]'}`} onClick={() => { setShowMob(2) }}>Order Book</button>
                        <button className={`admin-body-text relative after:dark:bg-white after:bg-black after:absolute after:bottom-[-3px]  after:left-[50%] after:w-[30px] after:translate-x-[-50%] after:h-[2px] ${showMob === 3 ? 'after:block !text-black dark:!text-white' : 'after:hidden !text-[#a3a8b7]'}`} onClick={() => { setShowMob(3) }}>Market Trades</button>
                    </div>
                    {
                        showMob === 1 &&
                        <FutureChart id={'tradingview_0d0de12'}  />
                    }
                    {
                        showMob === 2 &&
                        <OrderBookFuture setShow={setShow} show={show} widthFull={true} />
                    }
                    {
                        showMob === 3 &&
                        <MarketTrades widthFull={true} setShow={setShow} show={show} />
                    }
                </div>
                <ChartTabsFuture />
                <BuySell setOverlay={setOverlay} setOverlay={setOverlay} inputId={'slider_input2'} thumbId={'slider_thumb2'} lineId={'slider_line2'} fullWidth={true} radioId={'two'} setMarginMode={setMarginMode} marginMode={marginMode}  />
                <MarginRatio fullWidth={true} heightAuto={true} />
            </div>

            {/* overlay */}
            <div className={`sdsadsadd bg-black z-[9] duration-300 fixed top-0 left-0 h-full w-full opacity-0 invisible ${ overlay && '!opacity-[70%] !visible' }`}></div>

            {/* popups */}
            <MarginMode setOverlay={setOverlay} setOverlay={setOverlay} inputId={'slider_input3'} thumbId={'slider_thumb3'} lineId={'slider_line3'} setMarginMode={setMarginMode} marginMode={marginMode} />
            {/* swap popup */}
            <SwapModal setOverlay={setOverlay} setOverlay={setOverlay} setMarginMode={setMarginMode} marginMode={marginMode} />

            {/* tips modal */}
            <TipsModal  setOverlay={setOverlay} setOverlay={setOverlay} setMarginMode={setMarginMode} marginMode={marginMode}/>
        
        </>
    )
}

export default FutureTrading;

export async function getServerSideProps(context: GetServerSidePropsContext) {
    const { req } = context;
    const session = await getServerSession(context.req, context.res, authOptions);
    const providers = await getProviders();

    let tokenList = await fetch(`${process.env.NEXT_PUBLIC_BASEURL}/token`, {
        method: "GET"
    }).then(response => response.json());

    let future = tokenList?.data.filter((item: any) => {
        return item.futureTradePair !== null
    });

    let userAssets: any = [];
    if (session) {
        userAssets = await fetch(`${process.env.NEXT_PUBLIC_BASEURL}/user/assets?userid=${session?.user?.user_id}`, {
            method: "GET",
            headers: {
                "Authorization": session?.user?.access_token
            },
        }).then(response => response.json());
    }

    return {
        props: {
            session: session,
            sessions: session,
            provider: providers,
            coinList: future,
            assets: userAssets
        },
    };

}