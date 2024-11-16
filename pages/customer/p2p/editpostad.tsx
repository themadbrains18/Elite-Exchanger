import P2pLayout from '@/components/layout/p2p-layout'
import EditAdverstisement from '@/components/p2p/editadv/editadvertisement'
import React, { useEffect, useState } from 'react'
import { getProviders, useSession } from "next-auth/react"
import { getServerSession } from "next-auth/next"
import { GetServerSidePropsContext, InferGetServerSidePropsType } from 'next'
import { authOptions } from '../../api/auth/[...nextauth]';
import { useRouter } from 'next/router'
import Meta from '@/components/snippets/meta'

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

    /**
     * useEffect hook to fetch and update the post advertisement data when the component is mounted.
     * This effect runs once on component mount to get the advertisement details for the given post ID.
     */
    useEffect(() => {
        getPostadsByPostId();
    }, []);

    /**
     * Fetches advertisement details for a specific post ID and updates the state with the result.
     * 
     * @async
     * @function getPostadsByPostId
     * @returns {Promise<void>} Updates the state with the fetched advertisement data.
     * 
     * This function makes a GET request to fetch advertisement data for the given `postid`.
     * Upon a successful response, it updates the `editPost` state with the fetched data.
     * If no data is returned, it does nothing (can be enhanced with error handling).
     */
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
        <>
            <Meta title='Crypto Advertisements | Crypto Planet' description='Discover the latest crypto advertisements and promotions in one place! Browse exclusive offers, trading bonuses, and investment opportunities tailored for crypto enthusiasts. Stay informed and seize the best deals to maximize your trading experience. Check out our advertisement list today!' />
            <P2pLayout>
                <EditAdverstisement masterPayMethod={props.masterPayMethod} userPaymentMethod={props.userPaymentMethod} tokenList={props.tokenList} assets={props.assets} editPost={editPost} />
            </P2pLayout>
        </>
    )
}

export default EditPostad

/**
 * Server-side function to fetch necessary data for the page before rendering.
 * It fetches session information, provider data, and various other API data including 
 * master payment methods, user payment methods, token list, and user assets.
 * 
 * @async
 * @function getServerSideProps
 * @param {GetServerSidePropsContext} context - The context object containing request and response data.
 * @returns {Promise<{props: Object}>} Returns an object with props to be passed to the page component.
 * If the user is not authenticated, redirects to the home page.
 */
export async function getServerSideProps(context: GetServerSidePropsContext) {
    const { req } = context;
    const session = await getServerSession(context.req, context.res, authOptions);
    const providers = await getProviders()

    if (session) {

        /**
         * Fetches the list of available master payment methods for P2P transactions.
         * @returns {Promise<Object>} The master payment methods data.
         */
        let masterPaymentMethod = await fetch(`${process.env.NEXT_PUBLIC_BASEURL}/p2p/masterpayment`, {
            method: "GET",
            headers: {
                "Authorization": session?.user?.access_token
            },
        }).then(response => response.json());

         /**
         * Fetches the user's payment method data.
         * @returns {Promise<Object>} The user-specific payment methods data.
         */
        let userPaymentMethod = await fetch(`${process.env.NEXT_PUBLIC_BASEURL}/p2p/userpaymentmethod`, {
            method: "GET",
            headers: {
                "Authorization": session?.user?.access_token
            },
        }).then(response => response.json());

        /**
         * Fetches the list of available tokens.
         * @returns {Promise<Object>} The list of available tokens.
         */
        let tokenList = await fetch(`${process.env.NEXT_PUBLIC_BASEURL}/token`, {
            method: "GET"
        }).then(response => response.json());

        /**
         * Fetches the assets of the logged-in user.
         * @returns {Promise<Object>} The user's asset data.
         */
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