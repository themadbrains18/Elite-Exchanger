import ResetPassword from '@/components/login-register/resetPassword'
import Meta from '@/components/snippets/meta'
import React from 'react'

const Forget = () => {
  return (
    <>
    <Meta title='Reset Your Password | Recover Your Account Securely' description='Forgot your password? No problem! Enter your email address to receive a secure link for resetting your password. Regain access to your account quickly and easily. Your security is our priority!'/>
      <ResetPassword />
    </>
  )
}

export default Forget