import P2pLayout from '@/components/layout/p2p-layout';
import BuyCoinsTabs from '@/components/p2p/buy-coins-tabs';
import BuyPopup from '@/components/snippets/buyPopup';
import React, { useEffect, useState } from 'react'

import { getProviders } from "next-auth/react"
import { getServerSession } from "next-auth/next"
import { GetServerSidePropsContext, InferGetServerSidePropsType } from 'next'
import { authOptions } from '../../api/auth/[...nextauth]';
import { useWebSocket } from '@/libs/WebSocketContext';

interface propsData {
  provider: any,
  coinList: any,
  networks: any,
  assets: any,
  sessions: any,
  posts?: any,
  masterPayMethod?: any;
}

const P2pBuy = (props: propsData) => {

  const [show1, setShow1] = useState(false);
  const [selectedPost, setSelectedPost] = useState(Object);
  const [newPosts, setNewPosts] = useState([]);



  const wbsocket = useWebSocket();

  useEffect(() => {
    socket(props?.sessions?.user?.user_id);
  }, [wbsocket])

  

  const socket=(user_id:string | undefined)=>{
    if(wbsocket){
      
      wbsocket.onmessage = (event) => {
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

      const limit = 20;
          const offset = 0;
          wbsocket.send(JSON.stringify({ ws_type: "post", user_id, limit, offset }));
    }
  }


  return (
    <P2pLayout>
      <>
      </>
      <BuyCoinsTabs setShow1={setShow1} coinList={props?.coinList} assets={props?.assets} posts={newPosts.length > 0 ? newPosts : props?.posts} setSelectedPost={setSelectedPost} masterPayMethod={props.masterPayMethod} />
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

  let allPosts = await fetch(`${process.env.NEXT_PUBLIC_BASEURL}/p2p/buy?user_id=${session?.user?.user_id}&itemOffset=0&itemsPerPage=20`, {
    method: "GET",
  }).then(response => response.json());



  // masterpayment
  let masterPaymentMethod = await fetch(`${process.env.NEXT_PUBLIC_BASEURL}/p2p/masterpayment`, {
    method: "GET",
    
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