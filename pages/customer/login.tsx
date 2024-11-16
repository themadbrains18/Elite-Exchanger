import SignIn from '@/components/login-register/signIn'
import React from 'react'
import { getProviders, getSession } from "next-auth/react"
import { getServerSession } from "next-auth/next"
import { GetServerSidePropsContext, InferGetServerSidePropsType } from 'next'
import { authOptions } from "../api/auth/[...nextauth]";
import Meta from '@/components/snippets/meta'

/**
 * Login Page Component.
 * This component renders the login page for the crypto platform.
 * It displays the SignIn component for users to log in with their credentials.
 * 
 * @param {InferGetServerSidePropsType<typeof getServerSideProps>} providers - Providers fetched from NextAuth.
 * @returns {JSX.Element} The rendered login page with a SignIn form.
 */
const Login = ({ providers }: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  return (
    <>
    <Meta title='Log In | Crypto Planet' description='Log in to your account to access your crypto portfolio and trading dashboard. Enjoy secure access to your favorite features and manage your investments with ease. If you encounter any issues, our support team is here to help!'/>
      <SignIn loginType='user'/>
    </>
  )
}

export default Login;

/**
 * getServerSideProps function to fetch session and provider data on the server side.
 * It checks if the user is already logged in by fetching the session data.
 * If the user is logged in, they are redirected to the profile page.
 * Otherwise, the providers are fetched and passed as props to the Login component.
 * 
 * @param {GetServerSidePropsContext} context - The context object containing request and response objects.
 * @returns {Promise<{props: object}>} The props containing the providers and a secret key.
 */
export async function getServerSideProps(context: GetServerSidePropsContext) {
  const { req } = context

  // Fetch session data
  const session = await getServerSession(context.req, context.res, authOptions);
  
  // Fetch authentication providers
  const providers = await getProviders()

  // Redirect to profile if session exists (user is logged in)
  if (session) {
    return {
      redirect: { destination: "/profile" },
    }
  }

  // Return props with providers and secret key if no session exists
  return {
    props: {
      providers,
      secretKey: process.env.SECRET_REQUEST_SECRETPASS
    },
  }
}