import SideBarLayout from '@/components/layout/sideBarLayout'
import KycAuth from '@/components/profile/kycAuth'
import { getServerSession } from 'next-auth'
import { getProviders } from 'next-auth/react'
import React, { useEffect } from 'react'
import { authOptions } from '../../api/auth/[...nextauth]'
import { GetServerSidePropsContext } from 'next'
import KycPending from '@/components/profile/kyc-pending'
import KycDone from '@/components/profile/kyc-done'



interface Session {
  session: {
    user: any
  },
  provider: any,
  kycInfo: any,
  userDetail: any
}

const Kyc = (props: Session) => {

  return (
    <SideBarLayout userDetail={props.userDetail} kycInfo={props.kycInfo} >
      {
        ((props?.kycInfo?.isReject === 1) || Object.keys(props?.kycInfo)?.length === 0) &&
        <KycAuth fixed={false} num={1} session={props.session} />
      }

      {
        (props.kycInfo.isVerified == 0 && props.kycInfo.isReject == 0) &&
        <KycPending />
      }
      {
        props.kycInfo.isVerified == true &&
        <KycDone />
      }
    </SideBarLayout>
  )
}

export default Kyc;

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const { req } = context;
  const session = await getServerSession(context.req, context.res, authOptions);
  const providers = await getProviders()

  if (session) {

    let kycInfo = await fetch(`${process.env.NEXT_PUBLIC_BASEURL}/profile/kyc?userid=${session?.user?.user_id}`, {
      method: "GET",
      headers: {
        "Authorization": session?.user?.access_token
      },
    }).then(response => response.json());


    let profileDashboard = await fetch(`${process.env.NEXT_PUBLIC_BASEURL}/profile/dashboard?userid=${session?.user?.user_id}`, {
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
        kycInfo: kycInfo?.data?.result || [],
        userDetail: profileDashboard?.data || null
      },
    };
  }
  return {
    redirect: { destination: "/" },
  };
}
