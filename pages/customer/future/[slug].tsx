import React, { useEffect, useState } from 'react'
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
import FutureChart from '@/components/future/future-chart';
import MarginMode from '@/components/future/popups/margin-mode';
import SwapModal from '@/components/future/popups/swap-modal';
import ChartSec from '@/components/chart/chart-sec';
import TransferModal from '@/components/future/popups/transfer-modal';
import TradingFeeMadal from '@/components/future/popups/trading-fee-madal';


interface Session {
    session: {
        user: any
    },
    provider: any,
    coinList: any,
    assets: any,
    serverSlug: any;
}

const FutureTrading = (props: Session) => {
    const slug = props?.serverSlug// router.query;

    const [show, setShow] = useState(1);
    const [marginMode, setMarginMode] = useState({ margin: 'Isolated', leverage: 10 });
    const [popupMode, setPopupMode] = useState(0);
    const [overlay, setOverlay] = useState(false);
    const [showMob, setShowMob] = useState(1);
    const [show1, setShow1] = useState(false);
    const [currentToken, setCurrentToken] = useState([]);
    const [allCoins, setAllCoins] = useState(props.coinList);
    const [positions, setPositionData] = useState([]);
    const [openOrders, setOpenOrders] = useState([]);
    const [allAssets, setAllAssets] = useState(props?.assets);

    const [positionHistoryData, setPositionHistoryData] = useState([]);
    const [openOrderHistoryData, setOpenOrderHistoryData] = useState([]);
    const [topHLOCData, setTopHLOCData] = useState(Object);
    const [positionRecord, setPositionRecord] = useState([]);

    useEffect(() => {
        socket();
        let ccurrentToken = props.coinList.filter((item: any) => {
            return item.coin_symbol + item.usdt_symbol === props?.serverSlug
        })
        setCurrentToken(ccurrentToken);
        getUserFuturePositionData();
        getUserOpenOrderData();
        getUserFuturePositionHistoryData();
        getUserFutureOpenOrderHistoryData();
        getCoinHLOCData();
        getPositionOrderBook();

    }, [props?.serverSlug]);


    const socket = () => {

        const websocket = new WebSocket('ws://localhost:3001/');

        websocket.onopen = () => {
            console.log('connected');
        }

        websocket.onmessage = async (event) => {
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
                refreshWalletAssets();
                getUserFuturePositionData();
                getUserOpenOrderData();
                getUserFuturePositionHistoryData();
                getUserFutureOpenOrderHistoryData();
                getCoinHLOCData();
                getPositionOrderBook();
            }
        }

    }

    // ===================================== //
    // Refresh token list after price update //
    // ===================================== //
    const refreshTokenList = async () => {

        let tokenList = await fetch(`${process.env.NEXT_PUBLIC_BASEURL}/future`, {
            method: "GET"
        }).then(response => response.json());

        let ccurrentToken = tokenList?.data.filter((item: any) => {
            return (item.coin_symbol + item.usdt_symbol) === props?.serverSlug
        })

        setCurrentToken(ccurrentToken);
        setAllCoins(tokenList?.data);

    }

    // ================================================ //
    // Get future position order mean market type order //
    // ================================================ //
    const getUserFuturePositionData = async () => {
        try {

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

    // ============================================================== //
    // Get future open order mean limit type, TP/SL, Stop Limit order //
    // ============================================================== //
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

    const setMarginModeAndLeverage = (marginType: string, leverage: number) => {
        setMarginMode({ margin: marginType, leverage: leverage });
        setPopupMode(0);
        setOverlay(false);
    }

    // ================================================= //
    // Get Refresh user wallet assets after order create //
    // ================================================= //
    const refreshWalletAssets = async () => {
        let userAssets = await fetch(`${process.env.NEXT_PUBLIC_BASEURL}/user/assets?userid=${props?.session?.user?.user_id}`, {
            method: "GET",
            headers: {
                "Authorization": props?.session?.user?.access_token
            },
        }).then(response => response.json());

        setAllAssets(userAssets);
    }

    // ================================================ //
    // Get future position order history //
    // ================================================ //
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

    // ================================================ //
    // Get future open order history //
    // ================================================ //
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

    // ================================================ //
    // Get future Contract top bar HLOC data //
    // ================================================ //
    const getCoinHLOCData = async () => {
        try {
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

    // ================================================ //
    // Get future Contract order book data //
    // ================================================ //
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
            <ToastContainer />
            {/* For Desktop use */}
            <div className='max-[991px]:hidden flex max-[1023px]:mt-[57px] mt-[69px]'>
                <div className='w-full max-w-[calc(100%-300px)]'>
                    {/* future trade page top header */}
                    <TopBar show={show1} setShow={setShow1} currentToken={currentToken[0]} topHLOCData={topHLOCData} />
                    <div className='flex'>
                        <div className='w-full max-w-full max-w-[calc(100%-300px)]'>
                            <div className='flex relative w-full max-w-full'>
                                {/* Future trade coin list */}
                                <div className={`w-full max-w-[380px] max-[1500px]:absolute duration-300 z-[4] max-[1500px]:top-0 ${show1 ? 'max-[1500px]:left-0' : 'max-[1500px]:left-[-100%]'}`}>
                                    <CoinTypes coins={allCoins} />
                                </div>
                                {/* Future chart */}
                                <div className='max-[1499px]:pl-[20px] w-full max-w-full min-[1500px]:max-w-[calc(100%-380px)] bg-[#fafafa] dark:bg-[#1a1b1f] '>
                                    <ChartSec slug={`${props?.serverSlug}`} />
                                </div>
                            </div>
                        </div>
                        <div className='w-full max-w-[300px]'>
                            {/* order Book compoenent */}
                            <OrderBookFuture setShow={setShow} show={show} currentToken={currentToken[0]} positionRecord={positionRecord} />
                            {/* Market trade listing component */}
                            <MarketTrades setShow={setShow} show={show} widthFull={true} currentToken={currentToken[0]} positionRecord={positionRecord} />
                        </div>
                    </div>
                    {/* position,open order and trade history table */}
                    <ChartTabsFuture positions={positions} openOrders={openOrders} currentToken={currentToken[0]} positionHistoryData={positionHistoryData} openOrderHistoryData={openOrderHistoryData} />
                </div>
                <div>
                    {/* Buy/Sell open short traading component */}
                    <BuySell inputId={'slider_input1'} thumbId={'slider_thumb1'} lineId={'slider_line1'} radioId={'one'} positions={positions} openOrders={openOrders} setPopupMode={setPopupMode} popupMode={popupMode} setOverlay={setOverlay} assets={allAssets} currentToken={currentToken[0]} marginMode={marginMode} refreshWalletAssets={refreshWalletAssets} />
                    <MarginRatio setOverlay={setOverlay} setPopupMode={setPopupMode} popupMode={popupMode} />
                </div>
            </div>

            {/* For mobile use */}
            <div className='max-[991px]:block hidden mt-[57px] '>
                <div className='relative'>
                    <TopBar show={show1} setShow={setShow1} currentToken={currentToken[0]} topHLOCData={topHLOCData} />
                    <div className={`w-full max-w-full absolute duration-300 z-[4] top-[76px] ${show1 ? 'left-0' : 'left-[-100%]'}`}>
                        <CoinTypes coins={props?.coinList} />
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
                        // <FutureChart id={'tradingview_0d0de12'} />
                        <ChartSec slug={`${props?.serverSlug}`} />
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
                <BuySell setOverlay={setOverlay} inputId={'slider_input2'} thumbId={'slider_thumb2'} lineId={'slider_line2'} fullWidth={true} radioId={'two'} setPopupMode={setPopupMode} popupMode={popupMode} assets={allAssets} currentToken={currentToken[0]} marginMode={marginMode} refreshWalletAssets={refreshWalletAssets} />
                <MarginRatio fullWidth={true} heightAuto={true} setOverlay={setOverlay} setPopupMode={setPopupMode} popupMode={popupMode} />
            </div>

            {/* overlay */}
            <div className={`sdsadsadd bg-black z-[9] duration-300 fixed top-0 left-0 h-full w-full opacity-0 invisible ${overlay && '!opacity-[70%] !visible'}`}></div>

            {/* Leverage and margin type popup component */}
            <MarginMode setOverlay={setOverlay} inputId={'slider_input3'} thumbId={'slider_thumb3'} lineId={'slider_line3'} setPopupMode={setPopupMode} popupMode={popupMode} setMarginModeAndLeverage={setMarginModeAndLeverage} />

            {/* Future profit/loss and liquidation price calculate */}
            <SwapModal setOverlay={setOverlay} setPopupMode={setPopupMode} popupMode={popupMode} />

            {/* Asset transfer from wallet to other walllet  */}
            <TransferModal setOverlay={setOverlay} setPopupMode={setPopupMode} popupMode={popupMode} assets={allAssets} refreshWalletAssets={refreshWalletAssets} />

            {/* Show trading fee detail */}
            <TradingFeeMadal setOverlay={setOverlay} setPopupMode={setPopupMode} popupMode={popupMode} />
        </>
    )
}

export default FutureTrading;

export async function getServerSideProps(context: GetServerSidePropsContext) {
    const { req } = context;
    const session = await getServerSession(context.req, context.res, authOptions);
    const providers = await getProviders();

    const { slug } = context.query;

    let tokenList = await fetch(`${process.env.NEXT_PUBLIC_BASEURL}/future`, {
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
            assets: userAssets,
            serverSlug: slug
        },
    };

}