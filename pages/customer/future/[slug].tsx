import React, { useEffect, useRef, useState } from 'react'
import { getProviders, signOut } from "next-auth/react"
import { getServerSession } from "next-auth/next"
import { GetServerSidePropsContext } from 'next'
import { authOptions } from '../../api/auth/[...nextauth]';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import TopBar from '@/components/future/top-bar';
import BuySell from '@/components/future/buy-sell';
import MarginRatio from '@/components/future/margin-ratio';
import OrderBookFuture from '@/components/future/order-book/order-book';
import MarketTrades from '@/components/future/order-book/market-trade-table';
import CoinTypes from '@/components/future/coin-types';
import ChartTabsFuture from '@/components/future/chart-tabs-future';
import MarginMode from '@/components/future/popups/margin-mode';
import SwapModal from '@/components/future/popups/swap-modal';
import ChartSec from '@/components/chart/chart-sec';
import TransferModal from '@/components/future/popups/transfer-modal';
import TradingFeeMadal from '@/components/future/popups/trading-fee-madal';
import { useWebSocket } from '@/libs/WebSocketContext';
import { useRouter } from 'next/router';
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
    serverSlug: any;
    rewardsList?: any;
    totalPoint?: any;
}

const FutureTrading = (props: Session) => {
    const [show, setShow] = useState(1);
    const [active, setActive] = useState(1)
    const [marginMode, setMarginMode] = useState({ margin: 'Isolated', leverage: 10 });
    const [popupMode, setPopupMode] = useState(0);
    const [overlay, setOverlay] = useState(false);
    const [showMob, setShowMob] = useState(1);
    const [show1, setShow1] = useState(false);
    const [currentToken, setCurrentToken] = useState<any>([]);
    const [allCoins, setAllCoins] = useState(props.coinList);
    const [positions, setPositionData] = useState([]);
    const [openOrders, setOpenOrders] = useState([]);
    const [allAssets, setAllAssets] = useState(props?.assets);
    const [minTrade, setMinTrade] = useState()
    const [maxTrade, setMaxTrade] = useState()
    const [positionHistoryData, setPositionHistoryData] = useState([]);
    const [openOrderHistoryData, setOpenOrderHistoryData] = useState([]);
    const [topHLOCData, setTopHLOCData] = useState(Object);
    const [positionRecord, setPositionRecord] = useState([]);
    const [opnlong, setOpnlong] = useState('long');
    const router = useRouter();
    const { slug } = router.query;
    const slugRef = useRef(slug); // Store the current slug
    const [rewardsTotalPoint, setRewardsTotalPoint] = useState(props?.totalPoint);
    const wbsocket = useWebSocket();
    const socketListenerRef = useRef<(event: MessageEvent) => void>();

    /**
     * Initializes leverage and margin mode from local storage.
     * - Retrieves `leverage` from `localStorage` if available.
     * - Sets the margin mode to `Isolated` with the stored leverage value if found.
     *
     * Dependencies:
     * - Empty dependency array `[]` ensures this effect runs only once, on mount.
     *
     * @function useEffect
     */
    useEffect(() => {
        const savedLeverage = typeof window !== 'undefined' && localStorage.getItem('leverage');
        if (savedLeverage) {
            setMarginMode({ margin: 'Isolated', leverage: parseInt(savedLeverage) });
        }
    }, []);

    /**
     * Updates the state and fetches data when the `slug` changes.
     * - Updates the `slugRef` with the new `slug`.
     * - Filters the `coinList` to find the matching coin data based on the `slug`.
     * - Sets `minTrade` and `maxTrade` from the filtered coin data if available.
     * - Calls various functions to fetch user-related and coin-related data:
     *   - `getUserFuturePositionData()`
     *   - `getUserOpenOrderData()`
     *   - `getUserFuturePositionHistoryData()`
     *   - `getUserFutureOpenOrderHistoryData()`
     *   - `getCoinHLOCData()`
     *   - `getPositionOrderBook()`
     *
     * Dependencies:
     * - `slug`: The effect runs whenever the `slug` value changes.
     *
     * @function useEffect
     */
    useEffect(() => {
        slugRef.current = slug;
        let ccurrentToken = props.coinList.filter((item: any) => {
            return item.coin_symbol + item.usdt_symbol === slug
        })
        if (ccurrentToken && ccurrentToken?.length > 0) {
            setMinTrade(ccurrentToken[0]?.coin_min_trade)
            setMaxTrade(ccurrentToken[0]?.coin_max_trade)
        }
        setCurrentToken(ccurrentToken);
        getUserFuturePositionData();
        getUserOpenOrderData();
        getUserFuturePositionHistoryData();
        getUserFutureOpenOrderHistoryData();
        getCoinHLOCData();
        getPositionOrderBook();

    }, [slug]);


    /**
     * Establishes a WebSocket connection to listen for incoming messages.
     * - The effect listens for the `message` event on the `wbsocket`.
     * - Depending on the event type (`price` or `position`), different actions are triggered:
     *   - If the event type is `price`, it triggers the following functions:
     *     - `refreshTokenList()`
     *     - `getUserFuturePositionData()`
     *     - `getUserOpenOrderData()`
     *     - `getUserFuturePositionHistoryData()`
     *     - `getUserFutureOpenOrderHistoryData()`
     *   - If the event type is `position`, it triggers the following functions:
     *     - `refreshWalletAssets()`
     *     - `getUserFuturePositionData()`
     *     - `getUserOpenOrderData()`
     *     - `getUserFuturePositionHistoryData()`
     *     - `getUserFutureOpenOrderHistoryData()`
     *     - `getCoinHLOCData()`
     *     - `getPositionOrderBook()`
     *
     * - The `handleSocketMessage` function is added as an event listener on the `wbsocket` for `message` events.
     * - The event listener is cleaned up when the component is unmounted or the `wbsocket` changes.
     *
     * Dependencies:
     * - `wbsocket`: The effect runs whenever the `wbsocket` object changes.
     *
     * @function useEffect
     */
    useEffect(() => {
        const handleSocketMessage = async (event: any) => {
            const data = JSON.parse(event.data).data;
            let eventDataType = JSON.parse(event.data).type;

            if (eventDataType === "price") {
                await refreshTokenList();
                getUserFuturePositionData();
                getUserOpenOrderData();
                getUserFuturePositionHistoryData();
                getUserFutureOpenOrderHistoryData();
            }

            if (eventDataType === 'position') {

                await refreshWalletAssets();
                getUserFuturePositionData();
                getUserOpenOrderData();
                getUserFuturePositionHistoryData();
                getUserFutureOpenOrderHistoryData();
                getCoinHLOCData();
                getPositionOrderBook();
            }
        };

        if (wbsocket && wbsocket.readyState === WebSocket.OPEN) {
            if (socketListenerRef.current) {
                wbsocket.removeEventListener('message', socketListenerRef.current);
            }
            socketListenerRef.current = handleSocketMessage;
            wbsocket.addEventListener('message', handleSocketMessage);
        }

        return () => {
            if (wbsocket) {
                wbsocket.removeEventListener('message', handleSocketMessage);
            }
        };
    }, [wbsocket]);

    /**
     * Fetches and updates the list of available tokens and the current token.
     * 
     * - Makes a GET request to the `/future` endpoint to retrieve a list of tokens.
     * - Filters the tokens to find the current token based on the `slugRef.current` value, which combines the coin symbol and USDT symbol.
     * - Updates the state with the current token and the full list of all tokens.
     * 
     * Dependencies:
     * - `slugRef.current`: The combination of coin symbol and USDT symbol used to filter the token list.
     * 
     * @async
     * @function refreshTokenList
     */
    const refreshTokenList = async () => {
        try {
            let tokenList = await fetch(`${process.env.NEXT_PUBLIC_BASEURL}/future?qu=all`, {
                method: "GET"
            }).then(response => response.json());
            let ccurrentToken = tokenList?.data.filter((item: any) => {
                return (item.coin_symbol + item.usdt_symbol) === slugRef.current
            })
            setCurrentToken(ccurrentToken);
            setAllCoins(tokenList?.data);
        } catch (error) {
            console.log(error);

        }
    }

    /**
     * Fetches the user's future position data and updates the state.
     * 
     * - Calls `refreshWalletAssets` to refresh wallet data before fetching position data.
     * - Makes a GET request to the `/future/position` endpoint, passing the user's ID and access token for authorization.
     * - Updates the state with the fetched position data.
     * 
     * Dependencies:
     * - `props?.session`: The session object containing the user's `user_id` and `access_token`, used for authorization.
     * - `setPositionData`: Function to update the state with the fetched position data.
     * 
     * @async
     * @function getUserFuturePositionData
     */
    const getUserFuturePositionData = async () => {
        try {
            await refreshWalletAssets()
            if (props?.session) {
                let positionData = await fetch(`${process.env.NEXT_PUBLIC_BASEURL}/future/position?userid=${props?.session?.user?.user_id}`, {
                    method: "GET",
                    headers: {
                        "Authorization": props?.session?.user?.access_token
                    },
                }).then(response => response.json());


                setPositionData(positionData?.data);
            }

        } catch (error) {

        }
    }

    /**
     * Fetches the user's open orders and updates the state.
     * 
     * - Makes a GET request to the `/future/openorder` endpoint, passing the user's ID and access token for authorization.
     * - If the response contains data (and no errors), it updates the state with the user's open orders.
     * 
     * Dependencies:
     * - `props?.session`: The session object containing the user's `user_id` and `access_token`, used for authorization.
     * - `setOpenOrders`: Function to update the state with the fetched open orders.
     * 
     * @async
     * @function getUserOpenOrderData
     */
    const getUserOpenOrderData = async () => {
        try {
            if (props?.session) {
                let positionData = await fetch(`${process.env.NEXT_PUBLIC_BASEURL}/future/openorder?userid=${props?.session?.user?.user_id}`, {
                    method: "GET",
                    headers: {
                        "Authorization": props?.session?.user?.access_token
                    },
                }).then(response => response.json());

                if (positionData?.error) {

                }
                else {
                    setOpenOrders(positionData?.data);
                }

            }
        } catch (error) {

        }
    }

    /**
     * Sets the margin mode and leverage for the trading account.
     * 
     * - Updates the margin mode state with the provided margin type and leverage value.
     * - Resets the popup mode to `0` and hides the overlay.
     * 
     * Dependencies:
     * - `setMarginMode`: Function to update the margin mode state with the given margin type and leverage.
     * - `setPopupMode`: Function to reset the popup mode state.
     * - `setOverlay`: Function to hide the overlay.
     * 
     * @param {string} marginType - The type of margin, e.g., "Isolated" or "Cross".
     * @param {number} leverage - The leverage value for the margin type (e.g., 10, 20, 50).
     * 
     * @function setMarginModeAndLeverage
     */
    const setMarginModeAndLeverage = (marginType: string, leverage: number) => {
        setMarginMode({ margin: marginType, leverage: leverage });
        setPopupMode(0);
        setOverlay(false);
    }

    /**
     * Fetches and updates the user's wallet assets and rewards information.
     * 
     * - Retrieves the user's assets based on their user ID and updates the `allAssets` state.
     * - Retrieves the user's total reward points and updates the `rewardsTotalPoint` state.
     * 
     * Dependencies:
     * - `setAllAssets`: Function to update the state of all assets.
     * - `setRewardsTotalPoint`: Function to update the state of the total rewards points.
     * 
     * This function makes two API calls:
     * 1. Fetches assets with pagination (items per page: 20) for the logged-in user.
     * 2. Fetches the total reward points for the logged-in user.
     * 
     * @async
     * @function refreshWalletAssets
     */
    const refreshWalletAssets = async () => {
        let userAssets = await fetch(`${process.env.NEXT_PUBLIC_BASEURL}/assets?user_id=${props?.session?.user?.user_id}&itemOffset=0&itemsPerPage=20`, {
            method: "GET",
            headers: {
                "Authorization": props?.session?.user?.access_token
            },
        }).then(response => response.json());

        setAllAssets(userAssets);

        let rewardsList = await fetch(`${process.env.NEXT_PUBLIC_BASEURL}/rewards?userid=${props?.session?.user?.user_id}`, {
            method: "GET",
            headers: {
                "Authorization": props?.session?.user?.access_token
            },
        }).then(response => response.json());

        setRewardsTotalPoint(rewardsList?.data?.total);
    }

    /**
     * Fetches and updates the user's future position history data.
     * 
     * - Retrieves the historical position data for the user based on their user ID and updates the `positionHistoryData` state.
     * 
     * Dependencies:
     * - `setPositionHistoryData`: Function to update the state of the user's future position history.
     * 
     * This function makes an API call to retrieve the user's historical position data for future trading, based on the user's session and access token.
     * 
     * @async
     * @function getUserFuturePositionHistoryData
     */
    const getUserFuturePositionHistoryData = async () => {
        try {
            if (props?.session) {
                let positionData = await fetch(`${process.env.NEXT_PUBLIC_BASEURL}/future/history/position?userid=${props?.session?.user?.user_id}`, {
                    method: "GET",
                    headers: {
                        "Authorization": props?.session?.user?.access_token
                    },
                }).then(response => response.json());

                setPositionHistoryData(positionData?.data);
            }
        } catch (error) {

        }
    }

    /**
     * Fetches and updates the user's future open order history data.
     * 
     * - Retrieves the user's historical open order data for future trading and updates the `openOrderHistoryData` state.
     * 
     * Dependencies:
     * - `setOpenOrderHistoryData`: Function to update the state with the user's future open order history.
     * 
     * This function makes an API call to retrieve the user's historical open orders related to future trading, based on the user's session and access token.
     * 
     * @async
     * @function getUserFutureOpenOrderHistoryData
     */
    const getUserFutureOpenOrderHistoryData = async () => {
        try {
            if (props?.session) {
                let positionData = await fetch(`${process.env.NEXT_PUBLIC_BASEURL}/future/history/openorder?userid=${props?.session?.user?.user_id}`, {
                    method: "GET",
                    headers: {
                        "Authorization": props?.session?.user?.access_token
                    },
                }).then(response => response.json());

                setOpenOrderHistoryData(positionData?.data);
            }
        } catch (error) {

        }
    }

    /**
     * Fetches and updates the HLOC (High, Low, Open, Close) data for the selected coin.
     * 
     * - Retrieves HLOC data for the coin identified by `props.serverSlug` and updates the `topHLOCData` state.
     * - Makes an API call to fetch the topbar HLOC data using the coin ID from the `props.coinList`.
     * 
     * Dependencies:
     * - `setTopHLOCData`: Function to update the state with the fetched HLOC data.
     * - `props.coinList`: List of coins that includes the `coin_symbol` and `usdt_symbol` used to filter the coin.
     * - `props.serverSlug`: The slug used to filter the coin and identify the selected coin.
     * - `props.session?.user?.access_token`: The user's authentication token required for the API call.
     * 
     * @async
     * @function getCoinHLOCData
     */
    const getCoinHLOCData = async () => {
        try {
            // console.log("herer");

            let ccurrentToken = props.coinList.filter((item: any) => {
                return item.coin_symbol + item.usdt_symbol === props?.serverSlug
            })

            let hlocData = await fetch(`${process.env.NEXT_PUBLIC_BASEURL}/future/topbarhloc?coinid=${ccurrentToken[0]?.coin_id}`, {
                method: "GET",
                headers: {
                    "Authorization": props?.session?.user?.access_token
                },
            }).then(response => response.json());

            setTopHLOCData(hlocData?.data);
        } catch (error) {

        }
    }

    /**
     * Fetches and updates the order book data for the selected coin.
     * 
     * - Retrieves the order book data for the coin identified by `props.serverSlug` and updates the `positionRecord` state.
     * - Makes an API call to fetch the order book data for the coin using the coin ID from `props.coinList`.
     * 
     * Dependencies:
     * - `setPositionRecord`: Function to update the state with the fetched order book data.
     * - `props.coinList`: List of coins that includes the `coin_symbol` and `usdt_symbol` used to filter the coin.
     * - `props.serverSlug`: The slug used to filter the coin and identify the selected coin.
     * 
     * @async
     * @function getPositionOrderBook
     */
    const getPositionOrderBook = async () => {
        try {

            let ccurrentToken = props.coinList.filter((item: any) => {
                return item.coin_symbol + item.usdt_symbol === props?.serverSlug
            })
            let orderBookData = await fetch(`${process.env.NEXT_PUBLIC_BASEURL}/future/orderbook?coinid=${ccurrentToken[0]?.coin_id}`, {
                method: "GET",
            }).then(response => response.json());


            setPositionRecord(orderBookData?.data);
        } catch (error) {

        }
    }

    return (
        <>
            <Meta title={`${currencyFormatter(truncateNumber(currentToken[0]?.token?.price || currentToken[0]?.global_token?.price, 1))} | ${slug} Futures | Crypto Planet Future Trading`} description={`Dive into the world of futures trading with ${slug}! Explore real-time market data, advanced charting tools, and strategic insights to enhance your trading experience. Whether you’re a novice or a seasoned trader, maximize your investment potential with our secure platform. Start trading ${slug} futures today!`} />
            <ToastContainer limit={1} position='top-center' />
            {/* For Desktop use */}
            <div className='max-[991px]:hidden flex max-[1023px]:mt-[57px] mt-[69px]'>
                <div className='w-full max-w-[calc(100%-300px)]'>
                    {/* future trade page top header */}
                    <TopBar show={show1} setShow={setShow1} currentToken={currentToken[0]} topHLOCData={topHLOCData} />
                    <div className='flex'>
                        <div className='w-full max-w-full'>
                            <div className='flex relative w-full max-w-full'>
                                <div className={`w-full max-w-[380px]  absolute duration-300 z-[4] top-[-12px] hover:left-0  ${show1 ? 'left-0' : 'left-[-100%]'}`} >
                                    <CoinTypes coins={allCoins} show1={show1} />
                                </div>
                                {/* Future chart */}
                                <div className='max-[1499px]:pl-[20px] w-full max-w-full  bg-[#fafafa] dark:bg-[#1a1b1f] '>
                                    <ChartSec slug={`${slug}`} view="desktop" />
                                </div>
                            </div>
                        </div>
                        <div className='w-full max-w-[300px] bg-[#fafafa] dark:bg-[#1a1b1f] '>
                            <div className='flex items-center '>
                                <div className={`flex  flex-col justify-between gap-[10px] bg-[#fafafa] dark:bg-[#1a1b1f]  px-[16px] cursor-pointer `}>
                                    <h3 className={`top-label dark:!text-white !text-[#000] max-[991px]:hidden ${active === 1 ? 'border-primary' : 'border-[transparent]'} border-b py-[10px]`} onClick={() => { setActive(1) }}>Order Book</h3>

                                </div>
                                <div className={` bg-[#fafafa] dark:bg-[#1a1b1f]     px-[16px]  cursor-pointer`}>
                                    <h3 className={` ${active === 2 ? 'border-primary' : 'border-[transparent]'} border-b py-[10px]  top-label dark:!text-white !text-[#000] max-[991px]:hidden`} onClick={() => { setActive(2) }}>Recent Trades</h3>
                                </div>
                            </div>
                            {/* order Book compoenent */}
                            {active === 1 && <OrderBookFuture setShow={setShow} show={show} currentToken={currentToken[0]} positionRecord={positionRecord} />}
                            {/* Market trade listing component */}
                            {active === 2 && <MarketTrades setShow={setShow} show={show} widthFull={true} currentToken={currentToken[0]} positionRecord={positionRecord} />}
                        </div>
                    </div>
                    {/* position,open order and trade history table */}
                    <ChartTabsFuture positions={positions} openOrders={openOrders} currentToken={currentToken[0]} positionHistoryData={positionHistoryData} openOrderHistoryData={openOrderHistoryData} />
                </div>
                <div className='bg-[#fff] dark:bg-[#1a1b1f]  border-l  dark:border-[#25262a] border-[#e5e7eb] '>
                    {/* Buy/Sell open short traading component */}
                    <BuySell inputId={'slider_input1'} setOpnlong={setOpnlong} thumbId={'slider_thumb1'} lineId={'slider_line1'} radioId={'one'} positions={positions} openOrders={openOrders} setPopupMode={setPopupMode} popupMode={popupMode} setOverlay={setOverlay} assets={allAssets?.data?.data} currentToken={currentToken[0]} marginMode={marginMode} refreshWalletAssets={refreshWalletAssets} totalPoint={rewardsTotalPoint} minTrade={minTrade} maxTrade={maxTrade} />
                    <MarginRatio setOverlay={setOverlay} setPopupMode={setPopupMode} popupMode={popupMode} assets={allAssets?.data?.data} positions={positions} openOrders={openOrders} />
                </div>
            </div>

            {/* For mobile use */}
            <div className='max-[991px]:block hidden mt-[57px]'>
                <div className='relative'>
                    <TopBar show={show1} setShow={setShow1} currentToken={currentToken[0]} topHLOCData={topHLOCData} />
                    <div className={`w-full max-w-full absolute duration-300 z-[4] top-[76px] ${show1 ? 'left-0' : 'left-[-100%]'}`}>
                        <CoinTypes coins={props?.coinList} />
                    </div>
                </div>

                <div className='overflow-x-auto hide-scroller dark:bg-[#1a1b1f] bg-[#fafafa]'>
                    <div className='flex items-center gap-[20px] w-max p-[16px] '>
                        <button aria-label='for chart' className={`admin-body-text relative after:dark:bg-white after:bg-black after:absolute after:bottom-[-3px]  after:left-[50%] after:w-full after:translate-x-[-50%] after:h-[2px] ${showMob === 1 ? 'after:block !text-black dark:!text-white' : 'after:hidden !text-[#a3a8b7]'}`} onClick={() => { setShowMob(1) }}>Chart</button>
                        <button aria-label='for order book' className={`admin-body-text relative after:dark:bg-white after:bg-black after:absolute after:bottom-[-3px]  after:left-[50%] after:w-full after:translate-x-[-50%] after:h-[2px] ${showMob === 2 ? 'after:block !text-black dark:!text-white' : 'after:hidden !text-[#a3a8b7]'}`} onClick={() => { setShowMob(2) }}>Order Book</button>
                        <button aria-label="for recent trades" className={`admin-body-text relative after:dark:bg-white after:bg-black after:absolute after:bottom-[-3px]  after:left-[50%] after:w-full after:translate-x-[-50%] after:h-[2px] ${showMob === 3 ? 'after:block !text-black dark:!text-white' : 'after:hidden !text-[#a3a8b7]'}`} onClick={() => { setShowMob(3) }}>Recent Trades</button>
                    </div>
                    {
                        showMob === 1 &&
                        // <FutureChart id={'tradingview_0d0de12'} />
                        <ChartSec slug={`${props?.serverSlug}`} view="mobile" />
                    }
                    {
                        showMob === 2 &&
                        <OrderBookFuture setShow={setShow} show={show} widthFull={true} positionRecord={positionRecord} />
                    }
                    {
                        showMob === 3 &&
                        <MarketTrades widthFull={true} setShow={setShow} show={show} positionRecord={positionRecord} />
                    }
                </div>

                <ChartTabsFuture positions={positions} openOrders={openOrders} currentToken={currentToken[0]} positionHistoryData={positionHistoryData} openOrderHistoryData={openOrderHistoryData} />
                <BuySell setOpnlong={setOpnlong} setOverlay={setOverlay} inputId={'slider_input2'} minTrade={minTrade} maxTrade={maxTrade} thumbId={'slider_thumb2'} lineId={'slider_line2'} fullWidth={true} radioId={'two'} positions={positions} openOrders={openOrders} setPopupMode={setPopupMode} popupMode={popupMode} assets={allAssets?.data?.data} currentToken={currentToken[0]} marginMode={marginMode} refreshWalletAssets={refreshWalletAssets} totalPoint={rewardsTotalPoint} />
                <MarginRatio fullWidth={true} heightAuto={true} setOverlay={setOverlay} setPopupMode={setPopupMode} popupMode={popupMode} positions={positions} openOrders={openOrders} />
            </div>

            {/* overlay */}
            <div className={`sdsadsadd bg-black z-[9] duration-300 fixed top-0 left-0 h-full w-full opacity-0 invisible ${overlay && '!opacity-[70%] !visible'}`}></div>

            {/* Leverage and margin type popup component */}
            {popupMode === 1 ?

                <MarginMode setOverlay={setOverlay} opnlong={opnlong} inputId={'slider_input3'} thumbId={'slider_thumb3'} lineId={'slider_line3'} setPopupMode={setPopupMode} popupMode={popupMode} setMarginModeAndLeverage={setMarginModeAndLeverage} leverage={marginMode?.leverage} currentToken={currentToken[0]} />
                :
                popupMode === 2 ?
                    <SwapModal setOverlay={setOverlay} setPopupMode={setPopupMode} popupMode={popupMode} />
                    :
                    popupMode === 3 ?
                        <TransferModal setOverlay={setOverlay} setPopupMode={setPopupMode} popupMode={popupMode} assets={allAssets?.data?.data} refreshWalletAssets={refreshWalletAssets} type="future" />
                        : popupMode === 4 && <TradingFeeMadal setOverlay={setOverlay} setPopupMode={setPopupMode} popupMode={popupMode} />
            }

            {/* Asset transfer from wallet to other walllet  */}

            {/* Show trading fee detail */}
        </>
    )
}

