import { GetServerSidePropsContext } from 'next';
import DasboardLayout from '../../components/layout/dasboard-layout'
import React from 'react'
import { authOptions } from '../api/auth/[...nextauth]';
import { getServerSession } from 'next-auth';
import { getProviders } from 'next-auth/react';

/**
 * SubAdmin Component
 * 
 * This component renders a simple "SubAdmin" text inside a `DasboardLayout` component.
 * It serves as a placeholder for the actual SubAdmin page content.
 * 
 * @returns JSX element rendering the "SubAdmin" label inside the dashboard layout.
 */
const SubAdmin = () => {
  return (
    <DasboardLayout>
        <div>SubAdmin</div>
    </DasboardLayout>
  )
}

export default SubAdmin;

/**
 * Server-side Logic for SubAdmin Page
 * 
 * This function runs on the server side before the page is rendered. It checks if the user has a valid session
 * and fetches authentication providers. If the session is valid, the page is rendered; otherwise, the user is redirected
 * to the login page.
 * 
 * @param context - The context that contains the request and response for the server-side logic.
 * @returns The page props with session data or a redirect to the login page if no session is found.
 */
export async function getServerSideProps(context: GetServerSidePropsContext) {
  const { req } = context;
  const session = await getServerSession(context.req, context.res, authOptions);
  const providers = await getProviders();

  if (session) {
    return {
      props: {
        session: session,  // Passed session data to the component
        sessions: session, // Additional session information
        provider: providers, // Authentication providers
      },
    };
  }
  else {
    return {
      redirect: { destination: "/login" }, // Redirect to login if no session exists
    };
  }

}