import ResetPassword from '@/components/login-register/resetPassword'
import Meta from '@/components/snippets/meta'
import React from 'react'

/**
 * Forget Component.
 * This component renders the forget password page where users can reset their password
 * securely. It includes a meta tag to set the title and description for SEO purposes,
 * and a `ResetPassword` component to handle the password reset functionality.
 * 
 * @returns {JSX.Element} The rendered Forget Password page.
 */
const Forget = () => {
  return (
    <>
    <Meta title='Reset Your Password | Recover Your Account Securely' description='Forgot your password? No problem! Enter your email address to receive a secure link for resetting your password. Regain access to your account quickly and easily. Your security is our priority!'/>
      <ResetPassword />
    </>
  )
}

export default Forget