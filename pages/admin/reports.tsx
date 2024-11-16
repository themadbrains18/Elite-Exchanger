import { GetServerSidePropsContext } from 'next'
import ReportTable from '../../admin/admin-component/reports/reportTable'
import DasboardLayout from '../../components/layout/dasboard-layout'
import React from 'react'
import { getServerSession } from 'next-auth'
import { getProviders } from 'next-auth/react'
import { authOptions } from '../api/auth/[...nextauth]'

/**
 * Reports Component
 * 
 * This component renders the `DasboardLayout` and includes the `ReportTable` component.
 * The `ReportTable` component is responsible for displaying the reports UI within the dashboard layout.
 * 
 * @returns JSX element rendering the report table inside the dashboard layout.
 */
const Reports = () => {
  return (
    <DasboardLayout>
        <ReportTable />
    </DasboardLayout>
  )
}

export default Reports;

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
      redirect: { destination: "/login" },  // Redirect to login if no session
    };
  }

}