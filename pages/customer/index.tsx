import Hero from '../../components/home/hero'
// import CryptoCoin from '../../components/home/CryptoCoin'
// import CreateProfile from '@/components/home/create-profile'
// import TradeAnyWhere from '@/components/home/trade-anywhere'
// import BestServices from '@/components/home/best-services'
// import InvestorSec from '@/components/home/investor-sec'
// import StartMinning from '@/components/home/start-minning'

import { useEffect, useState } from 'react'
import { getProviders } from "next-auth/react"
import { getServerSession } from "next-auth/next"
import { GetServerSidePropsContext } from 'next'
import { authOptions } from '../api/auth/[...nextauth]';
import { useWebSocket } from '@/libs/WebSocketContext'

import Meta from '@/components/snippets/meta'
import dynamic from 'next/dynamic'
import CardsSkeleton from '@/components/skeletons/cardsSkeleton'


const CryptoCoin = dynamic(() => import('../../components/home/CryptoCoin') , {
  loading: () => <CardsSkeleton/>,
} );
const CreateProfile = dynamic(() => import('@/components/home/create-profile') );
const TradeAnyWhere = dynamic(() => import('@/components/home/trade-anywhere') );
const BestServices = dynamic(() => import('@/components/home/best-services') );
const InvestorSec = dynamic(() => import('@/components/home/investor-sec') );
const StartMinning = dynamic(() => import('@/components/home/start-minning') );

interface Session {
  session: {
    user: any
  },
  provider: any,
  coinList: any
}

export default function Home({ session, coinList }: Session) {

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
    <Meta title='Buy and Sell Bitcoin, Ethereum | Secure Crypto Trading Platform' description='Trade Bitcoin, Ethereum, and other cryptocurrencies instantly on our secure and easy-to-use platform. Buy, sell, and manage your crypto assets with confidence. Join now for fast and reliable crypto trading!'/>

      <section className='container max-w-[1818px] w-full'>
        <Hero />
      </section>
      <CryptoCoin coinList={allCoins} />
      <CreateProfile />
      <TradeAnyWhere />
      <BestServices />
      <InvestorSec />
      <StartMinning />
    </>
  )
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const { req } = context;
  
  const session = await getServerSession(context.req, context.res, authOptions);
  const providers = await getProviders();

  let tokenList = await fetch(`${process.env.NEXT_PUBLIC_BASEURL}/token`, {
    method: "GET"
  }).then(response => response.json());

  return {
    props: {
      sessions: session,
      session: session,
      provider: providers,
      coinList: tokenList?.data || []
    },
  };
}
