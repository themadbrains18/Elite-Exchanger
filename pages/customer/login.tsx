import SignIn from '@/components/login-register/signIn'
import React from 'react'
import { getProviders, getSession } from "next-auth/react"
import { getServerSession } from "next-auth/next"
import { GetServerSidePropsContext, InferGetServerSidePropsType } from 'next'
import { authOptions } from "../api/auth/[...nextauth]";
import ReEnterpass from '@/components/login-register/re-enterpass'


const Login = ({ providers }: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  return (
    <>
      <SignIn loginType='user'/>
      {/* <ReEnterpass /> */}
      
    </>
  )
}

export default Login;

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const { req } = context
  const session = await getServerSession(context.req, context.res, authOptions);
  
  const providers = await getProviders()
  if (session) {
    return {
      redirect: { destination: "/profile" },
    }
  }
  return {
    props: {
      providers,
      secretKey: process.env.SECRET_REQUEST_SECRETPASS
    },
  }
}