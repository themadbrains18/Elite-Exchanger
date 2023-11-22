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

        <div className='flex'>
            <div className='w-full max-w-[calc(100%-300px)]'>
                <TopBar show={show1} setShow={setShow1} />
                <div className='flex'>
                    <div className='w-full max-w-full max-w-[calc(100%-300px)]'>
                        <div className='flex relative w-full max-w-full'>
                            <div className={`w-full max-w-[380px] max-[1500px]:absolute duration-300 z-[99] max-[1500px]:top-0 ${show1 ? 'max-[1500px]:left-0':'max-[1500px]:left-[-100%]'}`}>
                                <CoinTypes />
                            </div>
                            <div className='max-[1499px]:pl-[20px] w-full max-w-full min-[1500px]:max-w-[calc(100%-380px)]'>
                                <FutureChart />
                            </div>
                        </div>
                    </div>
                    <div className='w-full max-w-[300px]'>
                        <OrderBookFuture setShow={setShow} show={show} />
                        <MarketTrades setShow={setShow} show={show} />
                    </div>
                </div>
                <ChartTabsFuture />
            </div>
            <div>
                <BuySell />
                <MarginRatio />
            </div>
        </div>
           {/* <TopBar />
           <div className='flex items-start'>

                <BuySell />
                <MarginRatio />
                <OrderBookFuture />
                <MarketTrades />
                <CoinTypes />

           </div>
            <ChartTabsFuture />
            <FutureChart /> */}
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