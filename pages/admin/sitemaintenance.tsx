
import DasboardLayout from "@/components/layout/dasboard-layout";
import { GetServerSidePropsContext } from "next";
import React, { useState } from "react";
import { authOptions } from "../api/auth/[...nextauth]";
import { getServerSession } from "next-auth";
import { getProviders } from "next-auth/react";
import MaintenanceList from "@/admin/admin-component/sitemaintenance/list";

interface Session {
  list?: any;
}

/**
 * SiteMaintenance Component
 * 
 * This component renders the `DasboardLayout` and includes the `MaintenanceList` component.
 * The `MaintenanceList` component is responsible for displaying a list of site maintenance activities.
 * 
 * @param props - The props passed to the component, including a list of maintenance activities.
 * @returns JSX element rendering the site maintenance list inside the dashboard layout.
 */
const SiteMaintenance = (props: Session) => {

  return (
    <DasboardLayout>
      <MaintenanceList list={props?.list} />
    </DasboardLayout>
  );
};

/**
 * Server-side Logic to Fetch Maintenance List
 * 
 * This function runs on the server before the page is rendered. It checks if there is an active session
 * and fetches the list of site maintenance activities. If the session exists, it returns the list of maintenance activities as props.
 * If there is no session, it redirects the user to the login page.
 * 
 * @param context - The context containing request and response for the server-side logic.
 * @returns props with the list of maintenance activities or a redirect to login if no session.
 */
export async function getServerSideProps(context: GetServerSidePropsContext) {
  const { req } = context;
  const session = await getServerSession(context.req, context.res, authOptions);
  const providers = await getProviders();

  if (session) {
    // Fetch the maintenance activities list
    let list = await fetch(
      `${process.env.NEXT_PUBLIC_BASEURL}/sitemaintenance`,
      {
        method: "GET",
        headers: {
          "Authorization": session?.user?.access_token || ''
        }
      }
    ).then((response) => response.json());

    return {
      props: {
        session: session, // Session data passed as props
        sessions: session, // Additional session information
        provider: providers, // Authentication providers
        list: list?.data || [], // Site maintenance activities list
      },
    };
  }
  else {
    return {
      redirect: { destination: "/login" }, // Redirect to login if no session
    };
  }
}

export default SiteMaintenance;
