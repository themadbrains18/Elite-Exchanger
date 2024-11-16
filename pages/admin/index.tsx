import { GetServerSidePropsContext } from "next";
import Cards from "../../admin/admin-component/dashboard/dashboardCard";
import MarketOverview from "../../admin/admin-component/dashboard/marketOverview";
import RevenueRsources from "../../admin/admin-component/dashboard/revenueRsources";
import Table from "../../admin/admin-snippet/table";
import DasboardLayout from "../../components/layout/dasboard-layout";
import React, { useEffect } from "react";
import { authOptions } from "../api/auth/[...nextauth]";
import { getServerSession } from "next-auth";
import { getProviders } from "next-auth/react";
import LineChart from "@/admin/admin-snippet/lineChart";
import Head from "next/head";

interface propsData {
  // coinList?: any,
  topgainer: any;
  userList: any;
  tradeList: any;
  adminProfit: any;
  activity: any;

  session: {
    user: any;
  };
}


/**
 * Index component for the Dashboard page.
 * It includes cards for user stats, trade stats, and charts like LineChart and MarketOverview.
 */
const Index = (props: propsData) => {
  return (
    <>
      <Head>
        <link rel="stylesheet" href="https://code.highcharts.com/css/highcharts.css" />
        <link rel="stylesheet" href="https://code.highcharts.com/css/stocktools/gui.css" />
        <link rel="stylesheet" href="https://code.highcharts.com/css/annotations/popup.css" />
      </Head>
      <DasboardLayout>
        <Cards userList={props?.userList} tradeList={props?.tradeList} />
        <div className="flex items-start gap-[24px]">
          <div className="max-w-[70%] w-full">
            <div className="w-full mb-[24px]">
              <LineChart />
            </div>
            <Table coinList={props.topgainer} />
            {/* <MarketOverview coinList={props.coinList} /> */}
            <MarketOverview />
          </div>
          <div className="max-w-[30%] w-full">
            <RevenueRsources adminProfit={props?.adminProfit} activity={props?.activity} />
          </div>
        </div>
      </DasboardLayout>
    </>
  );
};

/**
 * Server-side function to fetch data for the dashboard page.
 * It fetches user assets, trades, profits, activity, and top gainer coins.
 * 
 * @param context - The context object that contains request and response.
 * @returns props with fetched data if authenticated, or a redirect to login page if not authenticated.
 */
export async function getServerSideProps(context: GetServerSidePropsContext) {
  const { req } = context;
  const session = await getServerSession(context.req, context.res, authOptions);
  const providers = await getProviders();

  // Fetch top gainer coins
  let tokenList2 = await fetch(
    `${process.env.NEXT_PUBLIC_BASEURL}/token/topgainer`,
    {
      method: "GET",
    }
  ).then((response) => response.json());

  // Initialize empty arrays for fetching data
  let userAssets: any = [];
  let users: any = [];
  let trades: any = [];
  let profit: any = [];
  let activityList: any = []
  if (session) {

    // Fetch user assets for the logged-in user
    userAssets = await fetch(
      `${process.env.NEXT_PUBLIC_BASEURL}/user/assets?userid=${session?.user?.user_id}`,
      {
        method: "GET",
        headers: {
          Authorization: session?.user?.access_token,
        },
      }
    ).then((response) => response.json());

    // Fetch the list of users
    users = await fetch(
      `${process.env.NEXT_PUBLIC_BASEURL}/user/all?itemOffset=0&itemsPerPage=10`,
      {
        method: "GET",
        headers: {
          Authorization: session?.user?.access_token,
        },
      }
    ).then((response) => response.json());

    // Fetch admin profit data
    profit = await fetch(
      `${process.env.NEXT_PUBLIC_BASEURL}/user/adminProfit`,
      {
        method: "GET",
        headers: {
          Authorization: session?.user?.access_token,
        },
      }
    ).then((response) => response.json());

    // Fetch activity list
    activityList = await fetch(
      `${process.env.NEXT_PUBLIC_BASEURL}/activity/list`,
      {
        method: "GET",
        headers: {
          Authorization: session?.user?.access_token,
        },
      }
    ).then((response) => response.json());

    // Fetch trades
    trades = await fetch(`${process.env.NEXT_PUBLIC_BASEURL}/market/list?itemOffset=0&itemsPerPage=10`, {
      method: "GET",
      headers: {
        "Authorization": session?.user?.access_token
      },
    }).then(response => response.json());

    return {
      props: {
        session: session,
        sessions: session,
        provider: providers,
        // coinList: tokenList?.data,
        userList: users?.data || [],
        tradeList: trades?.data || [],
        adminProfit: profit?.data || [],
        assets: userAssets,
        topgainer: [],
        activity: activityList.data || []
        // allUsers:allUsers
      },
    };
  }
  else {
    // Redirect to login if the session does not exist
    return {
      redirect: { destination: "/login" },
    };
  }

}

export default Index;
