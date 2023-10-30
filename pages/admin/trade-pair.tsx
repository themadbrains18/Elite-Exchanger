import PairList from "@/admin/admin-component/trade-pair/pairList";
import DasboardLayout from "@/components/layout/dasboard-layout";
import { GetServerSidePropsContext } from "next";
import React, { useState } from "react";
import { authOptions } from "../api/auth/[...nextauth]";
import { getServerSession } from "next-auth";
import { getProviders } from "next-auth/react";

interface Session {
  coinList?: any;
  pairList:any;
}

const TradePair = (props: Session) => {
  const [pairList, setFreshPairList] = useState(props.pairList);

  const refreshPairList=(data:any)=>{
    setFreshPairList(data);
  }
  return (
    <DasboardLayout>
      <PairList list={props?.coinList} pairs={pairList} refreshPairList={refreshPairList}/>
    </DasboardLayout>
  );
};

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const { req } = context;
  const session = await getServerSession(context.req, context.res, authOptions);
  const providers = await getProviders();

  let tokenList = await fetch(
    `${process.env.NEXT_PUBLIC_BASEURL}/token/admin`,
    {
      method: "GET",
    }
  ).then((response) => response.json());
  let pairList = await fetch(`${process.env.NEXT_PUBLIC_APIURL}/pair`, {
    method: "GET",
  }).then((response) => response.json());


  return {
    props: {
      session: session,
      sessions: session,
      provider: providers,
      coinList: tokenList?.data,
      pairList:pairList
    },
  };

  // if (session) {

  // }
  // return {
  //   redirect: { destination: "/" },
  // };
}

export default TradePair;
