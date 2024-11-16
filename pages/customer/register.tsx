import SignUp from "@/components/login-register/signUp"
import Meta from "@/components/snippets/meta"

/**
 * Register Component.
 * This component renders the registration page for new users to sign up and join the platform.
 * It includes the Meta tags for SEO and dynamically renders the SignUp form component.
 *
 * @returns {JSX.Element} The rendered Register page with Meta tags and the SignUp form.
 */
const Register = () => {
  return (
    <>
    <Meta title="Welcome to Crypto Planet | Create Your Account | Join the Crypto Trading Community" description="Sign up for a new account and start your crypto trading journey today! Join our community to access real-time market data, advanced trading tools, and exclusive insights. Registration is quick, easy, and secure."/>
      <SignUp />
    </>
  )
}

export default Register