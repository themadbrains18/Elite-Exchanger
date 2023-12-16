import SideBarLayout from '@/components/layout/sideBarLayout'
import NotificationSettings from '@/components/profile/notificationSettings'
import React from 'react'

import { getServerSession } from 'next-auth'
import { getProviders } from 'next-auth/react'
import { authOptions } from '../../api/auth/[...nextauth]'
import { GetServerSidePropsContext } from 'next'


interface propsData {
  session: {
    user: any
  },
  provider: any,
  userDetail : any,
}

const Notification = (props: propsData) => {
  return (
    <SideBarLayout userDetail={props.userDetail}>
      <NotificationSettings />
    </SideBarLayout>
  )
}

export default Notification


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

    return {
      props: {
        providers: providers,
        session: session,
        sessions: session,
        userDetail: profileDashboard?.data || null
      },
    };
  }
  return {
    redirect: { destination: "/" },
  };
}
