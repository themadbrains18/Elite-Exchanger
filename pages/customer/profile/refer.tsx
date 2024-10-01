import SideBarLayout from '@/components/layout/sideBarLayout'
import Referal from '@/components/profile/referal'
import React from 'react'
import { getProviders } from "next-auth/react"
import { getServerSession } from "next-auth/next"
import { GetServerSidePropsContext, InferGetServerSidePropsType } from 'next'
import { authOptions } from '../../api/auth/[...nextauth]';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Meta from '@/components/snippets/meta'

interface propsData {
  session: {
    user: any
  },
  referalList: any,
  userDetail: any,
  eventList?: any,
  rewardsList?: any;
}

const Refer = (props: propsData) => {
  return (
    
    <>
    <Meta title='Refer and Earn | Crypto Referral Program' description='Join our Crypto Referral Program and start earning rewards today! Invite friends to trade on our platform, and receive bonuses for each successful referral. Discover how easy it is to share your love for crypto while benefiting from exclusive rewards. Start referring now and maximize your earnings!' />
    <SideBarLayout userDetail={props.userDetail} referalList={props.referalList} eventList={props.eventList} rewardsList={props.rewardsList}>
      <ToastContainer limit={1} />
      <Referal session={props.session} referalList={props.referalList} eventList={props.eventList} rewardsList={props.rewardsList} />
    </SideBarLayout>
    </>
  )
}

export default Refer

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const { req } = context;
  const session = await getServerSession(context.req, context.res, authOptions);
  const providers = await getProviders()

  if (session) {

    let referalList = await fetch(`${process.env.NEXT_PUBLIC_BASEURL}/referal?userid=${session?.user?.user_id}`, {
      method: "GET",
      headers: {
        "Authorization": session?.user?.access_token
      },
    }).then(response => response.json());

    let profileDashboard = await fetch(`${process.env.NEXT_PUBLIC_BASEURL}/profile/dashboard?userid=${session?.user?.user_id}`, {
      method: "GET",
      headers: {
        "Authorization": session?.user?.access_token
      },
    }).then(response => response.json());

    let eventList = await fetch(`${process.env.NEXT_PUBLIC_BASEURL}/referal/customer`, {
      method: "GET"
    }).then(response => response.json());

    let rewardsList = await fetch(`${process.env.NEXT_PUBLIC_BASEURL}/rewards?userid=${session?.user?.user_id}`, {
      method: "GET",
      headers: {
        "Authorization": session?.user?.access_token
      },
    }).then(response => response.json());

    return {
      props: {
        sessions: session,
        session: session,
        referalList: referalList?.data || [],
        userDetail: profileDashboard?.data || null,
        eventList: eventList?.data?.data || [],
        rewardsList: rewardsList?.data || []
      },
    };
  }
  return {
    redirect: { destination: "/" },
  };
}