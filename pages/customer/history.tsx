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

const TradeHistory = (props: propsData) => {
  return (
    <>
    <Meta title='Trade History | Review Your Crypto Transactions' description='Access your complete crypto trade history and analyze your transactions with ease. Our Trade History page provides detailed insights into your buying, selling, and trading activities. Track your performance, monitor trends, and make informed decisions for future trades. Stay organized and in control of your crypto investments!'/>
    <Historytrade coinList={props.coinList}/>
    </>
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

    return {
      props: {
        session: session,
        sessions: session,
        provider: providers,
        coinList: tokenList?.data || [],
      },
    };
  }
  return {
    redirect: { destination: "/" },
  };
}
