import Historytrade from '@/components/tradeHistory/historytrade'
import React from 'react'
import { getProviders } from "next-auth/react"
import { getServerSession } from "next-auth/next"
import { GetServerSidePropsContext } from 'next'
import { authOptions } from '../api/auth/[...nextauth]';
import 'react-toastify/dist/ReactToastify.css';
import Meta from '@/components/snippets/meta'

interface propsData {
  session: {
    user: any
  },
  provider: any,
  coinList: any,
}

/**
 * TradeHistory Component.
 * This component renders the trade history page where users can review their
 * crypto transactions. It includes a meta tag to set the title and description for SEO purposes,
 * and the `Historytrade` component to display the user's transaction details.
 * 
 * @param {propsData} props - The properties passed to the component, including session data, provider, and coin list.
 * @returns {JSX.Element} The rendered Trade History page.
 */
const TradeHistory = (props: propsData) => {
  return (
    <>
    <Meta title='Trade History | Review Your Crypto Transactions' description='Access your complete crypto trade history and analyze your transactions with ease. Our Trade History page provides detailed insights into your buying, selling, and trading activities. Track your performance, monitor trends, and make informed decisions for future trades. Stay organized and in control of your crypto investments!'/>
    <Historytrade coinList={props.coinList}/>
    </>
  )
}

export default TradeHistory

/**
 * Server-side function to fetch data and pass it as props to the TradeHistory component.
 * This function fetches the user's session, provider details, and a list of available coins (tokenList).
 * 
 * @param {GetServerSidePropsContext} context - The context object containing request and response objects.
 * @returns {Promise<{props: object}>} The props to be passed to the component, including session and coin list.
 */
export async function getServerSideProps(context: GetServerSidePropsContext) {
  const { req } = context;
  const session = await getServerSession(context.req, context.res, authOptions);
  const providers = await getProviders();

  // Fetch the list of available coins (tokens)
  let tokenList = await fetch(`${process.env.NEXT_PUBLIC_BASEURL}/token`, {
    method: "GET"
  }).then(response => response.json());

  if (session) {

    // If the user is logged in, return the relevant data
    return {
      props: {
        session: session,
        sessions: session,
        provider: providers,
        coinList: tokenList?.data || [],
      },
    };
  }
  // Redirect to the homepage if the user is not authenticated
  return {
    redirect: { destination: "/" },
  };
}
