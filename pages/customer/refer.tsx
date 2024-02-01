import Earning from '@/components/refer/earning';
import Events from '@/components/refer/events';
import Hero from '@/components/refer/hero';
import ReferFriends from '@/components/refer/referFriends';
import Safe from '@/components/refer/safe';
import React from 'react'

import { getProviders } from "next-auth/react"
import { getServerSession } from "next-auth/next"
import { GetServerSidePropsContext, InferGetServerSidePropsType } from 'next'
import { authOptions } from '../api/auth/[...nextauth]';

interface propsData {
  eventList?: any;
}

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