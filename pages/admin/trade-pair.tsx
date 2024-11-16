import PairList from "@/admin/admin-component/trade-pair/pairList";
import DasboardLayout from "@/components/layout/dasboard-layout";
import { GetServerSidePropsContext } from "next";
import React, { useState } from "react";
import { authOptions } from "../api/auth/[...nextauth]";
import { getServerSession } from "next-auth";
import { getProviders } from "next-auth/react";

interface Session {
  coinList?: any;
}

/**
 * TradePair Component
 * 
 * The main page that renders the list of trade pairs (tokens) using the PairList component.
 * 
 * @param props - Contains the coin list to be passed to the PairList component.
 * @returns JSX element that renders the layout and the PairList component.
 */
const TradePair = (props: Session) => {
  return (
    <DasboardLayout>
      <PairList list={props?.coinList} />
    </DasboardLayout>
  );
};

/**
 * Fetch required data on the server side before rendering the page.
 * 
 * @param context - The context containing request and response information.
 * @returns Props to be passed to the TradePair component.
 */
export async function getServerSideProps(context: GetServerSidePropsContext) {
  const { req } = context;
  const session = await getServerSession(context.req, context.res, authOptions);
  const providers = await getProviders();

  if (session) {
    // Fetch token list from API endpoint
    let tokenList = await fetch(
      `${process.env.NEXT_PUBLIC_BASEURL}/token/admin`,
      {
        method: "GET",
      }
    ).then((response) => response.json());

    // Return the session data and token list to be passed as props
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

export default TradePair;
