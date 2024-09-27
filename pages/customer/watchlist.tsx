
import React from 'react'
import { getProviders } from "next-auth/react"
import { getServerSession } from "next-auth/next"
import { GetServerSidePropsContext, InferGetServerSidePropsType } from 'next'
import { authOptions } from '../api/auth/[...nextauth]';
import dynamic from 'next/dynamic'

interface propsData{
  Watchlist?:any;
} 
const WatchListPage = dynamic(() => import('@/components/watchlist/watchListPage'), {
  loading: () => <p>Loading...</p>, // Custom loading component or spinner
});


const Watchlist = (props: propsData) => {
  return (
    <>
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