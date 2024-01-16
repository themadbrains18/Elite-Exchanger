import Marketpage from '@/components/market/marketpage'
import React, { useEffect, useState } from 'react'
import { getProviders } from "next-auth/react"
import { getServerSession } from "next-auth/next"
import { GetServerSidePropsContext, InferGetServerSidePropsType } from 'next'
import { authOptions } from '../api/auth/[...nextauth]';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

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

  useEffect(() => {
    const websocket = new WebSocket('ws://localhost:3001/');

    websocket.onopen = () => {
      console.log('connected');
    }

    websocket.onmessage = (event) => {
      const data = JSON.parse(event.data).data;
      let eventDataType = JSON.parse(event.data).type;
      if (eventDataType === "price") {
        refreshTokenList()
      }
    }

  }, [])

  const refreshTokenList = async () => {
    let tokenList = await fetch(`${process.env.NEXT_PUBLIC_BASEURL}/token`, {
      method: "GET"
    }).then(response => response.json());

    setAllCoins(tokenList?.data);
  }


  return (
    <>
      <ToastContainer />
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
  };
  // if (session) {

  // }
  // return {
  //   redirect: { destination: "/" },
  // };
}
