import PaymentList from '@/admin/admin-component/payment/paymentList'
import DasboardLayout from '../../components/layout/dasboard-layout'
import React from 'react'
import { GetServerSidePropsContext } from 'next'
import { authOptions } from '../api/auth/[...nextauth]'
import { getServerSession } from 'next-auth'
import { getProviders } from 'next-auth/react'

const Payment = () => {
  return (
    <DasboardLayout>
        <PaymentList />
    </DasboardLayout>
  )
}

export default Payment;

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