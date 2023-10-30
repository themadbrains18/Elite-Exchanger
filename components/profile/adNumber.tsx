import React, {
  FormEventHandler,
  useContext,
  useEffect,
  useState,
} from "react";
import Context from "../contexts/context";
import Password from "./password";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { AES } from "crypto-js";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { signOut, useSession } from "next-auth/react";

const schema = yup.object().shape({
  uname: yup
    .string()
    .required("Email / Phone is required")
    .test("email_or_phone", "Email / Phone is invalid", (value) => {
      return validateEmail(value) || validatePhone(value);
    }),
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

interface activeSection {
  setActive: Function;
  setShow: Function;
  type: string;
  session: any;
}

const AdNumber = (props: activeSection) => {
  const { mode } = useContext(Context);
  const [step, setStep] = useState(false);
  const [fillOtp, setOtp] = useState("");
  const [formData, setFormData] = useState();
  const [statuss, setStatuss] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const { status } = useSession();

  useEffect(() => {
    const inputElements = document.querySelectorAll(".input_wrapper input");
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
          setOtp(
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

  let {
    register,
    setValue,
    handleSubmit,
    getValues,
    watch,
    setError,
    clearErrors,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const sendOtp = async () => {
    try {
      setDisabled(true);
      let uname = getValues("uname");
      if (uname !== "") {
        clearErrors();
        let obj = {};
        // let type =  props.session?.user.email!=='null'?'email':'number'
        if (props?.type === "email") {
          let username =
            props?.type == "email" && props.session?.user.email !== "null"
              ? props.session?.user.email
              : props.session?.user?.number;
          obj = {
            username: username,
            data: uname,
            otp: "string",
          };
        }
        if (props?.type === "number") {
          let username =
            props?.type == "number" && props.session?.user.number !== "null"
              ? props.session?.user.number
              : props.session?.user?.email;
          obj = {
            username: username,
            data: uname,
            otp: "string",
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
                Authorization: props?.session?.user?.access_token,
              },
              body: JSON.stringify(record),
            }
          );
          let res = await userExist.json();
          console.log(res);

          if (res.data.data !== undefined) {
            setDisabled(false);
            toast.success(res.data.data);
            setStatuss(true);
          } else {
            setDisabled(false);
            toast.error(res.data.message);
          }
        } else {
          setError("uname", {
            type: "custom",
            message: `Please enter valid ${
              props?.type === "email" ? "email" : "number"
            }}`,
          });
        }
      } else {
        toast.error("Your session is expired. Its auto redirect to login page");
        setTimeout(() => {
          signOut();
        }, 4000);
      }
      //   props.formData.step = 2;
    } catch (error) {
      console.log(error);
    }
  };

  const onHandleSubmit = async (data: any) => {
    try {
      // console.log(data);
      let obj = {};
      // let type =  props.session?.user.email!=='null'?'email':'number'

      if (props?.type === "email") {
        let username =
          props?.type == "email" && props.session?.user.email !== "null"
            ? props.session?.user.email
            : props.session?.user?.number;
        obj = {
          username: username,
          data: data?.uname,
          otp: fillOtp,
          password: "",
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
              Authorization: props?.session?.user?.access_token,
            },
            body: JSON.stringify(record),
          }
        );
        let res = await userExist.json();
        console.log(res);

        if (res.data.message !== undefined) {
          toast.error(res.data.message);
        } else {
          setFormData(data?.uname);
          setStep(true);
        }
      } else {
        toast.error("Your session is expired. Its auto redirect to login page");
        setTimeout(() => {
          signOut();
        }, 4000);
      }
    } catch (error) {}
  };

  return (
    <>
      <div className="max-w-[calc(100%-30px)] md:max-w-[510px] w-full p-5 md:p-40 z-10 fixed rounded-10 bg-white dark:bg-omega top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%]">
        <div className="flex items-center justify-between ">
          <p className="sec-title">
            {props?.type === "email"
              ? "Add Email Address"
              : "Add Mobile Number"}
          </p>
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
              <div>
                <label className="sm-text mb-[6px]">
                  {props?.type === "email"
                    ? "Enter Email Address"
                    : "Enter Mobile Number"}
                </label>
                <input
                  type="text"
                  placeholder="Enter text"
                  className="sm-text input-cta2 w-full"
                  {...register("uname")}
                />
                {errors.uname && (
                  <p style={{ color: "red" }}>{errors.uname.message}</p>
                )}
              </div>

              <button
                className="info-10-14 text-end cursor-pointer hover:text-primary"
                onClick={() => sendOtp()}
                disabled={disabled}
              >
                {statuss ? "Resend OTP" : "Send OTP"}
              </button>
            </div>
            <div className="flex flex-col  gap-20">
              <label className="sm-text">Enter 6 Digit OTP</label>
              <div className="flex gap-10 justify-center items-center input_wrapper">
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
            </div>
          </div>
          <div className="flex gap-[20px]">
            <button
              className="solid-button2 w-full "
              onClick={() => {
                props?.setActive(0), props?.setShow(false);
              }}
            >
              Cancel
            </button>
            <button className="solid-button px-[51px] w-full">Next</button>
          </div>
        </form>
      </div>
      {step === true && (
        <Password
          setShow={props?.setShow}
          setActive={props?.setActive}
          setStep={setStep}
          type={props?.type}
          formData={formData}
        />
      )}
    </>
  );
};

export default AdNumber;
