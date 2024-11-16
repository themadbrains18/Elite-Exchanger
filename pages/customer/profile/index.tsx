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
import Meta from '@/components/snippets/meta';

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

/**
 * Profile component that displays the user's profile information, 
 * including their dashboard, KYC status, referral list, and activity.
 * It also listens for WebSocket messages to update the profile data.
 */
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
    <Meta title='Crypto Planet User Dashboard' description='Access and manage your crypto profile with ease. Update your personal information, security settings, and trading preferences to enhance your experience on our platform. Stay in control of your investments and personalize your crypto journey today!'/>
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

/**
 * Helper function to fetch data from a given URL with authorization headers.
 * 
 * @param {string} url - The URL to fetch data from.
 * @param {string} token - The authorization token to include in the request headers.
 * @returns {Promise<any>} - The response data in JSON format.
 * @throws {Error} - If the response status is not ok.
 */
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

/**
 * Server-side function to fetch user-specific data before rendering the profile page.
 * It retrieves session data, providers, and fetches various data like profile, KYC, referrals, and activity.
 * 
 * @param {GetServerSidePropsContext} context - The context object containing the request and response.
 * @returns {Promise<any>} - The props to pass to the component, including user session and data.
 * @throws {Error} - If the data fetching fails or session is invalid.
 */
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
