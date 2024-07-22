import P2pLayout from '@/components/layout/p2p-layout';
import ChatBox from '@/components/p2p/my-orders/chat-box';
import OrderInfo from '@/components/p2p/my-orders/order-info';
import OrdersTabs from '@/components/p2p/my-orders/orders-tabs';
import Remarks from '@/components/p2p/my-orders/remarks';
import SlectPaymentMethod from '@/components/p2p/my-orders/select-payment-method';
import React, { useEffect, useRef, useState } from 'react'

import { getProviders, useSession } from "next-auth/react"
import { getServerSession } from "next-auth/next"
import { GetServerSidePropsContext, InferGetServerSidePropsType } from 'next'
import { authOptions } from '../../api/auth/[...nextauth]';
// import { useRouter } from 'next/router';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Successfull from '@/components/snippets/successfull';
import { useWebSocket } from '@/libs/WebSocketContext';

interface propsData {
  userOrder?: any;
  orderList?: any;
  session?: any;
  coinList?:any;
  masterPayMethod?: any;
  userPaymentMethod?: any;
}

const MyOrders = (props: propsData) => {

  const [paymentMethod, setPaymentMethod] = useState('');
  const [order, setOrderDetail] = useState(props.userOrder);
  const [newOrderList, setNewOrderList] = useState(props.orderList);
  const [orderId, setOrderId] = useState('')
  const { status, data: session } = useSession();
  const [active1, setActive1] = useState(false);
  const [show, setShow] = useState(false);

  const wbsocket = useWebSocket();
  const socketListenerRef = useRef<(event: MessageEvent) => void>();

  useEffect(() => {
    const handleSocketMessage = (event: any) => {
      const data = JSON.parse(event.data).data;
      let eventDataType = JSON.parse(event.data).type;
      if (eventDataType === "order") {
        getOrderByOrderId(data?.id, 'socket');
      }

      if (eventDataType === "buy") {
        getUserOrders();
      }
    };

    // wbsocket.addEventListener('message', handleSocketMessage);
    if (wbsocket && wbsocket.readyState === WebSocket.OPEN) {
      if (socketListenerRef.current) {
        wbsocket.removeEventListener('message', socketListenerRef.current);
      }
      socketListenerRef.current = handleSocketMessage;
      wbsocket.addEventListener('message', handleSocketMessage);
    }

    return () => {
      if (wbsocket) {
        wbsocket.removeEventListener('message', handleSocketMessage);
      }
    };
  }, [wbsocket, session]);

  useEffect(() => {
    getUserOrders();
    if (orderId !== undefined && orderId !== '') {
      getOrderByOrderId(orderId, 'onload');
    }
  }, [orderId]);


  const getOrderByOrderId = async (orderid: any, type: string) => {
    let userOrder: any = await fetch(`${process.env.NEXT_PUBLIC_BASEURL}/p2p/order?orderid=${orderid}`, {
      method: "GET",
      headers: {
        "Authorization": props.session?.user?.access_token
      },
    }).then(response => response.json());

    setOrderDetail(userOrder?.data);
    if (userOrder?.data) {
      // if (userOrder?.data?.status === 'isCompleted' && userOrder?.data?.sell_user_id === session?.user?.user_id) {
      //   toast.info('Payment released by buyer.')
      // }
      // if (userOrder?.data?.status === 'isProcess' && userOrder?.data?.sell_user_id === session?.user?.user_id) {
      //   toast.info('Third party user buy assets')
      // }
      if (userOrder?.data?.status === 'isReleased' && userOrder?.data?.buy_user_id === session?.user?.user_id) {
        if (type === 'socket') {
          setActive1(true);
        }
      }
    }
  }

  const getUserOrders = async () => {
    let userAllOrderList = await fetch(`${process.env.NEXT_PUBLIC_BASEURL}/p2p/orderlist?userid=${props.session?.user?.user_id}&itemOffset=0&itemsPerPage=20`, {
      method: "GET",
      headers: {
        "Authorization": props.session?.user?.access_token
      },
    }).then(response => response.json());

    setNewOrderList(userAllOrderList?.data);

  }

  return (
    <>
      <ToastContainer limit={1} />
      <P2pLayout>
        {
          (props?.userOrder !== null)
            ?
            <>
              <div className='mt-30 flex items-start gap-30'>
                <div className='max-[1200px]:max-w-full max-w-[75%] w-full'>
                  <OrderInfo userOrder={order} />
                  <SlectPaymentMethod userOrder={order} setPaymentMethod={setPaymentMethod} />
                  <Remarks paymentMethod={paymentMethod} orderid={order?.id} userOrder={order} getUserOrders={getUserOrders} />
                </div>
                <ChatBox sellerUser={order?.user_post?.user?.id === props.session?.user?.user_id ? order?.user : order?.user_post?.user} order={order} />
              </div>
              {
                active1 &&
                <Successfull setShow={setShow} setActive1={setActive1} type="release" sellerUser={order?.user_post?.user?.id === props.session?.user?.user_id ? "released" : "received"} />
              }
            </>
            :
            <OrdersTabs orderList={newOrderList} userPaymentMethod={props.userPaymentMethod} coinList={props?.coinList} masterPayMethod={props.masterPayMethod} setOrderId={setOrderId} />
        }

      </P2pLayout>
    </>

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

    let userAllOrderList = await fetch(`${process.env.NEXT_PUBLIC_BASEURL}/p2p/orderlist?userid=${session?.user?.user_id}&itemOffset=0&itemsPerPage=10`, {
      method: "GET",
      headers: {
        "Authorization": session?.user?.access_token
      },
    }).then(response => response.json());

    // get UserPaymentMethod
    let userPaymentMethod = await fetch(`${process.env.NEXT_PUBLIC_BASEURL}/p2p/userpaymentmethod`, {
      method: "GET",
      headers: {
        "Authorization": session?.user?.access_token
      },
    }).then(response => response.json());


    // get all coin list
    let tokenList = await fetch(`${process.env.NEXT_PUBLIC_BASEURL}/token`, {
      method: "GET"
    }).then(response => response.json());


    // get masterPaymentMethod 
    let masterPaymentMethod = await fetch(`${process.env.NEXT_PUBLIC_BASEURL}/p2p/masterpayment`, {
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
        masterPayMethod: masterPaymentMethod?.data || [],
        userPaymentMethod: userPaymentMethod?.data || [],
        orderList: userAllOrderList?.data || [],
        coinList: tokenList?.data || [],
      },
    };
  }

  return {
    redirect: { destination: "/" },
  };

}