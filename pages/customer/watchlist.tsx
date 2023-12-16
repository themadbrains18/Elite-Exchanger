import WatchListPage from '@/components/watchlist/watchListPage'
import React from 'react'
import { getProviders } from "next-auth/react"
import { getServerSession } from "next-auth/next"
import { GetServerSidePropsContext, InferGetServerSidePropsType } from 'next'
import { authOptions } from '../api/auth/[...nextauth]';

const Watchlist = ({ sessions }: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  return (
    <>
      <WatchListPage />
    </>
  )
}

export default Watchlist

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const { req } = context;
  const session = await getServerSession(context.req, context.res, authOptions);
  const providers = await getProviders()
  if (session) {
      return {
          props: {
              providers: providers,
              sessions: session
          },
      };
  }
  return {
      redirect: { destination: "/" },
  };
}