import Banner from "@/components/events/banner";
import Participate from "@/components/events/participate";
import Terms from "@/components/events/terms";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

import { getProviders } from "next-auth/react"
import { getServerSession } from "next-auth/next"
import { GetServerSidePropsContext } from 'next'
import { authOptions } from '../../api/auth/[...nextauth]';

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
  const providers = await getProviders()

  return {
    props: {
      sessions: session,
      session: session
    },
  };

}