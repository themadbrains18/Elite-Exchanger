import React, { useState } from 'react'
import BuySellCard from '../snippets/buySellCard'
import IconsComponent from '../snippets/icons'
import { useRouter } from 'next/router';
import Exchange from '../watchlist/exchange';
import AddMoney from '../wallet/add-money';

/**
 * Interface representing the props for a component that handles coin data, user session, 
 * and trading-related information.
 * 
 * @interface propsData
 */
interface propsData {
    /**
  * List of available coins, each represented by an object. This can include information 
  * such as the coin's symbol, name, and other relevant details.
  * 
  * @type {any}
  */
    coins?: any,
    /**
   * The current user session, which may include details like authentication status,
   * user ID, and other session-related data.
   * 
   * @type {any}
   */
    session?: any;
    /**
   * Information about the specific token the user is interacting with, such as details 
   * of a cryptocurrency token or an asset.
   * 
   * @type {any}
   */
    token?: any;
    /**
   * List of assets held by the user, which may include details about the amount, type, 
   * and value of each asset.
   * 
   * @type {any}
   */
    assets?: any;
    /**
   * The slug or identifier for a specific coin or asset, often used to query specific data 
   * for that coin.
   * 
   * @type {any}
   */
    slug?: any;
    /**
  * Function to get the current open orders of the user. Typically used for fetching data 
  * about pending trades that have not yet been completed.
  * 
  * @type {any}
  */
    getUserOpenOrder?: any;
    /**
   * Function to get the user's trade history, which includes completed trades such as 
   * buy and sell transactions.
   * 
   * @type {any}
   */
    getUserTradeHistory?: any;
}
const ResponsiveFixCta = (props: propsData) => {
    const router = useRouter();
    const [show, setShow] = useState(false);

    return (
        <>
            <div className={`bg-black z-[9] duration-300 fixed top-0 left-0 h-full w-full ${show ? "opacity-80 visible" : "opacity-0 invisible"}`} onClick={() => { setShow(false) }}></div>
            <div className=''>
                {
                    router.pathname.includes('/watchlist') ||
                        router.pathname.includes('/portfolio') ?

                        <button className='fixed bottom-30 left-[50%] translate-x-[-50%] w-[calc(100%-70px)] solid-button' onClick={() => { setShow(true) }}>
                            Exchange
                        </button>
                        :
                        <></>
                }
                {
                    router.pathname.includes('/market') ||
                    router.pathname.includes('/chart') &&
                    <button className='fixed bottom-30 z-[2] left-[50%] translate-x-[-50%] w-[calc(100%-70px)] solid-button' onClick={() => { setShow(true) }}>
                        Buy & Sell
                    </button>
                }
                {/* {
                router.pathname.includes('/wallet') &&
                <button className='fixed bottom-30 left-[50%] translate-x-[-50%] w-[calc(100%-70px)] solid-button' onClick={()=>{setShow(true)}}>
                    Add money
                </button>
            } */}


                <div className={`fixed top-[50%] w-[calc(100%-30px)] left-[50%] max-h-[610px] overflow-y-scroll translate-y-[-50%] translate-x-[-50%] z-[9] rounded-10  bg-white dark:bg-d-bg-primary duration-300 ${show ? "opacity-1 visible" : "opacity-0 invisible"}`}>
                    {/* {
                    router.pathname.includes('/watchlist')  ||
                    router.pathname.includes('/portfolio')  ?
                    
                    <Exchange id={1} /> : <></>
                } */}
                    {
                        router.pathname.includes('/wallet') &&
                        <AddMoney newId={1} show={show} setShow={setShow} />
                    }
                    {
                        router.pathname.includes('/market') || router.pathname.includes('/chart') &&
                        <BuySellCard id={2} coins={props.coins} session={props.session} token={props?.token} slug={props.slug} assets={props.assets} getUserOpenOrder={props.getUserOpenOrder} getUserTradeHistory={props.getUserTradeHistory} />
                    }
                    <div className='flex items-center gap-[10px] justify-center mb-[30px]' onClick={() => { setShow(false) }}>
                        <IconsComponent type='close' hover={false} active={false} />
                        <p className='sm-text mt-[2px] dark:text-white'>Close</p>
                    </div>
                </div>

            </div>
        </>
    )
}

export default ResponsiveFixCta