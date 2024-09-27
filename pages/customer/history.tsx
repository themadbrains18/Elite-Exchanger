import Historytrade from '@/components/tradeHistory/historytrade'
import React from 'react'
import { getProviders } from "next-auth/react"
import { getServerSession } from "next-auth/next"
import { GetServerSidePropsContext } from 'next'
import { authOptions } from '../api/auth/[...nextauth]';
import 'react-toastify/dist/ReactToastify.css';

interface propsData {
  session: {
    user: any
  },
  provider: any,
  coinList: any,
}

const TradeHistory = (props: propsData) => {
  return (
    <Historytrade coinList={props.coinList}/>
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
