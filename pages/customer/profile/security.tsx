import SideBarLayout from '@/components/layout/sideBarLayout'
import Activity from '@/components/profile/activity/activity'
import SecuritySettings from '@/components/profile/securitySettings'
import { getServerSession } from 'next-auth'
import { getProviders } from 'next-auth/react'
import React, { useState } from 'react'
import { authOptions } from '../../api/auth/[...nextauth]'
import { GetServerSidePropsContext } from 'next'
import Meta from '@/components/snippets/meta'

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
    <>
    <Meta title='Security Settings | Safeguard Your Crypto Account' description='Enhance the security of your crypto account with our comprehensive security settings. Manage two-factor authentication, update passwords, and review your account activity to ensure your assets are protected. Take control of your security and trade with confidence on our platform!'/>
    <SideBarLayout userDetail={props.userDetail} activity={props?.activity}>
      <SecuritySettings session={props?.session} activity={props?.activity}/>
    </SideBarLayout>
    </>
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

    let activity = await fetch(`${process.env.NEXT_PUBLIC_BASEURL}/profile/activity?userid=${session?.user?.user_id}&itemOffset=0&itemsPerPage=10`, {
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
        userDetail: profileDashboard?.data || null,
        activity:activity?.data || []
      },
    };
  }
  return {
    redirect: { destination: "/" },
  };
}
