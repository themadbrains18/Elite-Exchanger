import { GetServerSidePropsContext } from "next";
import AllUsers from "@/admin/admin-component/users/all-users";

import TopHolders from "@/admin/admin-component/users/topHolders";
import UserCard from "@/admin/admin-component/users/userCard";
import DasboardLayout from "../../../components/layout/dasboard-layout";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { getServerSession } from "next-auth";
import { getProviders } from "next-auth/react";
import WorldMap from "react-svg-worldmap";
import RoundedDoughnutChart from "@/admin/admin-snippet/dougnutChart";
import TraficResources from "@/admin/admin-component/users/trafic-resources";

interface Session {
  users: any,
  networks: any,
  session: any,
  activity: any,
  usersCounts:any
}

const User = (props: Session) => {
  const [cities, setCities] = useState([])

  const data = [
    { country: "cn", value: '1389618778' },
    { country: "in", value: '1311559204' },
    { country: "us", value: '331883986' },
    { country: "id", value: '264935824' },
    { country: "pk", value: '210797836' },
    { country: "br", value: '210301591' },
    { country: "ng", value: '208679114' },
    { country: "bd", value: '161062905' },
    { country: "ru", value: '141944641' },
    { country: "mx", value: '127318112' },
  ];

  useEffect(() => {
    const groupCount = props?.activity.reduce((countMap: any, item: any) => {
      const { region } = item;
      countMap[region] = (countMap[region] || 0) + 1;
      return countMap;
    }, {});
    setCities(groupCount)
  }, [])

  return (
    <DasboardLayout>
      <UserCard usersCounts={props?.usersCounts} />
      <div className="flex gap-6 ">
        <div className="max-w-[50%] w-full">
          <TopHolders users={props?.users} />
        </div>
        <div className="max-w-[50%] w-full">
          <TopHolders users={props?.users} />
        </div>
      </div>
      <AllUsers users={props?.users} networks={props?.networks} session={props?.session} />
      <div className="grid grid-cols-3 gap-6 pt-6 ">
        {/* World Map */}
        <div className="py-6 px-5  rounded-10 bg-white dark:bg-grey-v-4">
          <WorldMap
            color="red"
            title="Top 10 Populous Countries"
            value-suffix="people"
            size="lg"
            data={data}
          />
        </div>
        {/* rounded Doughnut Chart */}
        <RoundedDoughnutChart cities={cities} />
        <TraficResources />

      </div>
    </DasboardLayout>
  );
};

export default User;


export async function getServerSideProps(context: GetServerSidePropsContext) {
  const { req } = context;
  const session = await getServerSession(context.req, context.res, authOptions);
  const providers = await getProviders();

  let users = await fetch(`${process.env.NEXT_PUBLIC_BASEURL}/user/all?itemOffset=0&itemsPerPage=10`, {
    method: "GET",
    headers: {
      "Authorization": session?.user?.access_token || ""
    },
  }).then(response => response.json());

  let usersCounts = await fetch(`${process.env.NEXT_PUBLIC_BASEURL}/user/count`, {
    method: "GET",
    headers: {
      "Authorization": session?.user?.access_token || ""
    },
  }).then(response => response.json());

  let activityList = await fetch(
    `${process.env.NEXT_PUBLIC_BASEURL}/activity/list`,
    {
      method: "GET",
      headers: {
        Authorization: session?.user?.access_token,
      },
    }
  ).then((response) => response.json());

  let networks = await fetch(`${process.env.NEXT_PUBLIC_BASEURL}/network`, {
    method: "GET",
    headers: {
      "Authorization": session?.user?.access_token || ""
    },

  }).then(response => response.json());

  // console.log(networks,"==hjhkjh");

  return {
    props: {
      session: session,
      sessions: session,
      provider: providers,
      users: users?.data?.data || [],
      networks: networks?.data || [],
      activity: activityList?.data || [],
      usersCounts : usersCounts
    },
  };
  // if (session) {

  // }
  // return {
  //   redirect: { destination: "/" },
  // };
}
