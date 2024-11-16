import { GetServerSidePropsContext } from 'next'
import WalletTable from '@/admin/admin-component/wallet/walletTable';
import DasboardLayout from '../../components/layout/dasboard-layout'
import React from 'react'
import { authOptions } from '../api/auth/[...nextauth]'
import { getServerSession } from 'next-auth'
import { getProviders } from 'next-auth/react'


interface Session {
  session: any,
}

/**
 * Wallet Component
 * 
 * This component renders the Wallet page with a table displaying wallet details.
 * It passes the session data to the WalletTable component.
 * 
 * @param {Session} props - Contains the session data to pass to the WalletTable component.
 * @returns JSX element that renders the layout and the wallet table.
 */
const Wallet = (props: Session) => {
  return (
    <DasboardLayout>
      <WalletTable session={props?.session} />
    </DasboardLayout>
  )
}

export default Wallet;

/**
 * Fetches the server-side props for the Wallet page.
 * It checks if the user is authenticated, and if so, it passes the session and provider information to the component.
 * If the user is not authenticated, it redirects them to the login page.
 * 
 * @param {GetServerSidePropsContext} context - The context object containing the request and response.
 * @returns {object} - Props to be passed to the Wallet component, or a redirect if the user is not authenticated.
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