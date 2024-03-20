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

const schema = yup.object().shape({
  old_password: yup.string().required("Old password is required"),
  new_password: yup
    .string()
    .min(8)
    .max(32)
    .required("New password is required").matches(/\w*[a-z]\w*/, "Password must have a small letter")
    .matches(/\w*[A-Z]\w*/, "Password must have a capital letter")
    .matches(/\d/, "Password must have a number")
    .matches(/[!+@#$%^&*()\-_"=+{}; :,<.>]/, "Password must have a special character")
    .matches(/^\S*$/, "White Spaces are not allowed"),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("new_password")], "Passwords must match"),
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

  const [enable, setEnable] = useState(0);
  const [show, setShow] = useState(false);
  const [active, setActive] = useState(0);
  const [googleAuth, setGoogleAuth] = useState(props.session?.user?.TwoFA)
  const [formData, setFormData] = useState<UserSubmitForm | null>();
  const { status, data: session } = useSession()
  const [tradePassword, setTradePassword] = useState(false);
  const [sendOtpRes, setSendOtpRes] = useState<any>();
  const [successModal, setSuccessModal] = useState(false)

  const [confirmation, setConfirmation] = useState(false)

  const [antiFishingCode, setAntiFishingCode] = useState(false);

  const [pswd, setpswd] = useState('');

  // auto generate password
  const [passwordLength, setPasswordLength] = useState(18);
  const [useSymbols, setUseSymbols] = useState(true);
  const [useNumbers, setUseNumbers] = useState(true);
  const [useLowerCase, setUseLowerCase] = useState(true);
  const [useUpperCase, setUseUpperCase] = useState(true);

  const [showOldPswd, setShowOldPswd] = useState(false);
  const [showpswd, setShowPswd] = useState(false);
  const [showconfirm, setShowconfirm] = useState(false);

  let data = [
    {
      image: "mail.svg",
      bg: "blue",
      title: "Email Authentication",
      desc: "",
      Add: true,
      CtaText: "Enable",
    },
    {
      image: "phone.svg",
      bg: "green",
      title: "SMS Authentication",
      desc: "",
      Add: true,
      CtaText: "Enable",
    },
    {
      image: "google.svg",
      bg: "red",
      title: "Google Authentication",
      desc: "",
      Add: false,
      CtaText: "Enable",
    },

    {
      image: "activity.svg",
      bg: "green",
      title: "Trading Password",
      desc: "",
      Add: false,
      CtaText: "Enable",
    },
    {
      image: "google.svg",
      bg: "blue",
      title: "Anti-phishing code",
      desc: "",
      Add: false,
      // ctaLink: "/activity",
      CtaText: "Enable",
    },
    {
      image: "activity.svg",
      bg: "red",
      title: "Activity log",
      desc: "",
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
      if (status === "authenticated") {
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
          toast.error(res.data.message);
        } else {
          setConfirmation(true)

          setShow(true);
          setFormData(data);
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
    setEnable(6);
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
        toast.error(response.data.message);
      }
    } catch (error) {

    }
  }

  const generatePassword = () => {
    let charset = "";
    let newPassword = "";

    if (useSymbols) charset += "!@#$%^&*()";
    if (useNumbers) charset += "0123456789";
    if (useLowerCase) charset += "abcdefghijklmnopqrstuvwxyz";
    if (useUpperCase) charset += "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

    for (let i = 0; i < passwordLength; i++) {
      let choice = random(0, 3);
      if (useLowerCase && choice === 0) {
        newPassword += randomLower();
      } else if (useUpperCase && choice === 1) {
        newPassword += randomUpper();
      } else if (useSymbols && choice === 2) {
        newPassword += randomSymbol();
      } else if (useNumbers && choice === 3) {
        newPassword += random(0, 9);
      } else {
        i--;
      }
    }

    setpswd(newPassword);
    setValue('new_password', newPassword);
    setValue('confirmPassword', newPassword);
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

  }, [errors])

  return (
    <>
      <ToastContainer position="top-right" />
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
        ) : (
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
                      </div>
                    </div>
                    {item.Add != false && (
                      <div
                        className="py-[8px] cursor-pointer pl-[10px] pr-[10px] pl-1 hidden md:flex gap-[8px] items-center border rounded-5 border-grey-v-1 dark:border-opacity-[15%] max-w-fit w-full"
                        onClick={() => {
                          console.log(props?.session?.user, '==========props?.session?.user');
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
                          <p className="nav-text-sm text-beta">
                            {props?.session?.user?.email !== "null"
                              ? "Change Email"
                              : "Add"}
                          </p>
                        ) : (
                          <p className="nav-text-sm text-beta">
                            {item?.title === "SMS Authentication" &&
                              props?.session?.user?.number == "null"
                              ? "Add"
                              : "Change"}
                          </p>
                        )}
                      </div>
                    )}

                    {item.CtaText == "Enable" ? (
                      index === 0 ? (
                        <></>
                        // <button
                        //   className={`max-w-full w-full md:max-w-[130px] h-40 ${props?.session?.user?.email == "null"
                        //     ? "bg-primary text-white"
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
                            ? "bg-primary text-white"
                            : "bg-grey-v-2 !text-primary"
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
                          className={`max-w-full w-full md:max-w-[130px] h-40 rounded-5 info-16-18  ${googleAuth === false ? 'bg-primary text-white' : 'bg-grey-v-2 !text-primary'} `}
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
                          className={`max-w-full w-full md:max-w-[130px] h-40 rounded-5 info-16-18  ${(props?.session?.user?.tradingPassword === null && tradePassword === false) ? 'bg-primary text-white' : 'bg-grey-v-2 !text-primary'} `}
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
                        :
                        <button
                          className={`max-w-full w-full md:max-w-[130px] h-40 rounded-5 info-16-18  ${props?.session?.user?.antiphishing === null ? 'bg-primary text-white' : 'bg-grey-v-2 !text-primary'} `}
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
                        className="max-w-full asasdasds w-full flex cursor-pointer items-center justify-center md:max-w-[130px] h-40 bg-primary rounded-5 info-16-18 text-white "
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

            <form onSubmit={handleSubmit(onHandleSubmit)}>
              <div className="py-[30px] md:py-[50px] lg:px-0 px-20">
                <p className="info-14-18 dark:text-white text-h-primary mb-[10px]">
                  Change Password
                </p>

                <div className="mt-[30px] ">
                  <div className="flex md:flex-row flex-col gap-[30px]">
                    <div className=" w-full">
                      <p className="sm-text mb-[10px]">Old Password</p>
                      <div className="relative">
                        <input
                          type={`${showOldPswd === true ? "text" : "password"}`}
                          {...register("old_password")}
                          placeholder="Enter Old password"
                          className="sm-text input-cta2 w-full"
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
                    <p style={{ color: "#ff0000d1" }}>
                      {errors.old_password.message}
                    </p>
                  )}
                  <div className="mt-5 flex gap-[30px] md:flex-row flex-col">
                    <div className=" w-full">
                      <div className="flex justify-between">
                        <p className="sm-text mb-[10px]">New Password</p>
                        <div className="relative text-end">
                          <button type="button" className="!text-primary" onClick={() => generatePassword()}>Generate Password</button>
                        </div>
                      </div>
                      <div className='relative'>
                        <input
                          type={`${showpswd === true ? "text" : "password"}`}
                          {...register("new_password")}
                          onChange={(e: any) => setpswd(e.target.value)}
                          placeholder="Enter new password"
                          className="sm-text input-cta2 w-full"
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

                      <StrengthCheck password={pswd} />
                      {errors.new_password && (
                        <p style={{ color: "#ff0000d1" }}>
                          {errors.new_password.message}
                        </p>
                      )}
                    </div>

                    <div className=" w-full">
                      <p className="sm-text mb-[10px]">Re-enter password</p>
                      <div className="relative">
                        <input
                          type={`${showconfirm === true ? "text" : "password"}`}
                          {...register("confirmPassword")}
                          placeholder="Re-Enter password"
                          className="sm-text input-cta2 w-full"
                        />
                        <Image
                          src={`/assets/register/${showconfirm === true ? "show.svg" : "hide.svg"}`}
                          alt="eyeicon"
                          width={24}
                          height={24}
                          onClick={() => {
                            setShowconfirm(!showconfirm);
                          }}
                          className="cursor-pointer absolute top-[50%] right-[20px] translate-y-[-50%]"
                        />

                      </div>

                      {errors.confirmPassword && (
                        <p style={{ color: "#ff0000d1" }}>
                          {errors.confirmPassword.message}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              <div className="h-[1px] w-full bg-grey-v-2 dark:bg-opacity-[15%]"></div>
              <div className="flex md:flex-row flex-col-reverse items-center gap-[10px] justify-end pt-5 md:pt-[30px] lg:px-0 px-20">
                {/* <p className="sm-text">
                  To ensure your account is well protected, please use 8 or more
                  characters with a mix of letters, numbers & symbols.
                </p> */}
                <button
                  type="submit"
                  className="solid-button px-[23px] md:px-[51px]"
                >
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
      {enable === 6 && (
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
        <ResetSuccessful />
      }
      {
        confirmation &&
        <ConfirmationModel title="Reset Password" message="After reset password, Withdrawal will be restricted for 24 hours after changing your password." actionPerform={confirmOtp} setShow={setShow} setActive={setConfirmation} />
      }
    </>
  );
};

export default SecuritySettings;
