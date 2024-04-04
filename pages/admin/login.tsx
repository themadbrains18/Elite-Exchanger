import SignIn from '@/components/login-register/signIn'
// import { GetServerSidePropsContext } from 'next'
// import { getServerSession } from 'next-auth'
import React from 'react'
// import { authOptions } from '../api/auth/[...nextauth]'
// import { getProviders } from 'next-auth/react'

const Login = () => {
  return (
    <>
      <SignIn loginType='admin' />
    </>
  )
}

export default Login

