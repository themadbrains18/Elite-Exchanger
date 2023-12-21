import { GetServerSidePropsContext } from "next";
import Cards from "../../admin/admin-component/dashboard/dashboardCard";
import MarketOverview from "../../admin/admin-component/dashboard/marketOverview";
import RevenueRsources from "../../admin/admin-component/dashboard/revenueRsources";
import Table from "../../admin/admin-snippet/table";
import DasboardLayout from "../../components/layout/dasboard-layout";
import Image from "next/image";
import React, { useEffect } from "react";
import { authOptions } from "../api/auth/[...nextauth]";
import { getServerSession } from "next-auth";
import { getProviders } from "next-auth/react";
import LineChart from "@/admin/admin-snippet/lineChart";

interface propsData {
  // coinList?: any,
  topgainer: any;
  userList:any;
  tradeList:any;
  adminProfit:any;
  activity:any;

  session: {
    user: any;
  };
}
const Index = (props: propsData) => {

  useEffect(() => {
    console.log(props.session, "======================");
  }, []);
  return (
    <DasboardLayout>
      <Cards userList={props?.userList} tradeList={props?.tradeList}/>
      <div className="flex items-start gap-[24px]">
        <div className="max-w-[70%] w-full">
          <div className="w-full mb-[24px]">
          <LineChart />
            {/* <Image
              src="/assets/admin/Graph-dark.svg"
              alt="img-description"
              width={795}
              height={405}
              className="w-full dark:block hidden"
            />
            <Image
              src="/assets/admin/Graph-light.svg"
              alt="img-description"
              width={795}
              height={405}
              className="w-full dark:hidden block"
            /> */}
          </div>
          <Table coinList={props.topgainer} />
          {/* <MarketOverview coinList={props.coinList} /> */}
          <MarketOverview />
        </div>
        <div className="max-w-[30%] w-full">
          <RevenueRsources  adminProfit={props?.adminProfit} activity={props?.activity}/>
        </div>
      </div>
    </DasboardLayout>
  );
};

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const { req } = context;
  const session = await getServerSession(context.req, context.res, authOptions);
  const providers = await getProviders();

  // let tokenList = await fetch(`${process.env.NEXT_PUBLIC_BASEURL}/token`, {
  //   method: "GET"
  // }).then(response => response.json());

  let tokenList2 = await fetch(
    `${process.env.NEXT_PUBLIC_BASEURL}/token/topgainer`,
    {
      method: "GET",
    }
  ).then((response) => response.json());

  let userAssets: any = [];
  let users: any = [];
  let trades: any = [];
  let profit: any = [];
  let activityList:any=[]
  if (session) {
    // console.log(session)

    userAssets = await fetch(
      `${process.env.NEXT_PUBLIC_BASEURL}/user/assets?userid=${session?.user?.user_id}`,
      {
        method: "GET",
        headers: {
          Authorization: session?.user?.access_token,
        },
      }
    ).then((response) => response.json());

    users = await fetch(
      `${process.env.NEXT_PUBLIC_BASEURL}/user/all?itemOffset=0&itemsPerPage=10`,
      {
        method: "GET",
        headers: {
          Authorization: session?.user?.access_token,
        },
      }
    ).then((response) => response.json());

    profit = await fetch(
      `${process.env.NEXT_PUBLIC_BASEURL}/user/adminProfit`,
      {
        method: "GET",
        headers: {
          Authorization: session?.user?.access_token,
        },
      }
    ).then((response) => response.json());
    activityList = await fetch(
      `${process.env.NEXT_PUBLIC_BASEURL}/activity/list`,
      {
        method: "GET",
        headers: {
          Authorization: session?.user?.access_token,
        },
      }
    ).then((response) => response.json());

    
 
    trades = await fetch(`${process.env.NEXT_PUBLIC_BASEURL}/market/list?itemOffset=0&itemsPerPage=10`, {
      method: "GET",
      headers: {
        "Authorization": session?.user?.access_token
    },
    }).then(response => response.json());
  }

  return {
    props: {
      session: session,
      sessions: session,
      provider: providers,
      // coinList: tokenList?.data,
      userList:users?.data || [],
      tradeList:trades?.data  || [],
      adminProfit:profit?.data || [],
      assets: userAssets,
      topgainer: tokenList2,
      activity:activityList.data || []
      // allUsers:allUsers
    },
  };
  // if (session) {

  // }
  // return {
  //   redirect: { destination: "/" },
  // };
}

export default Index;
