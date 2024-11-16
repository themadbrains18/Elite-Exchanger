import P2pLayout from '@/components/layout/p2p-layout'
import Adverstisement from '@/components/p2p/postadv/adverstisement'
import React, { useEffect, useState } from 'react'
import { getProviders, useSession } from "next-auth/react"
import { getServerSession } from "next-auth/next"
import { GetServerSidePropsContext, InferGetServerSidePropsType } from 'next'
import { authOptions } from '../../api/auth/[...nextauth]';
import Meta from '@/components/snippets/meta'

interface propsData {
  masterPayMethod?: any;  // Master payment methods available for the user
  userPaymentMethod?: any;  // User's payment methods
  tokenList?: any;  // List of available tokens for trading
  assets?: any;  // User's asset details
  session?: any;  // Session data for authentication and user details
}

const Postad = (props: propsData) => {

  const { status, data: session } = useSession();
  const [show, setShow] = useState(false);
  const [active, setActive] = useState(false);

  useEffect(() => {
    if (session?.user?.kyc !== 'approve' || session?.user?.TwoFA === false) {
      setShow(true);
      setActive(true);
    }
  }, []);


  return (
    <>
      <Meta title='Crypto Advertisements | Crypto Planet' description='Discover the latest crypto advertisements and promotions in one place! Browse exclusive offers, trading bonuses, and investment opportunities tailored for crypto enthusiasts. Stay informed and seize the best deals to maximize your trading experience. Check out our advertisement list today!' />
      <P2pLayout>
        {(session?.user?.kyc === 'approve' || session?.user?.TwoFA === true || (session?.user?.tradingPassword !== '' || session?.user?.tradingPassword !== null) || (session?.user?.email !== '' || session?.user?.email !== null)) &&
          <Adverstisement masterPayMethod={props.masterPayMethod} userPaymentMethod={props.userPaymentMethod} tokenList={props.tokenList} assets={props.assets} session={props?.session} />
        }
      </P2pLayout>
    </>
  )
}

export default Postad

/**
 * getServerSideProps
 * 
 * Fetches data needed before rendering the page on the server side.
 * - Retrieves session and user data from the server.
 * - Fetches the list of payment methods, tokens, and assets for the authenticated user.
 */
export async function getServerSideProps(context: GetServerSidePropsContext) {
  const { req } = context;
  const session = await getServerSession(context.req, context.res, authOptions);
  const providers = await getProviders()

  if (session) {

     // Fetch master payment methods (e.g., payment options supported for crypto transactions)
    let masterPaymentMethod = await fetch(`${process.env.NEXT_PUBLIC_BASEURL}/p2p/masterpayment`, {
      method: "GET",
      headers: {
        "Authorization": session?.user?.access_token
      },
    }).then(response => response.json());

    // Fetch user-specific payment methods
    let userPaymentMethod = await fetch(`${process.env.NEXT_PUBLIC_BASEURL}/p2p/userpaymentmethod`, {
      method: "GET",
      headers: {
        "Authorization": session?.user?.access_token
      },
    }).then(response => response.json());

    // Fetch the list of available tokens for trading (e.g., crypto assets)
    let tokenList = await fetch(`${process.env.NEXT_PUBLIC_BASEURL}/token`, {
      method: "GET"
    }).then(response => response.json());

    // Fetch user assets (e.g., crypto holdings, balances)
    let userAssets = await fetch(`${process.env.NEXT_PUBLIC_BASEURL}/user/assets?userid=${session?.user?.user_id}`, {
      method: "GET",
      headers: {
        "Authorization": session?.user?.access_token
      },
    }).then(response => response.json());

    return {
      props: {
        providers: providers,
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