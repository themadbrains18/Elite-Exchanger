import P2pLayout from '@/components/layout/p2p-layout'
import Adverstisement from '@/components/p2p/postadv/adverstisement'
import React from 'react'
import { getProviders } from "next-auth/react"
import { getServerSession } from "next-auth/next"
import { GetServerSidePropsContext, InferGetServerSidePropsType } from 'next'
import { authOptions } from '../api/auth/[...nextauth]';

interface propsData {
  masterPayMethod?: any;
  userPaymentMethod?: any;
  tokenList?: any;
  assets?:any;
}

const Postad = (props:propsData) => {
  return (
    <P2pLayout>
      <Adverstisement masterPayMethod={props.masterPayMethod} userPaymentMethod={props.userPaymentMethod} tokenList={props.tokenList} assets={props.assets}/>
    </P2pLayout>
  )
}

export default Postad

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const { req } = context;
  const session = await getServerSession(context.req, context.res, authOptions);
  const providers = await getProviders()

  if (session) {

    // masterpayment
    let masterPaymentMethod = await fetch(`${process.env.NEXT_PUBLIC_BASEURL}/p2p/masterpayment`, {
      method: "GET",
      headers: {
        "Authorization": session?.user?.access_token
      },
    }).then(response => response.json());

    let userPaymentMethod = await fetch(`${process.env.NEXT_PUBLIC_BASEURL}/p2p/userpaymentmethod`, {
      method: "GET",
      headers: {
        "Authorization": session?.user?.access_token
      },
    }).then(response => response.json());

    let tokenList = await fetch(`${process.env.NEXT_PUBLIC_BASEURL}/token`, {
      method: "GET"
    }).then(response => response.json());

    let userAssets = await fetch(`${process.env.NEXT_PUBLIC_BASEURL}/user/assets?userid=${session?.user?.user_id}`, {
      method: "GET",
      headers: {
        "Authorization": session?.user?.access_token
      },
    }).then(response => response.json());

    return {
      props: {
        providers: providers,
        sessions: session,
        masterPayMethod: masterPaymentMethod?.data || [],
        userPaymentMethod: userPaymentMethod?.data || [],
        tokenList: tokenList?.data || [],
        assets: userAssets || [],
      },
    };
  }
  return {
    redirect: { destination: "/" },
  };


}