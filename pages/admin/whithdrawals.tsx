import { getProviders } from "next-auth/react";
import WithdrawTable from "@/admin/admin-component/withdraw/withdrawTable";
import DasboardLayout from "../../components/layout/dasboard-layout";
import React from "react";
import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]";
import { GetServerSidePropsContext } from "next";


/**
 * Withdrawals Page Component
 * 
 * This component renders the Withdrawals page with a table displaying withdrawal data.
 * The WithdrawTable component is used to display the data on the page.
 * 
 * @returns {JSX.Element} The layout of the page with the WithdrawTable.
 */
const Whithdrawals = () => {
  return (
    <DasboardLayout>
      <WithdrawTable />
    </DasboardLayout>
  );
};

export default Whithdrawals;

/**
 * Fetches server-side props for the Withdrawals page.
 * It checks if the user is authenticated, and if so, passes the session and provider information to the component.
 * If the user is not authenticated, it redirects to the login page.
 * 
 * @param {GetServerSidePropsContext} context - The context object containing the request and response.
 * @returns {object} - Props to be passed to the Withdrawals component or a redirect if the user is not authenticated.
 */
export async function getServerSideProps(context: GetServerSidePropsContext) {
  const { req } = context;
  const session = await getServerSession(context.req, context.res, authOptions);
  const providers = await getProviders();
  // Return props containing session data and providers if the user is authenticated
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
    // Redirect to login page if the user is not authenticated
    return {
      redirect: { destination: "/login" },
    };
  }

}