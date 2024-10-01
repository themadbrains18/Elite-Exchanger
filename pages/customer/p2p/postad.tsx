import P2pLayout from '@/components/layout/p2p-layout'
import Adverstisement from '@/components/p2p/postadv/adverstisement'
import React, { useEffect, useState } from 'react'
import { getProviders, useSession } from "next-auth/react"
import { getServerSession } from "next-auth/next"
import { GetServerSidePropsContext, InferGetServerSidePropsType } from 'next'
import { authOptions } from '../../api/auth/[...nextauth]';
import AuthenticationModelPopup from '@/components/snippets/authenticationPopup'
import Meta from '@/components/snippets/meta'

interface propsData {
  masterPayMethod?: any;
  userPaymentMethod?: any;
  tokenList?: any;
  assets?: any;
  session?:any
}

const Postad = (props: propsData) => {

  const { status, data: session } = useSession();
  const [show, setShow] = useState(false);
  const [active, setActive] = useState(false);

  useEffect(()=>{
    if(session?.user?.kyc !== 'approve' || session?.user?.TwoFA === false){
      setShow(true);
      setActive(true);
    }
  },[]);


  return (
    <>
    <Meta title='Crypto Advertisements | Crypto Planet' description='Discover the latest crypto advertisements and promotions in one place! Browse exclusive offers, trading bonuses, and investment opportunities tailored for crypto enthusiasts. Stay informed and seize the best deals to maximize your trading experience. Check out our advertisement list today!'/>

    <P2pLayout>
      {(session?.user?.kyc === 'approve' ||  session?.user?.TwoFA === true || (session?.user?.tradingPassword !== '' || session?.user?.tradingPassword !== null) || (session?.user?.email !== '' || session?.user?.email !== null)) && 
        <Adverstisement masterPayMethod={props.masterPayMethod} userPaymentMethod={props.userPaymentMethod} tokenList={props.tokenList} assets={props.assets} session={props?.session}/>
      }

      {/* {(session?.user?.kyc !== 'approve' || session?.user?.TwoFA === false || (session?.user?.tradingPassword === '' || session?.user?.tradingPassword === null) || (session?.user?.email === '' || session?.user?.email === null)) &&
        <AuthenticationModelPopup title='Confirmation' message='Please complete your kyc' setShow={setShow} setActive={setActive} show={show} />
        } */}

    </P2pLayout>
        </>
  )
}

export default Postad

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