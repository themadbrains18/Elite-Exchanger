import Image from "next/image";
import React, { useEffect, useState } from "react";
import IconsComponent from "../snippets/icons";
import GoogleAuth from "../snippets/googleAuth";
import Verification from "../snippets/verification";
import AdNumber from "./adNumber";
import ConfirmPopup from "@/admin/admin-snippet/confirm-popup";
import Activity from "./activity/activity";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import TradingPassword from "./tradingPassword";
import AES from "crypto-js/aes";

import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { signOut, useSession } from "next-auth/react";
import StrengthCheck from "../snippets/strengthCheck";
import EmailChangeAlert from "../snippets/emailChangeAlert";
import ResetSuccessful from "../snippets/resetSuccessful";
import AntiPhishing from "./antiPhishing";
import ConfirmationModel from "../snippets/confirmation";
import Whitelist from "./whitelist";
import AddressManagement from "./address-management/address-management";
import StrengthCheck2 from "../snippets/strengthCheck2";

const schema = yup.object().shape({
  old_password: yup.string().required("Old password is required"),
  new_password: yup
    .string()
    .min(8, "New password must be at least of '8' character.")
    .max(32)
    .required("New password is required.").matches(/\w*[a-z]\w*/, "Password must have a small letter.")
    .matches(/\w*[A-Z]\w*/, "Password must have a capital letter.")
    .matches(/\d/, "Password must have a number.")
    .matches(/[!+@#$%^&*()\-_"=+{}; :,<.>]/, "Password must have a special character.")
    .matches(/^\S*$/, "Whitespaces are not allowed."),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("new_password")], "Passwords must match."),
});

interface fixSection {
  fixed?: boolean;
  show?: number;
  setShow?: Function | any;
  session: any;
  activity: any;
  // showActivity:boolean,
  // setShowActivity:any
}

type UserSubmitForm = {
  old_password: string;
  new_password: string;
  confirmPassword?: string;
};

