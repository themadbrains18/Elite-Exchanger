import { GetServerSidePropsContext } from 'next'
import WalletTable from '@/admin/admin-component/wallet/walletTable';
import DasboardLayout from '../../components/layout/dasboard-layout'
import React from 'react'
import { authOptions } from '../api/auth/[...nextauth]'
import { getServerSession } from 'next-auth'
import { getProviders } from 'next-auth/react'


interface Session {
  session: any,
}

const Wallet = (props: Session) => {
  return (
    <DasboardLayout>
      <WalletTable session={props?.session} />
    </DasboardLayout>
  )
}

export default Wallet


export async function getServerSideProps(context: GetServerSidePropsContext) {
  const { req } = context;
  const session = await getServerSession(context.req, context.res, authOptions);
  const providers = await getProviders();

  if (session) {
    return {
      props: {
        session: session,
        sessions: session,
        provider: providers,
      },
    };
  }
  else {
    return {
      redirect: { destination: "/login" },
    };
  }



}