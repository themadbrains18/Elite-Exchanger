import P2pLayout from '@/components/layout/p2p-layout'
import BuySellExpress from '@/components/p2p/express/buySellExpress'
import { GetServerSidePropsContext } from 'next'
import React from 'react'
import { authOptions } from '../../api/auth/[...nextauth]'
import { getServerSession } from 'next-auth'
import { getProviders } from 'next-auth/react'
import Meta from '@/components/snippets/meta'

interface Session {
  session: {
    user: any
  },
  provider: any,
  coinList: any,
  posts?: any;
  masterPayMethod?: any;
  assets: any
}

/**
 * Page component for the P2P Express Buy/Sell functionality.
 * Renders the P2P layout with the express buy/sell functionality.
 * 
 * @param {Session} props - The props passed into the component including user session data,
 *                            available coins, posts, payment methods, and assets.
 * @returns {JSX.Element} The JSX to render the page.
 */
const Express = (props: Session) => {
  return (
    <>
      <Meta title='Crypto Planet P2P Trading | Buy Crypto via Express' description='Crypto Planet Buy Crypto via Express' />
      <P2pLayout>
        <BuySellExpress coins={props?.coinList} session={props?.session} posts={props?.posts} masterPayMethod={props?.masterPayMethod} assets={props?.assets} />
      </P2pLayout>
    </>
  )
}

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
  const providers = await getProviders();

  /**
  * Fetches the token list publically.
  * @returns {Promise<Object>} The user's asset data.
  */
  let tokenList = await fetch(`${process.env.NEXT_PUBLIC_BASEURL}/token`, {
    method: "GET"
  }).then(response => response.json());

  /**
  * Fetches the master payment methods publically.
  * @returns {Promise<Object>} The user's asset data.
  */
  let masterPaymentMethod = await fetch(`${process.env.NEXT_PUBLIC_BASEURL}/p2p/masterpayment`, {
    method: "GET",
    headers: {
      "Authorization": ''
    },
  }).then(response => response.json());

  let userAssets: any = [];
  let allPosts: any = [];
  allPosts = await fetch(`${process.env.NEXT_PUBLIC_BASEURL}/p2p/all?user_id=${session?.user?.user_id}`, {
    method: "GET",

  }).then(response => response.json());
  if (session) {
    userAssets = await fetch(`${process.env.NEXT_PUBLIC_BASEURL}/user/assets?userid=${session?.user?.user_id}`, {
      method: "GET",
      headers: {
        "Authorization": session?.user?.access_token
      },
    }).then(response => response.json());


  }

  // console.log(userAssets,'-----------------userAssets');


  return {
    props: {
      session: session,
      sessions: session,
      provider: providers,
      coinList: tokenList?.data || [],
      posts: allPosts?.data || [],
      masterPayMethod: masterPaymentMethod?.data || [],
      assets: userAssets
    },
  };
}

export default Express