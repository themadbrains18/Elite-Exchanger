import Hero from '../../components/home/hero'
import { useEffect, useState } from 'react'
import { getProviders } from "next-auth/react"
import { getServerSession } from "next-auth/next"
import { GetServerSidePropsContext } from 'next'
import { authOptions } from '../api/auth/[...nextauth]';
import { useWebSocket } from '@/libs/WebSocketContext'

import Meta from '@/components/snippets/meta'
import dynamic from 'next/dynamic'
import CardsSkeleton from '@/components/skeletons/cardsSkeleton'


const CryptoCoin = dynamic(() => import('../../components/home/CryptoCoin'), {
  loading: () => <CardsSkeleton />,
});
const CreateProfile = dynamic(() => import('@/components/home/create-profile'));
const TradeAnyWhere = dynamic(() => import('@/components/home/trade-anywhere'));
const BestServices = dynamic(() => import('@/components/home/best-services'));
const InvestorSec = dynamic(() => import('@/components/home/investor-sec'));
const StartMinning = dynamic(() => import('@/components/home/start-minning'));

interface Session {
  session: {
    user: any
  },
  provider: any,
  coinList: any
}

/**
 * Home Page Component.
 * This component renders the home page for the crypto platform, including several dynamically loaded sections such as Hero, CryptoCoin, CreateProfile, etc.
 * It fetches the list of coins from the server, and listens for WebSocket messages to refresh the coin data.
 * 
 * @param {Session} props - The props passed to the component, including session data, coin list, and provider information.
 * @returns {JSX.Element} The rendered home page.
 */
export default function Home({ session, coinList }: Session) {

  // State to hold the list of all coins
  const [allCoins, setAllCoins] = useState(coinList);
  // WebSocket context for real-time updates
  const wbsocket = useWebSocket();

  /**
   * useEffect hook that listens to WebSocket messages and triggers a refresh of the token list on price updates.
   */
  useEffect(() => {
    socket();
  }, [wbsocket])

  /**
   * Function to handle WebSocket messages. If the message type is 'price', the coin list will be refreshed.
   */
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

  /**
   * Function to refresh the token list by fetching the latest coin data from the API.
   */
  const refreshTokenList = async () => {
    let tokenList = await fetch(`${process.env.NEXT_PUBLIC_BASEURL}/token`, {
      method: "GET"
    }).then(response => response.json());

    setAllCoins(tokenList?.data);
  }



  return (
    <>
      <Meta title='Buy and Sell Bitcoin, Ethereum | Secure Crypto Trading Platform' description='Trade Bitcoin, Ethereum, and other cryptocurrencies instantly on our secure and easy-to-use platform. Buy, sell, and manage your crypto assets with confidence. Join now for fast and reliable crypto trading!' />

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

/**
 * Server-side function to fetch session and coin data, and pass it as props to the Home component.
 * It retrieves the session data, provider information, and the list of available coins from the API.
 * 
 * @param {GetServerSidePropsContext} context - The context object containing request and response objects.
 * @returns {Promise<{props: object}>} The props to be passed to the component, including session and coin list.
 */
export async function getServerSideProps(context: GetServerSidePropsContext) {
  const { req } = context;

  // Get session information
  const session = await getServerSession(context.req, context.res, authOptions);
  const providers = await getProviders();

  // Fetch the list of available coins (tokens)
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
