import React from 'react'
import IconsComponent from '../snippets/icons';
interface showSidebar {
    show?: boolean;
    setShow?: Function;
    currentToken?: any;
}
const TopBar = (props: showSidebar) => {

    return (
        <section className='px-[1.25rem] py-[10px] bg-[#fafafa] dark:bg-[#1a1b1f] border-b dark:border-[#25262a] border-[#e5e7eb]'>
            <div className='overflow-x-auto hide-scroller'>
                <div className='flex items-center gap-[26px] w-[1200px]'>
                    {/* coin name */}
                    <div onClick={() => { props.setShow!==undefined && props.setShow(!props.show) }} className='max-[1140px]:left-0 max-[1140px]:top-0 max-[1140px]:sticky dark:bg-[#232428] bg-[#fff] rounded-[4px] cursor-pointer border border-[#9db3ba33] p-[5px] flex items-center gap-10'>
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
                        <p className='top-label !text-[#000] dark:!text-[#fff]'>0.0100% / 06:38:22</p>
                    </div>
                    {/* 24h Change*/}
                    <div>
                        <p className='top-label'>24h Change</p>
                        <p className='top-label !text-buy'>1.54%</p>
                    </div>
                    {/* 24h High */}
                    <div>
                        <p className='top-label'>24h High</p>
                        <p className='top-label !text-[#000] dark:!text-[#fff]'>37,526.7</p>
                    </div>
                    {/* 24h Low */}
                    <div>
                        <p className='top-label'>24h Low</p>
                        <p className='top-label !text-[#000] dark:!text-[#fff]'>36,384.0</p>
                    </div>
                    {/* 24h Volume(BTC) */}
                    <div>
                        <p className='top-label'>24h Volume({props?.currentToken?.coin_symbol})</p>
                        <p className='top-label !text-[#000] dark:!text-[#fff]'>165,593.148</p>
                    </div>
                    {/* 24h Volume(USDT) */}
                    <div>
                        <p className='top-label'>24h Volume({props?.currentToken?.usdt_symbol})</p>
                        <p className='top-label !text-[#000] dark:!text-[#fff]'>6,127,471,871.07</p>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default TopBar;