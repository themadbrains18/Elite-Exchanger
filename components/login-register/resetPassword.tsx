import React, { useContext, useEffect, useState } from "react";
import Context from "../contexts/context";
import Image from "next/image";
import HeaderLogo from "../svg-snippets/headerLogo";
import SecurityCode from "./securityCode";
import { useRouter } from "next/router";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { AES } from "crypto-js";
import { toast, ToastContainer } from "react-toastify";
import ReEnterpass from "./re-enterpass";

const schema = yup.object().shape({
  username: yup
    .string()
    .required("Email / Phone is required.").matches(/^([a-zA-Z0-9_\.])+\@(([a-zA-Z0-9])+\.)+([a-zA-Z0-9]{2,4})|([0-9]{10})+$/, 'Please enter valid email or phone number.'),
});

const validateEmail = (email: string | undefined) => {
  return yup.string().email().isValidSync(email);
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
      data.username = data.username.toLowerCase()
      setIsEmail(isEmailExist);

      data.otp = "";
      data.type = "forget";
      data.step = 1;
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

      if (res?.data?.otp !== undefined) {
        toast.success(res?.data?.message);
        setSendOtpRes(res?.data?.otp);
        setLayout(true)
        setStep(2)
        setFormData(data);
      } else {
        toast.error(res.data.message, { autoClose: 2500 });
        setTimeout(() => {
          setBtnDisabled(false);
        }, 3000);

      }
    } catch (error) {
      console.log(error);

    }
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
      <ToastContainer limit={1} />
      {step === 0 && (
        <section className="bg-primary-300 lg:dark:bg-black-v-1  lg:bg-bg-primary ">
          <div className="flex min-h-screen h-full gap-5 bg-[url('/assets/register/ellipsebg.svg')] bg-[length:75%]  bg-no-repeat lg:bg-none ">
            <div className="max-w-full lg:max-w-[50%]  w-full lg:block hidden">
              <Image
                src="/assets/register/forget.png"
                width={848}
                height={631}
                alt="signup"
                className="object-cover h-[1080px] sadasdsa min-h-screen block w-full"
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
                <p className="mb-5  lg:mb-[20px] md-text">
                  Enter your email/number to recover your password
                </p>
                {/**Form Start  */}
                <form onSubmit={handleSubmit(onHandleSubmit)} onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
              }
            }}>
                  <div className="flex flex-col gap-[15px] lg:gap-10 relative">
                    <input
                      type="text"
                      placeholder="Enter Email/Number "
                      {...register("username")}
                      name="username"
                      className="input-cta"
                    />
                    {/* <p className="errorMessage absolute top-[100%] left-0">skkfsdfs;d sfsd f;lk</p> */}
                    {errors.username && (
                      <p className="errorMessage absolute top-[calc(100%+5px)] left-0">{errors.username.message}</p>
                    )}
                  </div>
                  <button
                    type="submit"
                    className="my-[30px] lg:my-[50px] solid-button w-full hover:bg-primary-800"
                  >
                    {btnDisabled &&
                      <svg aria-hidden="true" role="status" className="inline w-4 h-4 me-3 text-white animate-spin" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="#E5E7EB" />
                        <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentColor" />
                      </svg>
                    }
                    Send OTP
                  </button>
                </form>
                {/**Form End  */}
              </div>
            </div>
          </div>
        </section>
      )}

      {step === 2 && <SecurityCode formData={formData} api="forget" isEmail={isEmail} sendOtpRes={sendOtpRes} setStep={setStep} />}
      {step === 3 && <ReEnterpass formData={formData} api="forget" isEmail={isEmail} sendOtpRes={sendOtpRes} setStep={setStep} />}
    </>
  );
};

export default ResetPassword;
