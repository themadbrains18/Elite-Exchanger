import P2pLayout from '@/components/layout/p2p-layout';
import BuyCoinsTabs from '@/components/p2p/buy-coins-tabs';
import BuyPopup from '@/components/snippets/buyPopup';
import React, { useEffect, useState } from 'react'

import { getProviders } from "next-auth/react"
import { getServerSession } from "next-auth/next"
import { GetServerSidePropsContext, InferGetServerSidePropsType } from 'next'
import { authOptions } from '../../api/auth/[...nextauth]';

interface propsData {
  provider: any,
  coinList: any,
  networks: any,
  assets: any,
  posts?: any,
  masterPayMethod?: any;
}

const P2pBuy = (props: propsData) => {

  const [show1, setShow1] = useState(false);
  const [selectedPost, setSelectedPost] = useState(Object);
  const [newPosts, setNewPosts] = useState([]);

  for (const post of props.posts) {
    let payment_method: any = [];
    for (const upid of post.p_method) {
      post?.User?.user_payment_methods.filter((item: any) => {
        if (item.id === upid?.upm_id) {
          payment_method.push(item);
        }
      })
    }
    post.user_p_method = payment_method;
  }

  useEffect(() => {
    const websocket = new WebSocket(`${process.env.NEXT_PUBLIC_WS_URL}`);

    websocket.onopen = () => {
      console.log('connected');
    }

    websocket.onmessage = (event) => {
      const data = JSON.parse(event.data).data;
      let eventDataType = JSON.parse(event.data).type;
      if (eventDataType === "post") {

        for (const post of data) {
          let payment_method: any = [];
          for (const upid of post.p_method) {
            post?.User?.user_payment_methods.filter((item: any) => {
              if (item.id === upid?.upm_id) {
                payment_method.push(item);
              }
            })
          }
          post.user_p_method = payment_method;
        }

        setNewPosts(data);
      }
    }

  }, [])


  return (
    <P2pLayout>
      <>
      </>
      <BuyCoinsTabs setShow1={setShow1} coinList={props?.coinList} posts={newPosts.length > 0 ? newPosts : props.posts} setSelectedPost={setSelectedPost} masterPayMethod={props.masterPayMethod} />
      <BuyPopup show1={show1} setShow1={setShow1} selectedPost={selectedPost} />
    </P2pLayout>
  )
}

export default P2pBuy;

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const { req } = context;
  const session = await getServerSession(context.req, context.res, authOptions);
  const providers = await getProviders()

  let tokenList = await fetch(`${process.env.NEXT_PUBLIC_BASEURL}/token`, {
    method: "GET"
  }).then(response => response.json());

  let allPosts = await fetch(`${process.env.NEXT_PUBLIC_BASEURL}/p2p/buy`, {
    method: "GET",
  }).then(response => response.json());

  // masterpayment
  let masterPaymentMethod = await fetch(`${process.env.NEXT_PUBLIC_BASEURL}/p2p/masterpayment`, {
    method: "GET",
    headers: {
      "Authorization": session?.user?.access_token
    },
  }).then(response => response.json());

  if (session) {

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
        coinList: tokenList?.data || [],
        assets: userAssets || [],
        posts: allPosts?.data || [],
        masterPayMethod: masterPaymentMethod?.data || [],
      },
    };
  }

  return {
    props: {
      providers: providers,
      sessions: session,
      coinList: tokenList?.data,
      assets: [],
      posts: allPosts?.data || [],
      masterPayMethod: masterPaymentMethod?.data || [],
    },
  };

}