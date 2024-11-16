import ResponsiveFixCta from '../../components/market/responsive-fix-cta'
import Banner from '../../components/wallet/banner'
import React, { useEffect, useRef, useState } from 'react'
import WalletList from '../../components/wallet/wallet-list'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { getProviders } from "next-auth/react"
import { getServerSession } from "next-auth/next"
import { GetServerSidePropsContext } from 'next'
import { authOptions } from '../api/auth/[...nextauth]';
import { useWebSocket } from '@/libs/WebSocketContext'
import Meta from '@/components/snippets/meta';


interface Session {
    session: {
        user: any
    },
    provider: any,
    coinList: any,
    networks: any,
    withdrawList: any,
    assets: any,
    convertList: any,
    depositList: any
}

/**
 * Wallet Component.
 * Displays the user's crypto wallet, including information such as assets, coins, and transactions.
 * The component listens to WebSocket messages to update the token and asset data in real-time.
 * Provides the user interface for managing and refreshing wallet data.
 *
 * @param {object} props - The properties passed to the Wallet component.
 * @param {object} props.session - The user's session data, including access token and user details.
 * @param {Array} props.coinList - The list of available coins in the platform.
 * @param {Array} props.networks - The list of supported networks for transactions.
 * @param {Array} props.withdrawList - The list of withdrawal data.
 * @param {Array} props.depositList - The list of deposit data.
 * @param {Array} props.assets - The list of assets owned by the user.
 * 
 * @returns {JSX.Element} The Wallet page with asset overview, coin list, and WebSocket support for real-time updates.
 */
const Wallet = (props: Session) => {

    const [userAssetsList, setUserAssetsList] = useState(props.assets);

    const [allCoins, setAllCoins] = useState(props.coinList);

    const wbsocket = useWebSocket();
    const socketListenerRef = useRef<(event: MessageEvent) => void>();
    useEffect(() => {

        /**
         * WebSocket message handler.
         * This function listens for incoming WebSocket messages and updates the token list
         * or user assets based on the event type (e.g., "convert", "price", "transfer").
         *
         * @param {MessageEvent} event - The WebSocket message event containing the data.
         */
        const handleSocketMessage = (event: any) => {
            const data = JSON.parse(event.data).data;
            let eventDataType = JSON.parse(event.data).type;

            if (eventDataType === "convert") {
                if (props.session) {
                    refreshTokenList()
                    refreshData();
                }
            }
            if (eventDataType === "price") {
                refreshTokenList()
            }
            if (eventDataType === "transfer") {
                refreshTokenList()
                refreshData();
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
     * Refresh the list of tokens available on the platform.
     * This function fetches the latest token data from the API and updates the state with the new list.
     */
    const refreshTokenList = async () => {
        let tokenList = await fetch(`${process.env.NEXT_PUBLIC_BASEURL}/token`, {
            method: "GET"
        }).then(response => response.json());

        setAllCoins(tokenList?.data);
    }

    /**
     * Refresh the user's asset data.
     * This function fetches the latest asset data from the API using the user's access token and updates the state.
     */
    const refreshData = async () => {
        try {
            if (props.session) {
                let userAssets = await fetch(`${process.env.NEXT_PUBLIC_BASEURL}/assets?user_id=${props.session?.user?.user_id}&itemOffset=0&itemsPerPage=20`, {
                    method: "GET",
                    headers: {
                        "Authorization": props.session?.user?.access_token
                    },
                }).then(response => response.json());
                setUserAssetsList(userAssets);
            }
        } catch (error) {
            console.log(error);
            
        }
    }

    return (
        <>
            <Meta title='Asset Overview | Crypto Planet' description='Manage your digital assets with our secure crypto wallet. Store, send, and receive a variety of cryptocurrencies effortlessly. Enjoy top-notch security features, user-friendly interface, and seamless integration with trading platforms. Safeguard your investments and experience peace of mind with our trusted crypto wallet solution.' />
            <div>
                <ToastContainer limit={1} />
                <div className=" bg-light-v-1 py-[20px] md:py-[80px] dark:bg-black-v-1">
                    <div className="container flex gap-30 flex-wrap">
                        <div className="max-w-full w-full">
                            <Banner coinList={allCoins} networks={props?.networks} session={props.session} assets={userAssetsList?.data?.totalAmount} withdrawList={props.withdrawList} depositList={props.depositList} />
                            <WalletList coinList={allCoins} networks={props?.networks} session={props.session} refreshData={refreshData} />
                        </div>
                        {/* <div className="lg:max-w-[432px] w-full md:block hidden">
                        <div className="lg:block hidden ">
                        <Exchange id={0} coinList={allCoins} assets={userAssetsList?.data?.data} refreshData={refreshData} />
                        </div>
                        </div> */}
                    </div>
                    <div className="lg:hidden">
                        <ResponsiveFixCta />
                    </div>
                </div>
            </div>
        </>
    )
}

export default Wallet;

/**
 * Server-side function to fetch data before rendering the page.
 * This function gets the user's session data, lists of coins, networks, assets, withdrawals, and deposits
 * to render the Wallet page with up-to-date information.
 *
 * @param {GetServerSidePropsContext} context - The context for the server-side request.
 * 
 * @returns {object} The props to be passed to the Wallet component, including session data, coin list, networks, and transactions.
 */
export async function getServerSideProps(context: GetServerSidePropsContext) {
    const { req } = context;
    const session = await getServerSession(context.req, context.res, authOptions);
    const providers = await getProviders()

    let tokenList = await fetch(`${process.env.NEXT_PUBLIC_BASEURL}/token`, {
        method: "GET"
    }).then(response => response.json());

    let networkList = await fetch(`${process.env.NEXT_PUBLIC_BASEURL}/network`, {
        method: "GET"
    }).then(response => response.json());

    if (session) {

        let withdraws = await fetch(`${process.env.NEXT_PUBLIC_BASEURL}/withdraw/list?user_id=${session?.user?.user_id}&itemOffset=0&itemsPerPage=20&currency=all&date=all`, {
            method: "GET",
            headers: {
                "Authorization": session?.user?.access_token
            },
        }).then(response => response.json());
        let deposits = await fetch(`${process.env.NEXT_PUBLIC_BASEURL}/deposit?user_id=${session?.user?.user_id}&itemOffset=0&itemsPerPage=20&currency=all&date=all`, {
            method: "GET",
            headers: {
                "Authorization": session?.user?.access_token
            },
        }).then(response => response.json());



        let userAssets = await fetch(`${process.env.NEXT_PUBLIC_BASEURL}/assets?user_id=${session?.user?.user_id}&itemOffset=0&itemsPerPage=20`, {
            method: "GET",
            headers: {
                "Authorization": session?.user?.access_token
            },
        }).then(response => response.json());

        // console.log(userAssets,"==assets");

        return {
            props: {
                providers: providers,
                session: session,
                sessions: session,
                coinList: tokenList?.data || [],
                networks: networkList?.data || [],
                withdrawList: withdraws?.data?.totalAmount || 0.00,
                depositList: deposits?.data?.totalAmount || 0.00,
                assets: userAssets || [],
            },
        };
    }
    return {
        redirect: { destination: "/" },
    };
}