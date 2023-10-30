import Historytrade from '@/components/tradeHistory/historytrade'
import React, { useState } from 'react'

import { getProviders } from "next-auth/react"
import { getServerSession } from "next-auth/next"
import { GetServerSidePropsContext, InferGetServerSidePropsType } from 'next'
import { authOptions } from './api/auth/[...nextauth]';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface propsData {
  session: {
    user: any
  },
  provider: any,
  coinList: any,
  trades: any,
  withdraws: any,
  deposits: any,
  convertHistory : any,
  stakingHistory : any
}

const TradeHistory = (props: propsData) => {

  const [stakingList, setStakingList] = useState(props.stakingHistory);

  const refreshStakingData = async()=>{
    let userStakingHistory = await fetch(`${process.env.NEXT_PUBLIC_BASEURL}/staking/history`, {
      method: "GET",
      headers: {
        "Authorization": props?.session?.user?.access_token
      },
    }).then(response => response.json());

    setStakingList(userStakingHistory?.data);
  }

  return (
    
    <Historytrade tradeHistory={props.trades} withdraws={props.withdraws} deposits={props.deposits} convertHistory={props.convertHistory} stakingHistory={stakingList} refreshStakingData={refreshStakingData}/>
  )
}

export default TradeHistory

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const { req } = context;
  const session = await getServerSession(context.req, context.res, authOptions);
  const providers = await getProviders();

  let tokenList = await fetch(`${process.env.NEXT_PUBLIC_BASEURL}/token`, {
    method: "GET"
  }).then(response => response.json());

  if (session) {

    let tradeHistory = await fetch(`${process.env.NEXT_PUBLIC_BASEURL}/history/trade?userid=${session?.user?.user_id}`, {
      method: "GET",
      headers: {
        "Authorization": session?.user?.access_token
      },
    }).then(response => response.json());

    if (tradeHistory?.data?.message !== undefined) {
      tradeHistory = [];
    }
    else {
      tradeHistory = tradeHistory?.data;
    }

    let withdraws = await fetch(`${process.env.NEXT_PUBLIC_BASEURL}/withdraw/list?user_id=${session?.user?.user_id}`, {
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

    let userConvertHistory = await fetch(`${process.env.NEXT_PUBLIC_BASEURL}/price/converthistory`, {
      method: "GET",
      headers: {
        "Authorization": session?.user?.access_token
      },
    }).then(response => response.json());


    let userStakingHistory = await fetch(`${process.env.NEXT_PUBLIC_BASEURL}/staking/history`, {
      method: "GET",
      headers: {
        "Authorization": session?.user?.access_token
      },
    }).then(response => response.json());

    return {
      props: {
        session: session,
        sessions: session,
        provider: providers,
        coinList: tokenList?.data,
        trades: tradeHistory || [],
        withdraws: withdraws?.data || [],
        deposits: deposits?.data || [],
        convertHistory : userConvertHistory?.data || [],
        stakingHistory : userStakingHistory?.data || []
      },
    };
  }
  return {
    redirect: { destination: "/" },
  };
}
