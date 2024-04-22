import ResponsiveFixCta from '../../components/market/responsive-fix-cta'
import Banner from '../../components/wallet/banner'
import Exchange from '../../components/watchlist/exchange'
import React, { useEffect, useState } from 'react'
import WalletList from '../../components/wallet/wallet-list'
// import AddMoney from '../components/wallet/add-money'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { getProviders } from "next-auth/react"
import { getServerSession } from "next-auth/next"
import { GetServerSidePropsContext, InferGetServerSidePropsType } from 'next'
import { authOptions } from '../api/auth/[...nextauth]';
import { useWebSocket } from '@/libs/WebSocketContext'


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

const Wallet = (props: Session) => {


    const [userAssetsList, setUserAssetsList] = useState(props.assets);

    const [allCoins, setAllCoins] = useState(props.coinList);

    const wbsocket = useWebSocket();
    

    useEffect(() => {
        socket();
    }, [wbsocket])

    const socket = () => {
        if (wbsocket) {
            wbsocket.onmessage = (event) => {
                const data = JSON.parse(event.data).data;
                let eventDataType = JSON.parse(event.data).type;
                if (eventDataType === "price") {
                    refreshTokenList()
                }
            }
        }
    }

    const refreshTokenList = async () => {
        let tokenList = await fetch(`${process.env.NEXT_PUBLIC_BASEURL}/token`, {
            method: "GET"
        }).then(response => response.json());

        setAllCoins(tokenList?.data);
    }

    const refreshData = async () => {
        if (props.session) {
         
            let userAssets = await fetch(`${process.env.NEXT_PUBLIC_BASEURL}/assets?user_id=${props.session?.user?.user_id}`, {
                method: "GET",
                headers: {
                    "Authorization": props.session?.user?.access_token
                },
            }).then(response => response.json());

            setUserAssetsList(userAssets);

       
        }
    }

    return (
        <div>
            <ToastContainer limit={1}/>
            <div className=" bg-light-v-1 py-[20px] md:py-[80px] dark:bg-black-v-1">
                <div className="container flex gap-30 flex-wrap">
                    <div className="max-w-full lg:max-w-[calc(100%-463px)] w-full">
                        <Banner coinList={allCoins} networks={props?.networks} session={props.session} assets={userAssetsList?.data?.totalAmount} withdrawList={props.withdrawList} depositList={props.depositList} />
                        <WalletList coinList={allCoins} networks={props?.networks} session={props.session}   />
                    </div>
                    <div className="lg:max-w-[432px] w-full md:block hidden">
                        <div className="lg:block hidden ">
                            <Exchange id={0} coinList={allCoins} assets={userAssetsList?.data?.data} refreshData={refreshData} />
                        </div>
                    </div>
                </div>
                <div className="lg:hidden">
                    <ResponsiveFixCta />
                </div>
            </div>
        </div>
    )
}

export default Wallet;

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

        let withdraws = await fetch(`${process.env.NEXT_PUBLIC_BASEURL}/withdraw/list?user_id=${session?.user?.user_id}&itemOffset=0&itemsPerPage=20`, {
            method: "GET",
            headers: {
                "Authorization": session?.user?.access_token
            },
        }).then(response => response.json());
        let deposits = await fetch(`${process.env.NEXT_PUBLIC_BASEURL}/deposit?user_id=${session?.user?.user_id}&itemOffset=0&itemsPerPage=20`, {
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

    


        return {
            props: {
                providers: providers,
                session: session,
                sessions: session,
                coinList: tokenList?.data || [],
                networks: networkList?.data || [],
                withdrawList: withdraws?.data?.totalAmount || 0.00,
                depositList: deposits?.data?.totalAmount || 0.00,
                assets: userAssets || [] ,
            },
        };
    }
    return {
        redirect: { destination: "/" },
    };
}