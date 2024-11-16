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

/**
 * Notification page component that renders the sidebar layout with user details 
 * and includes the notification settings section.
 * 
 * @param {propsData} props - The props object containing user session, provider details, and user profile.
 * @returns {JSX.Element} - A layout with notification settings for the authenticated user.
 */
const Notification = (props: propsData) => {
  return (
    <SideBarLayout userDetail={props.userDetail}>
      <NotificationSettings />
    </SideBarLayout>
  )
}

export default Notification

/**
 * Fetches the session, provider details, and user profile data from the server 
 * before rendering the notification settings page.
 * 
 * @param {GetServerSidePropsContext} context - The context object containing request and response.
 * @returns {Promise<Object>} - The props to be passed to the component, including user session and profile data, 
 *                              or a redirect if the session is not found.
 */
export async function getServerSideProps(context: GetServerSidePropsContext) {
  const { req } = context;
  const session = await getServerSession(context.req, context.res, authOptions);
  const providers = await getProviders()

  // If session exists, fetch the user's profile data
  if (session) {

    // Fetch user profile dashboard information
    let profileDashboard = await fetch(`${process.env.NEXT_PUBLIC_BASEURL}/profile/dashboard?userid=${session?.user?.user_id}`, {
      method: "GET",
      headers: {
        "Authorization": session?.user?.access_token
      },
    }).then(response => response.json());

    return {
      props: {
        providers: providers,       // Authentication providers
        session: session,           // Current session data
        sessions: session,          // Duplicate session data (possibly for backward compatibility)
        userDetail: profileDashboard?.data || null // User profile data
      },
    };
  }
  return {
    redirect: { destination: "/" },
  };
}
