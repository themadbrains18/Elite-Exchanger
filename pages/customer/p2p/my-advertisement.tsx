import P2pLayout from '@/components/layout/p2p-layout';
import AdvertisementTabs from '@/components/p2p/my-advertisement/advertisement-tabs';
import React from 'react'
import { getProviders } from "next-auth/react"
import { getServerSession } from "next-auth/next"
import { GetServerSidePropsContext, InferGetServerSidePropsType } from 'next'
import { authOptions } from '../../api/auth/[...nextauth]';
import { useRouter } from 'next/router';

interface propsData {
  // posts?: any;
  masterPayMethod?: any;
  userPaymentMethod?: any;
  coinList?:any;
  session?:any;
}

const MyAdvertisement = (props: propsData) => {

  const router= useRouter()

  return (
    <P2pLayout>
      <AdvertisementTabs userPaymentMethod={props.userPaymentMethod} coinList={props?.coinList} masterPayMethod={props.masterPayMethod} session={props?.session}/>
    </P2pLayout>

  )
}

export default MyAdvertisement;

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const { req } = context;
  const session = await getServerSession(context.req, context.res, authOptions);
  const providers = await getProviders()

  // masterpayment
  let masterPaymentMethod = await fetch(`${process.env.NEXT_PUBLIC_BASEURL}/p2p/masterpayment`, {
    method: "GET",
    headers: {
      "Authorization": session?.user?.access_token
    },
  }).then(response => response.json());

  let tokenList = await fetch(`${process.env.NEXT_PUBLIC_BASEURL}/token`, {
    method: "GET"
  }).then(response => response.json());

  if (session) {


    let userPaymentMethod = await fetch(`${process.env.NEXT_PUBLIC_BASEURL}/p2p/userpaymentmethod`, {
      method: "GET",
      headers: {
        "Authorization": session?.user?.access_token
      },
    }).then(response => response.json());

    return {
      props: {
        providers: providers,
        session: session,
        // posts: userPosts?.data || [],
        masterPayMethod: masterPaymentMethod?.data || [],
        userPaymentMethod: userPaymentMethod?.data || [],
        coinList: tokenList?.data || [],
      },
    };
  }
  return {
    redirect: { destination: "/" },
  };

}