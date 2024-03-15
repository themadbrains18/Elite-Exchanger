import React, { useContext, useEffect, useRef, useState } from "react";
import Context from "../contexts/context";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { AES } from "crypto-js";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { signOut, useSession } from "next-auth/react";
import clickOutSidePopupClose from "../snippets/clickOutSidePopupClose";

interface activeSection {
  setActive: Function;
  setShow: Function;
  setStep: Function;
  type: string;
  formData: any;
}

const schema = yup.object().shape({
  password: yup.string().required("password is required"),
});

const Password = (props: activeSection) => {
  const { mode } = useContext(Context);
  const [fillOtp2, setOtp2] = useState("");
  let { data: session, status } = useSession();


  let {
    register,
    setValue,
    handleSubmit,
    getValues,
    watch,
    setError,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  useEffect(() => {
    const inputElements = document.querySelectorAll(".input_wrapper2 input");
    // console.log(inputElements.length);

    inputElements.forEach((ele, index) => {
      ele.addEventListener("keydown", (e: any) => {
        if (e.keyCode === 8 && e.target.value === "") {
          (inputElements[Math.max(0, index - 1)] as HTMLElement).focus();
        }
      });
      ele.addEventListener("input", (e: any) => {
        const [first, ...rest] = e.target.value;
        e.target.value = first ?? "";
        const lastInputBox = index === inputElements.length - 1;
        const didInsertContent = first !== undefined;
        if (didInsertContent && !lastInputBox) {
          // continue to input the rest of the string
          (inputElements[index + 1] as HTMLElement).focus();
          (inputElements[index + 1] as HTMLInputElement).value = rest.join("");
          inputElements[index + 1].dispatchEvent(new Event("input"));
        } else {
          setOtp2(
            (inputElements[0] as HTMLInputElement).value +
              "" +
              (inputElements[1] as HTMLInputElement).value +
              "" +
              (inputElements[2] as HTMLInputElement).value +
              "" +
              (inputElements[3] as HTMLInputElement).value +
              "" +
              (inputElements[4] as HTMLInputElement).value +
              "" +
              (inputElements[5] as HTMLInputElement).value
          );
        }
      });
    });
  }, []);

  const onHandleSubmit = async (data: any) => {
    try {
      let obj = {};
      // let type =  props.session?.user.email!=='null'?'email':'number'
      if (props?.type === "email") {
        let username =
          props?.type == "email" && session?.user.email !== "null"
            ? session?.user.email
            : session?.user?.number;
        obj = {
          username: username,
          data: props?.formData,
          otp: fillOtp2,
          password: data?.password,
        };
      }
      if (props?.type === "number") {
        let username =
          props?.type == "number" && session?.user.number !== "null"
            ? session?.user.number
            : session?.user?.email;
        obj = {
          username: username,
          data: props?.formData,
          otp: fillOtp2,
          password: data?.password,
        };
      }
      if (status === "authenticated") {
        const ciphertext = AES.encrypt(
          JSON.stringify(obj),
          `${process.env.NEXT_PUBLIC_SECRET_PASSPHRASE}`
        );
        let record = encodeURIComponent(ciphertext.toString());

        let userExist = await fetch(
          `${process.env.NEXT_PUBLIC_BASEURL}/user/update`,
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

        if (res.data.message !== undefined) {
          toast.error(res.data.message);
        } else {
          toast.success(res.data.data);
          setTimeout(() => {
            props?.setActive(0), signOut();
            props?.setShow(false), props?.setStep(false);
          }, 1000);
        }
      } else {
        toast.error("Your session is expired. Its auto redirect to login page");
        setTimeout(() => {
          signOut();
        }, 4000);
      }
    } catch (error) {
      console.log(error,"=error password")
    }
  };

  const closePopup = () => {
    props?.setShow(false);
            props.setActive(0);
  }
  const wrapperRef = useRef(null);
  clickOutSidePopupClose({ wrapperRef, closePopup });

  return (
    <div ref={wrapperRef} className="max-w-[calc(100%-30px)] md:max-w-[510px] w-full p-5 md:p-40 z-10 fixed rounded-10 bg-white dark:bg-omega top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%]">
      <div className="flex items-center justify-between ">
        <p className="sec-title">Add Mobile Number</p>
        <svg
          onClick={() => {
            props?.setShow(false);
            props.setActive(0);
          }}
          enableBackground="new 0 0 60.963 60.842"
          version="1.1"
          id="Layer_1"
          xmlns="http://www.w3.org/2000/svg"
          xmlnsXlink="http://www.w3.org/1999/xlink"
          x="0px"
          y="0px"
          viewBox="0 0 60.963 60.842"
          xmlSpace="preserve"
          className="max-w-[18px] cursor-pointer w-full"
        >
          <path
            fill={mode === "dark" ? "#fff" : "#9295A6"}
            d="M59.595,52.861L37.094,30.359L59.473,7.98c1.825-1.826,1.825-4.786,0-6.611
                            c-1.826-1.825-4.785-1.825-6.611,0L30.483,23.748L8.105,1.369c-1.826-1.825-4.785-1.825-6.611,0c-1.826,1.826-1.826,4.786,0,6.611
                            l22.378,22.379L1.369,52.861c-1.826,1.826-1.826,4.785,0,6.611c0.913,0.913,2.109,1.369,3.306,1.369s2.393-0.456,3.306-1.369
                            l22.502-22.502l22.501,22.502c0.913,0.913,2.109,1.369,3.306,1.369s2.393-0.456,3.306-1.369
                            C61.42,57.647,61.42,54.687,59.595,52.861z"
          />
        </svg>
      </div>

      <form onSubmit={handleSubmit(onHandleSubmit)}>
        <div className="py-30 md:py-40">
          <div className="flex flex-col mb-[15px] md:mb-30 gap-20">
            <label className="sm-text">
              Enter Old {props?.type === "Email" ? "SMS" : "Email"} 6 Digit OTP
            </label>
            <div className="flex gap-10 justify-center items-center input_wrapper2">
              <input
                type="text"
                autoComplete="off"
                className="block px-2 font-noto md:px-5  w-40 md:w-[60px] dark:bg-black bg-primary-100  text-center  rounded min-h-[40px] md:min-h-[62px] text-black dark:text-white outline-none focus:!border-primary"
                name="code1"
              />
              <input
                type="text"
                autoComplete="off"
                className="block px-2 font-noto md:px-5 w-40 md:w-[60px] dark:bg-black bg-primary-100  text-center  rounded min-h-[40px] md:min-h-[62px] text-black dark:text-white outline-none focus:!border-primary"
                name="code2"
              />
              <input
                type="text"
                autoComplete="off"
                className="block px-2 font-noto md:px-5 w-40 md:w-[60px] dark:bg-black bg-primary-100  text-center  rounded min-h-[40px] md:min-h-[62px] text-black dark:text-white outline-none focus:!border-primary"
                name="code3"
              />
              <input
                type="text"
                autoComplete="off"
                className="block px-2 font-noto md:px-5 w-40 md:w-[60px] dark:bg-black bg-primary-100  text-center  rounded min-h-[40px] md:min-h-[62px] text-black dark:text-white outline-none focus:!border-primary"
                name="code4"
              />
              <input
                type="text"
                autoComplete="off"
                className="block px-2 font-noto md:px-5 w-40 md:w-[60px] dark:bg-black bg-primary-100  text-center  rounded min-h-[40px] md:min-h-[62px] text-black dark:text-white outline-none focus:!border-primary"
                name="code5"
              />
              <input
                type="text"
                autoComplete="off"
                className="block px-2 font-noto md:px-5 w-40 md:w-[60px] dark:bg-black bg-primary-100  text-center  rounded min-h-[40px] md:min-h-[62px] text-black dark:text-white outline-none focus:!border-primary"
                name="code6"
              />
            </div>
            <p className="info-10-14 text-end">Resend OTP</p>
          </div>
          <div className="flex flex-col  gap-20">
            <label className="sm-text mb-[6px]">Enter Account Password</label>
            <input
              type="password"
              placeholder="Enter text"
              className="sm-text input-cta2 w-full"
              {...register("password")}
            />
            {errors.password && (
              <p style={{ color: "red" }}>{errors.password.message}</p>
            )}
          </div>
        </div>
        <div className="flex gap-[20px]">
          <button
            type="button"
            className="solid-button2 w-full "
            onClick={() => {
              props?.setActive(0), props?.setShow(false), props?.setStep(false);
            }}
          >
            Cancel
          </button>
          <button type="submit" className="solid-button px-[51px] w-full">
            Add
          </button>
        </div>
      </form>
    </div>
  );
};

export default Password;
