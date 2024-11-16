
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

// Dynamically import FuturePairList component with a custom loading skeleton
const FuturePairList = dynamic(() => import("@/admin/admin-component/future-trade/pairlist"), {
  loading: () => <TableSkeleton/>, // Custom loading component or spinner
});

/**
 * FuturePair component
 * 
 * This component renders the `FuturePairList` component within a dashboard layout.
 * It passes the `coinList` prop which is fetched from the server-side.
 */
const FuturePair = (props: Session) => {

  return (
    <DasboardLayout>
      <FuturePairList list={props?.coinList} />
    </DasboardLayout>
  );
};

/**
 * getServerSideProps function
 * 
 * This function runs server-side before the page is rendered.
 * It fetches the coin list (token list) and checks the user session.
 * If the user is authenticated, it returns the session data and the coin list.
 * If not authenticated, it redirects to the login page.
 * 
 * @param context - The context object that contains request and response.
 * @returns props with session and coinList if authenticated, or a redirect to the login page.
 */
export async function getServerSideProps(context: GetServerSidePropsContext) {
  const { req } = context;

  // Get session and providers data using NextAuth
  const session = await getServerSession(context.req, context.res, authOptions);
  const providers = await getProviders();

   // Fetch the token list (coinList) from an API endpoint
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
    // Redirect to the login page if the user is not authenticated
    return {
      redirect: { destination: "/login" },
    };
  }

}

export default FuturePair;
