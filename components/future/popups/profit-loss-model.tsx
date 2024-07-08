import React, { useContext, useEffect, useRef, useState } from 'react'
import Context from '@/components/contexts/context';
import { useSession } from 'next-auth/react';
import { currencyFormatter } from '@/components/snippets/market/buySellCard';
import clickOutSidePopupClose from '@/components/snippets/clickOutSidePopupClose';
import { truncateNumber } from '@/libs/subdomain';

interface showPopup {
    modelPopup?: number;
    setModelOverlay?: any;
    setModelPopup?: any;
    modelOverlay?: boolean;
    entryPrice?: any;
    currentToken?: any;
    leverage?: any;
    sizeValue?: any;
    show?: any;
    setTpSl?: any;
    actionType?: any;
    positionId?: any;
    setProfitLossConfirm?: any;
}

const ProfitLossModal = (props: showPopup) => {
    const list = ['USDT', props?.currentToken?.coin_symbol];
    let { mode } = useContext(Context);
    const { status, data: session } = useSession()

    const [profit, setProfit] = useState(0);
    const [loss, setLoss] = useState(0);

    const [takeProfirValue, setTakeProfitValue] = useState(0);
    const [stopLossValue, setStopLossValue] = useState(0);
    const [errmsg, setErrmsg] = useState("");


    useEffect(() => {
        setTakeProfitValue(0)
        setStopLossValue(0)
        setProfit(0)
        setLoss(0)
    }, [])


    const findTakeProfit = (e: any) => {
        let marketPrice = e?.target?.value;
        setTakeProfitValue(e?.target?.value);
        if (props?.show === 'long') {
            //=====================================
            //=========== Coin PnL ================
            //=====================================
            let coin_pnl: any = (((1 / parseFloat(marketPrice)) - (1 / props?.entryPrice)) * 100).toFixed(5);

            //=====================================
            //=========== USDT PnL ================
            //=====================================
            let usdt_pnl: any = (coin_pnl * parseFloat(marketPrice)).toFixed(5);
            setProfit(usdt_pnl);
        }
        else if (props?.show === 'short') {


            //=====================================
            //=========== Coin PnL ================
            //=====================================
            let coin_pnl: any = (((1 / props?.entryPrice) - (1 / parseFloat(marketPrice))) * (100 * -1)).toFixed(5);

            //=====================================
            //=========== USDT PnL ================
            //=====================================
            let usdt_pnl: any = (coin_pnl * parseFloat(marketPrice)).toFixed(5);
            setProfit(usdt_pnl);

        }
    }

    const findStopLoss = (e: any) => {
        if (e?.target?.value < 0) {
            return;
        }
        let marketPrice = e?.target?.value;
        setStopLossValue(e?.target?.value);

        if (props?.show === 'long') {
            //=====================================
            //=========== Coin PnL ================
            //=====================================
            let coin_pnl: any = (((1 / parseFloat(marketPrice)) - (1 / props?.entryPrice)) * 100).toFixed(5);

            //=====================================
            //=========== USDT PnL ================
            //=====================================
            let usdt_pnl: any = (coin_pnl * parseFloat(marketPrice)).toFixed(5);
            setLoss(usdt_pnl);
        }
        else if (props?.show === 'short') {


            //=====================================
            //=========== Coin PnL ================
            //=====================================
            let coin_pnl: any = (((1 / props?.entryPrice) - (1 / parseFloat(marketPrice))) * (100 * -1)).toFixed(5);

            //=====================================
            //=========== USDT PnL ================
            //=====================================
            let usdt_pnl: any = (coin_pnl * parseFloat(marketPrice)).toFixed(5);
            setLoss(usdt_pnl);
        }
    }

    const storeProfitLossData = async () => {
        try {
            let profitobj = {
                "position_id": "--",
                "user_id": session?.user?.user_id,
                "symbol": props?.currentToken?.coin_symbol + props?.currentToken?.usdt_symbol,
                "side": props?.show === 'long' ? "Close Long" : 'Close Short',
                "type": 'take profit market', //e.g limit, take profit market, stop market
                "amount": 'close position', // limit order amount, close position
                "price_usdt": props.entryPrice, // limit order price
                "trigger": takeProfirValue.toString(), // TP/SL posiotion amount , limit order --
                "reduce_only": "Yes", // TP/SL case Yes, limit order No
                "post_only": "No", //No
                "status": false,
                "leverage": props?.leverage,
                "margin": props?.sizeValue / props?.leverage,
                "liq_price": 0.0,
                "market_price": props?.currentToken?.token !== null ? props?.currentToken?.token?.price : props?.currentToken?.global_token?.price,
                "order_type": "value",
                "leverage_type": '--',
                "coin_id": props?.currentToken?.coin_id,
            }

            let stoplossobj = {
                "position_id": "--",
                "user_id": session?.user?.user_id,
                "symbol": props?.currentToken?.coin_symbol + props?.currentToken?.usdt_symbol,
                "side": props?.show === 'long' ? "Close Long" : 'Close Short',
                "type": 'stop market', //e.g limit, take profit market, stop market
                "amount": 'close position', // limit order amount, close position
                "price_usdt": props?.entryPrice, // limit order price
                "trigger": stopLossValue.toString(), // TP/SL posiotion amount , limit order --
                "reduce_only": "Yes", // TP/SL case Yes, limit order No
                "post_only": "No", //No
                "status": false,
                "leverage": props?.leverage,
                "margin": props?.sizeValue / props?.leverage,
                "liq_price": 0.0,
                "market_price": props?.currentToken?.token !== null ? props?.currentToken?.token?.price : props?.currentToken?.global_token?.price,
                "order_type": "value",
                "leverage_type": '--',
                "coin_id": props?.currentToken?.coin_id,
            }

            if (props?.actionType === 'buysell') {
                props.setTpSl({ profit: profitobj, stopls: stoplossobj });

            }
            else {

                profitobj.position_id = props?.positionId;
                stoplossobj.position_id = props?.positionId;
                let profitreponse = await fetch(`${process.env.NEXT_PUBLIC_BASEURL}/future/openorder`, {
                    method: "POST",
                    headers: {
                        'Content-Type': 'application/json',
                        "Authorization": session?.user?.access_token
                    },
                    body: JSON.stringify(profitobj)
                }).then(response => response.json());

                let stopreponse = await fetch(`${process.env.NEXT_PUBLIC_BASEURL}/future/openorder`, {
                    method: "POST",
                    headers: {
                        'Content-Type': 'application/json',
                        "Authorization": session?.user?.access_token
                    },
                    body: JSON.stringify(stoplossobj)
                }).then(response => response.json());
            }

            setProfit(0);
            setLoss(0);
            setStopLossValue(0);
            setTakeProfitValue(0);
            props.setModelOverlay(false);
            props.setModelPopup(0);

        } catch (error) {
            console.log(error, "=error");

        }

    }

    const closePopup = () => {
        setProfit(0);
        setLoss(0);
        setStopLossValue(0);
        setTakeProfitValue(0);
        props.setModelOverlay(false);
        props.setModelPopup(0);
        props?.setProfitLossConfirm && props?.setProfitLossConfirm(false)
    }
    const wrapperRef = useRef(null);
    clickOutSidePopupClose({ wrapperRef, closePopup });

    return (
        <div ref={wrapperRef} className={`max-w-[calc(100%-30px)] duration-300 md:max-w-[720px] w-full p-5 md:p-[32px] z-10 fixed rounded-10 bg-white dark:bg-[#292d38] ${props.modelPopup == 1 ? 'top-[50%] opacity-1 visible' : 'top-[52%] opacity-0 invisible'}  left-[50%] translate-x-[-50%] translate-y-[-50%]`}>
            <div className="flex items-center justify-between mb-[20px]">
                <p className="sec-title !text-[20px]">Add TP/SL</p>
                <svg
                    onClick={() => {
                        setProfit(0);
                        setLoss(0);
                        setStopLossValue(0);
                        setTakeProfitValue(0);
                        props?.setModelOverlay && props?.setModelOverlay(false);
                        props?.setModelPopup && props?.setModelPopup(0);
                        props?.setProfitLossConfirm && props?.setProfitLossConfirm(false)

                    }}
                    enableBackground="new 0 0 60.963 60.842"
                    version="1.1"
                    id="Layer_1"
                    xmlns="http://www.w3.org/2000/svg"
                    xmlnsXlink="http://www.w3.org/1999/xlink"
                    x="0px"
                    y="0px"
                    viewBox="0 0 60.963 60.842"
                    xmlSpace="preserve"
                    className="max-w-[18px] cursor-pointer w-full"
                >
                    <path
                        fill={mode === "dark" ? "#fff" : "#9295A6"}
                        d="M59.595,52.861L37.094,30.359L59.473,7.98c1.825-1.826,1.825-4.786,0-6.611
                c-1.826-1.825-4.785-1.825-6.611,0L30.483,23.748L8.105,1.369c-1.826-1.825-4.785-1.825-6.611,0c-1.826,1.826-1.826,4.786,0,6.611
                l22.378,22.379L1.369,52.861c-1.826,1.826-1.826,4.785,0,6.611c0.913,0.913,2.109,1.369,3.306,1.369s2.393-0.456,3.306-1.369
                l22.502-22.502l22.501,22.502c0.913,0.913,2.109,1.369,3.306,1.369s2.393-0.456,3.306-1.369
                C61.42,57.647,61.42,54.687,59.595,52.861z"
                    />
                </svg>
            </div>
            <div>
                <div className='flex justify-between items-center mb-[10px]'>
                    <p className='dark:text-white text-black'>Symbol</p>
                    <p className='dark:text-white text-black'>{props?.currentToken?.coin_symbol + props?.currentToken?.usdt_symbol} Perpetual <span className='lowercase'>{props?.leverage}x</span></p>
                </div>
                <div className='flex justify-between items-center mb-[10px]'>
                    <p className='dark:text-white text-black'>Entry Price</p>
                    <p className='dark:text-white text-black'>{currencyFormatter(truncateNumber(props?.entryPrice, 6))}</p>
                </div>
                <div className='flex justify-between items-center mb-[10px]'>
                    <p className='dark:text-white text-black'>Market Price</p>
                    <p className='dark:text-white text-black'>{props?.currentToken?.token !== null ? currencyFormatter(truncateNumber(props?.currentToken?.token?.price, 6)) : currencyFormatter(truncateNumber(props?.currentToken?.global_token?.price, 6))}</p>
                </div>
            </div>

            {/* modal tabs */}
            <div className=' mt-[25px] gap-[20px]'>
                <div className='max-[991px]:max-w-full max-w-[100%] w-full'>
                    <div className='flex items-center dark:bg-[#373d4e] bg-[#e5ecf0] mt-[15px] relative p-[15px] rounded-[5px] justify-between'>
                        <p className='top-label min-w-max'>Take Profit</p>
                        <div className='flex item-center justify-between'>
                            <input type="text" autoFocus={true} className='max-w-[214px] text-end px-[10px] w-full outline-none dark:text-white text-black dark:bg-[#373d4e] bg-[#e5ecf0]' maxLength={11} value={takeProfirValue} onChange={(e: any) => {
                                const value = e.target.value;
                                const regex = /^\d{0,10}(\.\d{0,6})?$/;
                                if (regex.test(value) || value === "") {
                                    findTakeProfit(e)
                                    setErrmsg('');
                                } else {
                                    setErrmsg("Invalid format: up to 10 digits before decimal and up to 6 digits after decimal.");
                                    e.target.value = value.slice(0, -1);
                                }
                            }} />
                            <p className='top-label min-w-max'>USDT</p>
                            {/* <SelectDropdown list={list} defaultValue="USDT" whiteColor={true} /> */}
                        </div>

                    </div>
                    <div className='mt-[10px]'>
                        <p className='top-label !text-[14px]'>When Market Price reaches {takeProfirValue}, it will trigger Take Profit Market order to close this position. Estimated PNL will be {isNaN(profit) ? 0 : profit} USDT</p>
                    </div>
                    <div className='flex items-center dark:bg-[#373d4e] bg-[#e5ecf0] mt-[15px] relative p-[15px] rounded-[5px] justify-between'>
                        <p className='top-label min-w-max'>Stop Loss</p>
                        <div className='flex item-center justify-between'>
                            <input type="text" autoFocus={true} className='max-w-[214px] text-end px-[10px] w-full outline-none dark:text-white text-black dark:bg-[#373d4e] bg-[#e5ecf0]' maxLength={11} value={stopLossValue} onChange={(e: any) => {
                                const value = e.target.value;
                                const regex = /^\d{0,10}(\.\d{0,6})?$/;
                                if (regex.test(value) || value === "") {
                                    findStopLoss(e);
                                    setErrmsg('');
                                } else {
                                    setErrmsg("Invalid format: up to 10 digits before decimal and up to 6 digits after decimal.");
                                    e.target.value = value.slice(0, -1);
                                }
                            }} />
                            <p className='top-label min-w-max'>USDT</p>
                            {/* <SelectDropdown list={list} defaultValue="USDT" whiteColor={true} /> */}
                        </div>
                    </div>
                    {
                        errmsg && (
                            <p className='errorMessage'>{errmsg}</p>
                        )
                    }
                    <div className='mt-[10px]'>
                        <p className='top-label !text-[14px]'>When Market Price reaches {stopLossValue}, it will trigger Stop Market order to close this position. Estimated PNL will be {isNaN(loss) ? 0 : loss} USDT</p>
                    </div>

                    <div className='mt-[30px]'>
                        <p className='top-label !text-[14px]'>This setting applies to the entire position. Take Profit and Stop-loss automatically cancel after closing the position. A Market order is triggered when the stop price is reached. The order will be rejected if the position size exceeds the Max Market Order Qty limit.</p>
                    </div>
                    <button className=" w-full max-w-full mt-[15px] solid-button" onClick={storeProfitLossData}>Confirm</button>
                </div>
            </div>
        </div>
    )
}

export default ProfitLossModal;