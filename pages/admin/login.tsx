import SignIn from '@/components/login-register/signIn'
import { GetServerSidePropsContext } from 'next'
import { getServerSession } from 'next-auth'
import React from 'react'
import { authOptions } from '../api/auth/[...nextauth]'
import { getProviders } from 'next-auth/react'

/**
 * Login Component
 * 
 * This component renders the SignIn page for the admin. It uses the `SignIn` component and passes
 * a `loginType` prop with the value 'admin' to indicate this is for admin login.
 */
const Login = () => {
  return (
    <>
      <SignIn loginType='admin' />
    </>
  )
}

export default Login;

/**
 * getServerSideProps Function
 * 
 * This function is executed server-side and performs the following tasks:
 * - It checks if there is an existing session (user is already logged in).
 * - If a session exists, the user is redirected to the homepage ("/").
 * - If no session is found, the function fetches authentication providers and a secret key
 *   from environment variables and passes them as props to the page.
 * 
 * @param context - The context object, which includes the request and response.
 * @returns props containing the authentication providers and secret key, or a redirect to the homepage if a session exists.
 */
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
}