import AllKycUsers from '../../admin/admin-component/kyc/all-kyc-users'
import KycHead from '../../admin/admin-component/kyc/kyc-head'
import DasboardLayout from '../../components/layout/dasboard-layout'
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { GetServerSidePropsContext } from "next";
import { getServerSession } from "next-auth";
import { getProviders } from "next-auth/react";
import React from "react";

interface Session {
  kycs:any
}

const Kyc = (props:Session) => {
  return (
    <DasboardLayout>
      <KycHead />
      <AllKycUsers kycs={props?.kycs}/>
    </DasboardLayout>
  )
}

export default Kyc

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const { req } = context;
  const session = await getServerSession(context.req, context.res, authOptions);
  const providers = await getProviders();

   let kyc = await fetch(`${process.env.NEXT_PUBLIC_APIURL}/kyc/all/All`, {
      method: "GET",
    
    }).then(response => response.json());

    // console.log(kyc,"==all kyc");
    

  return {
    props: {
      session: session,
      sessions: session,
      provider: providers,
      kycs : kyc
    },
  }
}