import Image from "next/image";
import React, { useState } from "react";
import IconsComponent from "../snippets/icons";
import GoogleAuth from "../snippets/googleAuth";
import Verification from "../snippets/verification";
import AdNumber from "./adNumber";
import ConfirmPopup from "@/pages/profile/confirm-popup";
import Activity from "./activity/activity";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AES from "crypto-js/aes";

import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { signOut, useSession } from "next-auth/react";

const schema = yup.object().shape({
  old_password: yup.string().required("Old password is required"),
  new_password: yup
    .string()
    .min(8)
    .max(32)
    .required("New password is required"),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("new_password")], "Passwords must match"),
});

interface fixSection {
  fixed?: boolean;
  show?: number;
  setShow?: Function | any;
  session: any;
  activity:any;
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

  let data = [
    {
      image: "mail.svg",
      bg: "blue",
      title: "Email Authentication",
      desc: "Lorem Ipsum is simply dummy text of the printing and typesetting industry.",
      Add: true,
      CtaText: "Enable",
    },
    {
      image: "phone.svg",
      bg: "green",
      title: "SMS Authentication",
      desc: "Lorem Ipsum is simply dummy text of the printing and typesetting industry.",
      Add: true,
      CtaText: "Enable",
    },
    {
      image: "google.svg",
      bg: "red",
      title: "Google Authentication",
      desc: "Lorem Ipsum is simply dummy text of the printing and typesetting industry.",
      Add: false,
      CtaText: "Enable",
    },
    {
      image: "activity.svg",
      bg: "green",
      title: "Activity log",
      desc: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum",
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
    setError,
    formState: { errors },
  } = useForm<UserSubmitForm>({
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
          setEnable(4);
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

  const snedOtpToUser = async () => {
    try {
      let username = props.session?.user.email !== 'null' ? props.session?.user.email : props.session?.user?.number

      let obj = {
        username: username,
        old_password: formData?.old_password,
        new_password: formData?.new_password,
        otp: "string"
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
          toast.success(res.data)
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

    }
  }

  return (
    <>
      <ToastContainer />
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
          <Activity activity={props?.activity} setShowActivity={setShowActivity} showActivity={showActivity}/>
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
                            {item?.title === "SMS Authentication" &&
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
                              setEnable(index + 1);
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
            <form onSubmit={handleSubmit(onHandleSubmit)}>
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
                    <p style={{ color: "#ff0000d1" }}>
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
                        <p style={{ color: "#ff0000d1" }}>
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
                        className="sm-text input-cta2 w-full"
                      />
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
        />
      )}
      {enable === 2 && (
        <Verification
          setShow={setShow}
          setEnable={setEnable}
          type="number"
          data={formData}
          session={props?.session}
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
      {enable === 4 && (
        <ConfirmPopup
          setEnable={setEnable}
          setShow={setShow}
          type="number"
          data={formData}
          session={props?.session}
          snedOtpToUser={snedOtpToUser}
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
    </>
  );
};

export default SecuritySettings;
