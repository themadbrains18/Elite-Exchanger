import Image from "next/image";
import React, { useState } from "react";
import GoogleAuth from "../../../components/snippets/googleAuth";
// import Verification from "../snippets/verification";
// import AdNumber from "./adNumber";
import ConfirmPopup from "@/pages/customer/profile/confirm-popup";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AES from "crypto-js/aes";

import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { signOut, useSession } from "next-auth/react";
import PinLock from "./pinLock";
import Verification from "@/admin/admin-snippet/verification";
import AdNumber from "@/admin/admin-snippet/adNumber";

const schema = yup.object().shape({
  old_password: yup.string().required("Old password is required."),
  new_password: yup
    .string()
    .min(8, 'Password must be at least 8 character')
    .max(32)
    .required("New password is required."),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("new_password")], "Passwords must match."),
});

interface fixSection {
  fixed?: boolean;
  show?: number;
  setShow?: Function | any;
  session?: any;
  activity?: any;
  // showActivity:boolean,
  // setShowActivity:any
}

type UserSubmitForm = {
  old_password: string;
  new_password: string;
  confirmPassword?: string;
};

const AdminSettings = (props: fixSection) => {
  const [showActivity, setShowActivity] = useState(false);

  const [enable, setEnable] = useState(0);
  const [show, setShow] = useState(false);
  const [active, setActive] = useState(0);
  const [googleAuth, setGoogleAuth] = useState(props.session?.user?.TwoFA)
  const [formData, setFormData] = useState<UserSubmitForm | null>();
  const { status, data: session } = useSession();
  const [sendOtpRes, setSendOtpRes] = useState<any>();

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

  ];

  let {
    register,
    setValue,
    handleSubmit,
    reset,
    watch,
    setError,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const onHandleSubmit = async (data: UserSubmitForm) => {
    try {
      let username =
        session?.user.email !== "null"
          ? session?.user.email
          : session?.user?.number;

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
          `/api/user/changePassword`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              "Authorization": session?.user?.access_token || " ",
            },
            body: JSON.stringify(record),
          }
        );
        let res = await userExist.json();
        if (res.data.message) {
          toast.error(res.data.message);
        } else {
          setEnable(4);
          setShow(true);
          setFormData(data);
          reset();
        }
      } else {
        toast.error("Your session is expired. Its auto redirect to login page.");
        setTimeout(() => {
          signOut();
        }, 4000);
      }
    } catch (error) {
      console.log(error, "security settings");
    }
  };

  const snedOtpToUser = async () => {
    try {
      let username = session?.user.email !== 'null' ? session?.user.email : session?.user?.number

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

        let userExist = await fetch(`/api/user/changePassword`, {
          method: "PUT",
          headers: {
            'Content-Type': 'application/json',
            "Authorization": session?.user?.access_token || ""
          },
          body: JSON.stringify(record)
        })
        let res = await userExist.json();

        if (res.status === 200) {
          // toast.success(res.data)
          toast.success(res.data.message)
          setSendOtpRes(res?.data?.otp);
          setTimeout(() => {
            setEnable(1);
            setShow(true)
          }, 1000)

        }
      }
      else {
        toast.error('Your session is expired. Its auto redirect to login page.');
        setTimeout(() => {
          signOut();
        }, 4000);

      }
    } catch (error) {
      console.log("request for change password", error);

    }
  }

  const finalOtpVerification = async (otp: any) => {
    try {
      let username =
        session?.user.email !== "null"
          ? session?.user.email
          : session?.user?.number;

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
        `/api/user/changePassword`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: session?.user?.access_token || "",
          },
          body: JSON.stringify(record),
        }
      ).then((response) => response.json());
      if (response.data.result) {
        toast.success(response.data.message);
        setTimeout(() => {
          signOut();
          setEnable(0),
            setShow(false);
        }, 1000);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log("request for change password2", error);

    }
  }

  return (
    <>
      <ToastContainer limit={1}/>
      <div className={`bg-black  z-[9] duration-300 fixed top-0 left-0 h-full w-full ${show ? "opacity-80 visible" : "opacity-0 invisible"}`}></div>
      <section className={`  mt-[24px] py-6 px-5  rounded-10 bg-white dark:bg-grey-v-4`}>
        <div className="max-[1023px]  rounded-[10px]">
          <p className="sec-title lg:p-0 pl-20 pt-20">Security</p>
          <div className="py-[30px] md:py-[50px] px-20 lg:px-0">
            {data && data?.length>0 && data?.map((item, index: number) => {
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
                      className="py-[8px] cursor-pointer pr-[15px] pl-1 hidden md:flex gap-[8px] items-center border rounded-5 border-grey-v-1 dark:border-opacity-[15%] max-w-fit w-full"
                      onClick={() => {
                        setActive(index + 1);
                        setShow(true);
                      }}
                    >
                      <Image
                        src="/assets/market/add.svg"
                        width={16}
                        height={16}
                        alt="add"
                      />
                      {item?.title === "Email Authentication" ? (
                        <p className="nav-text-sm text-beta">
                          {props?.session?.user?.email !== "null"
                            ? "Edit"
                            : "Add"}
                        </p>
                      ) : (
                        <p className="nav-text-sm text-beta">
                          {item?.title === "Change PIN" &&
                            props?.session?.user?.number == "null"
                            ? "Add"
                            : "Edit"}
                        </p>
                      )}
                    </div>
                  )}
                  {item.CtaText == "Enable" ? (
                    index === 0 ? (
                      <button
                        className={`max-w-full w-full md:max-w-[130px] h-40 ${props?.session?.user?.email == "null"
                          ? "bg-primary text-white"
                          : "bg-grey-v-2 !text-primary"
                          }  rounded-5 info-16-18 `}
                        onClick={() => {
                          setEnable(index + 1);
                          setShow(true);
                        }}
                      >
                        {props?.session?.user?.email == "null"
                          ? "Enable"
                          : "Disable"}
                      </button>
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
                    ) : (
                      index === 2 && (
                        <button
                          className={`max-w-full w-full md:max-w-[130px] h-40 rounded-5 info-16-18  ${googleAuth === false ? 'bg-primary text-white' : 'bg-grey-v-2 !text-primary'} `}
                          onClick={() => {
                            setEnable(3);
                            setShow(true);
                          }}
                        >
                          {googleAuth === false
                            ? "Enable"
                            : "Disable"}
                        </button>
                      )
                    )
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
          <form onSubmit={handleSubmit(onHandleSubmit)} onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
              }
            }}>
            <div className="py-[30px] md:py-[50px] lg:px-0 px-20">
              <p className="info-14-18 dark:text-white text-h-primary mb-[10px]">
                Password
              </p>
              <p className="sm-text ">
                Set a unique password to protect your personal account.
              </p>
              <div className="mt-[30px] ">
                <div className="flex md:flex-row flex-col gap-[30px]">
                  <div className=" w-full">
                    <p className="sm-text mb-[10px]">Old Password</p>
                    <input
                      type="password"
                      {...register("old_password")}
                      placeholder="Enter Old password"
                      className="sm-text input-cta2 w-full"
                    />
                  </div>
                </div>
                {errors.old_password && (
                  <p className="errorMessage">
                    {errors.old_password.message}
                  </p>
                )}
                <div className="mt-5 flex gap-[30px] md:flex-row flex-col">
                  <div className=" w-full">
                    <p className="sm-text mb-[10px]">New Password</p>

                    <input
                      type="password"
                      {...register("new_password")}
                      placeholder="Enter new password"
                      className="sm-text input-cta2 w-full"
                    />
                    {errors.new_password && (
                      <p className="errorMessage">
                        {errors.new_password.message}
                      </p>
                    )}
                  </div>

                  <div className=" w-full">
                    <p className="sm-text mb-[10px]">Re-enter password</p>

                    <input
                      type="password"
                      {...register("confirmPassword")}
                      placeholder="Re-Enter password"
                      autoComplete="off"
                      className="sm-text input-cta2 w-full"
                    />
                    {errors.confirmPassword && (
                      <p className="errorMessage">
                        {errors.confirmPassword.message}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
            <div className="h-[1px] w-full bg-grey-v-2 dark:bg-opacity-[15%]"></div>
            <div className="flex md:flex-row flex-col-reverse items-center gap-[10px] justify-between pt-5 md:pt-[30px] lg:px-0 px-20">
              <p className="sm-text">
                To ensure your account is well protected, please use 8 or more
                characters with a mix of letters, numbers & symbols.
              </p>
              <button
                type="submit"
                className="solid-button px-[23px] md:px-[51px]"
              >
                Save Password
              </button>
            </div>
          </form>
        </div>
      </section>


      {enable === 1 && (
        <Verification
          setShow={setShow}
          setEnable={setEnable}
          type="email"
          data={formData}
          session={session}
          finalOtpVerification={finalOtpVerification}
          snedOtpToUser={snedOtpToUser}
          sendOtpRes={sendOtpRes}
        />
      )}
      {enable === 2 && (
        <PinLock
          setShow={setShow}
          setEnable={setEnable}
        //   session={props?.session}
        />
      )}
      {enable === 3 && (
        <GoogleAuth
          setShow={setShow}
          setEnable={setEnable}
          session={session}
          setGoogleAuth={setGoogleAuth}
        />
      )}
      {enable === 4 && (
        <ConfirmPopup
          setEnable={setEnable}
          setShow={setShow}
          type="email"
          data={formData}
          session={session}
          snedOtpToUser={snedOtpToUser}
        />
      )}
      {active === 1 && (
        <AdNumber
          setShow={setShow}
          setActive={setActive}
          type="email"
          session={session}
        />
      )}
      {active === 2 && (
        <AdNumber
          setShow={setShow}
          setActive={setActive}
          type="number"
          session={session}
        />
      )}

    </>
  );
};

export default AdminSettings;
