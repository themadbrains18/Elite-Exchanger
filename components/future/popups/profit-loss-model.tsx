import React, { useContext, useEffect, useRef, useState } from 'react'
import Context from '@/components/contexts/context';
import { useSession } from 'next-auth/react';
import { currencyFormatter } from '@/components/snippets/market/buySellCard';
import clickOutSidePopupClose from '@/components/snippets/clickOutSidePopupClose';
import { truncateNumber } from '@/libs/subdomain';
import { toast } from 'react-toastify';
import { AES } from 'crypto-js';

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
    setProfitLossConfirm?: any;
    position?: any;
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
        if (props?.position && props?.position?.profitlosses && props?.position?.profitlosses.length > 0) {
            setTakeProfitValue(props?.position?.profitlosses[0]?.trigger_profit)
            setStopLossValue(props?.position?.profitlosses[0]?.trigger_loss)
            setProfit(props?.position?.profitlosses[0]?.profit_value)
            setLoss(props?.position?.profitlosses[0]?.loss_value)
        }

    }, [props?.position]);

    const findTakeProfit = (e: any) => {
        if (e?.target?.value < 0) {
            return;
        }
        let newPriceValue = e?.target?.value;
        if (newPriceValue > 0) {
            setTakeProfitValue(e?.target?.value);
            if (props?.show === 'long') {
                //=========== USDT PnL ================
                let usdt_pnl: any = props?.position?.qty * (newPriceValue - parseFloat(props?.entryPrice));
                setProfit(truncateNumber(usdt_pnl, 6));
            }
            else if (props?.show === 'short') {
                //=========== USDT PnL ================
                let usdt_pnl: any = props?.position?.qty * (parseFloat(props?.entryPrice) - newPriceValue);
                setProfit(truncateNumber(usdt_pnl, 6));
            }
        }
        else {
            setTakeProfitValue(0);
            setProfit(0)
        }

    }

    const findStopLoss = (e: any) => {
        if (e?.target?.value < 0) {
            return;
        }
        let newPriceValue = e?.target?.value;
        if(newPriceValue > 0){
            setStopLossValue(e?.target?.value);
            if (props?.show === 'long') {
                //=========== USDT PnL ================
                let usdt_pnl: any = props?.position?.qty * (parseFloat(props?.entryPrice) - newPriceValue);
                setLoss(truncateNumber(usdt_pnl, 6));
            }
            else if (props?.show === 'short') {
                //=========== USDT PnL ================
                let usdt_pnl: any = props?.position?.qty * (newPriceValue - parseFloat(props?.entryPrice));
                setLoss(truncateNumber(usdt_pnl, 6));
            }
        }
        else{
            setStopLossValue(0);
            setLoss(0);
        }
        
    }

    const storeProfitLossData = async () => {
        try {
            let token = props?.currentToken?.token !== null ? props?.currentToken?.token : props?.currentToken?.global_token;
            let currentPrice = token?.price;

            if (props?.show === 'long') {
                if (currentPrice > takeProfirValue && takeProfirValue > 0) {
                    toast.error('Take-Profit price must be greater than market Price', { position: 'top-center' })
                    return;
                }
                if (currentPrice < stopLossValue || stopLossValue > parseFloat(props?.entryPrice) && stopLossValue > 0) {
                    toast.error('Stop loss price should be lower than market price or last entry price.', { position: 'top-center' });
                    return;
                }
            }

            if (props?.show === 'short') {
                if (currentPrice < takeProfirValue && takeProfirValue > 0) {
                    toast.error('Take-Profit price should be lower than Last market Price', { position: 'top-center' });
                    return;
                }
                if (currentPrice > stopLossValue && stopLossValue > 0) {
                    toast.error('Stop loss price should be higher than market price.', { position: 'top-center' });
                    return;
                }
            }

            let profitobj = {
                contract: props?.currentToken?.coin_symbol + props?.currentToken?.usdt_symbol,
                position_id: '--',
                user_id: session?.user?.user_id,
                qty: 'Entire Position',
                trigger_profit: takeProfirValue,
                trigger_loss: stopLossValue,
                profit_value: profit,
                loss_value: loss,
                trade_type: props?.show === 'short' ? 'Close Short' : 'Close Long',
            }

            if (props?.actionType === 'buysell') {
                props.setTpSl({ profit: profitobj });
            }
            else {
                // Make Take Profit loss request
                profitobj.position_id = props?.position?.id;
                const ciphertext = AES.encrypt(
                    JSON.stringify(profitobj),
                    `${process.env.NEXT_PUBLIC_SECRET_PASSPHRASE}`
                );
                let record = encodeURIComponent(ciphertext.toString());
                let reponse = await fetch(`${process.env.NEXT_PUBLIC_BASEURL}/future/profitlossorder`, {
                    method: "POST",
                    headers: {
                        'Content-Type': 'application/json',
                        "Authorization": session?.user?.access_token
                    },
                    body: JSON.stringify(record)
                }).then(response => response.json());

                if (reponse && reponse?.data?.status !== 200) {
                    toast.error(reponse?.data?.data?.message);
                    return
                }
                else {
                    setProfit(0);
                    setLoss(0);
                    setStopLossValue(0);
                    setTakeProfitValue(0);
                    props.setModelOverlay(false);
                    props.setModelPopup(0);
                }
            }



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
        if (props.setProfitLossConfirm) {
            props.setProfitLossConfirm(false)
        }
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
                        props.setModelOverlay(false);
                        props.setModelPopup(0);
                        if (props.setProfitLossConfirm) {
                            props.setProfitLossConfirm(false)
                        }

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
                    <p className='dark:text-white text-black'>Qty</p>
                    <p className='dark:text-white text-black'>{truncateNumber(props?.position?.qty, 3)}</p>
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
                            <input type="text" autoFocus={true} className='max-w-[214px] text-end px-[10px] w-full outline-none dark:text-white text-black dark:bg-[#373d4e] bg-[#e5ecf0]' maxLength={11} value={takeProfirValue === 0 ? '': takeProfirValue} onChange={(e: any) => {
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
                        <p className='top-label !text-[14px]'>
                            Last Traded Price to {takeProfirValue} will trigger market Take Profit order; your expected {profit < 0 ?'loss' : 'profit'} will be {isNaN(profit) ? 0 : profit} USDT
                        </p>
                    </div>
                    <div className='flex items-center dark:bg-[#373d4e] bg-[#e5ecf0] mt-[15px] relative p-[15px] rounded-[5px] justify-between'>
                        <p className='top-label min-w-max'>Stop Loss</p>
                        <div className='flex item-center justify-between'>
                            <input type="text" autoFocus={true} className='max-w-[214px] text-end px-[10px] w-full outline-none dark:text-white text-black dark:bg-[#373d4e] bg-[#e5ecf0]' maxLength={11} value={stopLossValue === 0 ? '':stopLossValue} onChange={(e: any) => {
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
                        <p className='top-label !text-[14px]'>
                            Last Traded Price to {stopLossValue} will trigger market Stop Loss order; your expected loss will be {isNaN(loss) ? 0 : loss} USDT
                        </p>
                    </div>

                    {/* <div className='mt-[30px]'>
                        <p className='top-label !text-[14px]'>This setting applies to the entire position. Take Profit and Stop-loss automatically cancel after closing the position. A Market order is triggered when the stop price is reached. The order will be rejected if the position size exceeds the Max Market Order Qty limit.</p>
                    </div> */}
                    <button disabled={takeProfirValue === 0 && stopLossValue === 0? true : false} className={`w-full max-w-full mt-[15px] solid-button ${takeProfirValue === 0 && stopLossValue === 0?'cursor-not-allowed opacity-25' : ''}`} onClick={storeProfitLossData}>Confirm</button>
                </div>
            </div>
        </div>
    )
}

export default ProfitLossModal;