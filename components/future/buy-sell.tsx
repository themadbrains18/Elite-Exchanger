import React, { useEffect, useState } from 'react'
import IconsComponent from '../snippets/icons';
import RangeSlider from './range-slider';
import SelectDropdown from './snippet/select-dropdown';
import { useSession } from 'next-auth/react';
import AES from 'crypto-js/aes';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ProfitLossModal from './popups/profit-loss-model';

interface fullWidth {
    fullWidth?: boolean;
    heightAuto?: boolean;
    inputId?: string;
    thumbId?: string;
    lineId?: string;
    radioId?: string;
    popupMode?: number;
    setPopupMode?: any;
    setOverlay?: any;
    overlay?: boolean;
    assets?: any;
    currentToken?: any;
    marginMode?: any;
}

const BuySell = (props: fullWidth) => {

    // main tabs
    const [show, setShow] = useState(1);
    const { status, data: session } = useSession()
    const list = ['USDT', props?.currentToken?.coin_symbol];
    // const timeInForceList = ['GTC', 'FOK', 'IOC'];
    const [modelPopup, setModelPopup] = useState(0);
    const [modelOverlay, setModelOverlay] = useState(false);
    // nested tabs
    const [showNes, setShowNes] = useState(1);
    const [symbol, setSymbol] = useState('USDT');
    const [avaibalance, setAvailBalance] = useState(0);
    const [sizeValue, setSizeValue] = useState(0);
    const [marketType, setMarketType] = useState('limit');
    const [entryPrice, setEntryPrice] = useState(0);
    const [istpslchecked, setIsTpSlchecked] = useState(false);

    const [buttonStyle, setButtonStyle] = useState(false);

    let openOrderObj = {
        "position_id": "--",
        "user_id": session?.user?.user_id,
        "symbol": props?.currentToken?.coin_symbol + props?.currentToken?.usdt_symbol,
        "side": "",
        "type": 'stop market', //e.g limit, take profit market, stop market
        "amount": 'close position', // limit order amount, close position
        "price_usdt": 0.00, // limit order price
        "trigger": "", // TP/SL posiotion amount , limit order --
        "reduce_only": "Yes", // TP/SL case Yes, limit order No
        "post_only": "No", //No
        "status": false,
        "leverage": 0,
        "margin": 0.00,
        "liq_price": 0.00,
        "market_price": 0.00,
        "order_type": "value",
        "leverage_type": '--',
        "coin_id": ""
    }
    const [tpsl, setTpSl] = useState({ profit: openOrderObj, stopls: openOrderObj });

    let marketPrice = props?.currentToken?.token !== null ? props?.currentToken?.token?.price : props?.currentToken?.global_token?.price;


    useEffect(() => {
        setSymbol('USDT');

        let futureAssets = props?.assets?.filter((item: any) => {
            return item.walletTtype === 'future_wallet'
        });

        let asset = futureAssets?.filter((item: any) => {
            let tokenSymbol = item?.token !== null ? item?.token?.symbol : item?.global_token?.symbol;
            return tokenSymbol === 'USDT';
        });

        if (asset?.length > 0) {
            if(asset[0].balance === 0){
                setButtonStyle(true);
            }
            else{
                setButtonStyle(false);
            }
            setAvailBalance(asset[0].balance);
        }
        else {
            setAvailBalance(0);
            setButtonStyle(true);
        }

    }, [props?.currentToken?.coin_symbol, props.assets]);

    const onCoinDropDownChange = (token: any) => {

        let futureAssets = props?.assets?.filter((item: any) => {
            return item.walletTtype === 'future_wallet'
        });
        let asset = futureAssets?.filter((item: any) => {
            let tokenSymbol = item?.token !== null ? item?.token?.symbol : item?.global_token?.symbol;
            return tokenSymbol === token;
        });

        if (asset?.length > 0) {
            setAvailBalance(asset[0].balance);
        }
        else {
            setAvailBalance(0);
        }
        setSymbol(token);
    }

    const onChangeSizeInPercentage = (value: any) => {

        let actualValue = (avaibalance * value) / 100;
        setSizeValue(actualValue);
    }

    const submitForm = async () => {

        let obj;
        if (marketType === 'market') {
            // let entry_price = props?.currentToken?.token !== null ? props?.currentToken?.token?.price : props?.currentToken?.global_token?.price;
            let Liquidation_Price = (marketPrice * (1 - 0.01)) / props?.marginMode?.leverage;

            // Liquidation Price for long case
            Liquidation_Price = marketPrice - Liquidation_Price;

            // Liquidation Price for short case
            if (show === 2) {
                Liquidation_Price = marketPrice + Liquidation_Price;
            }
            obj = {
                "symbol": props?.currentToken?.coin_symbol + props?.currentToken?.usdt_symbol,
                "user_id": session?.user?.user_id,
                "coin_id": props?.currentToken?.coin_id,
                "leverage": props?.marginMode?.leverage,
                "size": sizeValue,
                "entry_price": marketPrice,
                "market_price": marketPrice,
                "liq_price": Liquidation_Price,
                "margin": sizeValue / props?.marginMode?.leverage,
                "margin_ratio": 0.01,
                "pnl": 0,
                "realized_pnl": 0,
                "tp_sl": "--",
                "status": false,
                "queue": false,
                "direction": show === 1 ? "long" : 'short',
                "order_type": "value",
                "leverage_type": props?.marginMode?.margin,
                "market_type": marketType
            }
        }
        else {
            let Liquidation_Price = (entryPrice * (1 - 0.01)) / props?.marginMode?.leverage;

            // Liquidation Price for long case
            Liquidation_Price = entryPrice - Liquidation_Price;

            // Liquidation Price for short case
            if (show === 2) {
                Liquidation_Price = entryPrice + Liquidation_Price;
            }
            obj = {
                "position_id": "--",
                "user_id": session?.user?.user_id,
                "symbol": props?.currentToken?.coin_symbol + props?.currentToken?.usdt_symbol,
                "side": show === 1 ? "open long" : 'open short',
                "type": marketType, //e.g limit, take profit market, stop market
                "amount": sizeValue.toString(), // limit order amount, close position
                "price_usdt": entryPrice, // limit order price
                "trigger": "--", // TP/SL posiotion amount , limit order --
                "reduce_only": "No", // TP/SL case Yes, limit order No
                "post_only": "No", //No
                "status": false,
                "leverage": props?.marginMode?.leverage,
                "margin": sizeValue / props?.marginMode?.leverage,
                "liq_price": Liquidation_Price,
                "market_price": props?.currentToken?.token !== null ? props?.currentToken?.token?.price : props?.currentToken?.global_token?.price,
                "order_type": "value",
                "leverage_type": props?.marginMode?.margin,
                "coin_id": props?.currentToken?.coin_id,
            }
        }

        setButtonStyle(true);
        // 
        const ciphertext = AES.encrypt(JSON.stringify(obj), `${process.env.NEXT_PUBLIC_SECRET_PASSPHRASE}`);
        let record = encodeURIComponent(ciphertext.toString());

        let reponse = await fetch(`${process.env.NEXT_PUBLIC_BASEURL}/future/${marketType === 'market' ? 'position' : 'openorder'}`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                "Authorization": session?.user?.access_token
            },
            body: JSON.stringify(obj)
        }).then(response => response.json());

        if (reponse?.data?.status !== 200) {
            toast.error(reponse?.data?.data?.message !== undefined ? reponse?.data?.data?.message : reponse?.data?.data);
            setButtonStyle(false);
        }
        else {
            if (istpslchecked === true) {
                console.log(tpsl?.profit?.position_id);
                if (tpsl.profit) {
                    tpsl.profit.position_id = reponse?.data?.data?.result?.id;
                }
                let profitreponse = await fetch(`${process.env.NEXT_PUBLIC_BASEURL}/future/openorder`, {
                    method: "POST",
                    headers: {
                        'Content-Type': 'application/json',
                        "Authorization": session?.user?.access_token
                    },
                    body: JSON.stringify(tpsl?.profit)
                }).then(response => response.json());

                if (tpsl.stopls) {
                    tpsl.stopls.position_id = reponse?.data?.data?.result?.id;
                }
                let stopreponse = await fetch(`${process.env.NEXT_PUBLIC_BASEURL}/future/openorder`, {
                    method: "POST",
                    headers: {
                        'Content-Type': 'application/json',
                        "Authorization": session?.user?.access_token
                    },
                    body: JSON.stringify(tpsl?.stopls)
                }).then(response => response.json());
            }

            const websocket = new WebSocket('ws://localhost:3001/');
            let position = {
                ws_type: 'position'
            }
            websocket.onopen = () => {
                websocket.send(JSON.stringify(position));
            }
            toast.success(reponse?.data?.data?.message);
            setButtonStyle(false);
        }
    }

    const profitlosspopupenable = (event: any) => {
        if (event.currentTarget.checked === true) {
            setModelPopup(1);
        }
        else {
            setModelPopup(0);
        }
        setModelOverlay(event?.currentTarget?.checked);
        setIsTpSlchecked(event?.currentTarget?.checked);
    }

    const onChangeSizeValue = (e: any) => {
        setSizeValue(parseFloat(e.target.value));
        setButtonStyle(false);
        if(parseFloat(e.target.value) > avaibalance * props?.marginMode?.leverage){
            setButtonStyle(true);
        }
        if(parseFloat(e.target.value) / props?.marginMode?.leverage > avaibalance){
            setButtonStyle(true);
        }
    }

    return (
        <>

            <div className={`p-[16px] dark:bg-[#1f2127] bg-[#fff] ${props.fullWidth ? 'max-w-full h-auto' : 'max-w-[300px] h-[677px]'} w-full border-l border-b dark:border-[#25262a] border-[#e5e7eb]`}>
                <div className='flex items-center justify-between px-[12px] py-[7px] dark:bg-[#373d4e] bg-[#e5ecf0] rounded-[4px] cursor-pointer' onClick={() => { props.setOverlay(true); props.setPopupMode(1) }}>
                    <div className='flex items-center gap-10'>
                        <p className='top-label dark:!text-white !text-[#000]'>{props?.marginMode?.margin}</p>
                        <p className='bg-[#13c2c21f] px-[5px] text-[#13c2c2] text-[12px]'>{props?.marginMode?.leverage}X</p>
                    </div>
                    <IconsComponent type='rightArrowWithoutBg' />
                </div>
                {/* main tabs */}
                <div className='flex items-center dark:bg-[#373d4e] bg-[#e5ecf0] rounded-[2px] mt-10'>
                    <button className={`w-full p-[5px] rounded-[4px] border ${show === 1 ? 'text-buy border-buy' : 'text-[#a3a8b7] border-[#f0f8ff00]'}`} onClick={() => { setShow(1) }}>Buy</button>
                    <button className={`w-full p-[5px] rounded-[4px] border ${show === 2 ? 'text-sell border-sell ' : 'text-[#a3a8b7] border-[#f0f8ff00]'}`} onClick={() => { setShow(2) }}>Sell</button>
                </div>
                {/* nested tabs */}
                <div className='flex items-center justify-between  mt-10'>
                    <div className='flex items-center gap-[10px]'>
                        <button className={`admin-body-text ${showNes === 1 ? '!text-black dark:!text-white' : '!text-[#a3a8b7]'}`} onClick={() => { setShowNes(1); setMarketType('limit') }}>Limit</button>
                        <button className={`admin-body-text ${showNes === 2 ? '!text-black dark:!text-white' : '!text-[#a3a8b7]'}`} onClick={() => { setShowNes(2); setMarketType('market') }}>Market</button>
                        <button className={`admin-body-text ${showNes === 3 ? '!text-black dark:!text-white' : '!text-[#a3a8b7]'}`} onClick={() => { setShowNes(3); setMarketType('stop') }}>Stop Limit</button>

                    </div>
                    <div className='cursor-pointer' onClick={() => { props.setOverlay(true); props.setPopupMode(2) }}>
                        <IconsComponent type='swap-calender' />
                    </div>
                </div>

                {/* available */}
                <div className='flex items-center gap-[8px] mt-10'>
                    <p className='admin-body-text !text-[12px] !text-[#a3a8b7]'>Available: {avaibalance}</p>
                    <p className='admin-body-text !text-[12px] !text-white'> {symbol}</p>
                    <div onClick={() => { props.setOverlay(true); props.setPopupMode(3) }}>
                        <IconsComponent type='swap-calender-with-circle' />
                    </div>
                </div>

                {/* price input */}
                {
                    showNes === 1 &&
                    <>
                        <div className='mt-10 rounded-5 py-[6px] px-[10px] flex border items-center justify-between gap-[15px] dark:border-[#25262a] border-[#e5e7eb] relative dark:bg-[#373d4e] bg-[#e5ecf0]'>
                            <div>
                                <p className='top-label'>Price </p>
                                <input type="number" placeholder="$0" step="any" value={entryPrice} onChange={(e) => setEntryPrice(parseFloat(e.target.value))} name="token_amount" className="bg-[transparent] max-w-full w-full outline-none md-text px-[5px] md-text "></input>
                            </div>
                            <div>
                                <p className='admin-body-text !text-[12px] dark:!text-white'> {symbol}</p>
                            </div>
                        </div>
                        <p className='top-label mt-[5px]'>Current Price : {marketPrice}</p>
                    </>
                }

                {/* Size input */}
                {(showNes === 1 || showNes === 2) &&
                    <>
                        <div className='mt-10 z-[5] rounded-5 py-[6px] px-[10px] flex border items-center justify-between gap-[15px] dark:border-[#25262a] border-[#e5e7eb] relative dark:bg-[#373d4e] bg-[#e5ecf0]'>
                            <div>
                                <p className='top-label'>Size  </p>
                                <input type="number" placeholder={props?.currentToken?.coin_symbol === symbol ? props?.currentToken?.coin_min_trade : props?.currentToken?.usdt_min_trade} value={sizeValue} onChange={(e) => { onChangeSizeValue(e) }} step="any" name="token_amount" className="bg-[transparent] max-w-full w-full outline-none md-text px-[5px] md-text " />
                            </div>
                            <div>
                                {/* <p className='admin-body-text !text-[12px] dark:!text-white'> USDT</p> */}
                                <SelectDropdown list={list} showNes={showNes} defaultValue="USDT" whiteColor={true} onCoinDropDownChange={onCoinDropDownChange} />
                            </div>
                        </div>
                    </>
                }

                {
                    showNes === 3 &&
                    <>
                        <div className='mt-10 z-[5] rounded-5 py-[6px] px-[10px] flex border items-center justify-between gap-[15px] dark:border-[#25262a] border-[#e5e7eb] relative dark:bg-[#373d4e] bg-[#e5ecf0]'>
                            <div>
                                <p className='top-label'>Stop  </p>
                                <input type="number" placeholder={props?.currentToken?.coin_symbol === symbol ? props?.currentToken?.coin_min_trade : props?.currentToken?.usdt_min_trade} step="any" name="token_amount" className="bg-[transparent] max-w-full w-full outline-none md-text px-[5px] md-text " />
                            </div>
                            <div>
                                <p className='admin-body-text !text-[12px] dark:!text-white'> USDT</p>
                            </div>
                        </div>
                        <div className='mt-10 z-[5] rounded-5 py-[6px] px-[10px] flex border items-center justify-between gap-[15px] dark:border-[#25262a] border-[#e5e7eb] relative dark:bg-[#373d4e] bg-[#e5ecf0]'>
                            <div>
                                <p className='top-label'>Limit  </p>
                                <input type="number" placeholder={props?.currentToken?.coin_symbol === symbol ? props?.currentToken?.coin_min_trade : props?.currentToken?.usdt_min_trade} step="any" name="token_amount" className="bg-[transparent] max-w-full w-full outline-none md-text px-[5px] md-text " />
                            </div>
                            <div>
                                <p className='admin-body-text !text-[12px] dark:!text-white'> USDT</p>
                            </div>
                        </div>
                        <div className='mt-10 z-[5] rounded-5 py-[6px] px-[10px] flex border items-center justify-between gap-[15px] dark:border-[#25262a] border-[#e5e7eb] relative dark:bg-[#373d4e] bg-[#e5ecf0]'>
                            <div>
                                <p className='top-label'>Amount  </p>
                                <input type="number" placeholder={props?.currentToken?.coin_symbol === symbol ? props?.currentToken?.coin_min_trade : props?.currentToken?.usdt_min_trade} step="any" name="token_amount" className="bg-[transparent] max-w-full w-full outline-none md-text px-[5px] md-text " />
                            </div>
                            <div>
                                <p className='admin-body-text !text-[12px] dark:!text-white'> {props?.currentToken?.coin_symbol}</p>
                            </div>
                        </div>
                    </>
                }


                {/* range slider */}
                <RangeSlider inputId={props.inputId} thumbId={props.thumbId} lineId={props.lineId} onChangeSizeInPercentage={onChangeSizeInPercentage} rangetype={'%'} />

                {/* TP/SL */}
                {(showNes === 1 || showNes === 2) &&
                    <>
                        <div className='flex items-center justify-between mt-[20px]'>

                            <div className={`flex gap-5 items-center  w-full cursor-pointer bg-[transparent]`} >
                                <input id={`custom-radio${props.radioId}`} type="checkbox" onChange={(e) => { profitlosspopupenable(e) }
                                } value="" name="colored-radio" className="hidden w-5 h-5 max-w-full   bg-red-400 border-[transparent] focus:ring-primary dark:focus:ring-primary dark:ring-offset-primary  dark:bg-[transparent] dark:border-[transparent]" />
                                <label htmlFor={`custom-radio${props.radioId}`} className="
                                    custom-radio relative  px-[17px]  flex gap-2 items-center pl-[18px]
                                    cursor-pointer
                                    after:dark:bg-omega
                                    after:bg-white
                                    after:left-[0px]
                                    after:w-[20px] 
                                    after:h-[20px]
                                    after:border after:border-beta
                                    after:absolute

                                    before:dark:bg-[transparent]
                                    before:bg-white
                                    before:left-[5px]

                                    before:w-[10px] 
                                    before:h-[10px]
                                    before:absolute
                                    before:z-[1]
                                    
                                    ">
                                    <p className="ml-2 md-text !text-[14px]">TP/SL</p>
                                </label>
                            </div>
                        </div>
                    </>
                }


                {/* open long */}
                <div className='mt-[20px]'>
                    <div className='flex gap-5 items-center justify-between'>
                        <p className="top-label">Buy</p>
                        <p className="top-label !text-[#000] dark:!text-[#fff]">{sizeValue} USDT</p>
                    </div>
                    {
                        show === 1 &&
                        <div className='mt-[5px]'>
                            <button disabled={buttonStyle} className={` solid-button w-full !bg-[#03A66D] !rounded-[8px] py-[10px] px-[15px] !text-[14px] ${buttonStyle === true?'cursor-not-allowed opacity-50':''}`} onClick={submitForm}>Open Long</button>
                        </div>
                    }
                    {
                        show === 2 &&
                        <div className='mt-[5px]'>
                            <button disabled={buttonStyle} className={`solid-button w-full !bg-sell !rounded-[8px] py-[10px] px-[15px] !text-[14px] ${buttonStyle === true?'cursor-not-allowed opacity-50':''}`} onClick={submitForm}>Open Short</button>
                        </div>
                    }
                    <div className='flex gap-5 items-center justify-between mt-[5px]'>
                        <p className="top-label">Margin</p>
                        <p className="top-label !text-[#000] dark:!text-[#fff]">{sizeValue / props?.marginMode?.leverage}</p>
                    </div>
                    <div className='flex gap-5 items-center justify-between mt-[5px]'>
                        <p className="top-label">Max</p>
                        <p className="top-label !text-[#000] dark:!text-[#fff]">{avaibalance * props?.marginMode?.leverage} USDT</p>
                    </div>
                </div>
                <div className='flex items-center justify-between px-[12px] py-[7px] dark:bg-[#373d4e] bg-[#e5ecf0] rounded-[4px] cursor-pointer mt-[10px]' onClick={() => { props.setOverlay(true); props.setPopupMode(4) }}>
                    <div className='flex items-center gap-10'>
                        <p className='top-label dark:!text-white !text-[#000]'>Fee Rate</p>
                    </div>
                    <IconsComponent type='rightArrowWithoutBg' />
                </div>

            </div>

            {/* overlay */}
            <div className={`sdsadsadd bg-black z-[9] duration-300 fixed top-0 left-0 h-full w-full opacity-0 invisible ${modelOverlay && '!opacity-[70%] !visible'}`}></div>
            <ProfitLossModal setModelOverlay={setModelOverlay} setModelPopup={setModelPopup} modelPopup={modelPopup} modelOverlay={modelOverlay} entryPrice={showNes === 1 ? entryPrice : marketPrice} currentToken={props?.currentToken} leverage={props?.marginMode?.leverage} sizeValue={sizeValue} show={show === 1 ? 'long' : 'short'} setTpSl={setTpSl} actionType="buysell" />
        </>

    )
}

export default BuySell;