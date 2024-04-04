import { getProviders } from "next-auth/react";
import WithdrawTable from "@/admin/admin-component/withdraw/withdrawTable";
import DasboardLayout from "../../components/layout/dasboard-layout";
import React from "react";
import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]";
import { GetServerSidePropsContext } from "next";



const Whithdrawals = () => {
  return (
    <DasboardLayout>
      <WithdrawTable />
    </DasboardLayout>
  );
};

export default Whithdrawals;

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const { req } = context;
  const session = await getServerSession(context.req, context.res, authOptions);
  const providers = await getProviders();

  if (session) {
    return {
      props: {
        session: session,
        sessions: session,
        provider: providers,

      },
    };
  }
  else {
    return {
      redirect: { destination: "/login" },
    };
  }

}