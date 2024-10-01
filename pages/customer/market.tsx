import Marketpage from '@/components/market/marketpage'
import React, { useEffect, useState } from 'react'
import { getProviders } from "next-auth/react"
import { getServerSession } from "next-auth/next"
import { GetServerSidePropsContext } from 'next'
import { authOptions } from '../api/auth/[...nextauth]';
import 'react-toastify/dist/ReactToastify.css';
import { useWebSocket } from '@/libs/WebSocketContext'
import Meta from '@/components/snippets/meta'
// import Pusher from 'pusher-js';

// const pusher = new Pusher('b275b2f9e51725c09934', {
//   cluster: 'ap2'
// });

interface Session {
  session: {
    user: any
  },
  provider: any,
  coinList: any,
  assets: any
  networks: any
}

const Market = ({ session, coinList, assets, networks }: Session) => {

  const [userAssetsList, setUserAssetsList] = useState(assets);
  const [allCoins, setAllCoins] = useState(coinList);

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


  return (
    <>
      {/* <ToastContainer limit={1} /> */}
      <Meta title='Crypto Market Overview | Latest Trends, Prices & Insights' description='Stay informed with our comprehensive crypto market overview. Explore the latest trends, real-time prices, and in-depth insights on major cryptocurrencies, market cap, trading volume, and more. Join our community of crypto enthusiasts and navigate the ever-evolving landscape of digital assets with confidence.'/>
      <Marketpage coinList={allCoins} session={session} assets={userAssetsList} networks={networks} />
    </>
  )
}

export default Market;

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const { req } = context;
  const session = await getServerSession(context.req, context.res, authOptions);
  const providers = await getProviders();

  let tokenList = await fetch(`${process.env.NEXT_PUBLIC_BASEURL}/token`, {
    method: "GET"
  }).then(response => response.json());

  let networkList = await fetch(`${process.env.NEXT_PUBLIC_BASEURL}/network`, {
    method: "GET"
  }).then(response => response.json());

  let userAssets: any = [];
  if (session) {
    userAssets = await fetch(`${process.env.NEXT_PUBLIC_BASEURL}/user/assets?userid=${session?.user?.user_id}`, {
      method: "GET",
      headers: {
        "Authorization": session?.user?.access_token
      },
    }).then(response => response.json());
  }

  return {
    props: {
      session: session,
      sessions: session,
      provider: providers,
      coinList: tokenList?.data || [],
      networks: networkList?.data || [],
      assets: userAssets
    },
  }
}
