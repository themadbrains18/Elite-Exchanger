import ChartBanner from '@/components/chart/chart-banner'
import BuySellCard from '@/components/snippets/buySellCard'
import React, { useEffect, useState } from 'react'
import ChartSec from '@/components/chart/chart-sec';
import OrderBook from '@/components/chart/order-book-desktop';
import ChartTabs from '@/components/chart/chart-tabs';
import OrderBookMobile from '@/components/chart/order-book-mobile';
import ResponsiveFixCta from '@/components/market/responsive-fix-cta';
import { getProviders } from "next-auth/react"
import { getServerSession } from "next-auth/next"
import { GetServerSidePropsContext } from 'next'
import { authOptions } from '../../api/auth/[...nextauth]';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useRouter } from "next/router";
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
    const [width, setWidth] = useState<number>(0);


    useEffect(() => {
        if (window.innerWidth < 768) {
            setView("mobile")
        }
        else {
            setView("desktop")
        }
        refreshTokenList();
    }, [slug]);

    useEffect(() => {
        if (!wbsocket) return;
    
        const handleSocketMessage = (event:any) => {
            const data = JSON.parse(event.data).data;
            const eventDataType = JSON.parse(event.data).type;
    
            if (eventDataType === "price" || eventDataType === "market") {
                refreshTokenList();
            }
        };
    
        wbsocket.onmessage = handleSocketMessage;
    
        return () => {
            wbsocket.onmessage = null;  // Cleanup to avoid memory leaks
        };
    }, [wbsocket, slug]);

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

    const getTokenUserTradeHistory = async (token_id: string) => {
    
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



    const filterBuySellRecords = (data: any) => {
        // console.log(slug,"slug");


        if (data && data.length > 0) {
            let sellRecord = data.filter((item: any) => {
                return item.order_type === 'sell' && item?.global_token ? item?.global_token?.symbol === slug : item?.token?.symbol === slug
            })

            let buyRecord = data.filter((item: any) => {
                return item.order_type === 'buy' && item?.global_token ? item?.global_token?.symbol === slug : item?.token?.symbol === slug
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
    
        // return () => clearInterval(intervalId);
      }, []);

    return (
        <>
            <div>
                <ToastContainer limit={1} />
                <div className=" bg-light-v-1 py-20 dark:bg-black-v-1">
                    <div className="container !max-w-[1830px] p-[15px] lg:p-20 gap-30">
                        <ChartBanner hlocData={hlocData} />
                    </div>
                    <div className="container !max-w-[1830px] p-[15px] lg:p-20 flex gap-30 flex-wrap">
                        <div className="max-w-full lg:max-w-[calc(100%-463px)] w-full">
                            <ChartSec slug={`${slug === 'BTCB' ? 'BTC' : slug === 'BNBT' ? 'BNB' : slug}USDT`} view={view} />
                            {/* hidden on mobile */}
                            <div className='lg:block hidden'>
                                <ChartTabs slug={slug} coinsList={allCoins} openOrder={orders} tradehistory={userTradeHistory} />
                            </div>
                        </div>
                        <div className="max-w-full lg:max-w-[432px] w-full">
                            <div className="lg:block hidden ">
                                <BuySellCard id={1} coins={allCoins} session={props.session} token={currentToken[0]} slug={slug} assets={props.assets} />
                                {/* hidden on mobile */}
                                <div className='lg:block hidden'>
                                    <OrderBook slug={slug} width={width} token={currentToken[0]} allTradeHistory={userTradeHistory} sellTrade={sellTrade} BuyTrade={BuyTrade} hlocData={hlocData} />
                                </div>
                            </div>
                            {/* hidden on desktop */}
                            <div className='lg:hidden'>
                                <OrderBookMobile width={width} slug={slug} token={currentToken[0]} allTradeHistory={allTradeHistory} sellTrade={sellTrade} BuyTrade={BuyTrade} hlocData={hlocData} />
                                <ChartTabs slug={slug} coinsList={allCoins} openOrder={orders} tradehistory={userTradeHistory} />
                            </div>
                        </div>
                    </div>
                    <div className="lg:hidden">
                        <ResponsiveFixCta coins={allCoins} session={props.session} token={currentToken[0]} slug={slug} assets={props.assets} />
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