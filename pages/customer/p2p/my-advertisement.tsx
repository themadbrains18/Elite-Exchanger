import P2pLayout from '@/components/layout/p2p-layout';
import AdvertisementTabs from '@/components/p2p/my-advertisement/advertisement-tabs';
import React from 'react'
import { getProviders } from "next-auth/react"
import { getServerSession } from "next-auth/next"
import { GetServerSidePropsContext } from 'next'
import { authOptions } from '../../api/auth/[...nextauth]';
import { useRouter } from 'next/router';
import Meta from '@/components/snippets/meta';

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
    <>
    <Meta title='Crypto Advertisements | Crypto Planet' description='Discover the latest crypto advertisements and promotions in one place! Browse exclusive offers, trading bonuses, and investment opportunities tailored for crypto enthusiasts. Stay informed and seize the best deals to maximize your trading experience. Check out our advertisement list today!'/>
    <P2pLayout>
      <AdvertisementTabs userPaymentMethod={props.userPaymentMethod} coinList={props?.coinList} masterPayMethod={props.masterPayMethod} session={props?.session}/>
    </P2pLayout>
    </>

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