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

    const [userWithdrawList, setUserWithdrawList] = useState(props.withdrawList);
    const [userDepositList, setUserDepositList] = useState(props.depositList);
    const [userAssetsList, setUserAssetsList] = useState(props.assets);
    const [userConvertList, setUserConvertList] = useState(props.convertList);

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
            let withdraws = await fetch(`${process.env.NEXT_PUBLIC_BASEURL}/withdraw/list?user_id=${props.session?.user?.user_id}`, {
                method: "GET",
                headers: {
                    "Authorization": props.session?.user?.access_token
                },
            }).then(response => response.json());

            setUserWithdrawList(withdraws?.data);
            let deposits = await fetch(`${process.env.NEXT_PUBLIC_BASEURL}/deposit?user_id=${props.session?.user?.user_id}`, {
                method: "GET",
                headers: {
                    "Authorization": props.session?.user?.access_token
                },
            }).then(response => response.json());

            setUserDepositList(deposits?.data);

            let userAssets = await fetch(`${process.env.NEXT_PUBLIC_BASEURL}/user/assets?userid=${props.session?.user?.user_id}`, {
                method: "GET",
                headers: {
                    "Authorization": props.session?.user?.access_token
                },
            }).then(response => response.json());

            setUserAssetsList(userAssets);

            let newConvertList = await fetch(`${process.env.NEXT_PUBLIC_BASEURL}/price/convertlist`, {
                method: "GET",
                headers: {
                    "Authorization": props.session?.user?.access_token
                },
            }).then(response => response.json());

            setUserConvertList(newConvertList?.data);
        }
    }

    return (
        <div>
            <ToastContainer />
            <div className=" bg-light-v-1 py-[20px] md:py-[80px] dark:bg-black-v-1">
                <div className="container flex gap-30 flex-wrap">
                    <div className="max-w-full lg:max-w-[calc(100%-463px)] w-full">
                        <Banner coinList={allCoins} networks={props?.networks} session={props.session} assets={userAssetsList} withdrawList={userWithdrawList} depositList={userDepositList} />
                        <WalletList coinList={allCoins} networks={props?.networks} session={props.session} withdrawList={userWithdrawList} depositList={userDepositList} assets={userAssetsList} refreshData={refreshData} userConvertList={userConvertList} />
                    </div>
                    <div className="lg:max-w-[432px] w-full md:block hidden">
                        <div className="lg:block hidden ">
                            <Exchange id={0} coinList={allCoins} assets={userAssetsList} refreshData={refreshData} />
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

        let withdraws = await fetch(`${process.env.NEXT_PUBLIC_BASEURL}/withdraw?user_id=${session?.user?.user_id}`, {
            method: "GET",
            headers: {
                "Authorization": session?.user?.access_token
            },
        }).then(response => response.json());
        let deposits = await fetch(`${process.env.NEXT_PUBLIC_BASEURL}/deposit?user_id=${session?.user?.user_id}`, {
            method: "GET",
            headers: {
                "Authorization": session?.user?.access_token
            },
        }).then(response => response.json());

        let userAssets = await fetch(`${process.env.NEXT_PUBLIC_BASEURL}/user/assets?userid=${session?.user?.user_id}`, {
            method: "GET",
            headers: {
                "Authorization": session?.user?.access_token
            },
        }).then(response => response.json());

        let userConvertList = await fetch(`${process.env.NEXT_PUBLIC_BASEURL}/price/convertlist`, {
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
                withdrawList: withdraws?.data || [],
                depositList: deposits?.data || [],
                assets: userAssets || [],
                convertList: userConvertList?.data || [],
            },
        };
    }
    return {
        redirect: { destination: "/" },
    };
}