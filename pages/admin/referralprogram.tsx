import DasboardLayout from '@/components/layout/dasboard-layout'
import React from 'react'
import MainProgram from '@/admin/admin-component/referralProgram/program'

import { GetServerSidePropsContext } from "next";
import { authOptions } from "../api/auth/[...nextauth]";
import { getServerSession } from "next-auth";
import { getProviders } from "next-auth/react";

interface propsData {
    coinList?: any;
}

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

export default ReferralProgram