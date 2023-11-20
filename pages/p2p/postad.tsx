import P2pLayout from '@/components/layout/p2p-layout'
import Adverstisement from '@/components/p2p/postadv/adverstisement'
import React, { useEffect, useState } from 'react'
import { getProviders, useSession } from "next-auth/react"
import { getServerSession } from "next-auth/next"
import { GetServerSidePropsContext, InferGetServerSidePropsType } from 'next'
import { authOptions } from '../api/auth/[...nextauth]';
import AuthenticationModelPopup from '@/components/snippets/authenticationPopup'

interface propsData {
  masterPayMethod?: any;
  userPaymentMethod?: any;
  tokenList?: any;
  assets?: any;
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
    <P2pLayout>
      {(session?.user?.kyc === 'approve' ||  session?.user?.TwoFA === true || (session?.user?.tradingPassword !== '' || session?.user?.tradingPassword !== null) || (session?.user?.email !== '' || session?.user?.email !== null)) && 
        <Adverstisement masterPayMethod={props.masterPayMethod} userPaymentMethod={props.userPaymentMethod} tokenList={props.tokenList} assets={props.assets} />
      }

      {(session?.user?.kyc !== 'approve' || session?.user?.TwoFA === false || (session?.user?.tradingPassword === '' || session?.user?.tradingPassword === null) || (session?.user?.email === '' || session?.user?.email === null)) &&
        <AuthenticationModelPopup title='Confirmation' message='Please complete your kyc' setShow={setShow} setActive={setActive} show={show} />
      }

    </P2pLayout>
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
        sessions: session,
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