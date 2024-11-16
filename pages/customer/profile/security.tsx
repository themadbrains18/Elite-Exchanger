import SideBarLayout from '@/components/layout/sideBarLayout'
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

/**
 * Component for displaying the security settings page.
 * This component allows users to manage their security settings, including two-factor authentication
 * and reviewing account activity.
 * 
 * @param {Object} props - The props passed to the component.
 * @param {Object} props.session - The current user session.
 * @param {Object} props.provider - The authentication provider details.
 * @param {Object} props.userDetail - The user's profile information.
 * @param {Array} props.activity - A list of the user's recent account activities.
 * @returns JSX.Element - The rendered security settings page component.
 */
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

/**
 * Fetches necessary data for the Security page during SSR (Server-Side Rendering).
 * It checks if the user is authenticated, then fetches data related to the user's profile,
 * account activity, and authentication providers.
 * 
 * @param {GetServerSidePropsContext} context - The context object containing the request and response.
 * @returns {Promise<Object>} - The result object containing the fetched data and props.
 */
export async function getServerSideProps(context: GetServerSidePropsContext) {
  const { req } = context;
  // Get session data from NextAuth
  const session = await getServerSession(context.req, context.res, authOptions);
  // Get authentication providers (e.g., Google, GitHub, etc.)
  const providers = await getProviders()

  if (session) {
    
    // Fetch user profile dashboard data
    let profileDashboard = await fetch(`${process.env.NEXT_PUBLIC_BASEURL}/profile/dashboard?userid=${session?.user?.user_id}`, {
      method: "GET",
      headers: {
        "Authorization": session?.user?.access_token
      },
    }).then(response => response.json());

    // Fetch user account activity data
    let activity = await fetch(`${process.env.NEXT_PUBLIC_BASEURL}/profile/activity?userid=${session?.user?.user_id}&itemOffset=0&itemsPerPage=10`, {
      method: "GET",
      headers: {
        "Authorization": session?.user?.access_token
      },
    }).then(response => response.json());

    // Return the fetched data as props to the page
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
