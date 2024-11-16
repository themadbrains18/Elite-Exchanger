import P2pLayout from '@/components/layout/p2p-layout';
import AdvertisementTabs from '@/components/p2p/my-advertisement/advertisement-tabs';
import React from 'react'
import { getProviders } from "next-auth/react"
import { getServerSession } from "next-auth/next"
import { GetServerSidePropsContext } from 'next'
import { authOptions } from '../../api/auth/[...nextauth]';
import { useRouter } from 'next/router';
import Meta from '@/components/snippets/meta';

interface propsData {
  // posts?: any;
  masterPayMethod?: any;
  userPaymentMethod?: any;
  coinList?: any;
  session?: any;
}

/**
 * MyAdvertisement component displays the user's advertisements.
 * It includes functionality for managing payment methods, viewing advertisements, 
 * and interacting with the P2P advertisement tabs.
 * 
 * @param {propsData} props - The props object contains the user's session, payment methods, available coins, etc.
 * @returns {JSX.Element} The rendered MyAdvertisement page with advertisement management options.
 */
const MyAdvertisement = (props: propsData) => {
  const router = useRouter()
  return (
    <>
      <Meta title='Crypto Advertisements | Crypto Planet' description='Discover the latest crypto advertisements and promotions in one place! Browse exclusive offers, trading bonuses, and investment opportunities tailored for crypto enthusiasts. Stay informed and seize the best deals to maximize your trading experience. Check out our advertisement list today!' />
      <P2pLayout>
        <AdvertisementTabs userPaymentMethod={props.userPaymentMethod} coinList={props?.coinList} masterPayMethod={props.masterPayMethod} session={props?.session} />
      </P2pLayout>
    </>

  )
}

export default MyAdvertisement;

/**
 * getServerSideProps is used to fetch the necessary data for the MyAdvertisement page.
 * It retrieves session data, payment methods, coin list, and related information 
 * required to display user advertisements.
 * 
 * @async
 * @function getServerSideProps
 * @param {GetServerSidePropsContext} context - The context object containing request and response data.
 * @returns {Promise<{props: Object}>} Returns an object with props to be passed to the page component.
 */
export async function getServerSideProps(context: GetServerSidePropsContext) {
  const { req } = context;
  const session = await getServerSession(context.req, context.res, authOptions);
  const providers = await getProviders()

  /**
  * Fetches the master payment methods publically.
  * @returns {Promise<Object>} The user's asset data.
  */
  let masterPaymentMethod = await fetch(`${process.env.NEXT_PUBLIC_BASEURL}/p2p/masterpayment`, {
    method: "GET",
    headers: {
      "Authorization": session?.user?.access_token
    },
  }).then(response => response.json());

  /**
  * Fetches the token list publically.
  * @returns {Promise<Object>} The user's asset data.
  */
  let tokenList = await fetch(`${process.env.NEXT_PUBLIC_BASEURL}/token`, {
    method: "GET"
  }).then(response => response.json());

  if (session) {
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

    return {
      props: {
        providers: providers,
        session: session,
        // posts: userPosts?.data || [],
        masterPayMethod: masterPaymentMethod?.data || [],
        userPaymentMethod: userPaymentMethod?.data || [],
        coinList: tokenList?.data || [],
      },
    };
  }
  return {
    redirect: { destination: "/" },
  };

}