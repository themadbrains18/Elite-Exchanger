import { getProviders } from "next-auth/react";
import WithdrawTable from "../../admin/admin-component/withdraw/withdrawTable";
import DasboardLayout from "../../components/layout/dasboard-layout";
import React from "react";
import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]";
import { GetServerSidePropsContext } from "next";

interface Session {
  withdraw:any
}

const Whithdrawals = (props:Session) => {
  return (
    <DasboardLayout>
      <WithdrawTable withdraw={props?.withdraw}/>
    </DasboardLayout>
  );
};

export default Whithdrawals;

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const { req } = context;
  const session = await getServerSession(context.req, context.res, authOptions);
  const providers = await getProviders();

   let withdraw = await fetch(`${process.env.NEXT_PUBLIC_APIURL}/withdraw/admin/withdrawList`, {
      method: "GET",
    
    }).then(response => response.json());

    // console.log(withdraw);
    

  return {
    props: {
      session: session,
      sessions: session,
      provider: providers,
      withdraw : withdraw
    },
  };
  // if (session) {

  // }
  // return {
  //   redirect: { destination: "/" },
  // };
}