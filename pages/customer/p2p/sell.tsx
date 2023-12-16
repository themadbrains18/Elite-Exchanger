import P2pLayout from '@/components/layout/p2p-layout';
import SellCoinsTabs from '@/components/p2p/buy/sell-coin-tabs';
import BuyPopup from '@/components/snippets/buyPopup';
import React, { useState } from 'react'

import { getProviders } from "next-auth/react"
import { getServerSession } from "next-auth/next"
import { GetServerSidePropsContext, InferGetServerSidePropsType } from 'next'
import { authOptions } from '../../api/auth/[...nextauth]';

interface propsData {
  provider: any,
  coinList: any,
  networks: any,
  assets: any,
}

const P2pSell = (props:propsData) => {
  const [show1,setShow1] = useState(false);

  return (
    <P2pLayout>
      <SellCoinsTabs setShow1={setShow1} coinList={props?.coinList}/>
    </P2pLayout>
  )
}

export default P2pSell;

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

    let userAssets = await fetch(`${process.env.NEXT_PUBLIC_BASEURL}/user/assets?userid=${session?.user?.user_id}`, {
      method: "GET",
      headers: {
        "Authorization": session?.user?.access_token
      },
    }).then(response => response.json());

    return {
      props: {
        providers: providers,
        sessions: session,
        coinList: tokenList?.data,
        assets: userAssets || [],
      },
    };
  }
  
  return {
    props: {
      providers: providers,
      sessions: session,
      coinList: tokenList?.data,
      assets: [],
    },
  };

}