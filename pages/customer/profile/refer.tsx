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

/**
 * Refer page component that renders the sidebar layout with referral details, event list, and rewards.
 * It includes the referral section and displays meta information for SEO.
 * 
 * @param {propsData} props - The props object containing user session, referral list, event list, and rewards list.
 * @returns {JSX.Element} - A layout with referral details, event list, rewards, and notification toasts for the user.
 */
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

/**
 * Fetches session, referral list, user profile, event list, and rewards list from the server 
 * before rendering the referral page.
 * 
 * @param {GetServerSidePropsContext} context - The context object containing request and response.
 * @returns {Promise<Object>} - The props to be passed to the component, including session, referral data, event details, 
 *                              and rewards list, or a redirect if the session is not found.
 */
export async function getServerSideProps(context: GetServerSidePropsContext) {
  const { req } = context;
  const session = await getServerSession(context.req, context.res, authOptions);
  const providers = await getProviders()

  // If session exists, fetch referral, user profile, event, and rewards data
  if (session) {

    // Fetch referral list for the user
    let referalList = await fetch(`${process.env.NEXT_PUBLIC_BASEURL}/referal?userid=${session?.user?.user_id}`, {
      method: "GET",
      headers: {
        "Authorization": session?.user?.access_token
      },
    }).then(response => response.json());

    // Fetch user profile dashboard data
    let profileDashboard = await fetch(`${process.env.NEXT_PUBLIC_BASEURL}/profile/dashboard?userid=${session?.user?.user_id}`, {
      method: "GET",
      headers: {
        "Authorization": session?.user?.access_token
      },
    }).then(response => response.json());

    // Fetch event list related to referrals
    let eventList = await fetch(`${process.env.NEXT_PUBLIC_BASEURL}/referal/customer`, {
      method: "GET"
    }).then(response => response.json());

    // Fetch rewards list for the user
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