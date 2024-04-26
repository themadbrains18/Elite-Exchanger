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
  const [disabled, setDisabled] = useState(false)

  const closePopup = () => {
    props.setShow(false), props.setEnable(0);
  }
  const wrapperRef = useRef(null);
  clickOutSidePopupClose({ wrapperRef, closePopup });


  const handleSubmit = async () => {
    try {
      // console.log(session);
      setDisabled(true)
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
          setDisabled(false)
        } else {
          toast.error(res.data.message);
          setDisabled(false)
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
                className={`solid-button w-full ${disabled && 'cursor-not-allowed'}`}
                disabled={disabled}
                onClick={() => {
                  handleSubmit()

                }}
              >
                {disabled &&
                  <svg aria-hidden="true" role="status" className="inline w-4 h-4 me-3 text-white animate-spin" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="#E5E7EB" />
                  <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentColor" />
                </svg>
                }
                {props?.whitelist === false ? "Enable" : "Disable"}
              </button>
            </div>
          </div>
      }

    </>
  );
};

export default Whitelist;