export default FutureTrading;

/**
 * Server-side function to fetch and provide necessary data to the page component.
 * 
 * This function fetches the following:
 * - User session data using `getServerSession` to check if the user is authenticated.
 * - A list of available tokens for the future market from `/future?qu=all`.
 * - User assets data from `/assets` and rewards data from `/rewards`, if the user is authenticated.
 * - The slug from the query parameters to identify a specific coin.
 * 
 * The returned props are passed to the page component, which includes:
 * - `session`: The authenticated user session object.
 * - `sessions`: Duplicate of `session` for potential use in the page component.
 * - `provider`: The authentication providers fetched from `getProviders()`.
 * - `coinList`: A list of tokens available for trading in the future market.
 * - `assets`: The user's assets retrieved from the `/assets` API.
 * - `serverSlug`: The slug parameter from the query, used to identify a coin.
 * - `rewardsList`: The list of rewards associated with the user.
 * - `totalPoint`: The total reward points available for the user.
 * 
 * @async
 * @function getServerSideProps
 * @param {GetServerSidePropsContext} context - The context object provided by Next.js containing request (`req`) and response (`res`).
 * @returns {Promise<object>} The props object to be passed to the page component.
 */
export async function getServerSideProps(context: GetServerSidePropsContext) {
    const { req } = context;
    const session = await getServerSession(context.req, context.res, authOptions);
    const providers = await getProviders();

    const { slug } = context.query;


    let tokenList = await fetch(`${process.env.NEXT_PUBLIC_BASEURL}/future?qu=all`, {
        method: "GET"
    }).then(response => response.json());


    let userAssets: any = [];
    let rewardsList: any = [];
    if (session) {
        userAssets = await fetch(`${process.env.NEXT_PUBLIC_BASEURL}/assets?user_id=${session?.user?.user_id}&itemOffset=0&itemsPerPage=20`, {
            method: "GET",
            headers: {
                "Authorization": session?.user?.access_token
            },
        }).then(response => response.json());

        rewardsList = await fetch(`${process.env.NEXT_PUBLIC_BASEURL}/rewards?userid=${session?.user?.user_id}`, {
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
            coinList: tokenList?.data || [],
            assets: userAssets,
            serverSlug: slug,
            rewardsList: rewardsList?.data?.list || [],
            totalPoint: rewardsList?.data?.total || 0
        },
    };

}