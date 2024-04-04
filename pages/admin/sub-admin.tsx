import { GetServerSidePropsContext } from 'next';
import DasboardLayout from '../../components/layout/dasboard-layout'
import React from 'react'
import { authOptions } from '../api/auth/[...nextauth]';
import { getServerSession } from 'next-auth';
import { getProviders } from 'next-auth/react';

const SubAdmin = () => {
  return (
    <DasboardLayout>
        <div>SubAdmin</div>
    </DasboardLayout>
  )
}

export default SubAdmin;

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