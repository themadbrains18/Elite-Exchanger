import P2pLayout from '@/components/layout/p2p-layout';
import AdvertisementTabs from '@/components/p2p/my-advertisement/advertisement-tabs';
import React from 'react'
import { getProviders } from "next-auth/react"
import { getServerSession } from "next-auth/next"
import { GetServerSidePropsContext, InferGetServerSidePropsType } from 'next'
import { authOptions } from '../../api/auth/[...nextauth]';

interface propsData {
  posts?: any;
  masterPayMethod?: any;
  userPaymentMethod?: any;
  coinList?:any;
}

const MyAdvertisement = (props: propsData) => {

  for (const post of props.posts) {
    let payment_method: any = [];
    for (const upid of post.p_method) {
      props.userPaymentMethod.filter((item: any) => {
        if (item.id === upid?.upm_id) {
          payment_method.push(item);

        }
      })
    }
    post.user_p_method = payment_method;
  }

  let publishedData = props.posts.filter((item: any) => {
    return item.status === true;
  })

  let unpublishedData = props.posts.filter((item: any) => {
    return item.status === false;
  })

  return (
    <P2pLayout>
      <AdvertisementTabs posts={props.posts} published={publishedData} unpublished={unpublishedData} userPaymentMethod={props.userPaymentMethod} coinList={props?.coinList} masterPayMethod={props.masterPayMethod}/>
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

    let userPosts = await fetch(`${process.env.NEXT_PUBLIC_BASEURL}/p2p/advertisement`, {
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

    return {
      props: {
        providers: providers,
        sessions: session,
        posts: userPosts?.data || [],
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