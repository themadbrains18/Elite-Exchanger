import SideBarLayout from '@/components/layout/sideBarLayout'
import Activity from '@/components/profile/activity/activity'
import SecuritySettings from '@/components/profile/securitySettings'
import { getServerSession } from 'next-auth'
import { getProviders } from 'next-auth/react'
import React, { useState } from 'react'
import { authOptions } from '../../api/auth/[...nextauth]'
import { GetServerSidePropsContext } from 'next'

interface Session {
  session: {
    user: any
  },
  provider: any,
  userDetail :any,
  activity:any
}

const Security = (props: Session) => {
  return (
    <SideBarLayout userDetail={props.userDetail} activity={props?.activity}>
      <SecuritySettings session={props?.session} activity={props?.activity}/>
    </SideBarLayout>
  )
}

export default Security

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

    let activity = await fetch(`${process.env.NEXT_PUBLIC_BASEURL}/profile/activity?userid=${session?.user?.user_id}`, {
      method: "GET",
      headers: {
        "Authorization": session?.user?.access_token
      },
    }).then(response => response.json());

    console.log(activity,'-------user activity----------');
    

    return {
      props: {
        providers: providers,
        session: session,
        sessions: session,
        userDetail: profileDashboard?.data || null,
        activity:activity?.data || []
      },
    };
  }
  return {
    redirect: { destination: "/" },
  };
}
