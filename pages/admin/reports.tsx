import { GetServerSidePropsContext } from 'next'
import ReportTable from '../../admin/admin-component/reports/reportTable'
import DasboardLayout from '../../components/layout/dasboard-layout'
import React from 'react'
import { getServerSession } from 'next-auth'
import { getProviders } from 'next-auth/react'
import { authOptions } from '../api/auth/[...nextauth]'

const Reports = () => {
  return (
    <DasboardLayout>
        <ReportTable />
    </DasboardLayout>
  )
}

export default Reports;


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