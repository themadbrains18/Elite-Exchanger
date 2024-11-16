import AllKycUsers from '../../admin/admin-component/kyc/all-kyc-users'
import KycHead from '../../admin/admin-component/kyc/kyc-head'
import DasboardLayout from '../../components/layout/dasboard-layout'
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { GetServerSidePropsContext } from "next";
import { getServerSession } from "next-auth";
import { getProviders } from "next-auth/react";
import React from "react";

/**
 * Kyc Component
 * 
 * This component renders the KYC dashboard page, which consists of:
 * - KycHead: A header section for the KYC page.
 * - AllKycUsers: A list or table displaying all KYC users.
 * 
 * It is wrapped inside a `DasboardLayout` component for the admin dashboard structure.
 */
const Kyc = () => {
  return (
    <DasboardLayout>
      <KycHead />
      <AllKycUsers/>
    </DasboardLayout>
  )
}

export default Kyc

/**
 * getServerSideProps Function
 * 
 * This function is executed server-side and is responsible for:
 * - Checking if the user is authenticated by looking for a session.
 * - If authenticated, the session and provider information is passed to the component as props.
 * - If not authenticated, the user is redirected to the login page.
 * 
 * @param context - The context object, which includes the request and response.
 * @returns props containing session and provider information or a redirect to the login page.
 */
export async function getServerSideProps(context: GetServerSidePropsContext) {
  const { req } = context;
  const session = await getServerSession(context.req, context.res, authOptions);
  const providers = await getProviders();
  if (session){
    return {
      props: {
        session: session,
        sessions: session,
        provider: providers,
      },
    }
  }
  else{
    return {
      redirect: { destination: "/login" },
    };
  }
  
}