import SideBarLayout from '../../../components/layout/sideBarLayout'
import Dashboard from '../../../components/profile/dashboard'
import React, { useEffect, useState } from 'react'
import { getProviders } from "next-auth/react"
import { getServerSession } from "next-auth/next"
import { GetServerSidePropsContext, InferGetServerSidePropsType } from 'next'
import { authOptions } from '../../api/auth/[...nextauth]';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface propsData {
  session: {
    user: any
  },
  provider: any,
  userDetail: any,
  kycInfo: any,
  referalList: any,
  activity:any,
}

const Profile = (props: propsData) => {

  const [userProfile, setUserProfile] = useState(props.userDetail);

  useEffect(() => {
    const websocket = new WebSocket(`${process.env.NEXT_PUBLIC_WS_URL}`);

    websocket.onopen = () => {
      console.log("connected");
    };

    websocket.onmessage = (event) => {
      const data = JSON.parse(event.data).data;
      let eventDataType = JSON.parse(event.data).type;

      if (eventDataType === "profile") {
        if (data?.user_id === props?.session?.user?.user_id) {
          setUserProfile(data);
        }
      }
    };

  }, []);

  return (
    <>
      <ToastContainer />
      <SideBarLayout userDetail={userProfile} kycInfo={props.kycInfo} referalList={props.referalList} activity={props?.activity}>
        <Dashboard fixed={false} session={props.session} userDetail={props.userDetail} />
        
      </SideBarLayout>
      
    </>
  )
}

export default Profile;

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const { req } = context;
  const session = await getServerSession(context.req, context.res, authOptions);
  const providers = await getProviders()

  console.log(session,'--------------session profile page');
  
  if (session) {

    let profileDashboard = await fetch(`${process.env.NEXT_PUBLIC_BASEURL}/profile/dashboard?userid=${session?.user?.user_id}`, {
      method: "GET",
      headers: {
        "Authorization": session?.user?.access_token
      },
    }).then(response => response.json());

    let kycInfo = await fetch(`${process.env.NEXT_PUBLIC_BASEURL}/profile/kyc?userid=${session?.user?.user_id}`, {
      method: "GET",
      headers: {
        "Authorization": session?.user?.access_token
      },
    }).then(response => response.json());

    let referalList = await fetch(`${process.env.NEXT_PUBLIC_BASEURL}/referal?userid=${session?.user?.user_id}`, {
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


    return {
      props: {
        sessions: session,
        session: session,
        provider: providers,
        userDetail: profileDashboard?.data || null,
        kycInfo: kycInfo?.data?.result || [],
        referalList: referalList?.data || [],
        activity:activity?.data || []
      },
    };
  }
  return {
    redirect: { destination: "/" },
  };
}
