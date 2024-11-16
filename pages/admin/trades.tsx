import List from "@/admin/admin-component/tradeHistory/list";
import DasboardLayout from "@/components/layout/dasboard-layout";
import { GetServerSidePropsContext } from "next";
import React from "react";
import { authOptions } from "../api/auth/[...nextauth]";
import { getServerSession } from "next-auth";
import { getProviders } from "next-auth/react";

interface session {
  marketOrders: any
}

/**
 * Trades Component
 * 
 * This component renders the Trade History page with a list of market orders.
 * It receives marketOrders as props and passes them to the List component.
 * 
 * @param {session} props - Contains market orders data.
 * @returns JSX element that renders the layout and the trade history list.
 */
const Trades = (props: session) => {
  return (
    <DasboardLayout>
      <List marketOrders={props?.marketOrders} />
    </DasboardLayout>
  );
};

/**
 * Fetches data on the server side before rendering the page.
 * This function checks if the user is authenticated and fetches market orders 
 * from the API to display them on the Trades page.
 * 
 * @param {GetServerSidePropsContext} context - The context object containing request and response.
 * @returns {object} - Props to be passed to the Trades component.
 */
export async function getServerSideProps(context: GetServerSidePropsContext) {
  const { req } = context;
  const session = await getServerSession(context.req, context.res, authOptions);
  const providers = await getProviders();

  if (session) {
    // Fetch market orders if user is authenticated
    let marketOrders = await fetch(`${process.env.NEXT_PUBLIC_APIURL}/market/admin/all`, {
      method: "GET",
    }).then(response => response.json());

    // Return fetched data as props for the component
    return {
      props: {
        session: session,
        sessions: session,
        provider: providers,
        marketOrders: marketOrders || [],

      },
    };
  }
  else {
    // Redirect to login page if user is not authenticated
    return {
      redirect: { destination: "/login" },
    };
  }
}

export default Trades;
