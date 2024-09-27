import SideBarLayout from '../../../components/layout/sideBarLayout';
import Dashboard from '../../../components/profile/dashboard';
import React, { useEffect, useState } from 'react';
import { getProviders } from "next-auth/react";
import { getServerSession } from "next-auth/next";
import { GetServerSidePropsContext } from 'next';
import { authOptions } from '../../api/auth/[...nextauth]';
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useWebSocket } from '@/libs/WebSocketContext';

interface Props {
  session: {
    user: any;
  };
  provider: any;
  userDetail: any;
  kycInfo: any;
  referalList: any;
  activity: any;
}

const Profile: React.FC<Props> = ({
  session,
  userDetail,
  kycInfo,
  referalList,
  activity
}) => {
  const [profile, setProfile] = useState(userDetail);
  const wbsocket = useWebSocket();

  useEffect(() => {
    if (wbsocket) {
      const handleMessage = (event: MessageEvent) => {
        const { data, type } = JSON.parse(event.data);
        if (type === "profile" && data?.user_id === session?.user?.user_id) {
          setProfile(data);
        }
      };

      wbsocket.addEventListener('message', handleMessage);
      
      return () => {
        wbsocket.removeEventListener('message', handleMessage);
      };
    }
  }, [wbsocket, session]);

  return (
    <>
      <ToastContainer limit={1} />
      <SideBarLayout 
        userDetail={profile} 
        kycInfo={kycInfo} 
        referalList={referalList} 
        activity={activity}
      >
        <Dashboard fixed={false} session={session} userDetail={userDetail} />
      </SideBarLayout>
    </>
  );
};

export default Profile;

const fetchData = async (url: string, token: string) => {
  const response = await fetch(url, {
    method: "GET",
    headers: {
      "Authorization": token,
    },
  });
  if (!response.ok) {
    throw new Error(`Failed to fetch from ${url}`);
  }
  return response.json();
};

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const { req } = context;
  const session = await getServerSession(req, context.res, authOptions);
  
  if (!session) {
    return { redirect: { destination: "/" } };
  }

  const providers = await getProviders();
  const userId = session.user.user_id;
  const token = session.user.access_token;

  try {
    const [profileDashboard, kycInfo, referalList, activity] = await Promise.all([
      fetchData(`${process.env.NEXT_PUBLIC_BASEURL}/profile/dashboard?userid=${userId}`, token),
      fetchData(`${process.env.NEXT_PUBLIC_BASEURL}/profile/kyc?userid=${userId}`, token),
      fetchData(`${process.env.NEXT_PUBLIC_BASEURL}/referal?userid=${userId}`, token),
      fetchData(`${process.env.NEXT_PUBLIC_BASEURL}/profile/activity?userid=${userId}&itemOffset=0&itemsPerPage=10`, token),
    ]);

    return {
      props: {
        session,
        provider: providers,
        userDetail: profileDashboard.data || null,
        kycInfo: kycInfo.data?.result || [],
        referalList: referalList.data || [],
        activity: activity.data || []
      },
    };
  } catch (error) {
    console.error(error);
    return { notFound: true };
  }
}
