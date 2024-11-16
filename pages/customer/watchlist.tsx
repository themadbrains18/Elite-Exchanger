
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

// Dynamically loads the WatchListPage component with a custom loading state
const WatchListPage = dynamic(() => import('@/components/watchlist/watchListPage'), {
  loading: () => <p>Loading...</p>, // Custom loading component or spinner
});

/**
 * Watchlist component to render the user's personalized watchlist.
 * 
 * @param props - Contains the user's watchlist data to display.
 * @returns JSX element that displays the watchlist page with the provided data.
 */
const Watchlist = (props: propsData) => {
  return (
    <>
    <Meta title='Watchlist | Crypto Planet' description='Stay on top of the crypto market with your personalized watchlist! Monitor your favorite coins and tokens in real time, receive price alerts, and access key market data. Customize your watchlist to make informed trading decisions and never miss an opportunity in the dynamic world of cryptocurrency. Start tracking today!'/>
      <WatchListPage watchList={props.Watchlist}/>
    </>
  )
}

export default Watchlist

/**
 * Server-side function to fetch the user's watchlist data.
 * 
 * @param context - The context of the server-side request, including request and response objects.
 * @returns Object with props for the Watchlist component, including session and watchlist data.
 */
export async function getServerSideProps(context: GetServerSidePropsContext) {
  const { req } = context;
  const session = await getServerSession(context.req, context.res, authOptions);
  const providers = await getProviders()
  if (session) {
    // Fetch the user's watchlist data from the API
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