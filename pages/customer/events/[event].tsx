import Banner from "@/components/events/banner";
import Participate from "@/components/events/participate";
import Terms from "@/components/events/terms";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

import { getProviders } from "next-auth/react"
import { getServerSession } from "next-auth/next"
import { GetServerSidePropsContext } from 'next'
import { authOptions } from '../../api/auth/[...nextauth]';
import Meta from "@/components/snippets/meta";

const Events = () => {

  const router = useRouter();
  let { event } = router.query;

  const [eventData, setEventData] = useState();

  useEffect(() => {
    getEventDetail();
  }, []);

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
    <Meta title="Event Details | Upcoming Crypto Events and Webinars" description="Discover everything you need to know about our upcoming crypto events and webinars! Explore event details, including date, time, location, speakers, and topics covered. Join our community to gain insights, network with experts, and stay updated on the latest trends in the crypto world. Don’t miss out—register today!"/>
      <Banner eventData={eventData} />
      <Participate eventData={eventData} />
      <Terms />
    </>
  );
};

export default Events;

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