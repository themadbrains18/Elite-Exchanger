// import AdminSettings from '@/admin/admin-component/settings/adminSettings'
import DasboardLayout from '@/components/layout/dasboard-layout'
import { GetServerSidePropsContext } from 'next'
import React from 'react'
import { authOptions } from '../api/auth/[...nextauth]'
import { getServerSession } from 'next-auth'
import { getProviders } from 'next-auth/react'
import dynamic from 'next/dynamic'
import SecuritySkeleton from '@/components/skeletons/securitySkeleton'


const AdminSettings = dynamic(() => import('@/admin/admin-component/settings/adminSettings'), {
  loading: () => <SecuritySkeleton/>, // Custom loading component or spinner

});


const Settings = () => {
  return (
    <DasboardLayout>
      <AdminSettings />
    </DasboardLayout>
  )
}

export default Settings;


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