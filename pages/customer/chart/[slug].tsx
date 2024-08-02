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
import { GetServerSidePropsContext } from 'next'
import { authOptions } from '../../api/auth/[...nextauth]';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useRouter } from "next/router";
import AES from 'crypto-js/aes';
import { useWebSocket } from '@/libs/WebSocketContext';

interface Session {
    session: {
        user: any
    },
    provider: any,
    coinList: any,
    assets: any,
    userWatchList: any
}

const Chart = (props: Session) => {

    const router = useRouter();
    const [orders, setMarketOrders] = useState([]);
    const [userTradeHistory, setUserTradeHistory] = useState([]);
    const [currentToken, setCurrentToken] = useState([]);
    const [allCoins, setAllCoins] = useState(props.coinList);
    const [allTradeHistory, setAllTradeHistory] = useState([]);
    const [view, setView] = useState("desktop")
    const [sellTrade, setSellTrade] = useState([]);
    const [BuyTrade, setBuyTrade] = useState([]);
    const [hlocData, setHLOCData] = useState<any>(Object);
    let { slug } = router.query;
    const wbsocket = useWebSocket();

    useEffect(() => {
        if (window.innerWidth < 768) {
            setView("mobile")
        }
        else {
            setView("desktop")
        }
        socket();
        refreshTokenList();
    }, [slug, wbsocket]);

    const socket = () => {
        if (wbsocket) {
            wbsocket.onmessage = (event) => {
                const data = JSON.parse(event.data).data;
                let eventDataType = JSON.parse(event.data).type;
                if (eventDataType === "price" || eventDataType === "market") {
                    refreshTokenList()
                }
            }
        }
    };

    const refreshTokenList = async () => {

        let hlocv = await fetch(`${process.env.NEXT_PUBLIC_BASEURL}/price/hloc?slug=${slug}`, {
            method: "GET"
        }).then(response => response.json());

        setHLOCData(hlocv?.data?.data);

        let tokenList = await fetch(`${process.env.NEXT_PUBLIC_BASEURL}/token`, {
            method: "GET"
        }).then(response => response.json());

        let ccurrentToken = tokenList?.data.filter((item: any) => {
            return item.symbol === slug
        })
        setAllCoins(tokenList?.data);
        setCurrentToken(ccurrentToken);
        getTokenUserTradeHistory(ccurrentToken[0]?.id);
        
    }

    const getTokenUserTradeHistory=async(token_id:string)=>{
        addToWatchList(token_id);
        if (props.session) {
            let openOrder = await fetch(`${process.env.NEXT_PUBLIC_BASEURL}/market?token_id=${token_id}&userid=${props.session?.user?.user_id}`, {
                method: "GET",
                headers: {
                    "Authorization": props.session?.user?.access_token
                },
            }).then(response => response.json());

            let tradeHistory = await fetch(`${process.env.NEXT_PUBLIC_BASEURL}/market/user_trade_history?token_id=${token_id}&userid=${props.session?.user?.user_id}`, {
                method: "GET",
                headers: {
                    "Authorization": props.session?.user?.access_token
                },
            }).then(response => response.json());

            setMarketOrders(openOrder.data);
            setUserTradeHistory(tradeHistory?.data);
        }

        let marketHistory = await fetch(`${process.env.NEXT_PUBLIC_BASEURL}/market/token_trade_history?token_id=${token_id}`, {
            method: "GET",
            headers: {
                'Content-Type': 'application/json',
            },
        }).then(response => response.json());

        setAllTradeHistory(marketHistory?.data?.orderAll);
        filterBuySellRecords(marketHistory?.data?.orderAll);
    }

    const addToWatchList = async (tokenid: string) => {
        try {
            if (props?.session) {

                let exist = props.userWatchList.filter((item: any) => {
                    return item?.token_id === tokenid
                })

                if (!exist) {
                    let user_id = props.session.user.user_id;
                    let token_id = tokenid;

                    let obj = {
                        user_id,
                        token_id
                    }

                    const ciphertext = AES.encrypt(JSON.stringify(obj), `${process.env.NEXT_PUBLIC_SECRET_PASSPHRASE}`).toString();
                    let record = encodeURIComponent(ciphertext.toString());
                    let result = await fetch(
                        `/api/watchlist`,
                        {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json",
                                "Authorization": props?.session?.user?.access_token
                            },
                            body: JSON.stringify(record),
                        }
                    ).then((response) => response.json());
                }

            }

        } catch (error: any) {
            toast.error(error.message)
        }
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

    slug = slug
    return (
        <>
            <div>
                <ToastContainer limit={1} />
                <div className=" bg-light-v-1 py-20 dark:bg-black-v-1">
                    <div className="container p-[15px] lg:p-20 gap-30">
                        <ChartBanner hlocData={hlocData} />
                    </div>
                    <div className="container p-[15px] lg:p-20 flex gap-30 flex-wrap">
                        <div className="max-w-full lg:max-w-[calc(100%-463px)] w-full">
                            <ChartSec slug={`${slug === 'BTCB' ? 'BTC' : slug === 'BNBT' ? 'BNB' : slug}USDT`} view={view} />
                            {/* hidden on mobile */}
                            <div className='lg:block hidden'>
                                <ChartTabs slug={slug} coinsList={allCoins} openOrder={orders} tradehistory={userTradeHistory}  />
                            </div>
                        </div>
                        <div className="max-w-full lg:max-w-[432px] w-full">
                            <div className="lg:block hidden ">
                                <BuySellCard id={1} coins={allCoins} session={props.session} token={currentToken[0]} slug={slug} assets={props.assets} />
                                {/* hidden on mobile */}
                                <div className='lg:block hidden'>
                                    <OrderBook slug={slug} token={currentToken[0]} allTradeHistory={userTradeHistory} sellTrade={sellTrade} BuyTrade={BuyTrade} hlocData={hlocData} />
                                </div>
                            </div>
                            {/* hidden on desktop */}
                            <div className='lg:hidden'>
                                <OrderBookMobile slug={slug} token={currentToken[0]} allTradeHistory={allTradeHistory} sellTrade={sellTrade} BuyTrade={BuyTrade} hlocData={hlocData} />
                                <ChartTabs slug={slug} coinsList={allCoins} openOrder={orders} tradehistory={userTradeHistory}  />
                            </div>
                        </div>
                    </div>
                    <div className="lg:hidden">
                        <ResponsiveFixCta coins={allCoins} session={props.session} token={currentToken[0]} slug={slug} assets={props.assets}  />
                    </div>
                </div>
            </div>
        </>
    )
}

export default Chart

export async function getServerSideProps(context: GetServerSidePropsContext) {
    const session = await getServerSession(context.req, context.res, authOptions);
    const providers = await getProviders();
    
    return {
        props: {
            session: session,
            sessions: session,
            provider: providers,
            coinList: [],
            assets: [],
            userWatchList: []
        },
    };

}