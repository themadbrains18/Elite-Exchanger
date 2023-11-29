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

interface Session {
    session: {
        user: any
    },
    provider: any,
    coinList: any,
    assets: any
}

const Chart = (props: Session) => {

    const router = useRouter();

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
        setAllCoins(tokenList?.data);
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

    const getAllMarketOrderByToken = async (symbol:any) => {
        
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

    const filterBuySellRecords = (data:any) => {
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
        else{
            setSellTrade([]);
            setBuyTrade([]);
        }
    }

    
    return (
        <>
            <div>
                <ToastContainer />
                <div className=" bg-light-v-1 py-20 dark:bg-black-v-1">
                    <div className="container p-[15px] lg:p-20 gap-30">
                        <ChartBanner token={currentToken[0]} />
                    </div>
                    <div className="container p-[15px] lg:p-20 flex gap-30 flex-wrap">
                        <div className="max-w-full lg:max-w-[calc(100%-463px)] w-full">
                            <ChartSec slug={`${slug}USDT`} />
                            {/* hidden on mobile */}
                            <div className='lg:block hidden'>
                                <ChartTabs coinsList={allCoins} openOrder={orders} tradehistory={userTradeHistory} getUserOpenOrder={getUserOpenOrder} getUserTradeHistory={getUserTradeHistory} />
                            </div>
                        </div>
                        <div className="max-w-full lg:max-w-[432px] w-full">
                            <div className="lg:block hidden ">
                                <BuySellCard id={1} coins={allCoins} session={props.session} token={currentToken[0]} slug={slug} assets={props.assets} getUserOpenOrder={getUserOpenOrder} getUserTradeHistory={getUserTradeHistory} />
                                {/* hidden on mobile */}
                                <div className='lg:block hidden'>
                                    <OrderBook slug={slug} token={currentToken[0]} allTradeHistory={allTradeHistory} sellTrade={sellTrade} BuyTrade={BuyTrade}/>
                                </div>
                            </div>
                            {/* hidden on desktop */}
                            <div className='lg:hidden'>
                                <OrderBookMobile slug={slug} token={currentToken[0]} allTradeHistory={allTradeHistory} sellTrade={sellTrade} BuyTrade={BuyTrade}/>
                                <ChartTabs coinsList={allCoins} openOrder={orders} tradehistory={userTradeHistory} getUserOpenOrder={getUserOpenOrder} getUserTradeHistory={getUserTradeHistory}/>
                            </div>
                        </div>
                    </div>
                    <div className="lg:hidden">
                        <ResponsiveFixCta coins={allCoins} session={props.session} token={currentToken[0]} slug={slug} assets={props.assets} getUserOpenOrder={getUserOpenOrder} getUserTradeHistory={getUserTradeHistory} />
                    </div>
                </div>
            </div>
        </>
    )
}

export default Chart

export async function getServerSideProps(context: GetServerSidePropsContext) {
    const { req } = context;
    const session = await getServerSession(context.req, context.res, authOptions);
    const providers = await getProviders();

    let tokenList = await fetch(`${process.env.NEXT_PUBLIC_BASEURL}/token`, {
        method: "GET"
    }).then(response => response.json());

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
            coinList: tokenList?.data,
            assets: userAssets
        },
    };

}