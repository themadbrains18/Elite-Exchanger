import SignIn from '@/components/login-register/signIn'
import { GetServerSidePropsContext } from 'next'
import { getServerSession } from 'next-auth'
import React from 'react'
import { authOptions } from '../api/auth/[...nextauth]'
import { getProviders } from 'next-auth/react'

const Login = () => {
  return (
    <>
      <SignIn loginType='admin' />
    </>
  )
}

export default Login

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const { req } = context
  const session = await getServerSession(context.req, context.res, authOptions);
  
  const providers = await getProviders()
  if (session) {
    return {
      redirect: { destination: "/" },
    }
  }

  return {
    props: {
      providers,
      secretKey: process.env.SECRET_REQUEST_SECRETPASS
    },
  }
  // else{
  //   return {
  //     redirect: { destination: "/login" },
  //   }
  // }
}