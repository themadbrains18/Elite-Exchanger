import UserDetails from "@/admin/admin-component/users/userDetails";
import DasboardLayout from "@/components/layout/dasboard-layout";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { GetServerSidePropsContext } from "next";
import { getServerSession } from "next-auth";
import { getProviders } from "next-auth/react";
import React from "react";

/**
 * Details component
 * 
 * This component serves as the page for displaying user details
 * within a dashboard layout. It renders the UserDetails component,
 * passing the session data as props.
 */
interface Session {
  session: any,

}

/**
 * Main component rendering the dashboard layout with user details.
 * It receives session data as props and passes it down to the UserDetails component.
 * 
 * @param props - Contains session information passed from getServerSideProps.
 */
const Details = (props: Session) => {
  return (
    <DasboardLayout>
      <UserDetails session={props?.session} />
    </DasboardLayout>
  );
};

export default Details;

/**
 * getServerSideProps function
 * 
 * This function is called on the server before rendering the page. It fetches the
 * session details of the user and checks if the user is authenticated.
 * If authenticated, it returns the session data as props, otherwise redirects to the login page.
 * 
 * @param context - The context object containing information about the request and response.
 * @returns props with session data if authenticated, or a redirect object to the login page if not.
 */
export async function getServerSideProps(context: GetServerSidePropsContext) {
  const { req } = context;
  const session = await getServerSession(context.req, context.res, authOptions);
  const providers = await getProviders();

  // Check if the user is authenticated (has session)
  if (session) {
    return {
      props: {
        session: session, // Passing session details to the component
        sessions: session, // Duplicating session for other usage if necessary
        provider: providers, // Passing authentication providers
      },
    };
  }
  else {
    // Redirect to login page if session is not found (user not authenticated)
    return {
      redirect: { destination: "/login" },
    };
  }
}
