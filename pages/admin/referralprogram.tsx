import DasboardLayout from '@/components/layout/dasboard-layout'
import React from 'react'
// import MainProgram from '@/admin/admin-component/referralProgram/program'

import { GetServerSidePropsContext } from "next";
import { authOptions } from "../api/auth/[...nextauth]";
import { getServerSession } from "next-auth";
import { getProviders } from "next-auth/react";
import dynamic from 'next/dynamic';
import TableSkeleton from '@/components/skeletons/tableSkeleton';

interface propsData {
    coinList?: any;
}

/**
 * MainProgram Component (Dynamically Loaded)
 * 
 * The `MainProgram` component is dynamically loaded with a custom loading skeleton 
 * that displays while the component is loading. This component is responsible 
 * for rendering the main referral program UI.
 */
const MainProgram = dynamic(() => import('@/admin/admin-component/referralProgram/program'), {
    loading: () => <TableSkeleton/>, // Custom loading component or spinner
  });
  

  /**
 * ReferralProgram Component
 * 
 * This component renders the `DasboardLayout` and the `MainProgram` component.
 * It passes the `coinList` data as a prop to the `MainProgram` component for rendering.
 * 
 * @param props - The props object containing `coinList`.
 * @returns JSX element rendering the dashboard layout and the referral program.
 */
const ReferralProgram = (props: propsData) => {
    return (
        <DasboardLayout>
            <MainProgram coinList={props.coinList} />
        </DasboardLayout>
    )
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
    const { req } = context;
    const session = await getServerSession(context.req, context.res, authOptions);
    const providers = await getProviders();

    /**
     * Server-side logic to check for a valid session and fetch data.
     * 
     * If a valid session exists, fetch the token list from the API and 
     * pass it as `coinList` to the component.
     * 
     * @param context - The context containing request and response.
     * @returns props with session data and token list or redirect to login.
     */
    if (session) {
        let tokenList = await fetch(
            `${process.env.NEXT_PUBLIC_BASEURL}/token/admin`,
            {
                method: "GET",
            }
        ).then((response) => response.json());


        return {
            props: {
                session: session,
                sessions: session,
                provider: providers,
                coinList: tokenList?.data || [],
            },
        };
    }
    else {
        return {
            redirect: { destination: "/login" },
        };
    }


}

export default ReferralProgram