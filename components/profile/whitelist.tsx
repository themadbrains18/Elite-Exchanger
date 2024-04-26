import React, { useContext, useEffect, useRef, useState } from "react";
import Context from "../contexts/context";
import IconsComponent from "../snippets/icons";
import AntiPhishingCode from "./antiPhishingCode";
import clickOutSidePopupClose from "../snippets/clickOutSidePopupClose";
import WhitelistSuccessful from "./whitelistSuccessful";
import { AES } from "crypto-js";
import { signOut, useSession } from "next-auth/react";
import { ToastContainer, toast } from "react-toastify";

interface activeSection {
  setEnable: Function;
  setShow: Function;
  whitelist: any;
  setWhitelist: Function;
  session?: any;
}

const Whitelist = (props: activeSection) => {
  const { mode } = useContext(Context);
  const [active, setActive] = useState(false)
  let { data: session, status } = useSession();

  const closePopup = () => {
    props.setShow(false), props.setEnable(0);
  }
  const wrapperRef = useRef(null);
  clickOutSidePopupClose({ wrapperRef, closePopup });


  const handleSubmit = async () => {
    try {
      // console.log(session);

      let obj = {
        whitelist: props?.session?.user?.whitelist === true ? false : true
      }

      if (session !== undefined && session?.user !== undefined) {
        const ciphertext = AES.encrypt(
          JSON.stringify(obj),
          `${process.env.NEXT_PUBLIC_SECRET_PASSPHRASE}`
        );
        let record = encodeURIComponent(ciphertext.toString());

        let userExist = await fetch(
          `${process.env.NEXT_PUBLIC_BASEURL}/user/whitelist`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: session?.user?.access_token,
            },
            body: JSON.stringify(record),
          }
        );
        let res = await userExist.json();
        // console.log(res);

        if (res.status === 200) {
          setActive(true)
          props?.setWhitelist(res?.data?.result?.whitelist)
        } else {
          toast.error(res.data.message);

        }
      } else {
        toast.error("Your session is expired. Its auto redirect to login page");
        setTimeout(() => {
          signOut();
        }, 4000);
      }

    } catch (error: any) {
      console.log(error?.message, "==error");

    }
  }

  return (
    <>

      {/* <ToastContainer /> */}
      {
        active ?
          <WhitelistSuccessful setEnable={props?.setEnable} setActive={setActive} setShow={props?.setShow} whitelist={props?.whitelist} />
          : <div ref={wrapperRef} className="max-w-[calc(100%-30px)] md:max-w-[510px] w-full p-5 md:p-20 z-10 fixed rounded-10 bg-white dark:bg-omega top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%]">
            <div className="flex item-center justify-center mb-6">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 96 96"
                fill="none"
                className="w-[40px]"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M88 48c0 22.091-17.909 40-40 40S8 70.091 8 48 25.909 8 48 8s40 17.909 40 40z"
                  fill="#5367FF"
                />
                <path
                  d="M48 19c16.016 0 29 12.984 29 29S64.016 77 48 77 19 64.016 19 48s12.984-29 29-29z"
                  fill="#5367FF"
                />
                <path d="M45 66h6v-6h-6v6zM51 54V30h-6v24h6z" fill="#14151A" />
                <defs>
                  <linearGradient
                    id="general-warning_svg__paint0_linear_22059_28207"
                    x1={8}
                    y1={48}
                    x2="102.5"
                    y2={48}
                    gradientUnits="userSpaceOnUse"
                  >
                    <stop stopColor="#F0B90B" stopOpacity={0} />
                    <stop offset={1} stopColor="#F0B90B" />
                  </linearGradient>
                  <linearGradient
                    id="general-warning_svg__paint1_linear_22059_28207"
                    x1={77}
                    y1={48}
                    x2={19}
                    y2={48}
                    gradientUnits="userSpaceOnUse"
                  >
                    <stop stopColor="#F0B90B" />
                    <stop offset={1} stopColor="#F8D33A" />
                  </linearGradient>
                </defs>
              </svg>

            </div>
            <p className="sec-title text-center mb-5">{props?.whitelist === false ? "Enable" : "Disable"} Whitelist</p>

            <div className="mx-2 mb-6">

              <p className="sm-text text-center">Once this function is {props?.whitelist === false ? "enabled" : "disabled"}, your account will   {props?.whitelist === false ? "only able" : "not able"} to withdraw to addresses on your whitelist.</p>
            </div>
            <div className="flex justify-between items-center gap-2">

              <button
                className="solid-button2 w-full"
                onClick={() => {
                  props.setEnable(0);
                  props.setShow(false);

                }}
              >
                Cancel
              </button>
              <button
                className="solid-button w-full"
                onClick={() => {
                  handleSubmit()

                }}
              >
                {props?.whitelist === false ? "Enable" : "Disable"}
              </button>
            </div>
          </div>
      }

    </>
  );
};

export default Whitelist;
