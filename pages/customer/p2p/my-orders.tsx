import P2pLayout from '@/components/layout/p2p-layout';
import ChatBox from '@/components/p2p/my-orders/chat-box';
import OrderInfo from '@/components/p2p/my-orders/order-info';
import OrdersTabs from '@/components/p2p/my-orders/orders-tabs';
import Remarks from '@/components/p2p/my-orders/remarks';
import SlectPaymentMethod from '@/components/p2p/my-orders/select-payment-method';
import React, { useEffect, useState } from 'react'

import { getProviders, useSession } from "next-auth/react"
import { getServerSession } from "next-auth/next"
import { GetServerSidePropsContext, InferGetServerSidePropsType } from 'next'
import { authOptions } from '../../api/auth/[...nextauth]';
import { useRouter } from 'next/router';

interface propsData {
  userOrder?: any;
  orderList?: any;
  session?: any;
}

const MyOrders = (props: propsData) => {

  const [paymentMethod, setPaymentMethod] = useState('');
  const [order, setOrderDetail] = useState(props.userOrder);
  const [newOrderList, setNewOrderList] = useState(props.orderList);
  const [orderId, setOrderId] = useState('')

  // const { data: session } = useSession();

  useEffect(() => {
    const websocket = new WebSocket(`${process.env.NEXT_PUBLIC_WS_URL}`);

    websocket.onopen = () => {
      console.log('connected');
    }

    websocket.onmessage = (event) => {
      const data = JSON.parse(event.data).data;
      let eventDataType = JSON.parse(event.data).type;
      if (eventDataType === "order") {

        // console.log(data,'==========socket order data=============');
        
        getOrderByOrderId(data?.id);
        // setOrderDetail(data)
      }

      if (eventDataType === "buy") {
        getUserOrders();
      }
    }

    if (orderId !== undefined && orderId !== '') {
      getOrderByOrderId(orderId);
    }
  }, [orderId])

  const getOrderByOrderId = async (orderid: any) => {
    let userOrder: any = await fetch(`${process.env.NEXT_PUBLIC_BASEURL}/p2p/order?orderid=${orderid}`, {
      method: "GET",
      headers: {
        "Authorization": props.session?.user?.access_token
      },
    }).then(response => response.json());

    setOrderDetail(userOrder?.data);
  }

  const getUserOrders = async () => {
    let userAllOrderList = await fetch(`${process.env.NEXT_PUBLIC_BASEURL}/p2p/orderlist?userid=${props.session?.user?.user_id}`, {
      method: "GET",
      headers: {
        "Authorization": props.session?.user?.access_token
      },
    }).then(response => response.json());

    setNewOrderList(userAllOrderList?.data);
  }

  return (
    <P2pLayout>
      {
        (props.userOrder !== null)
          ?
          <>
            <div className='mt-30 flex items-start gap-30'>
              <div className='max-[1200px]:max-w-full max-w-[75%] w-full'>
                <OrderInfo userOrder={order} />
                <SlectPaymentMethod userOrder={order} setPaymentMethod={setPaymentMethod} />
                <Remarks paymentMethod={paymentMethod} orderid={order?.id} userOrder={order} getUserOrders={getUserOrders} />
              </div>
              <ChatBox sellerUser={order?.user_post?.User?.id === props.session?.user?.user_id ? order?.User : order?.user_post?.User} order={order} />
            </div>
          </>
          :
          <OrdersTabs orderList={newOrderList} setOrderId={setOrderId} />
      }

    </P2pLayout>
  )
}

export default MyOrders;

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const { req } = context;
  const session = await getServerSession(context.req, context.res, authOptions);
  const providers = await getProviders()

  if (session) {
    const { buy } = context.query;
    let userOrder: any = {};

    if (buy !== undefined) {
      userOrder = await fetch(`${process.env.NEXT_PUBLIC_BASEURL}/p2p/order?orderid=${buy}`, {
        method: "GET",
        headers: {
          "Authorization": session?.user?.access_token
        },
      }).then(response => response.json());
    }

    let userAllOrderList = await fetch(`${process.env.NEXT_PUBLIC_BASEURL}/p2p/orderlist?userid=${session?.user?.user_id}`, {
      method: "GET",
      headers: {
        "Authorization": session?.user?.access_token
      },
    }).then(response => response.json());


    return {
      props: {
        providers: providers,
        sessions: session,
        session: session,
        userOrder: buy !== undefined ? userOrder?.data : null,
        orderList: userAllOrderList?.data || []
      },
    };
  }

  return {
    redirect: { destination: "/" },
  };

}