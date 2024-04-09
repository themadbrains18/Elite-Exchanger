import Image from "next/image";
import React, { useContext, useEffect, useState } from "react";
import Context from "../contexts/context";
import HeaderLogo from "../svg-snippets/headerLogo";
import Link from "next/link";
import { useRouter } from "next/router";
import Verification from "./verification";
import SecurityCode from "./securityCode";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AES from 'crypto-js/aes';
import StrengthCheck from "../snippets/strengthCheck";

import { useSearchParams } from 'next/navigation'

const schema = yup.object().shape({
  username: yup.string()
    .required('Email / Phone is required').matches(/^([a-zA-Z0-9_\.])+\@(([a-zA-Z0-9])+\.)+([a-zA-Z0-9]{2,4})|([0-9]{10})+$/, 'Please enter valid email(letters, number and period(.)) or phone number '),
  // .test('email_or_phone', 'Email / Phone is invalid', (value) => {
  //   return yupValidateEmail(value) || validatePhone(value);
  // }),
  password: yup.string().min(8).max(32).required().matches(/\w*[a-z]\w*/, "Password must have a small letter")
    .matches(/\w*[A-Z]\w*/, "Password must have a capital letter")
    .matches(/\d/, "Password must have a number")
    .matches(/[!+@#$%^&*()\-_"=+{}; :,<.>]/, "Password must have a special character")
    .matches(/^\S*$/, "White Spaces are not allowed"),
  confirmPassword: yup.string().oneOf([yup.ref('password'), ''], 'Passwords must match').required('Confirm Password is required'),
  refeer_code: yup.string().optional(),
  agree: yup.bool().oneOf([true], "You must accept the terms and conditions")
});

const SignUp = () => {
  const { mode } = useContext(Context);
  const [show, setShow] = useState(false);
  const [show1, setShow1] = useState(false);
  const [step, setStep] = useState(0);
  const [isEmail, setIsEmail] = useState(false);
  const [formData, setFormData] = useState({ username: '', password: '' });
  const router = useRouter();
  const searchParams = useSearchParams();
  const [sendOtpRes, setSendOtpRes] = useState<any>();
  const [btnDisabled, setBtnDisabled] = useState(false);
  const [pswd, setpswd] = useState('');

  // auto generate password
  const [passwordLength, setPasswordLength] = useState(18);
  const [useSymbols, setUseSymbols] = useState(true);
  const [useNumbers, setUseNumbers] = useState(true);
  const [useLowerCase, setUseLowerCase] = useState(true);
  const [useUpperCase, setUseUpperCase] = useState(true);

  const queryParams = searchParams.get('r');
  const referLink = searchParams.get('e');

  let { register, setValue, handleSubmit, watch, setError, clearErrors, formState: { errors } } = useForm({
    resolver: yupResolver(schema),

  });

  const validateEmail = (email: string | undefined) => {
    return yup.string().email().isValidSync(email)
  };

  // const validatePhone = (phone: string | undefined) => {
  //   return yup.number().integer().positive().test(
  //     (phone) => {
  //       return (phone && phone.toString().length >= 10 && phone.toString().length <= 14) ? true : false;
  //     }
  //   ).isValidSync(phone);
  // };

  const onHandleSubmit = async (data: any, e: any) => {
    try {
      e.preventDefault();
      setBtnDisabled(true);
      let isEmailExist = await validateEmail(data.username);

      data.confirmPassword = true;
      data.otp = "string";
      data.step = 1;
      data.referral_id = referLink;
      setIsEmail(isEmailExist);

      const ciphertext = AES.encrypt(JSON.stringify(data), `${process.env.NEXT_PUBLIC_SECRET_PASSPHRASE}`);
      let record = encodeURIComponent(ciphertext.toString());

      let userExist = await fetch(`/api/user/register`, {
        method: "POST",
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(record)
      }).then(response => response.json());

      if (userExist.data.status === 200) {
        setBtnDisabled(false);
        toast.dismiss();
        setStep(1);
        setFormData(data);
      }
      else {
        setBtnDisabled(false);
        setpswd('');
        setValue('password', '');
        setValue('confirmPassword', '');
        setValue('refeer_code', '');
        toast.error(userExist?.data?.data?.message !== undefined ? userExist?.data?.data?.message : userExist?.data?.data);
      }
    } catch (error) {
      setBtnDisabled(false);
      console.log(error);

    }
  }

  const generatePassword = () => {
    
    const lowercaseCharset = "abcdefghijklmnopqrstuvwxyz";
    const uppercaseCharset = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const numberCharset = "0123456789";
    const specialCharset = "!@#$%^&*()_+{}[];:<>,.?/";

    // Function to randomly select a character from a given charset
    function getRandomCharacter(charset:string) {
      const randomIndex = Math.floor(Math.random() * charset.length);
      return charset[randomIndex];
    }

    let password = "";

    // Include at least one character from each charset
    password += getRandomCharacter(lowercaseCharset);
    password += getRandomCharacter(uppercaseCharset);
    password += getRandomCharacter(numberCharset);
    password += getRandomCharacter(specialCharset);

    // Fill the rest of the password with random characters
    const remainingLength = passwordLength - 4; // Subtract 4 for the characters already added
    for (let i = 0; i < remainingLength; i++) {
      const randomCharset = [lowercaseCharset, uppercaseCharset, numberCharset, specialCharset][Math.floor(Math.random() * 4)];
      password += getRandomCharacter(randomCharset);
    }

    // Shuffle the password to randomize the character order
    password = password.split('').sort(() => Math.random() - 0.5).join('');

    setpswd(password);
    setValue('password', password);
    setValue('confirmPassword', password);
  };

  const random = (min = 0, max = 1) => {
    return Math.floor(Math.random() * (max + 1 - min) + min);
  };

  const randomLower = () => {
    return String.fromCharCode(random(97, 122));
  };

  const randomUpper = () => {
    return String.fromCharCode(random(65, 90));
  };

  const randomSymbol = () => {
    const symbols = "~*$%@#^&!?*'-=/,.{}()[]<>";
    return symbols[random(0, symbols.length - 1)];
  };

  useEffect(() => {
    setTimeout(() => {
      if (errors.password) {
        clearErrors('password');
      }
      if (errors.username) {
        clearErrors('username');
      }
      if (errors.confirmPassword) {
        clearErrors('confirmPassword');
      }
      if (errors.agree) {
        clearErrors('agree');
      }
    }, 3000);

    if (queryParams) {
      setValue('refeer_code', queryParams);
    }

  }, [errors, queryParams])

  return (
    <>
      <ToastContainer limit={1} />
      {
        step === 0 &&
        <section className="bg-primary-300 lg:dark:bg-black-v-1  lg:bg-bg-primary ">
          <div className="flex min-h-screen h-full gap-5 bg-[url('/assets/register/ellipsebg.svg')] bg-[length:75%]  bg-no-repeat lg:bg-none">
            <div className="max-w-full lg:max-w-[50%]  w-full lg:block hidden">
              <Image src="/assets/register/register.png" width={1018} height={1100} alt="signup" className="object-cover h-full block w-full" />
            </div>
            <div className="max-w-full lg:max-w-[50%] flex flex-col justify-center w-full  ">
              <div className="py-[30px] lg:py-[40px]  max-w-[562px] w-full my-0 pr-5 flex justify-end items-center cursor-pointer" onClick={() => { router.push("/") }}>
                <HeaderLogo />
              </div>
              <div className="lg:hidden block">
                <Image src="/assets/register/loginmobile.svg" alt="register" width={398} height={198} className="mx-auto" />
              </div>
              <div className="mt-0 lg:mt-[80px] max-[1023px]:!mx-auto lg:p-0 p-5  max-w-[calc(100%-30px)] lg:mx-0 lg:bg-[transparent] lg:dark:bg-[transparent] bg-white lg:rounded-none rounded-10 dark:bg-d-bg-primary md:max-w-[562px] w-full lg:mb-0 mb-[10px]">
                <h1 className="lg-heading mb-5 lg:mb-[70px]">Create an account</h1>

                {/**Form Start  */}
                <form onSubmit={handleSubmit(onHandleSubmit)}>
                  <div className="flex flex-col gap-[15px] lg:gap-10">
                    <input type="text" placeholder="Enter Email / Phone Number" {...register('username')} autoComplete="nope" name="username" className="input-cta" />
                    {errors.username && <p style={{ color: 'red' }}>{errors.username.message}</p>}
                    <div className="relative text-end">
                      <button type="button" className="!text-primary" onClick={() => generatePassword()}>Generate Password</button>
                    </div>
                    <div
                      className="relative"
                    >
                      <input type={`${show === true ? "text" : "password"}`} {...register('password')} 
                        name="password" placeholder="Password" className="input-cta w-full password-input" maxLength={32} autoComplete="new" onChange={(e: any) => setpswd(e.target.value)} />
                      <Image
                        data-testid="show-hide"
                        src={`/assets/register/${show === true ? "show.svg" : "hide.svg"}`}
                        alt="eyeicon"
                        width={24}
                        height={24}
                        onClick={() => {
                          setShow(!show);
                        }}
                        className="cursor-pointer absolute top-[50%] right-[20px] translate-y-[-50%]"
                      />
                    </div>
                    <StrengthCheck password={pswd} />
                    {errors.password && <p style={{ color: 'red' }}>{errors.password.message}</p>}

                    <div className="relative">
                      <input type={`${show === true ? "text" : "password"}`} placeholder="Confirm Password"  {...register('confirmPassword')} name="confirmPassword" maxLength={32} className="input-cta w-full" />
                      <Image
                        data-testid="show-hide2"
                        src={`/assets/register/${show === true ? "show.svg" : "hide.svg"}`}
                        alt="eyeicon"
                        width={24}
                        height={24}
                        onClick={() => {
                          setShow(!show);
                        }}
                        className="cursor-pointer absolute top-[50%] right-[20px] translate-y-[-50%]"
                      />
                    </div>
                    {errors.confirmPassword && <p style={{ color: 'red' }}>{errors.confirmPassword.message}</p>}
                    <input type="text" {...register('refeer_code')} disabled={queryParams !== null ? true : false} placeholder="Referal Code(Optional)" className="input-cta" />
                  </div>
                  <div className="flex mt-[30px] gap-5">
                    <input type="checkbox" id="checkbox" {...register('agree')} />
                    <label htmlFor="checkbox" className=" cursor-pointer sm-text text-[14px] md:text-[16px] text-gamma dark:text-white ">
                      By Register i agree that i’m 18 years of age or older, ot the{" "}
                      <Link href="#" className="!text-primary">
                        User Agreements, Privacy Policy, Cookie Policy.
                      </Link>
                    </label>
                  </div>
                  {errors.agree && <p style={{ color: 'red' }}>{errors.agree.message}</p>}
                  <button type="submit" className="my-[30px] lg:my-[50px] solid-button w-full " disabled={btnDisabled}>{btnDisabled &&
                    <svg aria-hidden="true" role="status" className="inline w-4 h-4 me-3 text-white animate-spin" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="#E5E7EB" />
                      <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentColor" />
                    </svg>
                  }Register</button>
                </form>


                {/**Form End  */}
                <div className="flex justify-center">
                  <p className="sec-text text-nav-primary dark:text-white">Already have an account?&nbsp;</p>
                  <Link href="/login" className="sec-text !text-primary">
                    Sign in
                  </Link>
                </div>
                {/* <div className="mt-[30px] md:mt-[70px]">
                  <div className="flex gap-5 items-center justify-center">
                    <span className="border border-footer-text max-w-[79px] md:max-w-[192px] w-full h-[1px]"></span>
                    <p className="md-text !text-gamma dark:!text-white">or continue with</p>
                    <span className="border border-footer-text max-w-[79px] md:max-w-[192px] w-full h-[1px]"></span>
                  </div>
                  <div className="my-5 md:my-[50px] flex gap-10 justify-center">
                    <div className="group p-[10px] md:p-[17px] max-w-[50px] md:max-w-[70px] w-full rounded-10 border border-[transparent]  transition  bg-grey dark:bg-black-v-1 lg:dark:bg-d-bg-primary hover:bg-primary-100 hover:border-primary">
                      <Image src="/assets/register/google.svg" alt="google" width={36} height={36} className=" group-hover:scale-110 duration-300" />
                    </div>
                    <div className="p-[10px] md:p-[17px] max-w-[50px] md:max-w-[70px] w-full rounded-10 border border-[transparent] transition  hover:!border-primary group bg-grey dark:bg-black-v-1 lg:dark:bg-d-bg-primary hover:bg-primary-100">
                      <svg width="30" height="31" viewBox="0 0 30 31" fill="transparent" xmlns="http://www.w3.org/2000/svg" className="group-hover:scale-110 duration-300">
                        <g clipPath="url(#clip0_2908_17411)">
                          <path d="M20.7725 0.3125C20.8424 0.3125 20.9122 0.3125 20.9859 0.3125C21.1572 2.42816 20.3497 4.00898 19.3682 5.15376C18.4053 6.29063 17.0866 7.39325 14.9538 7.22595C14.8115 5.14059 15.6204 3.67701 16.6005 2.53487C17.5095 1.47045 19.1759 0.523276 20.7725 0.3125Z" fill={mode == "dark" ? "white" : "black"} />
                          <path
                            d="M27.2294 22.3335C27.2294 22.3545 27.2294 22.373 27.2294 22.3927C26.63 24.2081 25.775 25.7638 24.7317 27.2077C23.7793 28.5184 22.6121 30.2824 20.528 30.2824C18.7272 30.2824 17.5311 29.1244 15.6855 29.0928C13.7331 29.0612 12.6595 30.061 10.8745 30.3127C10.6703 30.3127 10.4661 30.3127 10.2659 30.3127C8.95512 30.123 7.89729 29.0849 7.12664 28.1496C4.85421 25.3858 3.09819 21.8157 2.77148 17.2472C2.77148 16.7993 2.77148 16.3527 2.77148 15.9048C2.90981 12.6351 4.49853 9.97673 6.61024 8.68836C7.72472 8.00334 9.25679 7.41975 10.9628 7.68059C11.6939 7.79388 12.4408 8.04418 13.0956 8.29184C13.716 8.53028 14.4919 8.95315 15.227 8.93075C15.725 8.91626 16.2203 8.65675 16.7222 8.47363C18.1924 7.94274 19.6336 7.33413 21.5332 7.61999C23.8161 7.96514 25.4365 8.9795 26.4377 10.5445C24.5064 11.7736 22.9796 13.6258 23.2405 16.7887C23.4723 19.6619 25.1427 21.3428 27.2294 22.3335Z"
                            fill={mode == "dark" ? "white" : "black"}
                          />
                        </g>
                        <defs>
                          <clipPath id="clip0_2908_17411">
                            <rect width="30" height="30" fill="white" transform="translate(0 0.3125)" />
                          </clipPath>
                        </defs>
                      </svg>
                    </div>

                    <div className="group p-[10px] md:p-[17px] max-w-[50px] md:max-w-[70px] w-full rounded-10 border border-[transparent]  transition  bg-grey dark:bg-black-v-1 lg:dark:bg-d-bg-primary hover:bg-primary-100 hover:border-primary">
                      <Image src="/assets/register/fb.svg" alt="fb" width={36} height={36} className=" group-hover:scale-110 duration-300" />
                    </div>
                  </div>
                </div> */}
              </div>
            </div>
          </div>
        </section>
      }
      {
        step === 1 &&
        <span data-testid="verification-modal">
          <Verification step={step} setStep={setStep} isEmail={isEmail} formData={formData} api='register' setSendOtpRes={setSendOtpRes} />
        </span>
      }
      {
        step === 2 &&
        <SecurityCode formData={formData} isEmail={isEmail} api='register' sendOtpRes={sendOtpRes} />
      }
    </>
  );
};

export default SignUp;
