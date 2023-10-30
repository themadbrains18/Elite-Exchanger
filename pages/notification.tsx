import NotificationsList from '@/components/notification/notificationsList'
import React, { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react';

import { getProviders } from "next-auth/react"
import { getServerSession } from "next-auth/next"
import { GetServerSidePropsContext, InferGetServerSidePropsType } from 'next'
import { authOptions } from './api/auth/[...nextauth]';

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
    <NotificationsList notificationData={notificationData}/>
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
