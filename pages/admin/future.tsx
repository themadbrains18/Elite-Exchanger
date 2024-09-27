
import DasboardLayout from "@/components/layout/dasboard-layout";
import { GetServerSidePropsContext } from "next";
import React, { useState } from "react";
import { authOptions } from "../api/auth/[...nextauth]";
import { getServerSession } from "next-auth";
import { getProviders } from "next-auth/react";
import dynamic from "next/dynamic";
import TableSkeleton from "@/components/skeletons/tableSkeleton";
// import FuturePairList from "@/admin/admin-component/future-trade/pairlist";

interface Session {
  coinList?: any;
}
const FuturePairList = dynamic(() => import("@/admin/admin-component/future-trade/pairlist"), {
  loading: () => <TableSkeleton/>, // Custom loading component or spinner
});


const FuturePair = (props: Session) => {

  return (
    <DasboardLayout>
      <FuturePairList list={props?.coinList} />
    </DasboardLayout>
  );
};

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const { req } = context;
  const session = await getServerSession(context.req, context.res, authOptions);
  const providers = await getProviders();

  let tokenList = await fetch(
    `${process.env.NEXT_PUBLIC_BASEURL}/token/admin`,
    {
      method: "GET",
    }
  ).then((response) => response.json());

  if (session) {
    return {
      props: {
        session: session,
        sessions: session,
        provider: providers,
        coinList: tokenList?.data || [],
      },
    };
  }
  else {
    return {
      redirect: { destination: "/login" },
    };
  }

}

export default FuturePair;
