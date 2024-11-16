import SideBarLayout from '@/components/layout/sideBarLayout'
import KycAuth from '@/components/profile/kycAuth'
import { getServerSession } from 'next-auth'
import { getProviders } from 'next-auth/react'
import React from 'react'
import { authOptions } from '../../api/auth/[...nextauth]'
import { GetServerSidePropsContext } from 'next'
import KycPending from '@/components/profile/kyc-pending'
import KycDone from '@/components/profile/kyc-done'
import Meta from '@/components/snippets/meta'

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
    <>
      <Meta title='Crypto Planet | KYC Verification' description='Complete your KYC verification to enhance the security of your crypto account and comply with regulations. Our streamlined process ensures your identity is verified quickly and safely. Join our platform with confidence and enjoy a secure trading experience while safeguarding your investments.' />
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
    </>
  )
}

export default Kyc;

/**
 * Fetches server-side data before rendering the profile page. This includes checking the session, 
 * fetching user-specific data (KYC info and profile dashboard), and passing this data as props to the page.
 * 
 * @param {GetServerSidePropsContext} context - The context object containing the request and response, 
 *                                             which is passed by Next.js for server-side data fetching.
 * @returns {Promise<Object>} - The props to be passed to the component. If no session exists, it redirects to the home page.
 */
export async function getServerSideProps(context: GetServerSidePropsContext) {
  const { req } = context;

  // Get session information from the server
  const session = await getServerSession(context.req, context.res, authOptions);
  const providers = await getProviders()

  // If a session exists, fetch additional user data
  if (session) {

    // Fetch KYC information for the user
    let kycInfo = await fetch(`${process.env.NEXT_PUBLIC_BASEURL}/profile/kyc?userid=${session?.user?.user_id}`, {
      method: "GET",
      headers: {
        "Authorization": session?.user?.access_token
      },
    }).then(response => response.json());

    // Fetch user profile dashboard information
    let profileDashboard = await fetch(`${process.env.NEXT_PUBLIC_BASEURL}/profile/dashboard?userid=${session?.user?.user_id}`, {
      method: "GET",
      headers: {
        "Authorization": session?.user?.access_token
      },
    }).then(response => response.json());

    // Return the fetched data as props
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
