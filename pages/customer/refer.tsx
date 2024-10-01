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
import Meta from '@/components/snippets/meta';

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

const Refer = (props: propsData) => {

  return (
    <>
      <Meta title='Refer and Earn | Crypto Referral Program' description='Join our Crypto Referral Program and start earning rewards today! Invite friends to trade on our platform, and receive bonuses for each successful referral. Discover how easy it is to share your love for crypto while benefiting from exclusive rewards. Start referring now and maximize your earnings!' />
      <Hero />
      <ReferFriends />
      <Safe />
      <Events eventList={props.eventList} />
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