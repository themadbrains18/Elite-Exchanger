import P2pLayout from '@/components/layout/p2p-layout'
import EditAdverstisement from '@/components/p2p/editadv/editadvertisement'
import React, { useEffect, useState } from 'react'
import { getProviders, useSession } from "next-auth/react"
import { getServerSession } from "next-auth/next"
import { GetServerSidePropsContext, InferGetServerSidePropsType } from 'next'
import { authOptions } from '../api/auth/[...nextauth]';
import { useRouter } from 'next/router'

interface propsData {
    masterPayMethod?: any;
    userPaymentMethod?: any;
    tokenList?: any;
    assets?: any;
    session?: any;
}

const EditPostad = (props: propsData) => {
    const router = useRouter();
    const { postid } = router.query;
    const [editPost, setEditPost] = useState(Object);

    const { status, data: session } = useSession();

    useEffect(() => {
        getPostadsByPostId();
    }, []);

    const getPostadsByPostId = async () => {

        let userPost = await fetch(`${process.env.NEXT_PUBLIC_BASEURL}/p2p/editadvertisement?postid=${postid}`, {
            method: "GET",
            headers: {
                "Authorization": session !== undefined ? session?.user?.access_token : props?.session?.user?.access_token
            },
        }).then(response => response.json());

        if (userPost?.data) {
            setEditPost(userPost?.data);
        }
        else {

        }

    }

    return (
        <P2pLayout>
            <EditAdverstisement masterPayMethod={props.masterPayMethod} userPaymentMethod={props.userPaymentMethod} tokenList={props.tokenList} assets={props.assets} editPost={editPost} />
        </P2pLayout>
    )
}

export default EditPostad

export async function getServerSideProps(context: GetServerSidePropsContext) {
    const { req } = context;
    const session = await getServerSession(context.req, context.res, authOptions);
    const providers = await getProviders()

    if (session) {

        // masterpayment
        let masterPaymentMethod = await fetch(`${process.env.NEXT_PUBLIC_BASEURL}/p2p/masterpayment`, {
            method: "GET",
            headers: {
                "Authorization": session?.user?.access_token
            },
        }).then(response => response.json());

        let userPaymentMethod = await fetch(`${process.env.NEXT_PUBLIC_BASEURL}/p2p/userpaymentmethod`, {
            method: "GET",
            headers: {
                "Authorization": session?.user?.access_token
            },
        }).then(response => response.json());

        let tokenList = await fetch(`${process.env.NEXT_PUBLIC_BASEURL}/token`, {
            method: "GET"
        }).then(response => response.json());

        let userAssets = await fetch(`${process.env.NEXT_PUBLIC_BASEURL}/user/assets?userid=${session?.user?.user_id}`, {
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
                masterPayMethod: masterPaymentMethod?.data || [],
                userPaymentMethod: userPaymentMethod?.data || [],
                tokenList: tokenList?.data || [],
                assets: userAssets || [],
            },
        };
    }
    return {
        redirect: { destination: "/" },
    };

}