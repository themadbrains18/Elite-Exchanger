import React, { useEffect, useRef, useState } from 'react'
import IconsComponent from '../snippets/icons';
import TimerCountDown from './timer-countdown';

interface showSidebar {
    show?: boolean;
    setShow?: Function;
    currentToken?: any;
    topHLOCData?: any;
    slug?:any;
}
const TopBar = (props: showSidebar) => {

    const Ref: any = useRef(null);
    const [timer, setTimer] = useState("00:00:00");

    const getTimeRemaining = (e: any) => {
        let deadline: any = new Date();
        const total = Date.parse(e) - Date.parse(deadline);
        const seconds = Math.floor((total / 1000) % 60);
        const minutes = Math.floor(
            (total / 1000 / 60) % 60
        );
        const hours = Math.floor(
            (total / 1000 / 60 / 60) % 8
        );
        return {
            total,
            hours,
            minutes,
            seconds,
        };
    };

    const startTimer = (e: any) => {
        let { total, hours, minutes, seconds } =
            getTimeRemaining(e);
        if (total >= 0) {
            setTimer(
                (hours > 9 ? hours : "0" + hours) +
                ":" +
                (minutes > 9
                    ? minutes
                    : "0" + minutes) +
                ":" +
                (seconds > 9 ? seconds : "0" + seconds)
            );
        }
    };

    const clearTimer = (e: any) => {
        setTimer("08:00:00");
        if (Ref.current) clearInterval(Ref.current);
        const id = setInterval(() => {
            startTimer(e);
        }, 1000);

        Ref.current = id;
    };

    const getDeadTime = () => {
        let deadline = new Date('Dec 05 2023 08:00:00 GMT-0000');
        deadline.setHours(deadline.getHours() + 8);
        return deadline;
    };

    useEffect(() => {
        clearTimer(getDeadTime());
    }, []);

    let marketPrice = props?.currentToken?.token !== null ? props?.currentToken?.token?.price.toFixed(5) : props?.currentToken?.global_token?.price.toFixed(5);

    let change = ((marketPrice - props?.topHLOCData?.open)/props?.topHLOCData?.open)*100;

    if(props?.topHLOCData?.open === 0){
        change = 0.00;
    }

    // let change = ((marketPrice - 42000)/42000)*100;

    return (
        <section className='px-[1.25rem] py-[10px] bg-[#fafafa] dark:bg-[#1a1b1f] border-b dark:border-[#25262a] border-[#e5e7eb]'>
            <div className='overflow-x-auto hide-scroller'>
                <div className='flex items-center gap-[26px] w-[1200px]'>
                    {/* coin name */}
                    <div onClick={() => { props.setShow !== undefined && props.setShow(!props.show) }} className='max-[1140px]:left-0 max-[1140px]:top-0 max-[1140px]:sticky dark:bg-[#232428] bg-[#fff] rounded-[4px] cursor-pointer border border-[#9db3ba33] p-[5px] flex items-center gap-10'>
                        <div>
                            <p className='info-14-18 dark:!text-white'>{props?.currentToken?.coin_symbol}{props?.currentToken?.usdt_symbol}</p>
                            <p className='admin-body-text !text-[#a3a8b7]'>Perpetual</p>
                        </div>
                        <div className='max-w-[24px] w-full'>
                            <IconsComponent type='swap' />
                        </div>

                    </div>

                    {/* coin price */}
                    <p className='admin-component-heading !text-buy'>{props?.currentToken?.token !== null ? props?.currentToken?.token?.price.toFixed(5) : props?.currentToken?.global_token?.price.toFixed(5)}</p>
                    <div>
                        <p className='top-label'>Mark</p>
                        <p className='top-label !text-[#000] dark:!text-[#fff]'>{props?.currentToken?.token !== null ? props?.currentToken?.token?.price.toFixed(5) : props?.currentToken?.global_token?.price.toFixed(5)}</p>
                    </div>
                    {/* index */}
                    {/* <div>
                        <p className='top-label'>Index</p>
                        <p className='top-label !text-[#000] dark:!text-[#fff]'>37,155.4</p>
                    </div> */}
                    {/* fundingrate */}
                    <div>
                        <p className='top-label'>Funding Rate / Countdown</p>
                        <p className='top-label !text-[#000] dark:!text-[#fff]'>0.0100% /{timer} </p>
                        {/* <TimerCountDown /> */}
                    </div>
                    {/* 24h Change*/}
                    <div>
                        <p className='top-label'>24h Change</p>
                        <p className={`top-label ${change < 0 ? '!text-sell':'!text-buy'}`}>{change.toFixed(4)}%</p>
                    </div>
                    {/* 24h High */}
                    <div>
                        <p className='top-label'>24h High</p>
                        <p className='top-label !text-[#000] dark:!text-[#fff]'>{props?.topHLOCData?.high?.toFixed(4)}</p>
                    </div>
                    {/* 24h Low */}
                    <div>
                        <p className='top-label'>24h Low</p>
                        <p className='top-label !text-[#000] dark:!text-[#fff]'>{props?.topHLOCData?.low?.toFixed(4)}</p>
                    </div>
                    {/* 24h Volume(BTC) */}
                    <div>
                        <p className='top-label'>open</p>
                        <p className='top-label !text-[#000] dark:!text-[#fff]'>{props?.topHLOCData?.open?.toFixed(4)}</p>
                    </div>
                    {/* 24h Volume(USDT) */}
                    <div>
                        <p className='top-label'>24h Volume({props?.currentToken?.usdt_symbol})</p>
                        <p className='top-label !text-[#000] dark:!text-[#fff]'>{props?.topHLOCData?.volume}</p>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default TopBar;