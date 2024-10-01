import NotificationsList from '@/components/notification/notificationsList'
import React, { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react';

import { getProviders } from "next-auth/react"
import { getServerSession } from "next-auth/next"
import { GetServerSidePropsContext } from 'next'
import { authOptions } from '../api/auth/[...nextauth]';
import Meta from '@/components/snippets/meta';

const Notification = () => {
  const { status, data: session } = useSession();
  const [notificationData, setNotificationData] = useState([]);

  useEffect(() => {
    if (status === 'authenticated') {
      getUserNotification();
    }
  }, []);

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
    <Meta title='Notifications | Stay Updated on Your Crypto Trades' description='Never miss an update with our Crypto Notification page! Customize your preferences to receive alerts about market trends, price changes, and important account activities. Stay informed and make timely decisions to enhance your trading experience. Join our community and take control of your crypto journey!'/>
    <NotificationsList notificationData={notificationData}/>
    </>
  )
}

export default Notification;


export async function getServerSideProps(context: GetServerSidePropsContext) {
  const { req } = context;
  const session = await getServerSession(context.req, context.res, authOptions);
  const providers = await getProviders()

  

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
