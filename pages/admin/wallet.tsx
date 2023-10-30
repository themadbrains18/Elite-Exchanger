import { GetServerSidePropsContext } from 'next'
import WalletTable from '../../admin/admin-component/wallet/walletTable'
import DasboardLayout from '../../components/layout/dasboard-layout'
import React from 'react'
import { authOptions } from '../api/auth/[...nextauth]'
import { getServerSession } from 'next-auth'
import { getProviders } from 'next-auth/react'


interface Session{
  orders:any,
  deposit:any,
  marketOrders:any,
  withdraw:any,
  session:any,
  assets:any,
  activityList:any
}

const Wallet = (props:Session) => {
  return (
    <DasboardLayout>
        <WalletTable  orders={props?.orders} deposit={props?.deposit} marketOrders={props?.marketOrders} withdraw={props?.withdraw} session={props?.session} assets={props?.assets} activity={props?.activityList}/>
    </DasboardLayout>
  )
}

export default Wallet


export async function getServerSideProps(context: GetServerSidePropsContext) {
  const { req } = context;
  const session = await getServerSession(context.req, context.res, authOptions);
  const providers = await getProviders();

   let withdraw = await fetch(`${process.env.NEXT_PUBLIC_APIURL}/withdraw/admin/withdrawList`, {
      method: "GET",    
    }).then(response => response.json());

   let deposit = await fetch(`${process.env.NEXT_PUBLIC_APIURL}/deposit/admin/depositList`, {
      method: "GET",    
    }).then(response => response.json());

   let orders = await fetch(`${process.env.NEXT_PUBLIC_APIURL}/p2p/admin/all`, {
      method: "GET",    
    }).then(response => response.json());

   let marketOrders = await fetch(`${process.env.NEXT_PUBLIC_APIURL}/market/admin/all`, {
      method: "GET",    
    }).then(response => response.json());

   let assets = await fetch(`${process.env.NEXT_PUBLIC_APIURL}/assets`, {
      method: "GET",    
    }).then(response => response.json());

   let activityList = await fetch(`${process.env.NEXT_PUBLIC_APIURL}/user/admin/activityList`, {
      method: "GET",    
    }).then(response => response.json());


  return {
    props: {
      session: session,
      sessions: session,
      provider: providers,
      withdraw: withdraw || [],
      marketOrders: marketOrders || [],
      deposit: deposit || [],
      orders: orders || [],
      assets: assets || [],
      activityList: activityList || [],
    },
  };
  // if (session) {

  // }
  // return {
  //   redirect: { destination: "/" },
  // };
}