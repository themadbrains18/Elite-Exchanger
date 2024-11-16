import Marketpage from '@/components/market/marketpage'
import React, { useEffect, useState } from 'react'
import { getProviders } from "next-auth/react"
import { getServerSession } from "next-auth/next"
import { GetServerSidePropsContext } from 'next'
import { authOptions } from '../api/auth/[...nextauth]';
import 'react-toastify/dist/ReactToastify.css';
import { useWebSocket } from '@/libs/WebSocketContext'
import Meta from '@/components/snippets/meta'

interface Session {
  session: {
    user: any
  },
  provider: any,
  coinList: any,
  assets: any
  networks: any
}

/**
 * Market Page Component.
 * This component displays the market overview with real-time prices, trends, and insights.
 * It connects to a WebSocket to receive live updates on the prices of cryptocurrencies.
 * 
 * @param {Session} session - The session data containing user information.
 * @param {Array} coinList - The list of available cryptocurrencies.
 * @param {Array} assets - The list of assets owned by the user.
 * @param {Array} networks - The list of supported networks for transactions.
 * @returns {JSX.Element} The Market page with a market overview and user assets.
 */
const Market = ({ session, coinList, assets, networks }: Session) => {

  const [userAssetsList, setUserAssetsList] = useState(assets);
  const [allCoins, setAllCoins] = useState(coinList);

  const wbsocket = useWebSocket();

  useEffect(() => {
    socket();
  }, [wbsocket])

  /**
   * Sets up the WebSocket connection to listen for incoming price data.
   * When a price update is received, it triggers a refresh of the coin list.
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
   * Refreshes the list of available cryptocurrencies from the server.
   * This function is called when a new price update is received.
   */
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

/**
 * getServerSideProps function to fetch session, coin list, user assets, and supported networks.
 * It checks if the user is logged in and fetches relevant data for the market overview.
 * 
 * @param {GetServerSidePropsContext} context - The context object containing request and response objects.
 * @returns {Promise<{props: object}>} The props containing session data, coin list, networks, and user assets.
 */
export async function getServerSideProps(context: GetServerSidePropsContext) {
  const { req } = context;
  const session = await getServerSession(context.req, context.res, authOptions);
  const providers = await getProviders();

  // Fetch the list of available cryptocurrencies
  let tokenList = await fetch(`${process.env.NEXT_PUBLIC_BASEURL}/token`, {
    method: "GET"
  }).then(response => response.json());

  // Fetch the list of supported networks
  let networkList = await fetch(`${process.env.NEXT_PUBLIC_BASEURL}/network`, {
    method: "GET"
  }).then(response => response.json());

  let userAssets: any = [];
  if (session) {
    // Fetch user assets if the user is logged in
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
