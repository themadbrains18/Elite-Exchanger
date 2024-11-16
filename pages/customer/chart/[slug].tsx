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
import Meta from '@/components/snippets/meta';
import { currencyFormatter } from '@/components/snippets/market/buySellCard';
import { truncateNumber } from '@/libs/subdomain';

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
    const [currentToken, setCurrentToken] = useState<any>([]);
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

    /**
     * useEffect hook to handle WebSocket messages.
     * - Listens for messages from the WebSocket.
     * - Parses incoming message data and checks the event type.
     * - If the event type is "price" or "market", it triggers a token list refresh.
     * - Cleans up the WebSocket listener on component unmount to prevent memory leaks.
     */
    useEffect(() => {
        if (!wbsocket) return;
        // Function to handle incoming WebSocket messages
        const handleSocketMessage = (event: any) => {
            const data = JSON.parse(event.data).data;
            const eventDataType = JSON.parse(event.data).type;
            // If event type is "price" or "market", refresh token data
            if (eventDataType === "price" || eventDataType === "market") {
                refreshTokenList();
            }
        };
        wbsocket.onmessage = handleSocketMessage;
        // Cleanup function to remove the message handler on unmount
        return () => {
            wbsocket.onmessage = null;  // Cleanup to avoid memory leaks
        };
    }, [wbsocket, slug]);

    /**
     * Asynchronously refreshes token and HLOC (high, low, open, close) data based on the current slug.
     * - Fetches HLOC data for the current token.
     * - Updates the HLOC state with the fetched data.
     * - Fetches a list of all tokens from the server.
     * - Filters the token list to match the symbol in the slug.
     * - Sets the matching token as the current token.
     * - Calls the function to retrieve the user's trade history for the current token.
     */
    const refreshTokenList = async () => {
        try {
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
        } catch (error) {

        }
    }

    /**
     * getTokenUserTradeHistory
     * - Fetches user-specific and global trade history data for a given token.
     * - Makes requests to fetch open orders, user trade history, and market trade history.
     * - Updates the component state with the fetched data.
     *
     * @param {string} token_id - The unique identifier for the token.
     */
    const getTokenUserTradeHistory = async (token_id: string) => {
        try {
            if (props.session) {
                // Fetch open orders for the user based on the token ID
                let openOrder = await fetch(`${process.env.NEXT_PUBLIC_BASEURL}/market?token_id=${token_id}&userid=${props.session?.user?.user_id}`, {
                    method: "GET",
                    headers: {
                        "Authorization": props.session?.user?.access_token
                    },
                }).then(response => response.json());

                // Fetch user-specific trade history for the token
                let tradeHistory = await fetch(`${process.env.NEXT_PUBLIC_BASEURL}/market/user_trade_history?token_id=${token_id}&userid=${props.session?.user?.user_id}`, {
                    method: "GET",
                    headers: {
                        "Authorization": props.session?.user?.access_token
                    },
                }).then(response => response.json());

                // Update the state with fetched open orders and user trade history
                setMarketOrders(openOrder.data);
                setUserTradeHistory(tradeHistory?.data);
            }

            // Fetch overall market trade history for the specified token
            let marketHistory = await fetch(`${process.env.NEXT_PUBLIC_BASEURL}/market/token_trade_history?token_id=${token_id}`, {
                method: "GET",
                headers: {
                    'Content-Type': 'application/json',
                },
            }).then(response => response.json());

            setAllTradeHistory(marketHistory?.data?.orderAll);
            filterBuySellRecords(marketHistory?.data?.orderAll);
        } catch (error) {
            console.log(error);
        }
    }


    /**
     * filterBuySellRecords
     * - Filters buy and sell records from the provided trade data.
     * - Checks if each record's token symbol matches the current `slug`.
     * - Updates the component state with filtered buy and sell records.
     *
     * @param {any} data - Array of trade data objects to filter by order type and token symbol.
     */
    const filterBuySellRecords = (data: any) => {
        if (data && data.length > 0) {
            // Filter sell records where order type is 'sell' and token symbol matches `slug`
            let sellRecord = data.filter((item: any) => {
                return item.order_type === 'sell' && item?.global_token ? item?.global_token?.symbol === slug : item?.token?.symbol === slug
            })

            // Filter buy records where order type is 'buy' and token symbol matches `slug`
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

    /**
     * useEffect Hook
     * - Randomly generates widths for elements with the class `.tmb-bg-overlay`.
     * - Sets these random widths every second to create a dynamic width effect.
     * - The interval is cleared on unmount to prevent memory leaks.
     *
     * Dependencies: []
     */
    useEffect(() => {

        /**
         * generateRandomWidth
         * - Generates a random width percentage between 30% and 100%.
         * @returns {number} - A random integer representing a width percentage.
         */
        const generateRandomWidth = (): number => {
            return Math.floor(Math.random() * (100 - 30 + 1)) + 30;
        };

        /**
        * applyRandomWidths
        * - Selects all elements with the `.tmb-bg-overlay` class.
        * - Applies a random width to each element.
        */
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

    }, []);

    return (
        <>
            <Meta title={`${currencyFormatter(truncateNumber(currentToken[0]?.price, 1))} ${slug === 'BTCB' ? 'BTC' : slug === 'BNBT' ? 'BNB' : slug}USDT Crypto Planet Spot Trading`} description={`Trade ${slug === 'BTCB' ? 'BTC' : slug === 'BNBT' ? 'BNB' : slug}USDT effortlessly with our user-friendly platform. Access live prices, detailed charts, and expert trading strategies to maximize your investment. Stay updated on market trends and join a vibrant community of traders. Start your ${slug === 'BTCB' ? 'BTC' : slug === 'BNBT' ? 'BNB' : slug}USDT trading journey today!`} />
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

/**
 * Server-side function to fetch and provide necessary data to the page component.
 * 
 * This function fetches the following:
 * - User session data using `getServerSession` to check if the user is authenticated.
 * - A list of available tokens for the future market from `/future?qu=all`.
 * - User assets data from `/assets` and rewards data from `/rewards`, if the user is authenticated.
 * 
 * The returned props are passed to the page component, which includes:
 * - `session`: The authenticated user session object.
 * - `sessions`: Duplicate of `session` for potential use in the page component.
 * - `provider`: The authentication providers fetched from `getProviders()`.
 * - `coinList`: A list of tokens available for trading in the future market.
 * - `assets`: The user's assets retrieved from the `/assets` API.
 * - `userWatchList`: The list of watch coins last time associated with the user.
 * 
 * @async
 * @function getServerSideProps
 * @param {GetServerSidePropsContext} context - The context object provided by Next.js containing request (`req`) and response (`res`).
 * @returns {Promise<object>} The props object to be passed to the page component.
 */
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