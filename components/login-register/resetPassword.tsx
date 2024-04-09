import React, { useContext, useEffect, useState } from "react";
import Context from "../contexts/context";
import Image from "next/image";
import HeaderLogo from "../svg-snippets/headerLogo";
import Verification from "./verification";
import SecurityCode from "./securityCode";
import { useRouter } from "next/router";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { AES } from "crypto-js";
import { toast, ToastContainer } from "react-toastify";
import StrengthCheck from "../snippets/strengthCheck";
import ConfirmationModel from "../snippets/confirmation";
import ReEnterpass from "./re-enterpass";

const schema = yup.object().shape({
  username: yup
    .string()
    .required("Email / Phone is required").matches(/^([a-zA-Z0-9_\.])+\@(([a-zA-Z0-9])+\.)+([a-zA-Z0-9]{2,4})|([0-9]{10})+$/, 'Please enter valid email or phone number'),
    // .test("email_or_phone", "Email / Phone is invalid", (value) => {
    //   return validateEmail(value) || validatePhone(value);
    // }),
  // new_password: yup.string().min(8).max(32).required().matches(/\w*[a-z]\w*/, "Password must have a small letter")
  // .matches(/\w*[A-Z]\w*/, "Password must have a capital letter")
  // .matches(/\d/, "Password must have a number")
  // .matches(/[!+@#$%^&*()\-_"=+{}; :,<.>]/, "Password must have a special character")
  // .matches(/^\S*$/, "White Spaces are not allowed"),
  // confirmPassword: yup.string()
  //   .oneOf([yup.ref('new_password')], 'Passwords must match'),
});

const validateEmail = (email: string | undefined) => {
  return yup.string().email().isValidSync(email);
};

const validatePhone = (phone: string | undefined) => {
  return yup
    .number()
    .integer()
    .positive()
    .test((phone) => {
      return phone &&
        phone.toString().length >= 10 &&
        phone.toString().length <= 14
        ? true
        : false;
    })
    .isValidSync(phone);

};




const ResetPassword = () => {
  const { mode } = useContext(Context);
  const [step, setStep] = useState(0);
  const router = useRouter();
  const [isEmail, setIsEmail] = useState(false);
  const [formData, setFormData] = useState({ username: "" });
  const [btnDisabled, setBtnDisabled] = useState(false);

  const [sendOtpRes, setSendOtpRes] = useState<any>();

  const [layout, setLayout] = useState(false)
 

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

  const onHandleSubmit = async (data: any) => {
    try {
      let isEmailExist = await validateEmail(data.username);

      setIsEmail(isEmailExist);
      data.otp = "";
      data.type = "forget";
      data.step = 1;
      // console.log(data, "==ahjhaj");
      setBtnDisabled(true);
      const ciphertext = AES.encrypt(
        JSON.stringify(data),
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

      if (res?.data?.otp !==undefined) {
        
        toast.success(res?.data?.message);
       setSendOtpRes(res?.data?.otp);
        setLayout(true)
        // setConfirmation(true)
        setStep(2)
        setFormData(data);
      } else {
        toast.error(res.data.message);
        setBtnDisabled(false);
      }
    } catch (error) { }
  };

  useEffect(() => {
    setTimeout(() => {
    
      if (errors.username) {
        clearErrors('username');
      }
   
    }, 3000);

  }, [errors]);



  return (
    <>
      <ToastContainer />
      {step === 0 && (
        <section className="bg-primary-300 lg:dark:bg-black-v-1  lg:bg-bg-primary ">
          <div className="flex min-h-screen h-full gap-5 bg-[url('/assets/register/ellipsebg.svg')] bg-[length:75%]  bg-no-repeat lg:bg-none ">
            <div className="max-w-full lg:max-w-[50%]  w-full lg:block hidden">
              <Image
                src="/assets/register/forget.png"
                width={848}
                height={631}
                alt="signup"
                className="object-cover h-screen block w-full"
              />
            </div>
            <div className="max-w-full lg:max-w-[50%] flex flex-col justify-center w-full">
              <div className="max-w-[562px] w-full mx-auto">
                <div
                className="py-[30px] lg:py-[40px]  max-w-[562px] w-full my-0  pr-5 flex justify-end items-center cursor-pointer"
                onClick={() => {
                  router.push("/");
                }}
              >
                <HeaderLogo />
              </div>
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
                  <div className="flex flex-col gap-[15px] lg:gap-10">
                    <input
                      type="text"
                      placeholder="Enter Email/Number "
                      {...register("username")}
                      name="username"
                      className="input-cta"
                    />
                    {errors.username && (
                      <p style={{ color: "red" }}>{errors.username.message}</p>
                    )}
                  </div>
                  <button
                    type="submit"
                    className="my-[30px] lg:my-[50px] solid-button w-full hover:bg-primary-800"
                  >
                   Send OTP
                  </button>
                </form>
                {/**Form End  */}
              </div>
            </div>
          </div>
        </section>
      )}
       
      {step === 2 && <SecurityCode formData={formData} api="forget"  isEmail={isEmail} sendOtpRes={sendOtpRes} setStep={setStep}/>}
      {step === 3 && <ReEnterpass formData={formData} api="forget"  isEmail={isEmail} sendOtpRes={sendOtpRes} setStep={setStep}/>}
    </>
  );
};

export default ResetPassword;
