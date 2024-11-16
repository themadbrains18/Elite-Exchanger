import P2pLayout from '@/components/layout/p2p-layout';
import SellCoinsTabs from '@/components/p2p/buy/sell-coin-tabs';
import BuyPopup from '@/components/snippets/buyPopup';
import React, { useState } from 'react'

import { getProviders } from "next-auth/react"
import { getServerSession } from "next-auth/next"
import { GetServerSidePropsContext, InferGetServerSidePropsType } from 'next'
import { authOptions } from '../../api/auth/[...nextauth]';
import Meta from '@/components/snippets/meta';

interface propsData {
  provider: any,
  coinList: any,
  networks: any,
  assets: any,
}

const P2pSell = (props: propsData) => {
  const [show1, setShow1] = useState(false);

  return (
    <>
      <Meta title='Crypto Planet P2P Trading | Sell Crypto via P2P' description='Crypto Planet Sell Crypto via P2P' />

      <P2pLayout>
        <SellCoinsTabs setShow1={setShow1} coinList={props?.coinList} />
      </P2pLayout>
    </>
  )
}

export default P2pSell;

/**
 * Fetches the server-side data required for the page.
 * This function fetches session data, authentication providers, 
 * the list of available tokens, and the user's assets if authenticated.
 * 
 * @param context - The Next.js server-side context that includes the request and response.
 * @returns An object containing the props for the page, including session data, providers, token list, and assets.
 */
export async function getServerSideProps(context: GetServerSidePropsContext) {
  const { req } = context;

   // Retrieve the user session from the server using NextAuth
  const session = await getServerSession(context.req, context.res, authOptions);

  // Fetch available authentication providers for the page (e.g., OAuth options)
  const providers = await getProviders()

  // Fetch the list of available tokens (coins) for P2P trading
  let tokenList = await fetch(`${process.env.NEXT_PUBLIC_BASEURL}/token`, {
    method: "GET"
  }).then(response => response.json());

  if (session) {
    // If a user session exists, fetch the user's assets (cryptocurrencies they hold)
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