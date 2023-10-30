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

interface Session {
  coinList?: any,
  topgainer:any
}
const Index = (props:Session) => {
  useEffect(()=>{
      console.log(props.topgainer,"======================");
  },[])
  return (
    <DasboardLayout>
      <Cards />
      <div className="flex items-start gap-[24px]">
        <div className="max-w-[70%] w-full">
          <div className="w-full mb-[24px]">
            <Image
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
            />
          </div>
          <Table coinList={props.topgainer} />
          <MarketOverview coinList={props.coinList} />
        </div>
        <div className="max-w-[30%] w-full">
          <RevenueRsources  />
        </div>
      </div>
    </DasboardLayout>
  );
};

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const { req } = context;
  const session = await getServerSession(context.req, context.res, authOptions);
  const providers = await getProviders();
 
  let tokenList = await fetch(`${process.env.NEXT_PUBLIC_BASEURL}/token`, {
    method: "GET"
  }).then(response => response.json());

  let tokenList2 = await fetch(`${process.env.NEXT_PUBLIC_BASEURL}/token/topgainer`, {
    method: "GET"
  }).then(response => response.json());

  let userAssets:any = [];
  if (session) {
    userAssets = await fetch(`${process.env.NEXT_PUBLIC_BASEURL}/user/assets?userid=${session?.user?.user_id}`, {
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
      coinList: tokenList?.data,
      assets : userAssets ,
      topgainer: tokenList2
    },
  };
  // if (session) {

  // }
  // return {
  //   redirect: { destination: "/" },
  // };
}


export default Index;
