import PaymentList from '@/admin/admin-component/payment/paymentList'
import DasboardLayout from '../../components/layout/dasboard-layout'
import React from 'react'
import { GetServerSidePropsContext } from 'next'
import { authOptions } from '../api/auth/[...nextauth]'
import { getServerSession } from 'next-auth'
import { getProviders } from 'next-auth/react'

/**
 * Payment Component
 * 
 * This component renders the dashboard layout for the payments section and includes the 
 * `PaymentList` component to display the list of payments.
 */
const Payment = () => {
  return (
    <DasboardLayout>
        <PaymentList />
    </DasboardLayout>
  )
}

export default Payment;

/**
 * getServerSideProps Function
 * 
 * This function is executed server-side to check if the user has a valid session.
 * - If the session exists, it returns the session and providers as props.
 * - If there is no session, the user is redirected to the login page.
 * 
 * @param context - The context object that provides access to the request and response.
 * @returns props containing session and providers, or a redirect if no session is found.
 */
export async function getServerSideProps(context: GetServerSidePropsContext) {
  const { req } = context;
  const session = await getServerSession(context.req, context.res, authOptions);
  const providers = await getProviders();

  if (session) {
    return {
      props: {
        session: session, // Passing session to the page
        sessions: session, // Additional session props (if needed)
        provider: providers, // Authentication providers
      },
    };
  }
  else {
    return {
      redirect: { destination: "/login" }, // Redirect to login if no session is found
    };
  }

}