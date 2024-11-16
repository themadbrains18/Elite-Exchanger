import React, {
  FormEventHandler,
  useContext,
  useEffect,
  useRef,
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
import EmailChangeAlert from "../snippets/emailChangeAlert";
import clickOutSidePopupClose from "../snippets/clickOutSidePopupClose";
import CodeNotRecieved from "../snippets/codeNotRecieved";

/**
 * This function validates a user's input for either email or phone number.
 * It checks if the input matches the required pattern for a valid email or phone number.
 *
 * @param {string} uname - The user's email or phone number to be validated.
 * @returns {boolean} - Returns true if the input matches the validation rules, otherwise false.
 */
const schema = yup.object().shape({
  uname: yup
    .string()
    .required("Email / Phone is required.").matches(/^([a-zA-Z0-9_\.])+\@(([a-zA-Z0-9])+\.)+([a-zA-Z0-9]{2,4})+$/, "Please enter valid email(letters, number and period('.')).")
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

/**
 * Interface for the properties passed to the AdNumber component.
 * This interface is used to define the required properties for the component, 
 * including methods to manage the state and session information.
 * 
 * @property {Function} setActive - A function to set the active state of the component.
 * @property {Function} setShow - A function to control the visibility of the component.
 * @property {string} type - A string that defines the type of the ad or component.
 * @property {any} session - The session information of the current user.
 */
interface AdNumberProps {
  setActive: Function;
  setShow: Function;
  type: string;
  session: any;
}

const AdNumber = (props: AdNumberProps) => {
  const { mode } = useContext(Context);
  const [step, setStep] = useState(false);
  const [fillOtp, setOtp] = useState("");
  const [formData, setFormData] = useState();
  const [statuss, setStatuss] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const { status, data: session } = useSession();
  const [show, setShow] = useState(true);
  const [popup, setPopup] = useState(false);

  const [isOtp, setIsOtp] = useState(false);
  const [showTime, setShowTime] = useState(false);
  const [timeLeft, setTimer] = useState('');
  const Ref: any = useRef(null);
  const [btnDisabled, setBtnDisabled] = useState(false);
  const [otpMessage, setOtpMessage] = useState('');
  const [secondExpireTime, setSecondExpireTime] = useState();

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

  /**
 * useEffect hook for handling OTP input in a set of input fields.
 * 
 * - Moves focus to the next input field after a character is entered.
 * - Moves focus to the previous input field if backspace is pressed on an empty field.
 * - Updates OTP state by combining values from all input fields.
 * 
 * @param show - Dependency to trigger re-initialization of event listeners.
 */
  useEffect(() => {
    const inputElements = document.querySelectorAll(".input_wrapper4 input");

    inputElements?.forEach((ele, index) => {
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
  }, [!show]);

  /**
   * Clears the 'uname' error after 3 seconds if it's present in the errors object.
   * 
   * @param errors - The form validation errors.
   * @param clearErrors - Function to clear the specific error.
   */
  useEffect(() => {
    // Set a timeout to clear the 'uname' error after 3 seconds if it's present
    setTimeout(() => {
      if (errors.uname) {
        clearErrors('uname');
      }
    }, 3000);
  }, [errors])

  /**
   * sendOtp - Function to handle OTP generation for the given username (email/phone number).
   * 
   * This function performs the following tasks:
   * 1. Clears any existing OTP inputs.
   * 2. Validates the provided email or phone number.
   * 3. Encrypts the OTP request data using AES encryption.
   * 4. Sends the request to the server for OTP generation.
   * 5. Handles server response and updates UI states based on success or failure.
   * 
   * @returns {Promise<void>} - No return value. It updates the UI states like OTP input fields, success/error messages, etc.
   */
  const sendOtp = async () => {
    try {
      // Clear all OTP input fields
      const inputElements = document.querySelectorAll(".input_wrapper4 input");
      inputElements.forEach((ele, index) => {
        (inputElements[index] as HTMLInputElement).value = ""
      })
      setOtp('')
      let uname = getValues("uname");
      if (uname !== "") {
        clearErrors();
        // Validate email format using regular expression
        let isValidEmail = uname.match(/^([a-zA-Z0-9_\.])+\@(([a-zA-Z0-9])+\.)+([a-zA-Z0-9]{2,4})+$/);
        if (isValidEmail === null) {
          setError("uname", {
            type: "custom",
            message: `Please enter valid email(letters, number and period('.')).`,
          });
          setTimeout(() => {
            clearErrors('uname');
          }, 2000);
          return;
        }
        setDisabled(true);
        // Prepare the object for OTP request based on type (email or phone number)
        let obj = {};
        if (props?.type === "email") {
          let username =
            props?.type == "email" && props.session?.user.email !== "null"
              ? props.session?.user.email
              : props.session?.user?.number;
          obj = {
            username: username,
            data: uname,
            otp: "string",
            step: 1
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

        // Check if session exists (user is authenticated)
        if (session) {
          const ciphertext = AES.encrypt(
            JSON.stringify(obj),
            `${process.env.NEXT_PUBLIC_SECRET_PASSPHRASE}`
          );
          let record = encodeURIComponent(ciphertext.toString());

          // Send PUT request to update user with OTP request
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
          // console.log(res);
          if (res?.data?.otp !== undefined) {
            setDisabled(false);
            // If OTP exists in the response, show success toast and handle expiration time
            toast.success(res?.data?.message, { autoClose: 2000 });
            let expireTime = res?.data?.otp?.expire;
            orderTimeCalculation(expireTime);
            setShowTime(true);
            setIsOtp(true);
            setStatuss(false);
            // setStatuss(true);
          } else {
            // If OTP generation failed, show error and re-enable button after 3 seconds
            toast.error(res.data.message, { autoClose: 2500 });
            setTimeout(() => {
              setDisabled(false);
            }, 3000);
          }
        } else {
          toast.error('Your session is expired. You will redirect login page in short time and Login again.', { autoClose: 2500 })
          setTimeout(() => {
            signOut();
          }, 3000);
        }
      }
      else {
        setError("uname", {
          type: "custom",
          message: `This field is required.`,
        });
        setDisabled(false);
        setTimeout(() => {
          clearErrors('uname')
        }, 3000);
        return;
      }
    } catch (error) {
      console.log(error);
      setDisabled(true);
    }
  };

  /**
 * orderTimeCalculation - Function to calculate and manage the countdown timer 
 * based on the provided expiration time.
 * 
 * This function performs the following tasks:
 * 1. Calculates the remaining time until the provided expiration time.
 * 2. Starts a countdown timer if the expiration time is in the future.
 * 3. If the expiration time has passed, it stops the timer, hides the time display, 
 *    resets OTP input fields, and updates the UI status.
 * 
 * @param {any} expireTime - The expiration time as a string or Date object.
 * 
 * @returns {void} - This function does not return a value. It modifies the UI and state.
 */
  const orderTimeCalculation = async (expireTime: any) => {
    // Convert expiration time to a Date object
    let deadline = new Date(expireTime);

    // Set the deadline's minutes and seconds
    deadline.setMinutes(deadline.getMinutes());
    deadline.setSeconds(deadline.getSeconds() + 1);
    let currentTime = new Date();

    // Check if the current time is before the deadline
    if (currentTime < deadline) {
      if (Ref.current) clearInterval(Ref.current);
      // Start a new interval timer to update the remaining time every second
      const timer = setInterval(() => {
        calculateTimeLeft(deadline);
      }, 1000);
      Ref.current = timer;
    }
    else if (currentTime > deadline) {
      // If the expiration time has passed, stop the countdown and hide the time display
      setShowTime(false);
      setStatuss(true);
      const inputElements = document.querySelectorAll(".input_wrapper4 input");
      inputElements.forEach((ele, index) => {
        (inputElements[index] as HTMLInputElement).value = ""
      })
    }
  }

  /**
 * calculateTimeLeft - Function to calculate and update the remaining time.
 * 
 * This function is responsible for calculating the remaining time based on the 
 * provided expiration time, formatting the time into a 'mm:ss' format, and 
 * updating the timer on the UI. If the time has expired, it stops the timer and 
 * resets the OTP input fields.
 * 
 * @param {any} e - The deadline date object or expiration time.
 * 
 * @returns {void} - This function updates the UI state and timer but does not return a value.
 */
  const calculateTimeLeft = (e: any) => {
    // Destructure total time, minutes, and seconds from the remaining time calculation
    let { total, minutes, seconds } = getTimeRemaining(e);

    if (total >= 0) {
      setTimer(
        (minutes > 9 ? minutes : '0' + minutes) + ':'
        + (seconds > 9 ? seconds : '0' + seconds)
      )
    }
    else {
      if (Ref.current) clearInterval(Ref.current);
      setShowTime(false);
      setStatuss(true);
      const inputElements = document.querySelectorAll(".input_wrapper4 input");
      inputElements.forEach((ele, index) => {
        (inputElements[index] as HTMLInputElement).value = ""
      })
    }
  }

  /**
   * getTimeRemaining - Function to calculate the remaining time from the current time to the given deadline.
   * 
   * This function takes a deadline time (in date format) and calculates the remaining time 
   * in total milliseconds, minutes, and seconds from the current time.
   * 
   * @param {any} e - The deadline date object or expiration time.
   * 
   * @returns {Object} - An object containing the total remaining time in milliseconds, 
   * minutes, and seconds.
   */
  const getTimeRemaining = (e: any) => {
    let current: any = new Date();
    const total = Date.parse(e) - Date.parse(current);
    const seconds = Math.floor((total / 1000) % 60);
    const minutes = Math.floor((total / 1000 / 60) % 60);
    return {
      total, minutes, seconds
    };
  }

  /**
 * onHandleSubmit - Function to handle the form submission, validate OTP, 
 * and make a request to update the user information.
 * 
 * This function performs the following actions:
 * 1. Checks if the OTP is empty and displays a message if so.
 * 2. Prepares the request body with either email or phone number based on the type.
 * 3. Encrypts the data and sends it to the backend via a PUT request.
 * 4. If the response contains an error, it displays an error message.
 * 5. If the request is successful, it proceeds to send session OTP and set form data for the next step.
 * 
 * @param {any} data - The form data containing the username (email or phone number).
 */
  const onHandleSubmit = async (data: any) => {
    try {
      if (fillOtp === '') {
        setOtpMessage('Please enter One-Time password to authenticate.');
        setTimeout(() => {
          setOtpMessage('');
        }, 3000);
        return;
      }
      setBtnDisabled(true);
      let obj = {};
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

      if (session) {
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
        if (res?.data?.message !== undefined) {
          toast.error(res?.data?.message, { autoClose: 2000 });
          // console.log("here");

          setTimeout(() => {
            setBtnDisabled(false);
          }, 3000);
        } else {
          await sendSessionOtp();
          setFormData(data?.uname);
          setStep(true);
        }
      } else {
        toast.error("Your session is expired. Its auto redirect to login page");
        setTimeout(() => {
          signOut();
        }, 4000);
      }
    } catch (error) { }
  };

  /**
 * sendSessionOtp - Function to send a session OTP request to the backend.
 * 
 * This function performs the following actions:
 * 1. Retrieves the username (either email or phone number) from form data.
 * 2. Prepares the request body with the username and step information.
 * 3. Encrypts the data and sends it to the backend via a PUT request.
 * 4. If the backend response contains OTP data, it sets the expiration time.
 * 5. If the response contains an error message, it displays an error toast and re-enables the button.
 * 
 * @returns {void}
 */
  const sendSessionOtp = async () => {
    try {
      // Retrieve username (email or phone number) from form data
      let uname = getValues("uname");
      let obj = {};
      // Prepare the request body for "email" type
      if (props?.type === "email") {
        let username = props.session?.user.email;
        obj = {
          username: username,
          data: uname,
          otp: "string",
          step: 2
        };
      }

      // If session exists and user information is available
      if (session !== undefined && session?.user !== undefined) {
        const ciphertext = AES.encrypt(
          JSON.stringify(obj),
          `${process.env.NEXT_PUBLIC_SECRET_PASSPHRASE}`
        );
        let record = encodeURIComponent(ciphertext.toString());

        // Make the request to the backend to update the user data
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

        // Parse the response from the backend
        let res = await userExist.json();

        // If OTP is returned, set the expiration time
        if (res?.data?.otp !== undefined) {
          let expireTime = res?.data?.otp?.expire;
          setSecondExpireTime(expireTime);
        } else {
          // console.log("here2");

          toast.error(res.data.message, { autoClose: 2500 });
          setTimeout(() => {
            setDisabled(false);
          }, 3000);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  /**
 * closePopup - Function to close the popup and reset related states.
 * 
 * This function performs the following actions:
 * 1. Resets the timer by setting the timer state to an empty string.
 * 2. Closes the popup by updating the `setShow` prop to `false`.
 * 3. Resets the active state by calling `setActive` with `0` as an argument.
 * 
 * @returns {void}
 */
  const closePopup = () => {
    setTimer('');
    props?.setShow(false);
    props.setActive(0);
  };
  const wrapperRef = useRef(null);
  clickOutSidePopupClose({ wrapperRef, closePopup });

  return (
    <div ref={wrapperRef}>
      {show && props?.type === "email" ? (
        <EmailChangeAlert
          setShow={setShow}
          setEnable={props?.setActive}
          setShow2={props?.setShow}
        />
      ) : (
        <div

          className={`max-w-[calc(100%-30px)] md:max-w-[510px] w-full p-5 md:p-40 z-10 fixed rounded-10 bg-white dark:bg-omega top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%]  ${popup === false ? "opacity-100" : "opacity-0"}`}
        >
          {step === false &&
            <>
              <div className={`flex items-center justify-between  `}>
                <p className="sec-title">
                  {props?.type === "email"
                    ? "Add Email Address "
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
              <form onSubmit={handleSubmit(onHandleSubmit)} onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                }
              }}>
                <div className="py-30 md:py-40">
                  <div className="flex flex-col mb-[15px] md:mb-20 gap-10">
                    <label className="sm-text">
                      Enter new {props?.type === "Email" ? "mobile number" : "email address"}
                    </label>
                    <div>
                      <input
                        type="text"
                        {...register("uname")}
                        name="uname"
                        placeholder={props?.type === "email"
                          ? "Enter Email Address"
                          : "Enter Mobile Number"}
                        className="sm-text input-cta2 w-full mb-[10px]"
                      />
                      {errors.uname && (
                        <p className="errorMessage">{errors.uname.message}</p>
                      )}
                    </div>


                  </div>
                  <div className="flex flex-col  gap-10">
                    <label className="sm-text">Enter 6 Digit OTP</label>
                    <div className="flex gap-10 justify-between items-center input_wrapper4 relative">
                      <input
                        type="text"
                        autoComplete="off"
                        className={`block px-2 font-noto md:px-5  w-40 md:w-[60px] dark:bg-black bg-primary-100 border-black dark:border-white border border-solid  text-center  rounded min-h-[40px] md:min-h-[60px] text-black dark:text-white outline-none `}
                        name="code1"
                      />
                      <input
                        type="text"
                        autoComplete="off"
                        className={`block px-2 font-noto md:px-5 w-40 md:w-[60px] dark:bg-black bg-primary-100 border-black dark:border-white border border-solid  text-center  rounded min-h-[40px] md:min-h-[60px] text-black dark:text-white outline-none focus:!border-primary  `}
                        name="code2"
                      />
                      <input
                        type="text"
                        autoComplete="off"
                        className={`block px-2 font-noto md:px-5 w-40 md:w-[60px] dark:bg-black bg-primary-100 border-black dark:border-white border border-solid  text-center  rounded min-h-[40px] md:min-h-[60px] text-black dark:text-white outline-none focus:!border-primary `}
                        name="code3"
                      />
                      <input
                        type="text"
                        autoComplete="off"
                        className={`block px-2 font-noto md:px-5 w-40 md:w-[60px] dark:bg-black bg-primary-100 border-black dark:border-white border border-solid   text-center  rounded min-h-[40px] md:min-h-[60px] text-black dark:text-white outline-none focus:!border-primary  `}
                        name="code4"
                      />
                      <input
                        type="text"
                        autoComplete="off"
                        className={`block px-2 font-noto md:px-5 w-40 md:w-[60px] dark:bg-black bg-primary-100 border-black dark:border-white border border-solid  text-center  rounded min-h-[40px] md:min-h-[60px] text-black dark:text-white outline-none focus:!border-primary`}
                        name="code5"
                      />
                      <input
                        type="text"
                        autoComplete="off"
                        className={`block px-2 font-noto md:px-5 w-40 md:w-[60px] dark:bg-black bg-primary-100 border-black dark:border-white border border-solid  text-center  rounded min-h-[40px] md:min-h-[60px] text-black dark:text-white outline-none focus:!border-primary `}
                        name="code6"
                      />
                    </div>

                  </div>
                  <div className="mt-2">
                    <div className={`flex gap-1 ${showTime === true ? '' : 'hidden'}`}>
                      <p className={`info-10-14 text-start  md-text`}>Your OTP will expire within </p>
                      <p className={`info-10-14 text-start md-text`}> {timeLeft}</p>
                    </div>
                    <p className={`lg:mt-[10px] md-text errorMessage ${otpMessage === '' ? 'hidden' : ''}`} >{otpMessage}</p>
                    <div className="text-end">
                      {isOtp === false &&
                        <button
                          type="button"
                          className={`info-10-14 text-end  !text-primary ${disabled === true ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                          onClick={() => disabled === false ? sendOtp() : ''}
                          disabled={disabled}
                        >
                          Send OTP
                        </button>
                      }
                      {statuss &&
                        <button
                          type="button"
                          className={`info-10-14 text-end  !text-primary ${disabled === true ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                          onClick={() => disabled === false ? sendOtp() : ''}
                          disabled={disabled}
                        >
                          Resend OTP
                        </button>
                      }
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
                  <button disabled={btnDisabled === true || isOtp === false || statuss === true ? true : false} className={`solid-button px-[51px] w-full ${isOtp === false || statuss === true ? 'cursor-not-allowed opacity-25' : ''} ${btnDisabled === true ? 'cursor-not-allowed' : ''}`}>{btnDisabled &&
                    <svg aria-hidden="true" role="status" className="inline w-4 h-4 me-3 text-white animate-spin" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="#E5E7EB" />
                      <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentColor" />
                    </svg>
                  }Next</button>
                </div>
                <p
                  className={`info-10-14 text-start cursor-pointer  inline-block mt-[10px] !text-primary `}
                  onClick={() => {
                    setPopup(true);
                    // props.setShow(false);
                  }}
                >
                  Didn't receive the code?
                </p>
              </form>
            </>
          }
          {step === true && (
            <Password
              setShow={props?.setShow}
              setActive={props?.setActive}
              setStep={setStep}
              type={props?.type}
              formData={formData}
              secondExpireTime={secondExpireTime}
              sendSessionOtp={sendSessionOtp}
            />
          )}
        </div>
      )}
      {popup === true && <CodeNotRecieved setEnable={setPopup} />}

    </div>
  );
};

export default AdNumber;
