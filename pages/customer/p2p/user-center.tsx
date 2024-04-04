import P2pLayout from '@/components/layout/p2p-layout';
import ProfileOverview from '@/components/p2p/user-center/profile-overview';
import UserCenterProfile from '@/components/p2p/user-center/user-center-profile';
import PaymentMethod from '@/components/p2p/postadv/paymentMethod';
import React from 'react'

import { getProviders } from "next-auth/react"
import { getServerSession } from "next-auth/next"
import { GetServerSidePropsContext, InferGetServerSidePropsType } from 'next'
import { authOptions } from '../../api/auth/[...nextauth]';

interface propsData{
  userDetail?:any;
  masterPayMethod?:any;
  userPaymentMethod?:any;
  posts?:any;
}

const UserCenter = (props:propsData) => {

  return (
    <P2pLayout>
       <UserCenterProfile userDetail={props.userDetail}/>
       {/* <ProfileOverview /> */}
       <PaymentMethod masterPayMethod={props.masterPayMethod} userPaymentMethod={props.userPaymentMethod} page="user-center" userPosts={props?.posts}/>
    </P2pLayout>
  )
}

export default UserCenter;

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const { req } = context;
  const session = await getServerSession(context.req, context.res, authOptions);
  const providers = await getProviders()
  if (session) {

    let profileDashboard = await fetch(`${process.env.NEXT_PUBLIC_BASEURL}/profile/dashboard?userid=${session?.user?.user_id}`, {
      method: "GET",
      headers: {
        "Authorization": session?.user?.access_token
      },
    }).then(response => response.json());

    let masterPaymentMethod = await fetch(`${process.env.NEXT_PUBLIC_BASEURL}/p2p/masterpayment`, {
      method: "GET",
      headers: {
        "Authorization": session?.user?.access_token
      },
    }).then(response => response.json());

    let userPaymentMethod = await fetch(`${process.env.NEXT_PUBLIC_BASEURL}/p2p/userpaymentmethod`, {
      method: "GET",
      headers: {
        "Authorization": session?.user?.access_token
      },
    }).then(response => response.json());

    let userPosts = await fetch(`${process.env.NEXT_PUBLIC_BASEURL}/p2p/advertisement`, {
      method: "GET",
      headers: {
        "Authorization": session?.user?.access_token
      },
    }).then(response => response.json());
    
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