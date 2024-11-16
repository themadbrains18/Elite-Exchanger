import Banner from "@/components/events/banner";
import Participate from "@/components/events/participate";
import Terms from "@/components/events/terms";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { getServerSession } from "next-auth/next"
import { GetServerSidePropsContext } from 'next'
import { authOptions } from '../../api/auth/[...nextauth]';
import Meta from "@/components/snippets/meta";

const Events = () => {
  const router = useRouter();
  let { event } = router.query;
  const [eventData, setEventData] = useState();

  /**
 * useEffect Hook
 * - Calls `getEventDetail` function once on component mount to fetch event details.
 * - No dependencies, so it only runs once on initial render.
 *
 * Dependencies: []
 */
  useEffect(() => {
    getEventDetail();
  }, []);

  /**
   * Fetches event details based on the `event` name and updates state.
   * - Makes a GET request to the API endpoint with the event name as a query parameter.
   * - Sets the response data to `eventData` state.
   *
   * @async
   * @function getEventDetail
   * @returns {Promise<void>} Resolves with no return value; updates state.
   *
   * Error Handling:
   * - Catches and silently handles any errors during the fetch operation.
   */
  const getEventDetail = async () => {
    try {
      let eventData = await fetch(`${process.env.NEXT_PUBLIC_BASEURL}/referal/customer/event?name=${event}`, {
        method: "GET"
      }).then(response => response.json());

      setEventData(eventData?.data);
    } catch (error) {
    }
  };

  return (
    <>
      <Meta title="Event Details | Upcoming Crypto Events and Webinars" description="Discover everything you need to know about our upcoming crypto events and webinars! Explore event details, including date, time, location, speakers, and topics covered. Join our community to gain insights, network with experts, and stay updated on the latest trends in the crypto world. Don’t miss out—register today!" />
      <Banner eventData={eventData} />
      <Participate eventData={eventData} />
      <Terms />
    </>
  );
};

export default Events;

/**
 * Server-side function to fetch and provide necessary data to the page component.
 * 
 * This function fetches the following:
 * - User session data using `getServerSession` to check if the user is authenticated.
 * 
 * The returned props are passed to the page component, which includes:
 * - `session`: The authenticated user session object.
 * - `sessions`: Duplicate of `session` for potential use in the page component.
 * 
 * @async
 * @function getServerSideProps
 * @param {GetServerSidePropsContext} context - The context object provided by Next.js containing request (`req`) and response (`res`).
 * @returns {Promise<object>} The props object to be passed to the page component.
 */
export async function getServerSideProps(context: GetServerSidePropsContext) {
  const { req } = context;
  const session = await getServerSession(context.req, context.res, authOptions);
  return {
    props: {
      sessions: session,
      session: session
    },
  };

}