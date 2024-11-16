import P2pLayout from '@/components/layout/p2p-layout';
import BuyCoinsTabs from '@/components/p2p/buy-coins-tabs';
import BuyPopup from '@/components/snippets/buyPopup';
import React, { useEffect, useState } from 'react'

import { getProviders } from "next-auth/react"
import { getServerSession } from "next-auth/next"
import { GetServerSidePropsContext } from 'next'
import { authOptions } from '../../api/auth/[...nextauth]';
import { useWebSocket } from '@/libs/WebSocketContext';
import Meta from '@/components/snippets/meta';


interface propsData {
  provider: any,
  coinList: any,
  networks: any,
  assets: any,
  session: any,
  posts?: any,
  masterPayMethod?: any;
}

const P2pBuy = (props: propsData) => {

  const [show1, setShow1] = useState(false);
  const [selectedPost, setSelectedPost] = useState(Object);
  const [newPosts, setNewPosts] = useState([]);
  const wbsocket = useWebSocket();

  /**
 * Effect hook to establish a WebSocket connection when `wbsocket` or `user_id` changes.
 * This effect triggers the `socket` function whenever a change is detected in `wbsocket` 
 * or the user's `user_id`. It is used for managing WebSocket connections and handling 
 * user-specific data.
 * 
 * Cleanup function ensures the WebSocket connection is closed if the component unmounts 
 * or if either `wbsocket` or `user_id` changes.
 */
  useEffect(() => {
    socket(props?.session?.user?.user_id);
  }, [wbsocket])

  /**
   * Establishes a WebSocket connection to listen for messages related to "post" data.
   * It processes the received data, specifically extracting payment methods associated 
   * with user posts, and updates the state with the processed posts data.
   * 
   * @param {string | undefined} user_id - The user identifier to send in the WebSocket request.
   * This user ID is used to retrieve user-specific data related to posts and payment methods.
   * 
   * The WebSocket listens for incoming messages and updates the component state based 
   * on the received data. Specifically, it processes post data, extracting and associating 
   * payment methods with each post.
   */
  const socket = (user_id: string | undefined) => {
    if (wbsocket) {

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
    <>
      <Meta title='Crypto Planet P2P Trading | Buy Crypto via P2P' description='Crypto Planet Buy Crypto via P2P' />

      <P2pLayout>
        <BuyCoinsTabs setShow1={setShow1} coinList={props?.coinList} assets={props?.assets} posts={newPosts?.length > 0 ? newPosts : props?.posts} setSelectedPost={setSelectedPost} masterPayMethod={props.masterPayMethod} session={props?.session} />
        {show1 === true &&
          <BuyPopup show1={show1} setShow1={setShow1} selectedPost={selectedPost} />
        }
      </P2pLayout>
    </>
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

  let allPosts = await fetch(`${process.env.NEXT_PUBLIC_BASEURL}/p2p/buy?user_id=${session?.user?.user_id}&itemOffset=0&itemsPerPage=20&currency=all&pmMethod=all`, {
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
        session: session,
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
      session: session,
      coinList: tokenList?.data,
      assets: [],
      posts: allPosts?.data || [],
      masterPayMethod: masterPaymentMethod?.data || [],
    },
  };

}