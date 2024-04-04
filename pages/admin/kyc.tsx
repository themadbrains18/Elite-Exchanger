import AllKycUsers from '../../admin/admin-component/kyc/all-kyc-users'
import KycHead from '../../admin/admin-component/kyc/kyc-head'
import DasboardLayout from '../../components/layout/dasboard-layout'
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { GetServerSidePropsContext } from "next";
import { getServerSession } from "next-auth";
import { getProviders } from "next-auth/react";
import React from "react";


const Kyc = () => {
  return (
    <DasboardLayout>
      <KycHead />
      <AllKycUsers/>
    </DasboardLayout>
  )
}

export default Kyc

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