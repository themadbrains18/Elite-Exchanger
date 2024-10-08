import NewList from "@/admin/admin-component/token/newList";
import CoinCards from "../../admin/admin-component/token/coinCards";
import HighRevenue from "@/admin/admin-component/token/highRevenue";
import DasboardLayout from "../../components/layout/dasboard-layout";
import React, { useEffect, useState } from "react";
import AddedTokens from "../../admin/admin-component/token/addedTokens";
import AllCoins from "@/admin/admin-component/token/allCoins";
import { GetServerSidePropsContext } from "next";
import { authOptions } from "../api/auth/[...nextauth]";
import { getServerSession } from "next-auth";
import { getProviders } from "next-auth/react";
import { useWebSocket } from "@/libs/WebSocketContext";

interface Session {
  coinList?: any,
  topgainer: any,
  networkList: any,
}
const Token = (props: Session) => {

  const [tokenList, setFreshTokenList] = useState(props.coinList);

  const refreshTokenList = (data: any) => {
    setFreshTokenList(data);
  }

  const wbsocket = useWebSocket();
  
  useEffect(() => {
    socket();
  }, [wbsocket])

  const socket=()=>{
    if(wbsocket){
      wbsocket.onmessage = (event) => {
        const data = JSON.parse(event.data).data;
        let eventDataType = JSON.parse(event.data).type;
        if (eventDataType === "price") {
          refreshPriceTokenList()
        }
      }
    }
  }

  const refreshPriceTokenList = async () => {
    let tokenList = await fetch(`${process.env.NEXT_PUBLIC_BASEURL}/token/admin`, {
      method: "GET",

    }).then(response => response.json());

    setFreshTokenList(tokenList?.data);
  }

  return (
    <DasboardLayout>
      <div className="flex gap-6">
        <div className="max-w-[70%] w-full">
          <CoinCards />
        </div>
        <div className="max-w-[30%] w-full">
          <HighRevenue coinList={props.topgainer} />
        </div>
      </div>
      <div className="flex gap-6 mt-6">
        <div className="max-w-[50%] w-full">
          <NewList coins={tokenList} />
        </div>
        <div className="max-w-[50%] w-full">
          <AddedTokens coins={tokenList} refreshTokenList={refreshTokenList} />
        </div>
      </div>
      <AllCoins coinList={tokenList} networkList={props?.networkList} refreshTokenList={refreshTokenList} />
    </DasboardLayout>
  );
};


export async function getServerSideProps(context: GetServerSidePropsContext) {
  const { req } = context;
  const session = await getServerSession(context.req, context.res, authOptions);
  const providers = await getProviders();

  if (session) {
    let tokenList = await fetch(`${process.env.NEXT_PUBLIC_BASEURL}/token/admin`, {
      method: "GET",

    }).then(response => response.json());


    let tokenList2 = await fetch(`${process.env.NEXT_PUBLIC_BASEURL}/token/topgainer`, {
      method: "GET",

    }).then(response => response.json());

    let networkList = await fetch(`${process.env.NEXT_PUBLIC_BASEURL}/network`, {
      method: "GET",

    }).then(response => response.json());


    let userAssets: any = [];
    userAssets = await fetch(`${process.env.NEXT_PUBLIC_BASEURL}/user/assets?userid=${session?.user?.user_id}`, {
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
        coinList: tokenList?.data || [],
        assets: userAssets,
        topgainer: [],
        networkList: networkList?.data || []
      }
    };

  }
  else {
    return {
      redirect: { destination: "/login" },
    };
  }



}

export default Token;