const SecuritySettings = (props: fixSection) => {
  const [showActivity, setShowActivity] = useState(false);
  const [showAddressManagement, setShowAddressManagement] = useState(false);

  const [enable, setEnable] = useState(0);
  const [show, setShow] = useState(false);
  const [active, setActive] = useState(0);
  const [googleAuth, setGoogleAuth] = useState(props.session?.user?.TwoFA)
  const [formData, setFormData] = useState<UserSubmitForm | null>();
  const { status, data: session } = useSession()
  const [tradePassword, setTradePassword] = useState(false);
  const [whitelist, setWhitelist] = useState(props.session?.user?.whitelist);
  const [sendOtpRes, setSendOtpRes] = useState<any>();
  const [successModal, setSuccessModal] = useState(false)

  const [confirmation, setConfirmation] = useState(false)

  const [antiFishingCode, setAntiFishingCode] = useState(false);

  const [pswd, setpswd] = useState('');
  const [checker, setChecker] = useState(false)

  // auto generate password
  const [passwordLength, setPasswordLength] = useState(18);

  const [showOldPswd, setShowOldPswd] = useState(false);
  const [showpswd, setShowPswd] = useState(false);
  const [showconfirm, setShowconfirm] = useState(false);
  const [btnDisabled, setBtnDisabled] = useState(false);


  // console.log(props?.session,"==sesionnn in secutity setting");


  let data = [
    {
      image: "mail.svg",
      bg: "blue",
      title: "Email Authentication",
      desc: "Use your email to protect your account and transactions.",
      Add: true,
      CtaText: "Enable",
    },
    {
      image: "phone.svg",
      bg: "green",
      title: "SMS Authentication",
      desc: "Use your phone number to protect your account and transactions.",
      Add: true,
      CtaText: "Enable",
    },
    {
      image: "google.svg",
      bg: "red",
      title: "Google Authentication",
      desc: "Use Google Authenticator to protect your account and transactions.",
      Add: false,
      CtaText: "Enable",
    },

    {
      image: "activity.svg",
      bg: "green",
      title: "Trading Password",
      desc: "Protect your account and withdrawals with Trading Password and/or security key",
      Add: false,
      CtaText: "Enable",
    },
    {
      image: "google.svg",
      bg: "blue",
      title: "Anti-phishing code",
      desc: "Protect your account from phishing attempts and ensure that your notification emails are from Crypto Planet only.",
      Add: false,
      // ctaLink: "/activity",
      CtaText: "Enable",
    },
    {
      image: "google.svg",
      bg: "blue",
      title: "Withdrawal Whitelist",
      desc: "Once this function is enabled, your account will only be able to withdraw to addresses on your whitelist.",
      Add: false,
      // ctaLink: "/activity",
      link: "",
      linkText: 'Address Management',
      CtaText: "Enable",
    },
    {
      image: "activity.svg",
      bg: "red",
      title: "Activity log",
      desc: "Check recent login activity",
      Add: false,
      ctaLink: "/activity",
      CtaText: "Activity log",
    },

  ];

  let {
    register,
    setValue,
    handleSubmit,
    reset,
    watch,
    setError, clearErrors,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const onHandleSubmit = async (data: UserSubmitForm) => {
    try {
      setBtnDisabled(true);
      let username =
        props.session?.user.email !== "null"
          ? props.session?.user.email
          : props.session?.user?.number;

      let obj = {
        username: username,
        old_password: data?.old_password,
        new_password: data?.new_password,
        otp: "string",
        step: 1
      };
      if (session !== undefined && session?.user !== undefined) {
        const ciphertext = AES.encrypt(
          JSON.stringify(obj),
          `${process.env.NEXT_PUBLIC_SECRET_PASSPHRASE}`
        );
        let record = encodeURIComponent(ciphertext.toString());

        let userExist = await fetch(
          `${process.env.NEXT_PUBLIC_BASEURL}/user/changePassword`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: props?.session?.user?.access_token,
            },
            body: JSON.stringify(record),
          }
        );
        let res = await userExist.json();
        if (res.data.message) {
          toast.error(res.data.message, { autoClose: 2000 });
          setTimeout(() => {
            setBtnDisabled(false)
          }, 3005)
        } else {
          setConfirmation(true)

          setShow(true);
          setFormData(data);
          setTimeout(() => {
            setBtnDisabled(false)

          }, 3000)
          reset();
        }
      } else {
        toast.error("Your session is expired. Its auto redirect to login page");
        setTimeout(() => {
          signOut();
        }, 4000);
      }
    } catch (error) {
      console.log(error, "security settings");
    }
  };

  const confirmOtp = () => {
    setConfirmation(false)
    setEnable(7);
    setShow(true);
  }

  const snedOtpToUser = async () => {
    try {
      let username = props.session?.user.email !== 'null' ? props.session?.user.email : props.session?.user?.number

      let obj = {
        username: username,
        old_password: formData?.old_password,
        new_password: formData?.new_password,
        otp: "string",
        step: 2
      }

      if (status === 'authenticated') {
        const ciphertext = AES.encrypt(JSON.stringify(obj), `${process.env.NEXT_PUBLIC_SECRET_PASSPHRASE}`);
        let record = encodeURIComponent(ciphertext.toString());

        let userExist = await fetch(`${process.env.NEXT_PUBLIC_BASEURL}/user/changePassword`, {
          method: "PUT",
          headers: {
            'Content-Type': 'application/json',
            "Authorization": props?.session?.user?.access_token
          },
          body: JSON.stringify(record)
        })
        let res = await userExist.json();

        if (res.status === 200) {
          toast.success(res.data.message)
          setSendOtpRes(res?.data?.otp);
          setTimeout(() => {
            setEnable(1);
            setShow(true)
          }, 1000)

        }
      }
      else {
        toast.error('Your session is expired. Its auto redirect to login page');
        setTimeout(() => {
          signOut();
        }, 4000);

      }
    } catch (error) {

    }
  }

  const finalOtpVerification = async (otp: any) => {
    try {
      let username =
        props.session?.user.email !== "null"
          ? props.session?.user.email
          : props.session?.user?.number;

      let request = {
        username: username,
        old_password: formData?.old_password,
        new_password: formData?.new_password,
        otp: otp,
        step: 3
      };
      const ciphertext = AES.encrypt(
        JSON.stringify(request),
        `${process.env.NEXT_PUBLIC_SECRET_PASSPHRASE}`
      );

      let record = encodeURIComponent(ciphertext.toString());
      let response = await fetch(
        `${process.env.NEXT_PUBLIC_BASEURL}/user/changePassword`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: props?.session?.user?.access_token,
          },
          body: JSON.stringify(record),
        }
      ).then((response) => response.json());
      if (response.data.result) {
        setEnable(0),
          // toast.success(response.data.message);
          // setTimeout(() => {
          //   signOut();
          //   setEnable(0),
          //     setShow(false);
          // }, 1000);
          setSuccessModal(true)
      } else {
        toast.error(response.data.message, { autoClose: 2000 });
      }
    } catch (error) {

    }
  }


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


  useEffect(() => {
    setTimeout(() => {
      if (errors.new_password) {
        clearErrors('new_password');
      }
      if (errors.confirmPassword) {
        clearErrors('confirmPassword');
      }
      if (errors.old_password) {
        clearErrors('old_password');
      }

    }, 3000);

    // setWhitelist(props?.session?.user?.whitelist)

  }, [errors])

  return (
    <>
      <ToastContainer position="top-right" limit={1} />
      <div
        className={`bg-black  z-[9] duration-300 fixed top-0 left-0 h-full w-full ${show ? "opacity-80 visible" : "opacity-0 invisible"
          }`}
      ></div>
    
        <section
          className={`${props.show == 2 && "!left-[50%]"} ${props.fixed &&
            "duration-300 fixed pt-[145px] top-0 left-[160%] translate-x-[-50%] bg-off-white dark:bg-black-v-1 z-[6] w-full h-full pb-[20px] lg:dark:bg-d-bg-primary overflow-y-scroll"
            }  lg:p-40 px-[15px]`}
        >
          {/* only for mobile view */}
          <div className="lg:hidden flex dark:shadow-none shadow-lg shadow-[#c3c3c317] fixed top-0 left-0 bg-white w-full  rounded-bl-[20px] rounded-br-[20px]  z-[6] dark:bg-omega  h-[105px]">
            <div className="grid grid-cols-[auto_1fr_auto] m-auto w-full px-[20px] items-center">
              <div
                onClick={() => {
                  props.setShow(0);
                  setShowActivity(false)
                }}
              >
                <IconsComponent type="backIcon" hover={false} active={false} />
              </div>
              <div className="text-center">
                <p className="sec-title">Security</p>
              </div>
            </div>
          </div>

          {showActivity ? (
            <Activity setShowActivity={setShowActivity} showActivity={showActivity} />
          ) :
            showAddressManagement ?
              (
                <AddressManagement setShowActivity={setShowAddressManagement} showActivity={showAddressManagement} />
              )
              :
              (
                <div className="max-[1023px] dark:bg-omega bg-white rounded-[10px]">
                  <p className="sec-title lg:p-0 pl-20 pt-20">Security</p>
                  <div className="py-[30px] md:py-[50px] px-20 lg:px-0">
                    {data.map((item, index: number) => {
                      return (
                        <div
                          key={index}
                          className="flex md:flex-row flex-col gap-5 mb-[30px] last:mb-0 items-center"
                        >
                          <div className="flex items-start w-full gap-5">
                            <div
                              className={`p-2 rounded-5 max-w-[40px] w-full ${item.bg === "blue"
                                ? "bg-primary-400"
                                : item.bg === "red"
                                  ? "bg-[#F87171]"
                                  : "bg-[#6EE7B7]"
                                }`}
                            >
                              <Image
                                src={`/assets/security/${item.image}`}
                                width={24}
                                height={24}
                                alt="security"
                              />
                            </div>
                            <div className="w-full">
                              <p className="info-14-18 mb-[5px] dark:text-white text-h-primary">
                                {item.title}
                              </p>
                              <p className="info-12">{item.desc}</p>
                              {
                                item?.linkText &&
                                <p onClick={() => { setShowAddressManagement(true) }} className="!text-primary font-bold info-14  mt-[5px] cursor-pointer">{item?.linkText}</p>
                              }
                            </div>
                          </div>
                          {item.Add != false && (
                            <div
                              className={`py-[8px] cursor-pointer w-full pr-[10px] pl-1 block md:flex gap-[8px] items-center border rounded-5 border-grey-v-1 text-center dark:border-opacity-[15%] max-w-full md:max-w-fit  ${item?.title === "Email Authentication" && 'md:!max-w-[130px]'}`}
                              onClick={() => {
                                // console.log(props?.session?.user, '==========props?.session?.user');
                                if (googleAuth === true) {
                                  setActive(index + 1);
                                  setShow(true);
                                }
                                else {
                                  toast.warning('Request failed. Google Two Factor Authentication has not been activated. Please check and try again', { position: 'top-center' })
                                }

                              }}
                            >
                              {/* <Image
                          src="/assets/market/add.svg"
                          width={16}
                          height={16}
                          alt="add"
                        /> */}
                              {item?.title === "Email Authentication" ? (
                                <p className="nav-text-sm text-beta w-full asdasds text-center">
                                  {props?.session?.user?.email !== "null"
                                    ? "Change Email"
                                    : "Add +"}
                                </p>
                              ) : (
                                <p className="nav-text-sm text-beta w-full text-center">
                                  {item?.title === "SMS Authentication" &&
                                    props?.session?.user?.number == "null"
                                    ? "Add +"
                                    : "Change Number"}
                                </p>
                              )}
                            </div>
                          )}

                          {item.CtaText == "Enable" ? (
                            index === 0 ? (
                              <></>
                              // <button
                              //   className={`max-w-full w-full md:max-w-[130px] h-40 ${props?.session?.user?.email == "null"
                              //     ? "bg-primary text-white hover:bg-primary-800"
                              //     : "bg-grey-v-2 !text-primary"
                              //     }  rounded-5 info-16-18 `}
                              //   onClick={() => {
                              //     setEnable(index + 1);
                              //     setShow(true);
                              //   }}
                              // >
                              //   {props?.session?.user?.email == "null"
                              //     ? "Enable"
                              //     : "Disable"}
                              // </button>
                            ) : index === 1 ? (
                              <button
                                className={`max-w-full w-full md:max-w-[130px] h-40 ${props?.session?.user?.number == "null"
                                  ? "bg-primary text-white hover:bg-primary-800"
                                  : "bg-grey-v-2 !text-primary hover:!text-white hover:bg-primary-800"
                                  }  rounded-5 info-16-18 `}
                                onClick={() => {
                                  setEnable(index + 1);
                                  setShow(true);
                                }}
                              >
                                {props?.session?.user?.number == "null"
                                  ? "Enable"
                                  : "Disable"}
                              </button>
                            ) : index === 2 ? (
                              <button
                                className={`max-w-full w-full md:max-w-[130px] h-40 rounded-5 info-16-18  ${googleAuth === false ? 'bg-primary text-white hover:bg-primary-800' : 'bg-grey-v-2 !text-primary hover:!text-white hover:bg-primary-800'} `}
                                onClick={() => {
                                  setEnable(index + 1);
                                  setShow(true);
                                }}
                              >
                                {googleAuth === false
                                  ? "Enable"
                                  : "Disable"}
                              </button>
                            ) : index === 3 ? (
                              <button
                                className={`max-w-full w-full md:max-w-[130px] h-40 rounded-5 info-16-18  ${(props?.session?.user?.tradingPassword === null && tradePassword === false) ? 'bg-primary text-white hover:bg-primary-800' : 'bg-grey-v-2 !text-primary hover:!text-white hover:bg-primary-800'} `}
                                onClick={() => {
                                  setEnable(index + 1);
                                  setShow(true);
                                }}
                              >
                                {(props?.session?.user?.tradingPassword === null && tradePassword === false)
                                  ? "Add"
                                  : "Edit"}
                              </button>
                            )
                              : index === 5 ? (
                                <button
                                  className={`max-w-full w-full md:max-w-[130px] h-40 rounded-5 info-16-18  ${whitelist === false ? 'bg-primary text-white hover:bg-primary-800' : 'bg-grey-v-2 !text-primary hover:!text-white hover:bg-primary-800'} `}
                                  onClick={() => {
                                    if (googleAuth === true) {
                                      setEnable(index + 1);
                                      setShow(true);
                                    }
                                    else {
                                      toast.warning('Request failed. Google Two Factor Authentication has not been activated. Please check and try again', { position: 'top-center' })
                                    }
                                  }}
                                >
                                  {whitelist === false
                                    ? "Enable"
                                    : "Disable"}
                                </button>
                              )
                                :
                                <button
                                  className={`max-w-full w-full md:max-w-[130px] h-40 rounded-5 info-16-18  ${props?.session?.user?.antiphishing === null && antiFishingCode === false ? 'bg-primary text-white hover:bg-primary-800' : 'bg-grey-v-2 !text-primary hover:bg-primary-800 hover:!text-white'} `}
                                  onClick={() => {
                                    if (googleAuth === true) {
                                      setEnable(index + 1);
                                      setShow(true);
                                    }
                                    else {
                                      toast.warning('Request failed. Google Two Factor Authentication has not been activated. Please check and try again', { position: 'top-center' })
                                    }
                                  }}
                                >
                                  {(props?.session?.user?.antiphishing === null && antiFishingCode === false)
                                    ? "Add"
                                    : "Edit"}
                                </button>
                          ) : (
                            <button
                              className="max-w-full asasdasds w-full flex cursor-pointer items-center justify-center md:max-w-[130px] h-40 bg-primary hover:bg-primary-800 rounded-5 info-16-18 text-white "
                              onClick={() => {
                                setShowActivity(true);
                              }}
                            >
                              {item.CtaText}
                            </button>
                          )}
                        </div>
                      );
                    })}
                  </div>
                  <div className="h-[1px] w-full bg-grey-v-2 dark:bg-opacity-[15%]"></div>

                  <form onSubmit={handleSubmit(onHandleSubmit)} onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
              }
            }}>
                    <div className="py-[30px] md:py-[50px] lg:px-0 px-20">
                      <p className="info-14-18 dark:text-white text-h-primary mb-[10px]">
                        Change Password 
                      </p>

                      <div className="mt-[30px] ">
                        <div className="flex md:flex-row flex-col gap-[30px]">
                          <div className=" w-full mb-[10px]">
                            <p className="sm-text mb-[10px]">Old Password<span className="text-red-dark dark:text-[#9295a6]">*</span></p>
                            <div className="relative">
                              <input
                                type={`${showOldPswd === true ? "text" : "password"}`}
                                {...register("old_password")}
                                placeholder="Enter Old password"
                                className="sm-text input-cta2 w-full"
                                maxLength={32}
                              />
                              <Image
                                src={`/assets/register/${showOldPswd === true ? "show.svg" : "hide.svg"}`}
                                alt="eyeicon"
                                width={24}
                                height={24}
                                onClick={() => {
                                  setShowOldPswd(!showOldPswd);
                                }}
                                className="cursor-pointer absolute top-[50%] right-[20px] translate-y-[-50%]"
                              />
                            </div>

                          </div>
                        </div>
                        {errors.old_password && (
                          <p className="errorMessage">
                            {errors.old_password.message}
                          </p>
                        )}
                        <div className="mt-5 flex gap-[30px] md:flex-row flex-col">
                          <div className=" w-full">
                            <div className="flex justify-between mb-[10px]">
                              <p className="sm-text ">New Password<span className="text-red-dark dark:text-[#9295a6]">*</span></p>
                              <button type="button" className="!text-primary text-[14px] " onClick={() => generatePassword()}>Generate Password</button>
                            </div>
                            <div className='relative  flex justify-between gap-3 items-center mb-[10px]' onFocus={() => { setChecker(true) }} onBlur={() => { setChecker(false) }}>
                              <input
                                type={`${showpswd === true ? "text" : "password"}`}
                                {...register("new_password")}
                                onChange={(e: any) => setpswd(e.target.value)}
                                placeholder="Enter new password"
                                className="sm-text input-cta2 w-full"
                                maxLength={32}
                              />
                              <Image
                                src={`/assets/register/${showpswd === true ? "show.svg" : "hide.svg"}`}
                                alt="eyeicon"
                                width={24}
                                height={24}
                                onClick={() => {
                                  setShowPswd(!showpswd);
                                }}
                                className="cursor-pointer absolute top-[50%] right-[20px] translate-y-[-50%]"
                              />
                              {checker &&
                                <StrengthCheck2 password={pswd} />}
                            </div>

                            <StrengthCheck password={pswd} />
                            {errors.new_password && (
                              <p className="errorMessage">
                                {errors.new_password.message}
                              </p>
                            )}
                          </div>

                          <div className=" w-full">
                            <p className="sm-text mb-[10px] h-[21px]">Re-enter password<span className="text-red-dark dark:text-[#9295a6]">*</span></p>
                            <div className="relative mb-[10px]">
                              <input
                                type={`${showpswd === true ? "text" : "password"}`}
                                {...register("confirmPassword")}
                                placeholder="Re-Enter password"
                                className="sm-text input-cta2 w-full"
                                autoComplete="off"
                                maxLength={32}
                              />
                              <Image
                                src={`/assets/register/${showpswd === true ? "show.svg" : "hide.svg"}`}
                                alt="eyeicon"
                                width={24}
                                height={24}
                                onClick={() => {
                                  setShowPswd(!showpswd);
                                }}
                                className="cursor-pointer absolute top-[50%] right-[20px] translate-y-[-50%]"
                              />

                            </div>

                            {errors.confirmPassword && (
                              <p className="errorMessage">
                                {errors.confirmPassword.message}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex md:flex-row flex-col-reverse items-center gap-[10px] justify-end  lg:px-0 px-20">
                      {/* <p className="sm-text">
                  To ensure your account is well protected, please use 8 or more
                  characters with a mix of letters, numbers & symbols.
                </p> */}
                      <button
                        disabled={btnDisabled}
                        type="submit"
                        className={`solid-button w-full md:w-auto px-[23px] md:px-[51px] ${btnDisabled === true ? "cursor-not-allowed" : ''}`}
                      >
                        {btnDisabled &&
                          <svg aria-hidden="true" role="status" className="inline w-4 h-4 me-3 text-white animate-spin" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="#E5E7EB" />
                            <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentColor" />
                          </svg>
                        }
                        Save
                      </button>
                    </div>
                  </form>
                </div>
              )}
        </section>
      

      {enable === 1 && (
        <Verification
          setShow={setShow}
          setEnable={setEnable}
          type="email"
          data={formData}
          session={props?.session}
          finalOtpVerification={finalOtpVerification}
          snedOtpToUser={snedOtpToUser}
          sendOtpRes={sendOtpRes}
        />
      )}
      {enable === 2 && (
        <Verification
          setShow={setShow}
          setEnable={setEnable}
          type="number" 
          data={formData}
          session={props?.session}
          snedOtpToUser={snedOtpToUser}
          sendOtpRes={sendOtpRes}
        />
      )}
      {enable === 3 && (
        <GoogleAuth
          setShow={setShow}
          setEnable={setEnable}
          session={props?.session}
          setGoogleAuth={setGoogleAuth}
        />
      )}
      {enable === 7 && (
        <ConfirmPopup
          setEnable={setEnable}
          setShow={setShow}
          type="number" 
          data={formData}
          session={props?.session}
          snedOtpToUser={snedOtpToUser}
        />
      )}
      {enable === 4 && (
        <TradingPassword
          setEnable={setEnable}
          setShow={setShow}
          session={props?.session}
          setTradePassword={setTradePassword}
          tradePassword={tradePassword}
        />
      )}
      {enable === 5 && (
        <AntiPhishing
          setEnable={setEnable}
          setShow={setShow}
          session={props?.session}
          setAntiFishingCode={setAntiFishingCode}
        />
      )}
      {enable === 6 && (
        <Whitelist
          setEnable={setEnable}
          setShow={setShow}
          session={props?.session}
          whitelist={whitelist}
          setWhitelist={setWhitelist}
        />
      )}
      {active === 1 && (
        <AdNumber
          setShow={setShow}
          setActive={setActive}
          type="email"
          session={props?.session}

        />
      )}
      {active === 2 && (
        <AdNumber
          setShow={setShow}
          setActive={setActive}
          type="number" 
          session={props?.session}
        />
      )}
      {
        successModal &&
        <ResetSuccessful setSuccessModal={setSuccessModal} />
      }
      {
        confirmation &&
        <ConfirmationModel title="Reset Password" message="After reset password, Withdrawal will be restricted for 24 hours. Are you sure want to proceed?" actionPerform={confirmOtp} setShow={setShow} setActive={setConfirmation} />
      }
    </>
  );
};

export default SecuritySettings;
