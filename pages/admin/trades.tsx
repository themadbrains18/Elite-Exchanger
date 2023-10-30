import List from "@/admin/admin-component/tradeHistory/list";
import DasboardLayout from "@/components/layout/dasboard-layout";
import { GetServerSidePropsContext } from "next";
import React from "react";
import { authOptions } from "../api/auth/[...nextauth]";
import { getServerSession } from "next-auth";
import { getProviders } from "next-auth/react";

interface session{
    marketOrders:any
}

const Trades = (props:session) => {
    return (
      <DasboardLayout>
        <List marketOrders={props?.marketOrders}/>
      </DasboardLayout>
    );
};

export async function getServerSideProps(context: GetServerSidePropsContext) {
    const { req } = context;
    const session = await getServerSession(context.req, context.res, authOptions);
    const providers = await getProviders();
  
     let marketOrders = await fetch(`${process.env.NEXT_PUBLIC_APIURL}/market/admin/all`, {
        method: "GET",    
      }).then(response => response.json());
  
   
  
    return {
      props: {
        session: session,
        sessions: session,
        provider: providers,
        marketOrders: marketOrders || [],
        
      },
    };
    // if (session) {
  
    // }
    // return {
    //   redirect: { destination: "/" },
    // };
  }

export default Trades;
