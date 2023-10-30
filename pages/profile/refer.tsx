import SideBarLayout from '@/components/layout/sideBarLayout'
import Referal from '@/components/profile/referal'
import React from 'react'
import { getProviders } from "next-auth/react"
import { getServerSession } from "next-auth/next"
import { GetServerSidePropsContext, InferGetServerSidePropsType } from 'next'
import { authOptions } from '../api/auth/[...nextauth]';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface propsData {
  session: {
    user: any
  },
  referalList : any,
  userDetail :any
}

const Refer = (props: propsData) => {
  return (
    <SideBarLayout userDetail={props.userDetail} referalList={props.referalList}>
      <ToastContainer />
      <Referal session={props.session} referalList={props.referalList}/>
    </SideBarLayout>
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
    
    return {
      props: {
        sessions: session,
        session: session,
        referalList : referalList?.data || [],
        userDetail: profileDashboard?.data || null
      },
    };
  }
  return {
    redirect: { destination: "/" },
  };
}