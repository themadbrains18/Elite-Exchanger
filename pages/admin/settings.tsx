// import AdminSettings from '@/admin/admin-component/settings/adminSettings'
import DasboardLayout from '@/components/layout/dasboard-layout'
import { GetServerSidePropsContext } from 'next'
import React from 'react'
import { authOptions } from '../api/auth/[...nextauth]'
import { getServerSession } from 'next-auth'
import { getProviders } from 'next-auth/react'
import dynamic from 'next/dynamic'
import SecuritySkeleton from '@/components/skeletons/securitySkeleton'

/**
 * Settings Component
 * 
 * This component renders the `DasboardLayout` and includes the dynamically imported `AdminSettings` component.
 * The `AdminSettings` component is responsible for rendering the settings page for the admin user.
 * 
 * @returns JSX element rendering the admin settings inside the dashboard layout.
 */
const AdminSettings = dynamic(() => import('@/admin/admin-component/settings/adminSettings'), {
  loading: () => <SecuritySkeleton/>, // Custom loading component or spinner

});


const Settings = () => {
  return (
    <DasboardLayout>
      <AdminSettings />
    </DasboardLayout>
  )
}

export default Settings;

/**
 * Server-side Logic to Fetch Session and Providers
 * 
 * This function runs on the server before the page is rendered. It checks if there is an active session
 * and fetches the authentication providers. If the session exists, it returns the session data as props.
 * If there is no session, it redirects the user to the login page.
 * 
 * @param context - The context containing request and response for the server-side logic.
 * @returns props with session data or redirect to login if no session.
 */
export async function getServerSideProps(context: GetServerSidePropsContext) {
  const { req } = context;
  const session = await getServerSession(context.req, context.res, authOptions);
  const providers = await getProviders();

  if (session) {
    return {
      props: {
        session: session, // Session data passed as props
        sessions: session, // Additional session information
        provider: providers, // Authentication providers
      },
    };
  }
  else {
    return {
      redirect: { destination: "/login" }, // Redirect to login if no session
    };
  }

}