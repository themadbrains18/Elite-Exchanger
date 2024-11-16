import { truncateNumber } from '@/libs/subdomain';
import Link from 'next/link';
import React, { useEffect, useState } from 'react'
import { currencyFormatter } from '../snippets/market/buySellCard';
interface fullWidth {
    fullWidth?: boolean;
    heightAuto?: boolean;
    popupMode?: number;
    setPopupMode?: any;
    setOverlay?: any;
    balance?: any;
    positions?: any;
    openOrders?: any;
    assets?: any;
}

/**
 * MarginRatio Component
 * 
 * This component displays the margin balance and wallet balance in USDT, calculates the available margin 
 * based on the user's positions and assets, and provides links for buying crypto or transferring funds.
 * 
 * It accepts the following props:
 * - `fullWidth`: A boolean to determine whether the component should take full width or a limited width.
 * - `heightAuto`: A boolean to adjust the component height automatically (not used in the component).
 * - `popupMode`: The current mode of the popup (not used directly in the component).
 * - `setPopupMode`: A function to set the current popup mode (used for showing transfer popup).
 * - `setOverlay`: A function to set the visibility of the overlay (used for the transfer popup).
 * - `balance`: The user's balance (not used directly in the component).
 * - `positions`: An array of user's positions (used to calculate the margin balance).
 * - `openOrders`: An array of open orders (not used in the component).
 * - `assets`: An array of user's assets (used to get the available balance in USDT).
 * 
 * @param {fullWidth} props.fullWidth - Whether the component should take full width or not.
 * @param {number} props.popupMode - The current popup mode.
 * @param {Function} props.setPopupMode - Function to set the current popup mode.
 * @param {Function} props.setOverlay - Function to control the overlay visibility.
 * @param {Array} props.positions - List of user positions.
 * @param {Array} props.assets - List of user assets.
 */
const MarginRatio = (props: fullWidth) => {
    const [avaibalance, setAvailBalance] = useState(0);
    const [marginBal, setMarginBal] = useState(0);

    useEffect(() => {
        let futureAssets = props?.assets?.filter((item: any) => {
            return item.walletTtype === "future_wallet";
        });

        let asset = futureAssets?.filter((item: any) => {
            let tokenSymbol =
                item?.token !== null ? item?.token?.symbol : item?.global_token?.symbol;
            return tokenSymbol === 'USDT'
        });

        if (asset?.length > 0) {
            let assetbal =truncateNumber(Number(asset[0].balance), 6)
            setAvailBalance(assetbal);

            let marginbalance = assetbal;
            if (props.positions && props.positions.length > 0) {
                props.positions.map((item: any) => {
                    marginbalance += item?.margin + item?.pnl;
                })
            }
            setMarginBal(marginbalance);
        }

    }, [props.positions]);

    return (
        <div className={`bg-[#fff] overflow-y-auto dark:bg-[#1a1b1f] py-[14px] px-[16px] ${props.fullWidth ? 'max-w-full' : 'max-w-[300px]'} w-full`}>
            <div className='flex gap-5 items-center justify-between mt-[10px] mb-[15px]'>
                <p className="top-label">Margin Balance </p>
                <p className="top-label !text-[#000] dark:!text-[#fff]">{truncateNumber(marginBal, 6) || '0.00'}<span> USDT</span></p>
            </div>
            <div className='flex gap-5 items-center justify-between mt-[4px]'>
                <p className="top-label">Wallet Balance</p>
                <p className="top-label !text-[#000] dark:!text-[#fff]">{currencyFormatter(truncateNumber(avaibalance, 6)) || '0.00'} <span> USDT</span></p>
            </div>
            
            <div className='flex items-center gap-[15px] mt-[15px]'>
                <Link prefetch={false} href="/p2p/express" className='border dark:text-white text-[#1A1B1F] dark:border-[#25262a] border-[#e5e7eb] text-center text-[12px] rounded-[4px] py-[5px] px-[10px] w-full max-w-full' >Buy Crypto</Link>
                <button className='border dark:text-white text-[#1A1B1F] dark:border-[#25262a] border-[#e5e7eb] text-[12px] rounded-[4px] py-[5px] px-[10px] w-full max-w-full' onClick={() => { props.setOverlay(true); props.setPopupMode(3) }}>Transfer</button>
            </div>
        </div>
    )
}

export default MarginRatio;