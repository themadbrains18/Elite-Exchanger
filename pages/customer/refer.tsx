import React from 'react'
import { getProviders } from "next-auth/react"
import { getServerSession } from "next-auth/next"
import { GetServerSidePropsContext } from 'next'
import { authOptions } from '../api/auth/[...nextauth]';

interface propsData {
  eventList?: any;
  fixed?: boolean;
  show?: number;
  setShow?: Function | any;
  session?: any;
  referalList?: any,
}

import dynamic from 'next/dynamic';

const Hero = dynamic(() => import('@/components/refer/hero'), {
  loading: () => <p>Loading...</p>,
})
const ReferFriends = dynamic(() => import('@/components/refer/referFriends'), {
  loading: () => <p>Loading...</p>,
})
const Safe = dynamic(() => import('@/components/refer/safe'), {
  loading: () => <p>Loading...</p>,
})
const Earning = dynamic(() => import('@/components/refer/earning'), {
  loading: () => <p>Loading...</p>,
})
const Events = dynamic(() => import('@/components/refer/events'), {
  loading: () => <p>Loading...</p>,
})

const Refer = (props:propsData) => {

  return (
    <>
      <Hero />
      <ReferFriends />
      <Safe />
      <Events eventList={props.eventList}/>
      <Earning />
    </>
  )
}

export default Refer;

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const { req } = context;
  const session = await getServerSession(context.req, context.res, authOptions);
  const providers = await getProviders();

  let eventList = await fetch(`${process.env.NEXT_PUBLIC_BASEURL}/referal/customer`, {
    method: "GET"
  }).then(response => response.json());

  return {
    props: {
      sessions: session,
      session: session,
      provider: providers,
      eventList: eventList?.data?.data || []
    },
  };
}