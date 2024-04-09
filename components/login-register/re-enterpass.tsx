import React, { useContext, useEffect, useState } from "react";
import Context from "../contexts/context";
import Image from "next/image";
import HeaderLogo from "../svg-snippets/headerLogo";
import { useRouter } from "next/router";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { AES } from "crypto-js";
import { toast, ToastContainer } from "react-toastify";
import StrengthCheck from "../snippets/strengthCheck";
import ConfirmationModel from "../snippets/confirmation";
import StrengthCheck2 from "../snippets/strengthCheck2";


const schema = yup.object().shape({
  new_password: yup.string().min(8).max(32).required().matches(/\w*[a-z]\w*/, "Password must have a small letter")
    .matches(/\w*[A-Z]\w*/, "Password must have a capital letter")
    .matches(/\d/, "Password must have a number")
    .matches(/[!+@#$%^&*()\-_"=+{}; :,<.>]/, "Password must have a special character")
    .matches(/^\S*$/, "White Spaces are not allowed"),
  confirmPassword: yup.string()
    .oneOf([yup.ref('new_password'),''], 'Passwords must match'),
});

interface propsData {
  formData?: any,
  data?: any,
  api?: string,
  setStep?: Function,
  sendOtpRes?: any;
  isEmail?: boolean;
  isNumber?: boolean;
}

const ReEnterpass = (props: propsData) => {

  const { mode } = useContext(Context);
  const router = useRouter();
  const [formData, setFormData] = useState({ username: "" });
  const [btnDisabled, setBtnDisabled] = useState(false);
  const [show, setShow] = useState(false);
  const [layout, setLayout] = useState(false)
  const [pswd, setpswd] = useState('');
  const [confirmation, setConfirmation] = useState(false)
  const [passwordLength, setPasswordLength] = useState(18);
  const [checker,setChecker] = useState(false)

  let {
    register,
    setValue,
    handleSubmit,
    watch,
    setError, clearErrors,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const generatePassword = async () => {
    const lowercaseCharset = "abcdefghijklmnopqrstuvwxyz";
    const uppercaseCharset = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const numberCharset = "0123456789";
    const specialCharset = "!@#$%^&*()_+{};:<>,.?";

    // Function to randomly select a character from a given charset
    function getRandomCharacter(charset: string) {
      const randomIndex = Math.floor(Math.random() * charset.length);
      return charset[randomIndex];
    }
    let password = "";
    // Include at least one character from each charset
    password += await getRandomCharacter(lowercaseCharset);
    password += await getRandomCharacter(uppercaseCharset);
    password += await getRandomCharacter(numberCharset);
    password += await getRandomCharacter(specialCharset);

    // Fill the rest of the password with random characters
    const remainingLength = passwordLength - 4; // Subtract 4 for the characters already added
    for (let i = 0; i < remainingLength; i++) {
      const randomCharset = [lowercaseCharset, uppercaseCharset, numberCharset, specialCharset][Math.floor(Math.random() * 4)];
      password += await getRandomCharacter(randomCharset);
    }
    // Shuffle the password to randomize the character order
    password = password.split('').sort(() => Math.random() - 0.5).join('');
    setpswd(password);
    setValue('new_password', password);
    setValue('confirmPassword', password);
  };

  const confirmOtp = async () => {
    toast.dismiss();
    setConfirmation(false)
    setLayout(false)
    setBtnDisabled(true);
    const ciphertext = AES.encrypt(
      JSON.stringify(formData),
      `${process.env.NEXT_PUBLIC_SECRET_PASSPHRASE}`
    ).toString();
    let record = encodeURIComponent(ciphertext.toString());

    let responseData = await fetch(`/api/user/forget`, {
      method: "POST",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(record),
    });

    let res = await responseData.json();

    if (res?.data?.status === 200) {
      toast.success(res?.data?.message);
      setTimeout(() => {
        router.push("/login");
      }, 1000)

    } else {
      toast.error(res.data.message);
      setBtnDisabled(false);
    }
  }

  const onHandleSubmit = async (data: any) => {
    try {
      setLayout(true)
      setConfirmation(true)
      data.otp = props?.formData?.otp;
      data.type = "forget";
      data.step = 4;
      data.username = props?.formData?.username
      setFormData(data)
    } catch (error) { }
  };

  useEffect(() => {
    setTimeout(() => {
      if (errors.new_password) {
        clearErrors('new_password');
      }

      if (errors.confirmPassword) {
        clearErrors('confirmPassword');
      }
    }, 3000);

  }, [errors]);

  return (
    <>
      <ToastContainer />
      <section className="bg-primary-300 lg:dark:bg-black-v-1 h-screen xl:h-full  lg:bg-bg-primary ">
        <div className="flex gap-5 bg-[url('/assets/register/ellipsebg.svg')] bg-[length:75%]  bg-no-repeat lg:bg-none h-screen">
          <div className="max-w-[848px]  w-full lg:block hidden">
            <Image
              src="/assets/register/forget.png"
              width={848}
              height={631}
              alt="signup"
              className="object-cover h-screen xl:h-full block"
            />
          </div>
          <div className="max-w-[902px] w-full ">
            <div
              className="py-[30px] lg:py-[40px]  max-w-[710px] w-full my-0 mx-auto pr-5 flex justify-end items-center cursor-pointer"
              onClick={() => {
                router.push("/");
              }}
            >
              <HeaderLogo />
            </div>
            <div className="lg:hidden block">
              <Image
                src="/assets/register/forgetbg.svg"
                alt="forget"
                width={398}
                height={198}
                className="mx-auto"
              />
            </div>
            <div className="mt-0 lg:mt-[200px] lg:p-0 p-5  max-w-[calc(100%-30px)] mx-auto  lg:bg-[transparent] lg:dark:bg-[transparent] bg-white lg:rounded-none rounded-10 dark:bg-d-bg-primary md:max-w-[562px] w-full">
              <h1 className="lg-heading mb-5">Password Recovery</h1>
              <p className="mb-5  lg:mb-[70px] md-text">
                Enter your email/number to recover your password
              </p>
              {/**Form Start  */}
              <form onSubmit={handleSubmit(onHandleSubmit)}>

                <div className="relative text-end">
                  <button type="button" className="!text-primary" onClick={() => generatePassword()}>Generate Password</button>
                </div>
                <div
                      className="relative flex justify-between gap-2 items-center input-cta"
                    >
                      <input type={`${show === true ? "text" : "password"}`} {...register('new_password')}
                        name="new_password" placeholder="New Password" className=" w-full password-input !bg-[transparent] focus:outline-none  !text-beta dark:shadow-[inset_0_50px_0_#121318] shadow-[inset_0_50px_0_#e2f2ff]" maxLength={32} autoComplete="off" onChange={(e: any) => setpswd(e.target.value)} onFocus={()=>{setChecker(true)}} onBlur={()=>{setChecker(false)}} />
                      <Image
                        data-testid="show-hide"
                        src={`/assets/register/${show === true ? "show.svg" : "hide.svg"}`}
                        alt="eyeicon"
                        width={24}
                        height={24}
                        onClick={() => {
                          setShow(!show);
                        }}  
                        className="cursor-pointer "
                      />
                    {checker && 
                      <StrengthCheck2 password={pswd} />}
                    </div>
               
                {errors.new_password && <p style={{ color: 'red' }}>{errors.new_password.message}</p>}
                <div className="relative mt-[10px]">
                  <input type={`${show === true ? "text" : "password"}`} placeholder="Confirm Password"  {...register('confirmPassword')} name="confirmPassword" maxLength={32} className="input-cta w-full" />
                  <Image
                    src={`/assets/register/${show === true ? "show.svg" : "hide.svg"}`}
                    alt="eyeicon2"
                    width={24}
                    height={24}
                    onClick={() => {
                      setShow(!show);
                    }}
                    className="cursor-pointer absolute top-[50%] right-[20px] translate-y-[-50%]"
                  />
                </div>
                {errors.confirmPassword && <p style={{ color: 'red' }}>{errors.confirmPassword.message}</p>}

                <button
                  type="submit"
                  className="my-[30px] lg:my-[50px] solid-button w-full hover:bg-primary-800"
                >
                  Reset Password
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
      {
        confirmation &&
        <ConfirmationModel title="Reset Password" message="After reset password, Withdrawal will be restricted for 24 hours." actionPerform={confirmOtp} show={layout} setShow={setLayout} setActive={setConfirmation} />
      }
    </>
  )
}

export default ReEnterpass;