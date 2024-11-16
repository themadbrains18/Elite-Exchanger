import NotificationsList from '@/components/notification/notificationsList'
import React, { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react';

import { getProviders } from "next-auth/react"
import { getServerSession } from "next-auth/next"
import { GetServerSidePropsContext } from 'next'
import { authOptions } from '../api/auth/[...nextauth]';
import Meta from '@/components/snippets/meta';

/**
 * Notification Page Component.
 * This component renders the notifications page, fetching and displaying user notifications.
 * It uses session data from NextAuth for authentication and loads notification data when the user is authenticated.
 * 
 * @returns {JSX.Element} The rendered notifications page with a list of notifications.
 */
const Notification = () => {
  const { status, data: session } = useSession();
  const [notificationData, setNotificationData] = useState([]);

  /**
   * Fetches user notifications when the user is authenticated.
   * This is called inside a `useEffect` hook once the component is mounted.
   */
  useEffect(() => {
    if (status === 'authenticated') {
      getUserNotification();
    }
  }, []);

  /**
   * Makes an API call to fetch notifications for the authenticated user.
   * Updates the state with the fetched notification data.
   */
  const getUserNotification = async () => {
    let profileDashboard = await fetch(`${process.env.NEXT_PUBLIC_BASEURL}/notification?userid=${session?.user?.user_id}`, {
      method: "GET",
      headers: {
        "Authorization": session?.user?.access_token
      },
    }).then(response => response.json());

    if (profileDashboard) {
      setNotificationData(profileDashboard?.data)
    }
  }
  return (
    <>
      <Meta title='Notifications | Stay Updated on Your Crypto Trades' description='Never miss an update with our Crypto Notification page! Customize your preferences to receive alerts about market trends, price changes, and important account activities. Stay informed and make timely decisions to enhance your trading experience. Join our community and take control of your crypto journey!' />
      <NotificationsList notificationData={notificationData} />
    </>
  )
}

export default Notification;

/**
 * Server-side function to fetch session data and handle redirection based on the session status.
 * If the user is authenticated, it returns session and provider information as props.
 * If the user is not authenticated, it redirects them to the home page.
 * 
 * @param {GetServerSidePropsContext} context - The context for the server-side props fetching.
 * @returns {Promise<{props: object} | {redirect: object}>} The server-side props or redirection data.
 */
export async function getServerSideProps(context: GetServerSidePropsContext) {
  const { req } = context;
  const session = await getServerSession(context.req, context.res, authOptions);
  const providers = await getProviders()

  // If the user is authenticated, provide session and provider data as props
  if (session) {
    return {
      props: {
        providers: providers,
        session: session,
        sessions: session,
      },
    };
  }
  return {
    redirect: { destination: "/" },
  };
}
