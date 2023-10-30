import P2pLayout from '@/components/layout/p2p-layout'
import BuySellExpress from '@/components/p2p/express/buySellExpress'
import { GetServerSidePropsContext } from 'next'
import React from 'react'
import { authOptions } from '../api/auth/[...nextauth]'
import { getServerSession } from 'next-auth'
import { getProviders } from 'next-auth/react'

interface Session {
    session: {
      user: any
    },
    provider: any,
    coinList: any,
    // assets: any
  }
  

const Express = (props:Session) => {
  return (
    <P2pLayout>
        <BuySellExpress coins={props?.coinList} session={props?.session}/>
    </P2pLayout>
  )
}


export async function getServerSideProps(context: GetServerSidePropsContext) {
    const { req } = context;
    const session = await getServerSession(context.req, context.res, authOptions);
    const providers = await getProviders();
  
    let tokenList = await fetch(`${process.env.NEXT_PUBLIC_BASEURL}/token`, {
      method: "GET"
    }).then(response => response.json());
  
    // let userAssets: any = [];
    if (session) {
    //   userAssets = await fetch(`${process.env.NEXT_PUBLIC_BASEURL}/user/assets?userid=${session?.user?.user_id}`, {
    //     method: "GET",
    //     headers: {
    //       "Authorization": session?.user?.access_token
    //     },
    //   }).then(response => response.json());
     }
  
    return {
      props: {
        session: session,
        sessions: session,
        provider: providers,
        coinList: tokenList?.data,
        // assets: userAssets
      },
    };
    // if (session) {
  
    // }
    // return {
    //   redirect: { destination: "/" },
    // };
  }

export default Express