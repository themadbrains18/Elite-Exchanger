import P2pLayout from '@/components/layout/p2p-layout';
import UserCenterProfile from '@/components/p2p/user-center/user-center-profile';
import PaymentMethod from '@/components/p2p/postadv/paymentMethod';
import React from 'react'

import { getProviders } from "next-auth/react"
import { getServerSession } from "next-auth/next"
import { GetServerSidePropsContext, InferGetServerSidePropsType } from 'next'
import { authOptions } from '../../api/auth/[...nextauth]';
import Meta from '@/components/snippets/meta';

interface propsData {
  userDetail?: any;
  masterPayMethod?: any;
  userPaymentMethod?: any;
  posts?: any;
}

const UserCenter = (props: propsData) => {

  return (
    <>
      <Meta title='User Center | Manage Your Crypto Account and Preferences' description='Welcome to your User Center! Manage your crypto account, update personal details, adjust security settings, and customize your trading preferences. Enjoy a seamless experience tailored to your needs, and stay in control of your crypto journey with easy access to all your account information.' />
      <P2pLayout>
        <UserCenterProfile userDetail={props.userDetail} />
        <PaymentMethod masterPayMethod={props.masterPayMethod} userPaymentMethod={props.userPaymentMethod} page="user-center" userPosts={props?.posts} />
      </P2pLayout>
    </>
  )
}

export default UserCenter;

/**
 * Fetches necessary data for the page, including session data, user details, payment methods, and advertisements.
 * If the user is authenticated, it retrieves profile data, available payment methods, and advertisements related to the user.
 * 
 * @param context - The Next.js server-side context, which includes the request and response.
 * @returns The props containing session data, user details, payment methods, and advertisements, or a redirect if not authenticated.
 */
export async function getServerSideProps(context: GetServerSidePropsContext) {
  const { req } = context;

  // Fetch the user session from the server using NextAuth
  const session = await getServerSession(context.req, context.res, authOptions);

  // Fetch authentication providers (e.g., OAuth options)
  const providers = await getProviders()
  if (session) {

    // Fetch the user's profile data for the dashboard
    let profileDashboard = await fetch(`${process.env.NEXT_PUBLIC_BASEURL}/profile/dashboard?userid=${session?.user?.user_id}`, {
      method: "GET",
      headers: {
        "Authorization": session?.user?.access_token
      },
    }).then(response => response.json());

    // Fetch the list of master payment methods available for P2P trading
    let masterPaymentMethod = await fetch(`${process.env.NEXT_PUBLIC_BASEURL}/p2p/masterpayment`, {
      method: "GET",
      headers: {
        "Authorization": session?.user?.access_token
      },
    }).then(response => response.json());

    // Fetch the list of payment methods linked to the user's account
    let userPaymentMethod = await fetch(`${process.env.NEXT_PUBLIC_BASEURL}/p2p/userpaymentmethod`, {
      method: "GET",
      headers: {
        "Authorization": session?.user?.access_token
      },
    }).then(response => response.json());

    // Fetch the list of advertisements created by the user
    let userPosts = await fetch(`${process.env.NEXT_PUBLIC_BASEURL}/p2p/advertisement?status=all&itemOffset=0&itemsPerPage=50&currency=all&pmMethod=all&date=all`, {
      method: "GET",
      headers: {
        "Authorization": session?.user?.access_token
      },
    }).then(response => response.json());

    // Return the data as props, including session data, user details, payment methods, and advertisements
    return {
      props: {
        sessions: session,
        session: session,
        provider: providers,
        userDetail: profileDashboard?.data || null,
        masterPayMethod: masterPaymentMethod?.data || [],
        userPaymentMethod: userPaymentMethod?.data || [],
        posts: userPosts?.data || [],
      },
    };
  }
  return {
    redirect: { destination: "/" },
  };
}