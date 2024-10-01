
import React from 'react'
import { getProviders } from "next-auth/react"
import { getServerSession } from "next-auth/next"
import { GetServerSidePropsContext, InferGetServerSidePropsType } from 'next'
import { authOptions } from '../api/auth/[...nextauth]';
import dynamic from 'next/dynamic'
import Meta from '@/components/snippets/meta';

interface propsData{
  Watchlist?:any;
} 
const WatchListPage = dynamic(() => import('@/components/watchlist/watchListPage'), {
  loading: () => <p>Loading...</p>, // Custom loading component or spinner
});


const Watchlist = (props: propsData) => {
  return (
    <>
    <Meta title='Watchlist | Crypto Planet' description='Stay on top of the crypto market with your personalized watchlist! Monitor your favorite coins and tokens in real time, receive price alerts, and access key market data. Customize your watchlist to make informed trading decisions and never miss an opportunity in the dynamic world of cryptocurrency. Start tracking today!'/>
      <WatchListPage watchList={props.Watchlist}/>
    </>
  )
}

export default Watchlist

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const { req } = context;
  const session = await getServerSession(context.req, context.res, authOptions);
  const providers = await getProviders()
  if (session) {
      let userWatchList = await fetch(`${process.env.NEXT_PUBLIC_BASEURL}/watchlist?userid=${session?.user?.user_id}`, {
        method: "GET",
        headers: {
          "Authorization": session?.user?.access_token
        },
      }).then(response => response.json());
      
      return {
          props: {
              providers: providers,
              sessions: session,
              Watchlist: userWatchList?.data || []
          },
      };
  }
  return {
      redirect: { destination: "/" },
  };
}